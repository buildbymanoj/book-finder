/**
 * Books Routes
 * Handles book searching and saved reading list operations
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/books/suggestions
 * @desc    Get book suggestions for autocomplete
 * @access  Private
 */
router.get('/suggestions', protect, async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json({
        success: true,
        data: []
      });
    }

    const searchQuery = q.trim();

    // Call Open Library Search API for suggestions
    const response = await axios.get(
      `${process.env.OPEN_LIBRARY_API}/search.json`,
      {
        params: {
          q: searchQuery,
          limit: parseInt(limit),
          fields: 'key,title,author_name,first_publish_year,cover_i'
        },
        timeout: 10000 // Shorter timeout for suggestions
      }
    );

    // Format the results for suggestions
    const suggestions = response.data.docs.map(book => ({
      id: book.key,
      title: book.title || 'Unknown Title',
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      publishYear: book.first_publish_year || null,
      coverUrl: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`
        : null
    }));

    res.json({
      success: true,
      data: suggestions
    });
  } catch (error) {
    console.error('Suggestions error:', error.message);
    // Return empty array on error to avoid breaking the UI
    res.json({
      success: true,
      data: []
    });
  }
});

/**
 * @route   GET /api/books/search
 * @desc    Search books using Open Library API with filtering
 * @access  Private
 */
router.get('/search', protect, async (req, res, next) => {
  try {
    const { q, page = 1, limit = 12, genre, yearFrom, yearTo } = req.query;

    // Require either a query or at least one filter
    if ((!q || q.trim() === '') && !genre && !yearFrom && !yearTo) {
      return res.status(400).json({
        success: false,
        message: 'Search query or at least one filter (genre or year) is required'
      });
    }

    // Build search query with filters
    let searchQuery = q && q.trim() !== '' ? q.trim() : '';
    
    // If only genre is provided, search by that genre
    if (genre && (!q || q.trim() === '')) {
      searchQuery = `subject:${genre}`;
    } else if (genre) {
      // Add genre filter to existing query
      searchQuery += ` subject:${genre}`;
    }

    // If no query and only year filters, use a broad search term
    if (!searchQuery && (yearFrom || yearTo)) {
      searchQuery = 'fiction'; // Default broad search
    }

    // Call Open Library Search API
    const response = await axios.get(
      `${process.env.OPEN_LIBRARY_API}/search.json`,
      {
        params: {
          q: searchQuery,
          page,
          limit,
          fields: 'key,title,author_name,first_publish_year,isbn,cover_i,subject'
        },
        timeout: 30000 // Increase timeout to 30 seconds
      }
    );

    // Format the results
    let books = response.data.docs.map(book => ({
      id: book.key,
      title: book.title || 'Unknown Title',
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      publishYear: book.first_publish_year || null,
      coverUrl: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
      isbn: book.isbn ? book.isbn[0] : null,
      genres: book.subject ? book.subject.slice(0, 5) : [],
      description: book.subject ? book.subject.slice(0, 3).join(', ') : 'No description available'
    }));

    // Apply year filters
    if (yearFrom || yearTo) {
      books = books.filter(book => {
        if (!book.publishYear) return false;
        if (yearFrom && book.publishYear < parseInt(yearFrom)) return false;
        if (yearTo && book.publishYear > parseInt(yearTo)) return false;
        return true;
      });
    }


    res.json({
      success: true,
      count: books.length,
      total: response.data.numFound,
      page: parseInt(page),
      filters: {
        genre: genre || null,
        yearFrom: yearFrom || null,
        yearTo: yearTo || null
      },
      data: books
    });
  } catch (error) {
    console.error('Search error:', error.message);
    
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return res.status(504).json({
        success: false,
        message: 'Open Library is taking too long to respond. Please try a more specific search or try again later.'
      });
    }

    if (error.response) {
      return res.status(error.response.status).json({
        success: false,
        message: 'Open Library API error. Please try again.'
      });
    }

    // Network error
    if (error.request) {
      return res.status(503).json({
        success: false,
        message: 'Cannot reach Open Library API. Please check your internet connection.'
      });
    }

    next(error);
  }
});

/**
 * @route   GET /api/books/details/:id
 * @desc    Get detailed book information
 * @access  Private
 */
router.get('/details/:id', protect, async (req, res, next) => {
  try {
    const bookId = req.params.id.replace('/works/', '');
    
    // Fetch book details from Open Library
    const response = await axios.get(
      `${process.env.OPEN_LIBRARY_API}/works/${bookId}.json`,
      { timeout: 30000 } // Increase timeout to 30 seconds
    );

    const book = response.data;

    // Format response
    const bookDetails = {
      id: book.key,
      title: book.title || 'Unknown Title',
      description: typeof book.description === 'string' 
        ? book.description 
        : book.description?.value || 'No description available',
      subjects: book.subjects || [],
      covers: book.covers || []
    };

    res.json({
      success: true,
      data: bookDetails
    });
  } catch (error) {
    console.error('Book details error:', error.message);
    next(error);
  }
});

/**
 * @route   GET /api/books/saved
 * @desc    Get user's saved books
 * @access  Private
 */
router.get('/saved', protect, async (req, res, next) => {
  try {
    const books = await Book.find({ user: req.user.id })
      .sort({ addedAt: -1 });

    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/books/saved
 * @desc    Add book to reading list
 * @access  Private
 */
router.post('/saved', protect, async (req, res, next) => {
  try {
    const { openLibraryId, title, author, coverUrl, publishYear, description, isbn, genres } = req.body;

    // Validate required fields
    if (!openLibraryId || !title) {
      return res.status(400).json({
        success: false,
        message: 'Book ID and title are required'
      });
    }

    // Check if book already saved
    const existingBook = await Book.findOne({
      user: req.user.id,
      openLibraryId
    });

    if (existingBook) {
      return res.status(400).json({
        success: false,
        message: 'Book already in your reading list'
      });
    }

    // Create new saved book
    const book = await Book.create({
      user: req.user.id,
      openLibraryId,
      title,
      author: author || 'Unknown Author',
      coverUrl,
      publishYear,
      description: description || 'No description available',
      isbn,
      genres: genres || []
    });

    res.status(201).json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/books/saved/:id
 * @desc    Remove book from reading list
 * @access  Private
 */
router.delete('/saved/:id', protect, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Make sure user owns this book
    if (book.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this book'
      });
    }

    await book.deleteOne();

    res.json({
      success: true,
      message: 'Book removed from reading list'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/books/saved/openlibrary/:openLibraryId
 * @desc    Remove book from reading list by Open Library ID
 * @access  Private
 */
router.delete('/saved/openlibrary/:openLibraryId', protect, async (req, res, next) => {
  try {
    const book = await Book.findOne({
      user: req.user.id,
      openLibraryId: req.params.openLibraryId
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found in your reading list'
      });
    }

    await book.deleteOne();

    res.json({
      success: true,
      message: 'Book removed from reading list'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/books/:id/progress
 * @desc    Update reading progress for a book
 * @access  Private
 */
router.put('/:id/progress', protect, async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Make sure user owns this book
    if (book.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this book'
      });
    }

    const { status, currentPage, totalPages, notes } = req.body;

    // Update progress fields
    if (status) book.readingProgress.status = status;
    if (currentPage !== undefined) book.readingProgress.currentPage = currentPage;
    if (totalPages !== undefined) book.readingProgress.totalPages = totalPages;
    if (notes !== undefined) book.readingProgress.notes = notes;

    // Calculate percentage
    if (totalPages && currentPage !== undefined) {
      book.readingProgress.percentage = Math.min(
        Math.round((currentPage / totalPages) * 100),
        100
      );
    }

    // Set timestamps
    if (status === 'reading' && !book.readingProgress.startedAt) {
      book.readingProgress.startedAt = new Date();
    }
    if (status === 'completed') {
      book.readingProgress.completedAt = new Date();
      book.readingProgress.percentage = 100;
    }

    await book.save();

    res.json({
      success: true,
      data: book
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/books/progress/stats
 * @desc    Get reading statistics for user
 * @access  Private
 */
router.get('/progress/stats', protect, async (req, res, next) => {
  try {
    const books = await Book.find({ user: req.user.id });

    const stats = {
      total: books.length,
      notStarted: books.filter(b => b.readingProgress.status === 'not-started').length,
      reading: books.filter(b => b.readingProgress.status === 'reading').length,
      completed: books.filter(b => b.readingProgress.status === 'completed').length,
      paused: books.filter(b => b.readingProgress.status === 'paused').length,
      averageRating: 0
    };

    // Calculate average rating
    const ratedBooks = books.filter(b => b.userRating);
    if (ratedBooks.length > 0) {
      stats.averageRating = (
        ratedBooks.reduce((sum, b) => sum + b.userRating, 0) / ratedBooks.length
      ).toFixed(1);
    }

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
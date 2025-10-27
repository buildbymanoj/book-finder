/**
 * Recommendations Routes
 * Provides personalized book recommendations
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Book = require('../models/Book');
const SearchHistory = require('../models/SearchHistory');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/recommendations
 * @desc    Get personalized book recommendations
 * @access  Private
 */
router.get('/', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const savedBooks = await Book.find({ user: req.user.id }).limit(20);
    const searchHistory = await SearchHistory.find({ user: req.user.id })
      .sort({ searchedAt: -1 })
      .limit(10);

    // Collect genres from multiple sources
    let genres = new Set();

    // 1. User's favorite genres
    if (user.favoriteGenres && user.favoriteGenres.length > 0) {
      user.favoriteGenres.forEach(g => genres.add(g.toLowerCase()));
    }

    // 2. Genres from saved books
    savedBooks.forEach(book => {
      if (book.genres && book.genres.length > 0) {
        book.genres.forEach(g => genres.add(g.toLowerCase()));
      }
    });

    // 3. Inferred genres from search history
    searchHistory.forEach(search => {
      if (search.inferredGenres && search.inferredGenres.length > 0) {
        search.inferredGenres.forEach(g => genres.add(g.toLowerCase()));
      }
    });

    // Convert to array and get top genres
    const genreArray = Array.from(genres).slice(0, 3);

    // If no genres found, use default popular genres
    if (genreArray.length === 0) {
      genreArray.push('fiction', 'mystery', 'science fiction');
    }

    // Search for books based on genres
    const recommendations = [];
    
    for (const genre of genreArray) {
      try {
        const response = await axios.get(
          `${process.env.OPEN_LIBRARY_API}/search.json`,
          {
            params: {
              subject: genre,
              limit: 5,
              sort: 'rating',
              fields: 'key,title,author_name,first_publish_year,isbn,cover_i,subject,ratings_average'
            },
            timeout: 10000
          }
        );

        const books = response.data.docs.map(book => ({
          id: book.key,
          title: book.title || 'Unknown Title',
          author: book.author_name ? book.author_name[0] : 'Unknown Author',
          publishYear: book.first_publish_year || null,
          coverUrl: book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : null,
          isbn: book.isbn ? book.isbn[0] : null,
          genres: book.subject ? book.subject.slice(0, 3) : [genre],
          rating: book.ratings_average || null,
          recommendedBy: genre
        }));

        recommendations.push(...books);
      } catch (error) {
        console.error(`Error fetching recommendations for genre ${genre}:`, error.message);
      }
    }

    // Remove duplicates and books already saved
    const savedBookIds = savedBooks.map(b => b.openLibraryId);
    const uniqueRecommendations = recommendations
      .filter((book, index, self) => 
        index === self.findIndex(b => b.id === book.id) &&
        !savedBookIds.includes(book.id)
      )
      .slice(0, 12);

    res.json({
      success: true,
      count: uniqueRecommendations.length,
      basedOn: {
        favoriteGenres: Array.from(genres),
        savedBooksCount: savedBooks.length,
        recentSearchesCount: searchHistory.length
      },
      data: uniqueRecommendations
    });
  } catch (error) {
    console.error('Recommendations error:', error.message);
    next(error);
  }
});

/**
 * @route   GET /api/recommendations/trending
 * @desc    Get trending/popular books
 * @access  Private
 */
router.get('/trending', protect, async (req, res, next) => {
  try {
    const response = await axios.get(
      `${process.env.OPEN_LIBRARY_API}/search.json`,
      {
        params: {
          q: '*',
          sort: 'new',
          limit: 12,
          fields: 'key,title,author_name,first_publish_year,isbn,cover_i,subject'
        },
        timeout: 10000
      }
    );

    const books = response.data.docs.map(book => ({
      id: book.key,
      title: book.title || 'Unknown Title',
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      publishYear: book.first_publish_year || null,
      coverUrl: book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null,
      isbn: book.isbn ? book.isbn[0] : null,
      genres: book.subject ? book.subject.slice(0, 3) : []
    }));

    res.json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error('Trending books error:', error.message);
    next(error);
  }
});

/**
 * @route   PUT /api/recommendations/preferences
 * @desc    Update user's favorite genres for better recommendations
 * @access  Private
 */
router.put('/preferences', protect, async (req, res, next) => {
  try {
    const { favoriteGenres } = req.body;

    if (!favoriteGenres || !Array.isArray(favoriteGenres)) {
      return res.status(400).json({
        success: false,
        message: 'favoriteGenres must be an array'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { favoriteGenres },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: {
        favoriteGenres: user.favoriteGenres
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

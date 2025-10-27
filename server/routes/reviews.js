/**
 * Reviews Routes
 * Handles book review operations
 */

const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Book = require('../models/Book');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/reviews/book/:openLibraryId
 * @desc    Get all reviews for a specific book
 * @access  Public (can see reviews without login, but need login to post)
 */
router.get('/book/:openLibraryId', async (req, res, next) => {
  try {
    const reviews = await Review.find({ openLibraryId: req.params.openLibraryId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    // Calculate average rating
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({
      success: true,
      count: reviews.length,
      averageRating: avgRating.toFixed(1),
      data: reviews
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/reviews/user
 * @desc    Get all reviews by current user
 * @access  Private
 */
router.get('/user', protect, async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('book', 'title author coverUrl')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/reviews
 * @desc    Create a new review
 * @access  Private
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const { bookId, openLibraryId, rating, title, comment, readingStatus } = req.body;

    // Validate required fields
    if (!bookId || !openLibraryId || !rating || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      user: req.user.id,
      book: bookId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this book'
      });
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      book: bookId,
      openLibraryId,
      rating,
      title,
      comment,
      readingStatus: readingStatus || 'completed'
    });

    // Update book's user rating
    book.userRating = rating;
    await book.save();

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username');

    res.status(201).json({
      success: true,
      data: populatedReview
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update a review
 * @access  Private
 */
router.put('/:id', protect, async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const { rating, title, comment, readingStatus } = req.body;

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.readingStatus = readingStatus || review.readingStatus;

    await review.save();

    // Update book's user rating
    const book = await Book.findById(review.book);
    if (book && book.user.toString() === req.user.id) {
      book.userRating = rating;
      await book.save();
    }

    review = await Review.findById(review._id)
      .populate('user', 'username');

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete a review
 * @access  Private
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure user owns this review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await review.deleteOne();

    // Remove rating from book
    const book = await Book.findById(review.book);
    if (book && book.user.toString() === req.user.id) {
      book.userRating = null;
      await book.save();
    }

    res.json({
      success: true,
      message: 'Review deleted'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/reviews/:id/helpful
 * @desc    Mark review as helpful
 * @access  Private
 */
router.post('/:id/helpful', protect, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already voted
    if (review.votedBy.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'You have already voted for this review'
      });
    }

    review.helpfulVotes += 1;
    review.votedBy.push(req.user.id);
    await review.save();

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

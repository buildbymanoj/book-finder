/**
 * Review Model
 * Defines the schema for book reviews
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Reference to the user who wrote the review
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Reference to the book
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  
  // Open Library ID for cross-reference
  openLibraryId: {
    type: String,
    required: true
  },
  
  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  // Review content
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  
  // Helpful votes
  helpfulVotes: {
    type: Number,
    default: 0
  },
  
  // Users who found this review helpful
  votedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Reading status when reviewed
  readingStatus: {
    type: String,
    enum: ['reading', 'completed'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Create compound index to ensure user can review same book only once
reviewSchema.index({ user: 1, book: 1 }, { unique: true });

// Index for finding reviews by book
reviewSchema.index({ openLibraryId: 1 });

module.exports = mongoose.model('Review', reviewSchema);

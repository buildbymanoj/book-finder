/**
 * Book Model
 * Defines the schema for saved books in user's reading list
 */

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  // Reference to the user who saved this book
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Book information from Open Library
  openLibraryId: {
    type: String,
    required: true
  },
  
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true
  },
  
  author: {
    type: String,
    trim: true,
    default: 'Unknown Author'
  },
  
  coverUrl: {
    type: String,
    default: null
  },
  
  publishYear: {
    type: Number,
    default: null
  },
  
  description: {
    type: String,
    default: 'No description available'
  },
  
  isbn: {
    type: String,
    default: null
  },
  
  // Enhanced features
  genres: [{
    type: String,
    trim: true
  }],
  
  // Reading progress tracking
  readingProgress: {
    status: {
      type: String,
      enum: ['not-started', 'reading', 'completed', 'paused'],
      default: 'not-started'
    },
    currentPage: {
      type: Number,
      default: 0
    },
    totalPages: {
      type: Number,
      default: 0
    },
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    notes: {
      type: String,
      default: ''
    },
    startedAt: {
      type: Date,
      default: null
    },
    completedAt: {
      type: Date,
      default: null
    }
  },
  
  // User rating
  userRating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  },
  
  // Awards and recognition
  awards: [{
    name: String,
    year: Number
  }],
  
  // Related books (stored as Open Library IDs)
  relatedBooks: [{
    openLibraryId: String,
    title: String,
    author: String,
    coverUrl: String
  }],
  
  // Track when book was added to reading list
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create compound index to ensure user can't save same book twice
bookSchema.index({ user: 1, openLibraryId: 1 }, { unique: true });

module.exports = mongoose.model('Book', bookSchema);
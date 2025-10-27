/**
 * SearchHistory Model
 * Tracks user search history for personalized recommendations
 */

const mongoose = require('mongoose');

const searchHistorySchema = new mongoose.Schema({
  // Reference to the user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  
  // Search query
  query: {
    type: String,
    required: true,
    trim: true
  },
  
  // Number of results returned
  resultsCount: {
    type: Number,
    default: 0
  },
  
  // Books clicked from this search
  clickedBooks: [{
    openLibraryId: String,
    title: String,
    genres: [String],
    clickedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Extracted genres/categories from search
  inferredGenres: [{
    type: String,
    trim: true
  }],
  
  searchedAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
searchHistorySchema.index({ user: 1, searchedAt: -1 });

// Limit search history per user (keep last 100 searches)
searchHistorySchema.statics.addSearch = async function(userId, searchData) {
  const search = await this.create({
    user: userId,
    ...searchData
  });
  
  // Remove old searches if more than 100
  const count = await this.countDocuments({ user: userId });
  if (count > 100) {
    const oldSearches = await this.find({ user: userId })
      .sort({ searchedAt: 1 })
      .limit(count - 100);
    
    const idsToDelete = oldSearches.map(s => s._id);
    await this.deleteMany({ _id: { $in: idsToDelete } });
  }
  
  return search;
};

module.exports = mongoose.model('SearchHistory', searchHistorySchema);

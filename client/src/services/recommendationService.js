/**
 * Recommendations Service
 * Handles recommendation-related API operations
 */

import api from './api';

/**
 * Get personalized recommendations
 * @returns {Promise} Recommended books array
 */
export const getRecommendations = async () => {
  const response = await api.get('/recommendations');
  return response.data;
};

/**
 * Get trending/popular books
 * @returns {Promise} Trending books array
 */
export const getTrendingBooks = async () => {
  const response = await api.get('/recommendations/trending');
  return response.data.data;
};

/**
 * Update user's favorite genres
 * @param {Array} favoriteGenres - Array of genre strings
 * @returns {Promise} Updated preferences
 */
export const updateFavoriteGenres = async (favoriteGenres) => {
  const response = await api.put('/recommendations/preferences', { favoriteGenres });
  return response.data.data;
};

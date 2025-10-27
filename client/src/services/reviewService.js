/**
 * Review Service
 * Handles review-related API operations
 */

import api from './api';

/**
 * Get reviews for a specific book
 * @param {String} openLibraryId - Open Library book ID
 * @returns {Promise} Reviews array and average rating
 */
export const getBookReviews = async (openLibraryId) => {
  const response = await api.get(`/reviews/book/${openLibraryId}`);
  return response.data;
};

/**
 * Get user's own reviews
 * @returns {Promise} Array of user reviews
 */
export const getUserReviews = async () => {
  const response = await api.get('/reviews/user');
  return response.data.data;
};

/**
 * Create a new review
 * @param {Object} reviewData - { bookId, openLibraryId, rating, title, comment, readingStatus }
 * @returns {Promise} Created review
 */
export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data.data;
};

/**
 * Update an existing review
 * @param {String} reviewId - Review ID
 * @param {Object} reviewData - Updated review data
 * @returns {Promise} Updated review
 */
export const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(`/reviews/${reviewId}`, reviewData);
  return response.data.data;
};

/**
 * Delete a review
 * @param {String} reviewId - Review ID
 * @returns {Promise} Success message
 */
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

/**
 * Mark review as helpful
 * @param {String} reviewId - Review ID
 * @returns {Promise} Updated review
 */
export const markReviewHelpful = async (reviewId) => {
  const response = await api.post(`/reviews/${reviewId}/helpful`);
  return response.data.data;
};

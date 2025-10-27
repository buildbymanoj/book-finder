/**
 * Book Service
 * Handles book-related API operations
 */

import api from './api';

/**
 * Search books using Open Library API with filtering
 * @param {String} query - Search query
 * @param {Object} filters - { genre, yearFrom, yearTo, page, limit }
 * @returns {Promise} Search results
 */
export const searchBooks = async (query, filters = {}) => {
  const { genre, yearFrom, yearTo, page = 1, limit = 12 } = filters;
  
  const response = await api.get('/books/search', {
    params: { q: query, page, limit, genre, yearFrom, yearTo }
  });
  return response.data;
};

/**
 * Get book details
 * @param {String} id - Book ID
 * @returns {Promise} Book details
 */
export const getBookDetails = async (id) => {
  const response = await api.get(`/books/details/${id}`);
  return response.data.data;
};

/**
 * Get user's saved books
 * @returns {Promise} Array of saved books
 */
export const getSavedBooks = async () => {
  const response = await api.get('/books/saved');
  return response.data.data;
};

/**
 * Add book to reading list
 * @param {Object} bookData - Book information
 * @returns {Promise} Saved book data
 */
export const addToReadingList = async (bookData) => {
  const response = await api.post('/books/saved', bookData);
  return response.data.data;
};

/**
 * Remove book from reading list
 * @param {String} bookId - MongoDB book ID
 * @returns {Promise} Success message
 */
export const removeFromReadingList = async (bookId) => {
  const response = await api.delete(`/books/saved/${bookId}`);
  return response.data;
};

/**
 * Remove book by Open Library ID
 * @param {String} openLibraryId - Open Library book ID
 * @returns {Promise} Success message
 */
export const removeByOpenLibraryId = async (openLibraryId) => {
  const response = await api.delete(`/books/saved/openlibrary/${openLibraryId}`);
  return response.data;
};

/**
 * Update reading progress for a book
 * @param {String} bookId - MongoDB book ID
 * @param {Object} progressData - { status, currentPage, totalPages, notes }
 * @returns {Promise} Updated book data
 */
export const updateReadingProgress = async (bookId, progressData) => {
  const response = await api.put(`/books/${bookId}/progress`, progressData);
  return response.data.data;
};

/**
 * Get reading statistics
 * @returns {Promise} Statistics object
 */
export const getReadingStats = async () => {
  const response = await api.get('/books/progress/stats');
  return response.data.data;
};
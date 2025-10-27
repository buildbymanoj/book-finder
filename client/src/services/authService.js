/**
 * Authentication Service
 * Handles user authentication operations
 */

import api from './api';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} User data with token
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }
  
  return response.data.data;
};

/**
 * Login user
 * @param {Object} credentials - Email and password
 * @returns {Promise} User data with token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }
  
  return response.data.data;
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * Get current logged in user
 * @returns {Promise} User data
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data.data;
};

/**
 * Update user preferences
 * @param {Object} preferences - { darkMode, fontSize, reducedMotion, highContrast }
 * @returns {Promise} Updated preferences
 */
export const updatePreferences = async (preferences) => {
  const response = await api.put('/auth/preferences', preferences);
  return response.data.data;
};
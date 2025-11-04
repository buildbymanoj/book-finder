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
  
  return {
    ...response.data.data,
    message: response.data.message
  };
};

/**
 * Login user
 * @param {Object} credentials - Email/username and password
 * @returns {Promise} User data with token
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', {
    identifier: credentials.identifier,
    password: credentials.password
  });
  
  if (response.data.success && response.data.data.token) {
    localStorage.setItem('token', response.data.data.token);
  }
  
  return {
    ...response.data.data,
    message: response.data.message
  };
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

/**
 * Update user profile (username and/or password)
 * @param {Object} data - { username, currentPassword, newPassword }
 * @returns {Promise} Updated user data
 */
export const updateProfile = async (data) => {
  const response = await api.put('/auth/profile', data);
  return response.data.data;
};

/**
 * Get password for forgot password
 * @param {String} email - User email
 * @returns {Promise} Password
 */
export const forgotPassword = async (email) => {
  const response = await api.post('/auth/forgot-password', { email });
  return response.data;
};

/**
 * Reset password using token
 * @param {String} token - Reset token
 * @param {String} password - New password
 * @returns {Promise} Success message
 */
export const resetPassword = async (token, password) => {
  const response = await api.post('/auth/reset-password', { token, password });
  return response.data;
};

/**
 * Google Sign In
 * @returns {Promise} User data with token
 */
export const googleSignIn = async () => {
  // Redirect to Google OAuth
  window.location.href = `${api.defaults.baseURL}/auth/google`;
};

/**
 * Handle Google OAuth callback
 * @param {String} token - JWT token from Google OAuth
 * @returns {Promise} User data
 */
export const handleGoogleCallback = async (token) => {
  // Store token
  localStorage.setItem('token', token);
  
  // Get user data
  const userData = await getCurrentUser();
  return userData;
};
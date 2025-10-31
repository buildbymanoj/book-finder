/**
 * Authentication Routes
 * Handles user registration and login
 */

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendPasswordResetEmail, sendTestEmail } = require('../utils/emailService');

/**
 * Generate JWT Token
 * @param {String} id - User ID
 * @returns {String} JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', [
  body('username').trim().isLength({ min: 3, max: 30 }),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
], async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const firstError = errors.array()[0];
      let message = 'Validation failed';
      
      if (firstError.path === 'password') {
        message = 'Password must be at least 8 characters';
      } else if (firstError.path === 'email') {
        message = 'Please enter a valid email address';
      } else if (firstError.path === 'username') {
        message = 'Username must be between 3 and 30 characters';
      }
      
      return res.status(400).json({
        success: false,
        message: message
      });
    }

    const { username, email, password } = req.body;

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password
    });

    // Return user info and token
    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Book Finder!',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
router.post('/login', [
  body('identifier').notEmpty().withMessage('Email or username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { identifier, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect username or email'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password'
      });
    }

    // Return user info and token
    res.json({
      success: true,
      message: 'Login successful! Welcome back!',
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current logged in user
 * @access  Private
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.json({
      success: true,
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        favoriteGenres: user.favoriteGenres || [],
        preferences: user.preferences || {}
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/auth/preferences
 * @desc    Update user preferences
 * @access  Private
 */
router.put('/preferences', protect, async (req, res, next) => {
  try {
    const { darkMode, fontSize, reducedMotion, highContrast } = req.body;

    const user = await User.findById(req.user.id);

    if (darkMode !== undefined) user.preferences.darkMode = darkMode;
    if (fontSize) user.preferences.fontSize = fontSize;
    if (reducedMotion !== undefined) user.preferences.reducedMotion = reducedMotion;
    if (highContrast !== undefined) user.preferences.highContrast = highContrast;

    await user.save();

    res.json({
      success: true,
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile (username and/or password)
 * @access  Private
 */
router.put('/profile', protect, [
  body('username').optional().trim().isLength({ min: 3, max: 30 }),
  body('currentPassword').optional().isLength({ min: 8 }),
  body('newPassword').optional().isLength({ min: 8 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { username, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    // Update username if provided
    if (username && username !== user.username) {
      // Check if username already exists
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists'
        });
      }
      user.username = username;
    }

    // Update password if provided
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Current password is required to change password'
        });
      }
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Incorrect current password'
        });
      }
      user.password = newPassword;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Get user password
 * @access  Public
 */
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Forgot Password: Invalid email input', req.body.email);
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address'
      });
    }

    const { email } = req.body;
    console.log('Forgot Password: Request received for', email);

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // Don't reveal if email exists or not for security
      console.log('Forgot Password: No user found for', email);
      return res.status(404).json({
        success: false,
        message: 'No account found with that email address'
      });
    }

    if (!user.plainPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password not available. Please reset your password.'
      });
    }

    console.log('Forgot Password: Password retrieved for', email);
    res.json({
      success: true,
      message: 'Password retrieved successfully',
      password: user.plainPassword
    });
  } catch (error) {
    console.error('Forgot Password: Unexpected error', error);
    next(error);
  }
});

/**
 * @route   POST /api/auth/send-test-email
 * @desc    Send a test email to verify SMTP from the running environment
 * @access  Public (for debugging only)
 */
router.post('/send-test-email', [
  body('email').isEmail().normalizeEmail()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }
    const { email } = req.body;

    // Use unified sendTestEmail (tries SMTP, then SendGrid)
  const info = await sendTestEmail(email);
  return res.json({ success: true, message: 'Test email sent', info });
  } catch (err) {
    console.error('SendTestEmail: Error sending test email', err && err.message ? err.message : err);
    return res.status(500).json({ success: false, message: 'Failed to send test email', error: err && err.message ? err.message : String(err) });
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
], async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { token, password } = req.body;

    // Find user with valid reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    // Update password and clear reset token
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successful. You can now log in with your new password.'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

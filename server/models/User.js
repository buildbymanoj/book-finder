/**
 * User Model
 * Defines the schema for user authentication and profile
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: function() {
      // Password is required only if not a Google user
      return !this.googleId;
    },
    minlength: [8, 'Password must be at least 8 characters']
  },
  googleId: {
    type: String,
    sparse: true,
    unique: true
  },
  plainPassword: {
    type: String,
    minlength: [8, 'Plain password must be at least 8 characters']
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  // User preferences
  favoriteGenres: [{
    type: String,
    trim: true
  }],
  preferences: {
    darkMode: {
      type: Boolean,
      default: false
    },
    fontSize: {
      type: String,
      enum: ['small', 'medium', 'large'],
      default: 'medium'
    },
    reducedMotion: {
      type: Boolean,
      default: false
    },
    highContrast: {
      type: Boolean,
      default: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

/**
 * Hash password before saving user
 */
userSchema.pre('save', async function(next) {
  // Only hash password if it's modified and user doesn't have googleId
  if (!this.isModified('password') || this.googleId) {
    return next();
  }

  try {
    // Set plain password
    this.plainPassword = this.password;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare entered password with hashed password
 * @param {String} enteredPassword - Password to compare
 * @returns {Promise<Boolean>} True if passwords match
 */
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
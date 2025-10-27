/**
 * Navbar Component
 * Top navigation bar with authentication controls and theme toggle
 */

import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiBook, FiLogOut, FiBookmark, FiMoon, FiSun } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { logout } from '../services/authService';
import './Navbar.css';

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  // User menu dropdown state
  const [showDropdown, setShowDropdown] = React.useState(false);
  const handleUserMenuClick = () => setShowDropdown((prev) => !prev);
  const handleDropdownLogout = () => {
    setShowDropdown(false);
    handleLogout();
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <FiBook className="logo-icon" />
          <span>Book Finder</span>
        </Link>

        {/* Navigation Links */}
        {user && (
          <div className="navbar-menu">
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Search Books
            </Link>
            <Link 
              to="/reading-list" 
              className={`nav-link ${location.pathname === '/reading-list' ? 'active' : ''}`}
            >
              <FiBookmark className="nav-icon" />
              My Reading List
            </Link>
          </div>
        )}

        {/* User Menu */}
        <div className="navbar-actions">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="theme-toggle"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Light mode' : 'Dark mode'}
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {user ? (
            <div className="user-menu-wrapper">
              <button
                className="user-avatar-btn"
                onClick={handleUserMenuClick}
                aria-label="User menu"
              >
                {/* Simple user avatar icon, can be replaced with an image */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="#BB86FC" />
                  <circle cx="16" cy="13" r="6" fill="#E0E0E0" />
                  <ellipse cx="16" cy="25" rx="8" ry="5" fill="#E0E0E0" />
                </svg>
              </button>
              {showDropdown && (
                <div className="user-dropdown">
                  <div className="user-info">
                    <div className="user-name">{user.username}</div>
                    <div className="user-email">{user.email}</div>
                  </div>
                  <button onClick={handleDropdownLogout} className="btn btn-logout">
                    <FiLogOut className="btn-icon" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
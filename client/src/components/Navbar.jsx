/**
 * Navbar Component
 * Top navigation bar with authentication controls and theme toggle
 */

import React, { useContext } from 'react';
// Custom hamburger SVG
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

  // Close dropdown when clicking outside
  React.useEffect(() => {
    if (!showDropdown) return;
    const handleClickOutside = (event) => {
      const dropdown = document.querySelector('.user-dropdown');
      const avatarBtn = document.querySelector('.user-avatar-btn');
      if (dropdown && !dropdown.contains(event.target) && avatarBtn && !avatarBtn.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);
  const handleDropdownLogout = () => {
    setShowDropdown(false);
    handleLogout();
  };


  // Responsive hamburger menu state
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close menu on route change
  React.useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const handleHamburgerClick = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">

      <div className="container navbar-container">
        {/* Hamburger for mobile (left) */}
        {user && isMobile && (
          <button className="hamburger-btn left" onClick={handleHamburgerClick} aria-label="Menu">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="6" y="10" width="20" height="2.5" rx="1.25" fill="var(--primary-color)" />
              <rect x="6" y="16" width="20" height="2.5" rx="1.25" fill="var(--primary-color)" />
              <rect x="6" y="22" width="20" height="2.5" rx="1.25" fill="var(--primary-color)" />
            </svg>
          </button>
        )}

        {/* Centered logo and title for mobile */}
        <div className={`navbar-center-logo${isMobile ? ' mobile' : ''}`}>
          <Link to="/" className="navbar-logo">
            <FiBook className="logo-icon" />
            <span>Book Finder</span>
          </Link>
        </div>


        {/* Navigation Links (desktop) */}
        {user && !isMobile && (
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
                  <Link to="/edit-profile" style={{ padding: 0, background: 'none', color: 'inherit', fontWeight: 500, fontSize: '1rem', textDecoration: 'none', border: 'none', boxShadow: 'none', cursor: 'pointer' }} onClick={() => setShowDropdown(false)}>
                    Edit Profile
                  </Link>
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

      {/* Mobile menu drawer */}
      {user && isMobile && menuOpen && (
        <div className="mobile-menu">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Search Books
          </Link>
          <Link 
            to="/reading-list" 
            className={`nav-link ${location.pathname === '/reading-list' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <FiBookmark className="nav-icon" />
            My Reading List
          </Link>
          <Link 
            to="/edit-profile" 
            className={`nav-link ${location.pathname === '/edit-profile' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            Edit Profile
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
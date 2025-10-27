/**
 * Search Bar Component
 * Book search input with loading state
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { getBookSuggestions } from '../services/bookService';
import './SearchBar.css';

const SearchBar = ({ onSearch, onClear, loading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceTimer = useRef(null);

  // Debounced function to fetch suggestions
  const fetchSuggestions = useCallback(async (searchQuery) => {
    if (searchQuery.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      const results = await getBookSuggestions(searchQuery, 5);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, []);

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300); // 300ms debounce
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Allow search even with empty query (filters can be used)
    const searchQuery = selectedIndex >= 0 ? suggestions[selectedIndex].title : query.trim();
    onSearch(searchQuery);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    if (onClear) {
      onClear();
    }
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.title);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    onSearch(suggestion.title);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };

  // Handle clicks outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-input-container">
        <FiSearch className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Search for books by title, author, ISBN... (or just use filters below)"
          className="search-input"
          disabled={loading}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="clear-search-btn"
            aria-label="Clear search"
          >
            <FiX />
          </button>
        )}

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div ref={suggestionsRef} className="suggestions-dropdown">
            {isLoadingSuggestions ? (
              <div className="suggestion-loading">
                <div className="spinner-small"></div>
                <span>Searching...</span>
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id}
                  className={`suggestion-item ${index === selectedIndex ? 'selected' : ''}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="suggestion-content">
                    <div className="suggestion-title">{suggestion.title}</div>
                    <div className="suggestion-meta">
                      {suggestion.author}
                      {suggestion.publishYear && ` (${suggestion.publishYear})`}
                    </div>
                  </div>
                  <img 
                    src={suggestion.coverUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='48' viewBox='0 0 32 48' fill='none'%3E%3Crect width='32' height='48' fill='%23E0E0E0'/%3E%3Cpath d='M8 12h16v24H8z' fill='%23CCCCCC'/%3E%3Cpath d='M12 16h8v4h-8zM12 22h8v2h-8zM12 26h6v2h-6z' fill='%23AAAAAA'/%3E%3C/svg%3E"}
                    alt={suggestion.title}
                    className="suggestion-cover"
                    onError={(e) => {
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='48' viewBox='0 0 32 48' fill='none'%3E%3Crect width='32' height='48' fill='%23E0E0E0'/%3E%3Cpath d='M8 12h16v24H8z' fill='%23CCCCCC'/%3E%3Cpath d='M12 16h8v4h-8zM12 22h8v2h-8zM12 26h6v2h-6z' fill='%23AAAAAA'/%3E%3C/svg%3E";
                    }}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>
      <button 
        type="submit" 
        className="btn btn-search"
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default SearchBar;
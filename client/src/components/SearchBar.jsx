/**
 * Search Bar Component
 * Book search input with loading state
 */

import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import './SearchBar.css';

const SearchBar = ({ onSearch, onClear, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Allow search even with empty query (filters can be used)
    onSearch(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    if (onClear) {
      onClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-input-container">
        <FiSearch className="search-icon" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
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
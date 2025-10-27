/**
 * Home Page
 * Main search and discovery page with filtering and recommendations
 */

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import BookCard from '../components/BookCard';
import Recommendations from '../components/Recommendations';
import { searchBooks, getSavedBooks, addToReadingList, removeByOpenLibraryId } from '../services/bookService';
import './Home.css';

const Home = () => {
  const [books, setBooks] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({});
  const [lastQuery, setLastQuery] = useState('');

  // Load saved books on mount
  useEffect(() => {
    loadSavedBooks();
  }, []);

  const loadSavedBooks = async () => {
    try {
      const data = await getSavedBooks();
      setSavedBooks(data);
    } catch (error) {
      console.error('Error loading saved books:', error);
    }
  };

  const handleSearch = async (query = '') => {
    // Allow search with just filters (no query required)
    if (!query.trim() && !filters.genre && !filters.yearFrom && !filters.yearTo) {
      toast.info('Please enter a search term or select a filter (genre or year)');
      return;
    }

    setLoading(true);
    setSearched(true);
    setLastQuery(query);
    
    try {
      const data = await searchBooks(query || 'fiction', filters); // Default to 'fiction' if no query
      setBooks(data.data);
      
      if (data.data.length === 0) {
        toast.info('No books found. Try a different search term or adjust filters.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Search failed');
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    
    // Automatically search when filters are applied
    // Use the last query or search by filter alone
    if (Object.keys(newFilters).length > 0) {
      handleSearch(lastQuery);
    }
  };

  const handleClearFilters = () => {
    setFilters({});
    setBooks([]);
    setSearched(false);
    setLastQuery('');
  };

  const handleClearSearch = () => {
    setBooks([]);
    setSearched(false);
    setLastQuery('');
    setFilters({});
  };

  const handleSaveBook = async (book) => {
    const bookData = {
      openLibraryId: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
      publishYear: book.publishYear,
      description: book.description,
      isbn: book.isbn,
      genres: book.genres || []
    };

    await addToReadingList(bookData);
    await loadSavedBooks();
  };

  const handleRemoveBook = async (book) => {
    await removeByOpenLibraryId(book.id);
    await loadSavedBooks();
  };

  const isBookSaved = (bookId) => {
    return savedBooks.some(book => book.openLibraryId === bookId);
  };

  return (
    <div className="container home-page">
      <div className="home-header">
        <h1 className="page-title">Discover Your Next Great Read</h1>
        <p className="page-subtitle">
          Search millions of books and build your personal reading list
        </p>
      </div>

      <div className="search-section">
        <SearchBar onSearch={handleSearch} onClear={handleClearSearch} loading={loading} />
        <FilterBar
          onFilterChange={handleFilterChange}
          activeFilters={filters}
          onClearFilters={handleClearFilters}
        />
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Searching for books...</p>
        </div>
      )}

      {!loading && searched && books.length === 0 && (
        <div className="empty-state">
          <p>No books found. Try searching with different keywords or adjust your filters.</p>
        </div>
      )}

      {!loading && searched && books.length > 0 && (
        <>
          <div className="results-header">
            <h2>Search Results ({books.length})</h2>
          </div>
          <div className="books-grid">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isSaved={isBookSaved(book.id)}
                onSave={handleSaveBook}
                onRemove={handleRemoveBook}
              />
            ))}
          </div>
        </>
      )}

      {!loading && !searched && (
        <div className="welcome-section">
          <div className="welcome-content">
            <h2>Welcome to Book Finder! 📚</h2>
            <p>Discover books in multiple ways:</p>
            <ul>
              <li><strong>Search by text:</strong> Book title, author name, ISBN, or keywords</li>
              <li><strong>Browse by genre:</strong> Select a genre from filters to explore books</li>
              <li><strong>Filter by year:</strong> Find books published in a specific year range</li>
              <li><strong>Combine both:</strong> Search with filters for precise results</li>
            </ul>
            <p className="tip">💡 <strong>Quick Start:</strong> Use the filters below to browse books by genre without searching!</p>
          </div>

          {/* Show recommendations on home */}
          <Recommendations />
        </div>
      )}
    </div>
  );
};

export default Home;
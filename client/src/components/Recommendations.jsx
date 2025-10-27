/**
 * Recommendations Component
 * Display personalized book recommendations
 */

import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiRefreshCw } from 'react-icons/fi';
import { getRecommendations, getTrendingBooks } from '../services/recommendationService';
import BookCard from './BookCard';
import { addToReadingList, getSavedBooks, removeByOpenLibraryId } from '../services/bookService';
import './Recommendations.css';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [basedOn, setBasedOn] = useState(null);
  const [activeTab, setActiveTab] = useState('personalized');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recsData, trendingData, saved] = await Promise.all([
        getRecommendations(),
        getTrendingBooks(),
        getSavedBooks()
      ]);

      setRecommendations(recsData.data);
      setBasedOn(recsData.basedOn);
      setTrending(trendingData);
      setSavedBooks(saved);
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setLoading(false);
    }
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
    const updated = await getSavedBooks();
    setSavedBooks(updated);
  };

  const handleRemoveBook = async (book) => {
    await removeByOpenLibraryId(book.id);
    const updated = await getSavedBooks();
    setSavedBooks(updated);
  };

  const isBookSaved = (bookId) => {
    return savedBooks.some(book => book.openLibraryId === bookId);
  };

  const displayBooks = activeTab === 'personalized' ? recommendations : trending;

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h2>Discover Books</h2>
        <button
          onClick={loadData}
          className="refresh-btn"
          aria-label="Refresh recommendations"
        >
          <FiRefreshCw />
          Refresh
        </button>
      </div>

      <div className="recommendations-tabs">
        <button
          className={`tab-btn ${activeTab === 'personalized' ? 'active' : ''}`}
          onClick={() => setActiveTab('personalized')}
        >
          For You
        </button>
        <button
          className={`tab-btn ${activeTab === 'trending' ? 'active' : ''}`}
          onClick={() => setActiveTab('trending')}
        >
          <FiTrendingUp />
          Trending
        </button>
      </div>

      {activeTab === 'personalized' && basedOn && (
        <div className="based-on-info">
          <p>
            Recommended based on{' '}
            {basedOn.favoriteGenres.length > 0 && (
              <span>your favorite genres ({basedOn.favoriteGenres.slice(0, 3).join(', ')})</span>
            )}
            {basedOn.savedBooksCount > 0 && (
              <span>, {basedOn.savedBooksCount} saved books</span>
            )}
            {basedOn.recentSearchesCount > 0 && (
              <span>, and your recent searches</span>
            )}
          </p>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading recommendations...</p>
        </div>
      ) : displayBooks.length === 0 ? (
        <div className="empty-state">
          <p>
            {activeTab === 'personalized'
              ? 'Start saving books and searching to get personalized recommendations!'
              : 'No trending books available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="books-grid">
          {displayBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isSaved={isBookSaved(book.id)}
              onSave={handleSaveBook}
              onRemove={handleRemoveBook}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;

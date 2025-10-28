/**
 * Reading List Page
 * Displays user's saved books
 */

import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
import { FiBookOpen } from 'react-icons/fi';
import BookCard from '../components/BookCard';
import { getSavedBooks, removeFromReadingList } from '../services/bookService';
import './ReadingList.css';

const ReadingList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await getSavedBooks();
      setBooks(data);
    } catch (error) {
      // Optionally handle error silently
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBook = async (book) => {
    try {
      await removeFromReadingList(book._id);
      setBooks(prevBooks => prevBooks.filter(b => b._id !== book._id));
    } catch (error) {
      // Optionally handle error silently
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading your reading list...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container reading-list-page">
      <div className="reading-list-header">
        <div className="header-content">
          <FiBookOpen className="header-icon" />
          <div>
            <h1 className="page-title">My Reading List</h1>
            <p className="page-subtitle">
              {books.length} {books.length === 1 ? 'book' : 'books'} saved
            </p>
          </div>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="empty-reading-list">
          <div className="empty-content">
            <FiBookOpen className="empty-icon" />
            <h2>Your reading list is empty</h2>
            <p>Start searching for books and add them to your list!</p>
            <a href="/" className="btn btn-primary">
              Search Books
            </a>
          </div>
        </div>
      ) : (
        <div className="books-grid">
          {books.map((book) => (
            <BookCard
              key={book._id}
              book={{
                id: book.openLibraryId,
                _id: book._id,
                title: book.title,
                author: book.author,
                coverUrl: book.coverUrl,
                publishYear: book.publishYear,
                description: book.description
              }}
              isSaved={true}
              onRemove={handleRemoveBook}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReadingList;
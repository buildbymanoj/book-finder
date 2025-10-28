/**
 * Book Card Component
 * Displays individual book information with actions
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark, FiX, FiCalendar, FiUser } from 'react-icons/fi';
import SocialShare from './SocialShare';
import './BookCard.css';

const BookCard = ({ book, isSaved, onSave, onRemove }) => {
  const [loading, setLoading] = useState(false);

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='220' viewBox='0 0 150 220' fill='none'%3E%3Crect width='150' height='220' fill='%23E0E0E0'/%3E%3Cpath d='M30 50h90v120H30z' fill='%23CCCCCC'/%3E%3Cpath d='M45 70h60v20h-60zM45 100h60v10h-60zM45 115h45v10h-45z' fill='%23AAAAAA'/%3E%3Ctext x='75' y='180' text-anchor='middle' fill='%23666' font-family='Arial' font-size='12'%3ENo Cover%3C/text%3E%3C/svg%3E";

  const handleAction = async () => {
    setLoading(true);
    try {
      if (isSaved && onRemove) { // Only allow remove if onRemove is provided
        await onRemove(book);
      } else if (!isSaved) {
        await onSave(book);
      }
    } catch (error) {
      // Parent component will handle error display
    } finally {
      setLoading(false);
    }
  };

  // Determine button content and state
  const getButtonContent = () => {
    if (loading) {
      return <span>Loading...</span>;
    }
    if (isSaved) {
      if (onRemove) { // On Reading List page
        return <><FiX className="btn-icon" /> Remove</>;
      }
      // On Home page, after being saved
      return <>✓ Added</>; 
    }
    // Default "Add to List"
    return <><FiBookmark className="btn-icon" /> Add to List</>;
  };

  return (
    <div className="card h-100">
      <img
        src={book.coverUrl || placeholderImage}
        className="card-img-top"
        alt={book.title}
        onError={(e) => {
          e.target.src = placeholderImage;
        }}
        style={{ objectFit: 'cover', height: '220px' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title" title={book.title}>{book.title}</h5>
        <div className="mb-2">
          {book.author && (
            <span className="me-2"><FiUser /> {book.author}</span>
          )}
          {book.publishYear && (
            <span className="me-2"><FiCalendar /> {book.publishYear}</span>
          )}
        </div>
        {book.genres && book.genres.length > 0 && (
          <div className="mb-2">
            {book.genres.slice(0, 2).map((genre, idx) => (
              <span key={idx} className="badge bg-secondary me-1">{genre}</span>
            ))}
          </div>
        )}
        {book.description && (
          <p className="card-text book-description" title={book.description}>
            {book.description.length > 100
              ? `${book.description.substring(0, 100)}...`
              : book.description}
          </p>
        )}
        <div className="mt-auto">
          <button
            onClick={handleAction}
            disabled={loading || (isSaved && !onRemove)} // Disable if saved and not on reading list
            className={`btn btn-sm ${isSaved ? (onRemove ? 'btn-remove' : 'btn-success') : 'btn-primary'} me-2`}
          >
            {getButtonContent()}
          </button>
          <SocialShare book={book} />
        </div>
      </div>
      <div className="card-footer">
        <small className="text-body-secondary">{book.lastUpdated ? `Last updated ${book.lastUpdated}` : ''}</small>
      </div>
    </div>
  );
};

export default BookCard;
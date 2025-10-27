/**
 * Book Card Component
 * Displays individual book information with actions
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark, FiX, FiCalendar, FiUser, FiExternalLink } from 'react-icons/fi';
import { toast } from 'react-toastify';
import SocialShare from './SocialShare';
import './BookCard.css';

const BookCard = ({ book, isSaved, onSave, onRemove }) => {
  const [loading, setLoading] = useState(false);

  // Default placeholder image (SVG)
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='220' viewBox='0 0 150 220' fill='none'%3E%3Crect width='150' height='220' fill='%23E0E0E0'/%3E%3Cpath d='M30 50h90v120H30z' fill='%23CCCCCC'/%3E%3Cpath d='M45 70h60v20h-60zM45 100h60v10h-60zM45 115h45v10h-45z' fill='%23AAAAAA'/%3E%3Ctext x='75' y='180' text-anchor='middle' fill='%23666' font-family='Arial' font-size='12'%3ENo Cover%3C/text%3E%3C/svg%3E";

  const handleAction = async () => {
    setLoading(true);
    try {
      if (isSaved) {
        await onRemove(book);
        toast.success('Book removed from reading list');
      } else {
        await onSave(book);
        toast.success('Book added to reading list');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="book-card">
      {/* Book Cover */}
      <div className="book-cover">
        <img 
          src={book.coverUrl || placeholderImage} 
          alt={book.title}
          onError={(e) => {
            e.target.src = placeholderImage;
          }}
        />
        {/* <div className="book-overlay">
          <Link 
            to={`/book/${book.id}`} 
            className="view-details-btn"
            aria-label="View book details"
          >
            <FiExternalLink /> View Details
          </Link>
        </div> */}
      </div>

      {/* Book Info */}
      <div className="book-info">
        <h3 className="book-title" title={book.title}>
          {book.title}
        </h3>
        
        <div className="book-meta">
          {book.author && (
            <div className="meta-item">
              <FiUser className="meta-icon" />
              <span>{book.author}</span>
            </div>
          )}
          
          {book.publishYear && (
            <div className="meta-item">
              <FiCalendar className="meta-icon" />
              <span>{book.publishYear}</span>
            </div>
          )}
        </div>

        {book.genres && book.genres.length > 0 && (
          <div className="book-genres">
            {book.genres.slice(0, 2).map((genre, idx) => (
              <span key={idx} className="genre-badge">{genre}</span>
            ))}
          </div>
        )}

        {book.description && (
          <p className="book-description">
            {book.description.length > 100
              ? `${book.description.substring(0, 100)}...` 
              : book.description}
          </p>
        )}

        {/* Actions */}
        <div className="book-actions">
          <button
            onClick={handleAction}
            disabled={loading}
            className={`btn-action ${isSaved ? 'btn-remove' : 'btn-save'}`}
          >
            {loading ? (
              <span>Loading...</span>
            ) : isSaved ? (
              <>
                <FiX className="btn-icon" />
                Remove
              </>
            ) : (
              <>
                <FiBookmark className="btn-icon" />
                Add to List
              </>
            )}
          </button>
          <SocialShare book={book} />
        </div>
      </div>
    </div>
  );
};

export default BookCard;
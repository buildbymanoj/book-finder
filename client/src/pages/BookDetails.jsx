/**
 * BookDetails Page
 * Detailed view of a book with reviews, progress tracking, and related books
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiBook, FiCalendar, FiAward } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { getBookDetails, getSavedBooks, addToReadingList, removeByOpenLibraryId } from '../services/bookService';
import ReadingProgress from '../components/ReadingProgress';
import Reviews from '../components/Reviews';
import SocialShare from '../components/SocialShare';
import BookCard from '../components/BookCard';
import './BookDetails.css';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [savedBook, setSavedBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookDetails();
  }, [id]);

  const loadBookDetails = async () => {
    setLoading(true);
    try {
      const details = await getBookDetails(id);
      const saved = await getSavedBooks();
      const foundBook = saved.find(b => b.openLibraryId === id);
      
      setBook(details);
      setSavedBook(foundBook || null);
    } catch (error) {
      toast.error('Failed to load book details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (savedBook) {
      await removeByOpenLibraryId(id);
      toast.success('Book removed from reading list');
      setSavedBook(null);
    } else {
      const bookData = {
        openLibraryId: id,
        title: book.title,
        author: book.author || 'Unknown Author',
        coverUrl: book.covers?.[0] ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` : null,
        description: book.description,
        genres: book.subjects?.slice(0, 5) || []
      };
      
      const saved = await addToReadingList(bookData);
      toast.success('Book added to reading list');
      setSavedBook(saved);
    }
  };

  const handleProgressUpdate = (updatedBook) => {
    setSavedBook(updatedBook);
  };

  if (loading) {
    return (
      <div className="container book-details-page">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container book-details-page">
        <div className="error-state">
          <p>Book not found</p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const coverUrl = book.covers?.[0] 
    ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`
    : 'https://via.placeholder.com/300x450/e5e7eb/6b7280?text=No+Cover';

  return (
    <div className="container book-details-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        <FiArrowLeft />
        Back
      </button>

      <div className="book-details-container">
        {/* Book Main Info */}
        <div className="book-main-section">
          <div className="book-cover-section">
            <img src={coverUrl} alt={book.title} className="book-cover-large" />
            <div className="cover-actions">
              <button
                onClick={handleSave}
                className={`btn-action ${savedBook ? 'saved' : ''}`}
              >
                {savedBook ? 'Remove from List' : 'Add to Reading List'}
              </button>
              <SocialShare book={book} />
            </div>
          </div>

          <div className="book-info-section">
            <h1 className="book-title-large">{book.title}</h1>
            
            {book.author && (
              <div className="book-meta-item">
                <FiBook />
                <span>{book.author}</span>
              </div>
            )}

            {book.subjects && book.subjects.length > 0 && (
              <div className="book-genres">
                {book.subjects.slice(0, 8).map((subject, index) => (
                  <span key={index} className="genre-tag">
                    {subject}
                  </span>
                ))}
              </div>
            )}

            <div className="book-description">
              <h2>About This Book</h2>
              <p>{book.description || 'No description available.'}</p>
            </div>

            {/* Awards Section */}
            {savedBook?.awards && savedBook.awards.length > 0 && (
              <div className="awards-section">
                <h3>
                  <FiAward /> Awards & Recognition
                </h3>
                <ul className="awards-list">
                  {savedBook.awards.map((award, index) => (
                    <li key={index}>
                      <strong>{award.name}</strong>
                      {award.year && <span> ({award.year})</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Reading Progress */}
        {savedBook && (
          <div className="progress-section">
            <ReadingProgress book={savedBook} onUpdate={handleProgressUpdate} />
          </div>
        )}

        {/* Related Books */}
        {savedBook?.relatedBooks && savedBook.relatedBooks.length > 0 && (
          <div className="related-books-section">
            <h2>Related Books</h2>
            <div className="books-grid">
              {savedBook.relatedBooks.map((relatedBook) => (
                <BookCard
                  key={relatedBook.openLibraryId}
                  book={{
                    id: relatedBook.openLibraryId,
                    title: relatedBook.title,
                    author: relatedBook.author,
                    coverUrl: relatedBook.coverUrl
                  }}
                  isSaved={false}
                  onSave={() => {}}
                  onRemove={() => {}}
                />
              ))}
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {savedBook && (
          <Reviews book={savedBook} openLibraryId={id} />
        )}
      </div>
    </div>
  );
};

export default BookDetails;

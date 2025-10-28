/**
 * Recommendations Component
 * Display curated classic books
 */

import React, { useState, useEffect } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import BookCard from './BookCard';
import { addToReadingList, getSavedBooks, removeByOpenLibraryId, searchBooks } from '../services/bookService';
import './Recommendations.css';

// Curated list of classic/best books of all time
const CLASSIC_BOOKS_QUERIES = [
  'To Kill a Mockingbird Harper Lee',
  '1984 George Orwell',
  'Pride and Prejudice Jane Austen',
  'The Great Gatsby F. Scott Fitzgerald',
  'One Hundred Years of Solitude',
  'The Catcher in the Rye',
  'Lord of the Rings',
  'Harry Potter',
  'The Hobbit Tolkien',
  'Jane Eyre Charlotte Bronte',
  'Wuthering Heights',
  'Moby Dick Herman Melville',
  'The Odyssey Homer',
  'Crime and Punishment Dostoevsky',
  'The Brothers Karamazov',
  'Anna Karenina',
  'Brave New World Aldous Huxley',
  'Animal Farm George Orwell',
  'Fahrenheit 451 Ray Bradbury'
];

const Recommendations = () => {
  const [books, setBooks] = useState([]);
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClassicBooks();
  }, []);

  const getRandomBooks = () => {
    // Shuffle and pick 3 random classic books
    const shuffled = [...CLASSIC_BOOKS_QUERIES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  };

  const loadClassicBooks = async () => {
    setLoading(true);
    try {
      const saved = await getSavedBooks();
      setSavedBooks(saved);

      const randomQueries = getRandomBooks();
      const bookPromises = randomQueries.map(query => 
        searchBooks(query, { limit: 1 }).catch(() => null)
      );

      const results = await Promise.all(bookPromises);
      const fetchedBooks = results
        .filter(result => result && result.data && result.data.length > 0)
        .map(result => result.data[0]);

      setBooks(fetchedBooks);
    } catch (error) {
      console.error('Error loading classic books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBook = async (book) => {
    const bookData = {
      openLibraryId: book.id.startsWith('/') ? book.id.substring(1) : book.id,
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
    const bookId = book.id.startsWith('/') ? book.id.substring(1) : book.id;
    await removeByOpenLibraryId(bookId);
    setSavedBooks(prev => prev.filter(b => b.openLibraryId !== bookId));
  };

  const isBookSaved = (bookId) => {
    // Normalize bookId by removing leading slash if present
    const normalizedId = bookId.startsWith('/') ? bookId.substring(1) : bookId;
    return savedBooks.some(book => book.openLibraryId === normalizedId);
  };

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h2>📚 Classic Books You Might Love</h2>
        <button
          onClick={loadClassicBooks}
          className="refresh-btn"
          aria-label="Show different classics"
          title="Show different classics"
        >
          <FiRefreshCw />
          Shuffle
        </button>
      </div>

      <p className="recommendations-subtitle">
        Timeless masterpieces that have captivated readers for generations
      </p>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading classics...</p>
        </div>
      ) : books.length === 0 ? (
        <div className="empty-state">
          <p>Unable to load classic books at the moment. Please try again.</p>
        </div>
      ) : (
        <div className="books-grid-compact">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              isSaved={isBookSaved(book.id)}
              onSave={() => handleSaveBook(book)}
              // No onRemove prop passed from Recommendations
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;

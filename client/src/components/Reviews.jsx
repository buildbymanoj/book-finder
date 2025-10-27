/**
 * Reviews Component
 * Display and manage book reviews
 */

import React, { useState, useEffect, useContext } from 'react';
import { FiStar, FiThumbsUp, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext';
import {
  getBookReviews,
  createReview,
  updateReview,
  deleteReview,
  markReviewHelpful
} from '../services/reviewService';
import { toast } from 'react-toastify';
import './Reviews.css';

const Reviews = ({ book, openLibraryId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    readingStatus: 'completed'
  });

  useEffect(() => {
    loadReviews();
  }, [openLibraryId]);

  const loadReviews = async () => {
    try {
      const data = await getBookReviews(openLibraryId);
      setReviews(data.data);
      setAverageRating(parseFloat(data.averageRating));
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.comment.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      if (editingReview) {
        await updateReview(editingReview._id, formData);
        toast.success('Review updated!');
      } else {
        await createReview({
          bookId: book._id,
          openLibraryId,
          ...formData
        });
        toast.success('Review submitted!');
      }

      setFormData({ rating: 5, title: '', comment: '', readingStatus: 'completed' });
      setShowForm(false);
      setEditingReview(null);
      loadReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      readingStatus: review.readingStatus
    });
    setShowForm(true);
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteReview(reviewId);
      toast.success('Review deleted');
      loadReviews();
    } catch (error) {
      toast.error('Failed to delete review');
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      await markReviewHelpful(reviewId);
      loadReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark as helpful');
    }
  };

  const userReview = reviews.find(r => r.user._id === user?.id);
  const canReview = user && book && !userReview;

  return (
    <div className="reviews-section">
      <div className="reviews-header">
        <h2>Reviews</h2>
        {averageRating > 0 && (
          <div className="average-rating">
            <FiStar className="star-icon filled" />
            <span className="rating-value">{averageRating}</span>
            <span className="rating-count">({reviews.length} reviews)</span>
          </div>
        )}
      </div>

      {canReview && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="write-review-btn"
        >
          Write a Review
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="review-form">
          <h3>{editingReview ? 'Edit Review' : 'Write a Review'}</h3>

          {/* Rating */}
          <div className="form-group">
            <label>Rating</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="star-btn"
                  aria-label={`Rate ${star} stars`}
                >
                  <FiStar
                    className={star <= formData.rating ? 'filled' : ''}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="review-title">Title</label>
            <input
              id="review-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Sum up your review"
              maxLength="100"
              required
            />
          </div>

          {/* Comment */}
          <div className="form-group">
            <label htmlFor="review-comment">Your Review</label>
            <textarea
              id="review-comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              placeholder="Share your thoughts about this book..."
              rows="5"
              maxLength="1000"
              required
            />
            <span className="char-count">{formData.comment.length}/1000</span>
          </div>

          {/* Reading Status */}
          <div className="form-group">
            <label htmlFor="reading-status">Reading Status</label>
            <select
              id="reading-status"
              value={formData.readingStatus}
              onChange={(e) => setFormData({ ...formData, readingStatus: e.target.value })}
            >
              <option value="reading">Currently Reading</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingReview(null);
                setFormData({ rating: 5, title: '', comment: '', readingStatus: 'completed' });
              }}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {editingReview ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="reviews-list">
        {loading ? (
          <div className="loading-state">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="empty-state">
            <p>No reviews yet. Be the first to review this book!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="review-meta">
                  <span className="reviewer-name">{review.user.username}</span>
                  <span className="review-date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="review-rating">
                  {[...Array(review.rating)].map((_, i) => (
                    <FiStar key={i} className="star-icon filled" />
                  ))}
                </div>
              </div>

              <h4 className="review-title">{review.title}</h4>
              <p className="review-comment">{review.comment}</p>

              <div className="review-footer">
                <button
                  onClick={() => handleHelpful(review._id)}
                  className="helpful-btn"
                  disabled={review.votedBy?.includes(user?.id)}
                >
                  <FiThumbsUp />
                  Helpful ({review.helpfulVotes})
                </button>

                {user && review.user._id === user.id && (
                  <div className="review-actions">
                    <button
                      onClick={() => handleEdit(review)}
                      className="action-btn edit"
                      aria-label="Edit review"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="action-btn delete"
                      aria-label="Delete review"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;

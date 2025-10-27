/**
 * ReadingProgress Component
 * Track and display reading progress
 */

import React, { useState } from 'react';
import { FiBookOpen, FiCheck, FiPause, FiEdit2, FiSave } from 'react-icons/fi';
import { updateReadingProgress } from '../services/bookService';
import { toast } from 'react-toastify';
import './ReadingProgress.css';

const ReadingProgress = ({ book, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: book.readingProgress?.status || 'not-started',
    currentPage: book.readingProgress?.currentPage || 0,
    totalPages: book.readingProgress?.totalPages || 0,
    notes: book.readingProgress?.notes || ''
  });

  const statusOptions = [
    { value: 'not-started', label: 'Not Started', icon: FiBookOpen, color: '#6b7280' },
    { value: 'reading', label: 'Reading', icon: FiBookOpen, color: '#3b82f6' },
    { value: 'paused', label: 'Paused', icon: FiPause, color: '#f59e0b' },
    { value: 'completed', label: 'Completed', icon: FiCheck, color: '#10b981' }
  ];

  const currentStatus = statusOptions.find(opt => opt.value === formData.status);
  const percentage = formData.totalPages > 0
    ? Math.round((formData.currentPage / formData.totalPages) * 100)
    : book.readingProgress?.percentage || 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedBook = await updateReadingProgress(book._id, formData);
      toast.success('Progress updated!');
      setIsEditing(false);
      if (onUpdate) onUpdate(updatedBook);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isEditing) {
    const CurrentStatusIcon = currentStatus.icon;
    
    return (
      <div className="reading-progress">
        <div className="progress-header">
          <h3>Reading Progress</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="edit-btn"
            aria-label="Edit reading progress"
          >
            <FiEdit2 />
          </button>
        </div>

        <div className="progress-content">
          <div className="status-display" style={{ color: currentStatus.color }}>
            <CurrentStatusIcon className="status-icon" />
            <span className="status-label">{currentStatus.label}</span>
          </div>

          {percentage > 0 && (
            <div className="progress-bar-container">
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: currentStatus.color
                  }}
                />
              </div>
              <span className="progress-text">{percentage}%</span>
            </div>
          )}

          {formData.totalPages > 0 && (
            <div className="page-info">
              Page {formData.currentPage} of {formData.totalPages}
            </div>
          )}

          {formData.notes && (
            <div className="notes-display">
              <strong>Notes:</strong>
              <p>{formData.notes}</p>
            </div>
          )}

          {book.readingProgress?.startedAt && (
            <div className="date-info">
              <small>
                Started: {new Date(book.readingProgress.startedAt).toLocaleDateString()}
              </small>
            </div>
          )}

          {book.readingProgress?.completedAt && (
            <div className="date-info">
              <small>
                Completed: {new Date(book.readingProgress.completedAt).toLocaleDateString()}
              </small>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="reading-progress">
      <div className="progress-header">
        <h3>Update Progress</h3>
      </div>

      <form onSubmit={handleSubmit} className="progress-form">
        {/* Status Selection */}
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <div className="status-options">
            {statusOptions.map(option => {
              const StatusIcon = option.icon;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`status-btn ${formData.status === option.value ? 'active' : ''}`}
                  onClick={() => handleChange('status', option.value)}
                  style={{
                    borderColor: formData.status === option.value ? option.color : '',
                    color: formData.status === option.value ? option.color : ''
                  }}
                >
                  <StatusIcon />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Page Progress */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="currentPage">Current Page</label>
            <input
              id="currentPage"
              type="number"
              min="0"
              value={formData.currentPage}
              onChange={(e) => handleChange('currentPage', parseInt(e.target.value) || 0)}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalPages">Total Pages</label>
            <input
              id="totalPages"
              type="number"
              min="0"
              value={formData.totalPages}
              onChange={(e) => handleChange('totalPages', parseInt(e.target.value) || 0)}
              className="form-input"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label htmlFor="notes">Notes (Optional)</label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            className="form-textarea"
            placeholder="Add your thoughts or notes about this book..."
            rows="3"
            maxLength="500"
          />
          <span className="char-count">{formData.notes.length}/500</span>
        </div>

        {/* Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="btn-cancel"
            disabled={loading}
          >
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            <FiSave />
            {loading ? 'Saving...' : 'Save Progress'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReadingProgress;

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { updateProfile } from '../services/authService';
import './EditProfile.css';

const EditProfile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    // Only send fields that are changed
    const payload = {};
    if (username !== user?.username) payload.username = username;
    if (newPassword) {
      payload.newPassword = newPassword;
      payload.currentPassword = currentPassword;
    }
    if (!payload.username && !payload.newPassword) {
      setMessage('No changes to update.');
      setLoading(false);
      return;
    }
    try {
      const res = await updateProfile(payload);
      setUser(res);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Update failed');
    }
    setLoading(false);
  };

  return (
    <div className="edit-profile-container">
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <button
          type="button"
          style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: 8, fontSize: '1.5rem', color: 'var(--primary-color, #7c3aed)' }}
          aria-label="Back to Home"
          onClick={() => navigate('/')}
        >
          &#8592;
        </button>
        <div className="edit-profile-title" style={{ flex: 1 }}>Edit Profile</div>
      </div>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <label htmlFor="currentPassword">Current Password <span style={{fontWeight:400, fontSize:'0.95em'}}>(required only to change password)</span></label>
        <input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          disabled={!newPassword}
        />
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>Update</button>
        {message && <div className="edit-profile-message">{message}</div>}
      </form>
    </div>
  );
};

export default EditProfile;

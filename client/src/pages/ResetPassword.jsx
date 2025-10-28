/**
 * Reset Password Page
 * Allows users to set a new password using reset token
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../services/authService';
import './Auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await resetPassword(token, password);
      toast.success('Password reset successful! You can now log in with your new password.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
      if (error.response?.status === 400) {
        setTokenValid(false);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <section>
        <div className="container">
          <div className="user signinBx">
            <div className="imgBx"></div>
            <div className="formBx">
              <div style={{ textAlign: 'center' }}>
                <h2>Invalid or Expired Link</h2>
                <p style={{ margin: '20px 0', color: '#666' }}>
                  This password reset link is invalid or has expired.
                </p>
                <p style={{ margin: '20px 0', color: '#666' }}>
                  Please request a new password reset link.
                </p>
                <a href="/forgot-password" style={{ color: '#007bff', textDecoration: 'none' }}>
                  Request New Reset Link
                </a>
                <br />
                <a href="/login" style={{ color: '#007bff', textDecoration: 'none', marginTop: '10px', display: 'inline-block' }}>
                  ← Back to Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="container">
        <div className="user signinBx">
          <div className="imgBx"></div>
          <div className="formBx">
            <form onSubmit={handleSubmit}>
              <h2>Reset Password</h2>
              <p style={{ margin: '10px 0 20px 0', color: '#666', fontSize: '14px' }}>
                Enter your new password below.
              </p>
              <input
                type="password"
                name="password"
                placeholder="New Password (min 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
              />
              <input
                type="submit"
                value={loading ? 'Resetting...' : 'Reset Password'}
                disabled={loading}
              />
              <p className="signup">
                Remember your password?{' '}
                <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
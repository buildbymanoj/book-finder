/**
 * Forgot Password Page
 * Allows users to request a password reset email
 */

import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { forgotPassword } from '../services/authService';
import './Auth.css';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      await forgotPassword(email);
      setSubmitted(true);
      toast.success('If an account with that email exists, a password reset link has been sent.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <section>
        <div className="container">
          <div className="user signinBx">
            <div className="imgBx"></div>
            <div className="formBx">
              <div style={{ textAlign: 'center' }}>
                <h2>Check Your Email</h2>
                <p style={{ margin: '20px 0', color: '#666' }}>
                  If an account with that email exists, we've sent you a password reset link.
                </p>
                <p style={{ margin: '20px 0', color: '#666' }}>
                  Check your spam folder if you don't see it in your inbox.
                </p>
                <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                  ← Back to Login
                </Link>
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
              <h2>Forgot Password</h2>
              <p style={{ margin: '10px 0 20px 0', color: '#666', fontSize: '14px' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <input
                type="submit"
                value={loading ? 'Sending...' : 'Send Reset Link'}
                disabled={loading}
              />
              <p className="signup">
                Remember your password?{' '}
                <Link to="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;

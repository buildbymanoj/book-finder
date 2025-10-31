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
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const response = await forgotPassword(email);
      if (response.success) {
        setPassword(response.password);
        toast.success('Password retrieved successfully');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to retrieve password');
    } finally {
      setLoading(false);
    }
  };

  if (password) {
    return (
      <section>
        <div className="container">
          <div className="user signinBx">
            <div className="imgBx"></div>
            <div className="formBx">
              <div style={{ textAlign: 'center' }}>
                <h2>Your Password</h2>
                <p style={{ margin: '20px 0', color: '#666' }}>
                  Your password is: <strong>{password}</strong>
                </p>
                <p style={{ margin: '20px 0', color: '#666' }}>
                  Please save it securely.
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
                Enter your email address and we'll show your password.
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
                value={loading ? 'Retrieving...' : 'Get Password'}
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

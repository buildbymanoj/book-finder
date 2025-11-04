/**
 * Combined Auth Page with Sliding Forms
 * Login and Register in one page with sliding animation
 */

import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login, register, googleSignIn, handleGoogleCallback } from '../services/authService';
import './Auth.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useContext(AuthContext);
  
  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false); // for sliding
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');

  // Check if we should start with register form
  React.useEffect(() => {
    if (location.pathname === '/register') {
      setIsActive(true);
    }
  }, [location.pathname]);

  // Handle Google OAuth callback
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    const isGoogle = urlParams.get('google');

    if (token && isGoogle) {
      // Handle successful Google authentication
      handleGoogleCallback(token)
        .then((userData) => {
          setUser(userData);
          setLoginSuccess('Google sign-in successful! Welcome!');
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
          setTimeout(() => {
            window.location.href = '/';
          }, 1500);
        })
        .catch((err) => {
          setLoginError('Failed to complete Google authentication');
          console.error('Google callback error:', err);
        });
    } else if (error) {
      setLoginError(error);
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setUser]);

  const toggleForm = () => {
    setIsActive(!isActive);
    setLoginError('');
    setRegisterError('');
    setLoginSuccess('');
    setRegisterSuccess('');
  };

  const handleToggleClick = (e) => {
    e.preventDefault();
    toggleForm();
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    setLoginError('');
    setLoginSuccess('');
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
    setRegisterError('');
    setRegisterSuccess('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginSuccess('');
    
    if (!loginData.identifier || !loginData.password) {
      setLoginError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const userData = await login(loginData);
      setUser(userData);
      setLoginSuccess(userData.message || 'Login successful!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      setLoginError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    
    if (!registerData.username || !registerData.email || !registerData.password) {
      setRegisterError('Please fill in all fields');
      return;
    }

    if (registerData.password.length < 8) {
      setRegisterError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const userData = await register(registerData);
      setUser(userData);
      setRegisterSuccess(userData.message || 'Registration successful!');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      setLoginError('Google sign-in failed. Please try again.');
    }
  };

  return (
    <section>
      <div className={`container ${isActive ? 'active' : ''}`}>
        {/* Sign In Form */}
        <div className="user signinBx">
          <div className="imgBx"></div>
          <div className="formBx">
            <form onSubmit={handleLoginSubmit}>
              <h2>Sign In</h2>
              {loginError && <div className="error-message">{loginError}</div>}
              {loginSuccess && <div className="success-message">{loginSuccess}</div>}
              <input
                type="text"
                name="identifier"
                placeholder="Email or Username"
                value={loginData.identifier}
                onChange={handleLoginChange}
                disabled={loading}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                disabled={loading}
                required
              />
              <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                <a href={`/forgot-password${loginData.identifier ? `?email=${encodeURIComponent(loginData.identifier)}` : ''}`} style={{ color: '#007bff', textDecoration: 'none', fontSize: '14px' }}>
                  Forgot Password?
                </a>
              </div>
              <input
                type="submit"
                value={loading ? 'Signing in...' : 'Login'}
                disabled={loading}
              />
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>or</span>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '20px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <p className="signup">
                Don't have an account?{' '}
                <a href="#" onClick={handleToggleClick}>Sign up.</a>
              </p>
            </form>
          </div>
        </div>

        {/* Sign Up Form */}
        <div className="user signupBx">
          <div className="imgBx"></div>
          <div className="formBx">
            <form onSubmit={handleRegisterSubmit}>
              <h2>Create an Account</h2>
              {registerError && <div className="error-message">{registerError}</div>}
              {registerSuccess && <div className="success-message">{registerSuccess}</div>}
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={registerData.username}
                onChange={handleRegisterChange}
                disabled={loading}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={registerData.email}
                onChange={handleRegisterChange}
                disabled={loading}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Create Password (min 8 characters)"
                value={registerData.password}
                onChange={handleRegisterChange}
                disabled={loading}
                required
              />
              <input
                type="submit"
                value={loading ? 'Signing up...' : 'Sign Up'}
                disabled={loading}
              />
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <span style={{ color: '#666', fontSize: '14px' }}>or</span>
              </div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  marginBottom: '20px'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
              <p className="signup">
                Already have an account?{' '}
                <a href="#" onClick={handleToggleClick}>Sign in.</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthPage;

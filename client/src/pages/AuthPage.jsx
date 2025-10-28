/**
 * Combined Auth Page with Sliding Forms
 * Login and Register in one page with sliding animation
 */

import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login, register } from '../services/authService';
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

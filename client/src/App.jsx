/**
 * Main App Component
 * Handles routing, authentication, and theme context
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context
import { AuthContext } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AuthPage from './pages/AuthPage';
import ReadingList from './pages/ReadingList';
import BookDetails from './pages/BookDetails';
import PrivateRoute from './components/PrivateRoute';

// Services
import { getCurrentUser } from './services/authService';

// Styles
import './App.css';

import GradientBlinds from './components/GradientBlinds';



function App() {

  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <ThemeProvider>
        <Router>
          <div className="App" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
            {/* Background GradientBlinds */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, width: '100vw', height: '100vh', pointerEvents: 'none' }}>
              <GradientBlinds
                gradientColors={['#FF9FFC', '#5227FF']}
                angle={0}
                noise={0.3}
                blindCount={12}
                blindMinWidth={50}
                spotlightRadius={0.5}
                spotlightSoftness={1}
                spotlightOpacity={1}
                mouseDampening={0.15}
                distortAmount={0}
                shineDirection="left"
                mixBlendMode="lighten"
              />
            </div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              {/* Show only app name for login/register, full Navbar otherwise */}
              {window.location.pathname === '/login' || window.location.pathname === '/register' ? (
                <div style={{ width: '100%', textAlign: 'center', padding: '2rem 0 1rem 0', fontWeight: 700, fontSize: '2rem', color: 'var(--primary-color)', letterSpacing: '2px' }}>
                  Book Finder
                </div>
              ) : (
                <Navbar />
              )}
              <main className="main-content">
                <Routes>
                  {/* Public Routes */}
                  <Route 
                    path="/login" 
                    element={user ? <Navigate to="/" /> : <AuthPage />} 
                  />
                  <Route 
                    path="/register" 
                    element={user ? <Navigate to="/" /> : <AuthPage />} 
                  />
                  {/* Private Routes */}
                  <Route 
                    path="/" 
                    element={
                      <PrivateRoute>
                        <Home />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/reading-list" 
                    element={
                      <PrivateRoute>
                        <ReadingList />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/book/:id" 
                    element={
                      <PrivateRoute>
                        <BookDetails />
                      </PrivateRoute>
                    } 
                  />
                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              {/* Toast Notifications */}
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </div>
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
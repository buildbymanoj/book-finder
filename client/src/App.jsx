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
import Login from './pages/Login';
import Register from './pages/Register';
import ReadingList from './pages/ReadingList';
import BookDetails from './pages/BookDetails';
import PrivateRoute from './components/PrivateRoute';

// Services
import { getCurrentUser } from './services/authService';

// Styles
import './App.css';

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
          <div className="App">
            <Navbar />
            
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route 
                  path="/login" 
                  element={user ? <Navigate to="/" /> : <Login />} 
                />
                <Route 
                  path="/register" 
                  element={user ? <Navigate to="/" /> : <Register />} 
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
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export default App;
/**
 * Private Route Component
 * Protects routes that require authentication
 */

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
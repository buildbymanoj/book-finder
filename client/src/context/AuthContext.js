/**
 * Authentication Context
 * Provides user authentication state across the app
 */

import { createContext } from 'react';

export const AuthContext = createContext({
  user: null,
  setUser: () => {}
});
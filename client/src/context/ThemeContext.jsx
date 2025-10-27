/**
 * Theme Context
 * Manages dark mode and accessibility preferences
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { updatePreferences } from '../services/authService';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  // Load preferences from user data or localStorage
  useEffect(() => {
    if (user && user.preferences) {
      setDarkMode(user.preferences.darkMode || false);
      setFontSize(user.preferences.fontSize || 'medium');
      setReducedMotion(user.preferences.reducedMotion || false);
      setHighContrast(user.preferences.highContrast || false);
    } else {
      // Load from localStorage for guests
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      const savedFontSize = localStorage.getItem('fontSize') || 'medium';
      setDarkMode(savedDarkMode);
      setFontSize(savedFontSize);
    }
  }, [user]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Dark mode
    if (darkMode) {
      root.classList.add('dark-mode');
    } else {
      root.classList.remove('dark-mode');
    }

    // Font size
    root.setAttribute('data-font-size', fontSize);

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [darkMode, fontSize, reducedMotion, highContrast]);

  const toggleDarkMode = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem('darkMode', newValue.toString());

    if (user) {
      try {
        await updatePreferences({ darkMode: newValue });
      } catch (error) {
        console.error('Failed to save preference:', error);
      }
    }
  };

  const changeFontSize = async (size) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);

    if (user) {
      try {
        await updatePreferences({ fontSize: size });
      } catch (error) {
        console.error('Failed to save preference:', error);
      }
    }
  };

  const toggleReducedMotion = async () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);

    if (user) {
      try {
        await updatePreferences({ reducedMotion: newValue });
      } catch (error) {
        console.error('Failed to save preference:', error);
      }
    }
  };

  const toggleHighContrast = async () => {
    const newValue = !highContrast;
    setHighContrast(newValue);

    if (user) {
      try {
        await updatePreferences({ highContrast: newValue });
      } catch (error) {
        console.error('Failed to save preference:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        fontSize,
        reducedMotion,
        highContrast,
        toggleDarkMode,
        changeFontSize,
        toggleReducedMotion,
        toggleHighContrast
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

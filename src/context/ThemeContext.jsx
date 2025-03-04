'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Define available themes
export const themes = {
  light: 'light',
  dark: 'dark',
};

// Create the theme context
const ThemeContext = createContext(null);

/**
 * ThemeProvider component that provides theme state and toggle functionality
 * to its children
 */
export const ThemeProvider = ({ children }) => {
  // Initialize theme state from localStorage if available, otherwise use system preference
  const [theme, setTheme] = useState(() => {
    // Default to light theme for server-side rendering
    if (typeof window === 'undefined') return themes.light;

    // Check for saved theme in localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && Object.values(themes).includes(savedTheme)) {
      return savedTheme;
    }

    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return themes.dark;
    }

    // Default to light theme
    return themes.light;
  });

  // Apply theme to document when it changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const root = document.documentElement;
    
    // Remove all theme classes
    Object.values(themes).forEach(t => {
      root.classList.remove(t);
    });
    
    // Add current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        theme === themes.dark ? '#1a1a1a' : '#ffffff'
      );
    }
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only change theme if user hasn't manually set it
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? themes.dark : themes.light);
      }
    };

    // Add listener for system preference changes
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Cleanup listener
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme(prevTheme => 
      prevTheme === themes.light ? themes.dark : themes.light
    );
  };

  // Set a specific theme
  const setThemeValue = (newTheme) => {
    if (Object.values(themes).includes(newTheme)) {
      setTheme(newTheme);
    } else {
      console.warn(`Invalid theme: ${newTheme}. Available themes: ${Object.values(themes).join(', ')}`);
    }
  };

  // Context value
  const value = {
    theme,
    toggleTheme,
    setTheme: setThemeValue,
    isDark: theme === themes.dark,
    isLight: theme === themes.light,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Custom hook to use the theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};


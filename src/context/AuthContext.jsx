'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Simulate checking authentication status
    const checkAuth = async () => {
      try {
        setLoading(true);
        // In a real app, you would check for a token and validate it
        const token = localStorage.getItem('token');
        
        if (token) {
          // Simulate fetching user data
          // In a real app, you would make an API call to get the user data
          setTimeout(() => {
            setUser({ name: 'Demo User', role: 'Admin' });
            setIsAuthenticated(true);
            setLoading(false);
          }, 500);
        } else {
          setIsAuthenticated(false);
          setLoading(false);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setError(err.message);
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username, password) => {
    try {
      setLoading(true);
      // Simulate login API call
      // In a real app, you would make an API call to authenticate
      return new Promise((resolve) => {
        setTimeout(() => {
          const user = { name: 'Demo User', role: 'Admin' };
          const token = 'demo-token';
          localStorage.setItem('token', token);
          setUser(user);
          setIsAuthenticated(true);
          setLoading(false);
          resolve(user);
        }, 1000);
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      // Simulate logout
      // In a real app, you would make an API call to logout
      return new Promise((resolve) => {
        setTimeout(() => {
          localStorage.removeItem('token');
          setUser(null);
          setIsAuthenticated(false);
          setLoading(false);
          resolve();
        }, 500);
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import Toast from '@/components/ui/Toast';

// Define notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Create notification context
const NotificationContext = createContext(null);

/**
 * NotificationProvider component that provides toast notifications
 * functionality to its children
 */
export const NotificationProvider = ({ children }) => {
  // State to store active toasts
  const [toasts, setToasts] = useState([]);
  // Counter to create unique toast IDs
  const toastIdCounter = useRef(0);

  // Add a new toast notification
  const addToast = useCallback(({ type, title, message, duration = 5000 }) => {
    const id = `toast-${Date.now()}-${toastIdCounter.current++}`;
    
    setToasts(prevToasts => [
      ...prevToasts,
      {
        id,
        type,
        title,
        message,
        duration,
      },
    ]);
    
    return id; // Return the ID so it can be used to dismiss the toast if needed
  }, []);

  // Remove a toast by ID
  const removeToast = useCallback((id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Convenience methods for different toast types
  const success = useCallback((message, title = 'Success', duration) => {
    return addToast({
      type: NOTIFICATION_TYPES.SUCCESS,
      title,
      message,
      duration,
    });
  }, [addToast]);

  const error = useCallback((message, title = 'Error', duration) => {
    return addToast({
      type: NOTIFICATION_TYPES.ERROR,
      title,
      message,
      duration,
    });
  }, [addToast]);

  const warning = useCallback((message, title = 'Warning', duration) => {
    return addToast({
      type: NOTIFICATION_TYPES.WARNING,
      title,
      message,
      duration,
    });
  }, [addToast]);

  const info = useCallback((message, title = 'Information', duration) => {
    return addToast({
      type: NOTIFICATION_TYPES.INFO,
      title,
      message,
      duration,
    });
  }, [addToast]);

  // Clear all toasts
  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Context value
  const value = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
    clearToasts,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Toast container that renders all active toasts */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

/**
 * Custom hook to use the notification context
 */
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

// Helper to show error messages from API responses
export const useApiErrorNotification = () => {
  const { error } = useNotification();
  
  return useCallback((err) => {
    let errorMessage = 'An unexpected error occurred';
    
    if (typeof err === 'string') {
      errorMessage = err;
    } else if (err?.response?.data?.message) {
      errorMessage = err.response.data.message;
    } else if (err?.message) {
      errorMessage = err.message;
    }
    
    error(errorMessage);
  }, [error]);
};

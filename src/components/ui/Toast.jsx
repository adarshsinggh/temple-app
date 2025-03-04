import React, { useEffect, useState } from 'react';
import { FaCheck, FaInfo, FaExclamationTriangle, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const Toast = ({
  id,
  type = 'info', // success, info, warning, error
  title,
  message,
  duration = 5000, // ms, 0 for no auto-dismiss
  onClose,
  position = 'top-right',
  className = ''
}) => {
  const [visible, setVisible] = useState(true);
  const [removing, setRemoving] = useState(false);
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheck />;
      case 'warning':
        return <FaExclamationTriangle />;
      case 'error':
        return <FaExclamationCircle />;
      case 'info':
      default:
        return <FaInfo />;
    }
  };
  
  const handleClose = () => {
    setRemoving(true);
    // Wait for animation to complete
    setTimeout(() => {
      setVisible(false);
      if (onClose) {
        onClose(id);
      }
    }, 300); // Match animation duration
  };
  
  // Auto-dismiss after duration (if not 0)
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(handleClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);
  
  if (!visible) return null;
  
  return (
    <div 
      className={`toast toast-${type} toast-${position} ${removing ? 'removing' : ''} ${className}`}
      role="alert"
    >
      <div className="toast-icon">
        {getIcon()}
      </div>
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={handleClose} aria-label="Close notification">
        <FaTimes />
      </button>
      {duration > 0 && (
        <div className="toast-progress">
          <div 
            className="toast-progress-bar"
            style={{ animationDuration: `${duration}ms` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Toast;
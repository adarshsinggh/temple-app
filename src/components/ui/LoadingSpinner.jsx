import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  fullScreen = false,
  overlay = false,
  text = 'Loading...',
  className = '' 
}) => {
  const spinnerClasses = [
    'spinner',
    `spinner-${size}`,
    fullScreen ? 'spinner-fullscreen' : '',
    overlay ? 'spinner-overlay' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={spinnerClasses}>
      <div className="spinner-circle"></div>
      {text && <div className="spinner-text">{text}</div>}
    </div>
  );
};

export default LoadingSpinner;
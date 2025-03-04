import React, { useEffect, useRef } from 'react';
import { FaTimes } from 'react-icons/fa';
import { createPortal } from 'react-dom';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md', // sm, md, lg, xl, full
  closeOnEscape = true,
  closeOnOutsideClick = true,
  showCloseButton = true,
  className = '',
  contentClassName = '',
  overlayClassName = '',
  disableScroll = true,
}) => {
  const modalRef = useRef(null);
  
  // Handle closing on escape key
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscapeKey);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, closeOnEscape, onClose]);
  
  // Handle outside click
  const handleOverlayClick = (e) => {
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Disable body scroll when modal is open
  useEffect(() => {
    if (disableScroll) {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
      
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, disableScroll]);
  
  // Set up focus trapping
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    
    const modal = modalRef.current;
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    firstElement.focus();
    modal.addEventListener('keydown', handleTabKey);
    
    return () => {
      modal.removeEventListener('keydown', handleTabKey);
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return createPortal(
    <div className={`modal-overlay ${overlayClassName}`} onClick={handleOverlayClick}>
      <div 
        ref={modalRef}
        className={`modal modal-${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {title && (
          <div className="modal-header">
            <h3 id="modal-title" className="modal-title">{title}</h3>
            {showCloseButton && (
              <button 
                className="modal-close" 
                onClick={onClose}
                aria-label="Close modal"
              >
                <FaTimes />
              </button>
            )}
          </div>
        )}
        
        <div className={`modal-content ${contentClassName}`}>
          {children}
        </div>
        
        {footer && (
          <div className="modal-footer">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
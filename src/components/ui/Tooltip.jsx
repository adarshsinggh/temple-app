import React, { useState, useRef, useEffect } from 'react';

const Tooltip = ({
  children,
  content,
  position = 'top', // top, right, bottom, left
  delay = 300,
  className = '',
  tooltipClassName = '',
  showOnClick = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const targetRef = useRef(null);
  const tooltipRef = useRef(null);
  const timerRef = useRef(null);
  
  const calculatePosition = () => {
    if (!targetRef.current || !tooltipRef.current) return;
    
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let top = 0;
    let left = 0;
    
    switch (position) {
      case 'top':
        top = targetRect.top - tooltipRect.height - 10;
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'right':
        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.right + 10;
        break;
      case 'bottom':
        top = targetRect.bottom + 10;
        left = targetRect.left + (targetRect.width / 2) - (tooltipRect.width / 2);
        break;
      case 'left':
        top = targetRect.top + (targetRect.height / 2) - (tooltipRect.height / 2);
        left = targetRect.left - tooltipRect.width - 10;
        break;
      default:
        break;
    }
    
    // Adjust position if tooltip is outside viewport
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };
    
    // Keep tooltip within horizontal bounds
    if (left < 10) left = 10;
    if (left + tooltipRect.width > viewport.width - 10) {
      left = viewport.width - tooltipRect.width - 10;
    }
    
    // Keep tooltip within vertical bounds
    if (top < 10) top = 10;
    if (top + tooltipRect.height > viewport.height - 10) {
      top = viewport.height - tooltipRect.height - 10;
    }
    
    setTooltipPosition({
      top: top + window.scrollY,
      left: left + window.scrollX
    });
  };
  
  const showTooltip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate position after tooltip becomes visible
      setTimeout(() => {
        calculatePosition();
      }, 0);
    }, delay);
  };
  
  const hideTooltip = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };
  
  const toggleTooltip = () => {
    if (isVisible) {
      hideTooltip();
    } else {
      showTooltip();
    }
  };
  
  // Calculate position when tooltip content changes
  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [content, isVisible]);
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  
  // Add click outside listener to close tooltip when clicking elsewhere
  useEffect(() => {
    if (!showOnClick || !isVisible) return;
    
    const handleClickOutside = (e) => {
      if (
        targetRef.current && 
        !targetRef.current.contains(e.target) &&
        tooltipRef.current && 
        !tooltipRef.current.contains(e.target)
      ) {
        hideTooltip();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOnClick, isVisible]);
  
  return (
    <div 
      className={`tooltip-container ${className}`}
      ref={targetRef}
      onMouseEnter={!showOnClick ? showTooltip : undefined}
      onMouseLeave={!showOnClick ? hideTooltip : undefined}
      onClick={showOnClick ? toggleTooltip : undefined}
    >
      {children}
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`tooltip tooltip-${position} ${tooltipClassName}`}
          style={{
            position: 'absolute',
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`
          }}
          role="tooltip"
        >
          {content}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
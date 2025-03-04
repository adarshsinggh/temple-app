import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dropdown = ({ trigger, items, position = 'bottom-left' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  return (
    <div className="dropdown" ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={toggleDropdown}>
        {trigger}
      </div>
      {isOpen && (
        <ul className={`dropdown-menu dropdown-${position}`}>
          {items.map((item, index) => (
            <li key={index} className="dropdown-item">
              {item.href ? (
                <Link to={item.href} className="dropdown-link" onClick={() => setIsOpen(false)}>
                  {item.icon && <span className="dropdown-icon">{item.icon}</span>}
                  <span className="dropdown-label">{item.label}</span>
                </Link>
              ) : (
                <button 
                  className="dropdown-button" 
                  onClick={() => {
                    item.onClick();
                    setIsOpen(false);
                  }}
                >
                  {item.icon && <span className="dropdown-icon">{item.icon}</span>}
                  <span className="dropdown-label">{item.label}</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
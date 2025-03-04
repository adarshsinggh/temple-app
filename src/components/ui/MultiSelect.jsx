import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaTimes, FaCheck } from 'react-icons/fa';

const MultiSelect = ({
  id,
  label,
  options = [],
  value = [],
  onChange,
  placeholder = 'Select options',
  error,
  hint,
  required = false,
  disabled = false,
  maxHeight = '250px',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  
  // Convert value array to an array of option objects
  const selectedOptions = Array.isArray(value) 
    ? options.filter(option => value.includes(option.value))
    : [];
  
  // Filter options based on search term
  const filteredOptions = options.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    // Check if the option is already selected
    const isSelected = selectedOptions.some(selected => selected.value === option.value);
    
    // Create new selection array
    let newSelection;
    if (isSelected) {
      // Remove option if already selected
      newSelection = selectedOptions.filter(selected => selected.value !== option.value);
    } else {
      // Add option if not selected
      newSelection = [...selectedOptions, option];
    }
    
    // Call onChange with the new selection
    onChange(newSelection);
  };

  const handleRemoveOption = (e, option) => {
    e.stopPropagation();
    const newSelection = selectedOptions.filter(selected => selected.value !== option.value);
    onChange(newSelection);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Add click outside listener
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      className={`form-group multi-select-container ${className} ${error ? 'has-error' : ''}`}
      ref={containerRef}
    >
      {label && (
        <label htmlFor={id} className="form-label">
          {label} {required && <span className="required-mark">*</span>}
        </label>
      )}
      
      <div 
        className={`multi-select ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={toggleDropdown}
      >
        <div className="multi-select-selection">
          {selectedOptions.length > 0 ? (
            <div className="selected-options">
              {selectedOptions.map(option => (
                <div key={option.value} className="selected-option-tag">
                  <span className="selected-option-label">{option.label}</span>
                  <button 
                    type="button"
                    className="remove-option-btn"
                    onClick={(e) => handleRemoveOption(e, option)}
                    aria-label={`Remove ${option.label}`}
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="placeholder">{placeholder}</div>
          )}
          
          {selectedOptions.length > 0 && (
            <button 
              type="button"
              className="clear-all-btn"
              onClick={handleClearAll}
              aria-label="Clear all selected options"
            >
              <FaTimes />
            </button>
          )}
        </div>
        
        <div className="multi-select-arrow">
          <FaChevronDown />
        </div>
        
        {isOpen && (
          <div className="multi-select-dropdown">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                ref={searchInputRef}
              />
            </div>
            
            <div className="options-container" style={{ maxHeight }}>
              {filteredOptions.length > 0 ? (
                filteredOptions.map(option => {
                  const isSelected = selectedOptions.some(selected => selected.value === option.value);
                  return (
                    <div 
                      key={option.value}
                      className={`option ${isSelected ? 'selected' : ''} ${option.disabled ? 'disabled' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!option.disabled) {
                          handleSelect(option);
                        }
                      }}
                    >
                      <div className="checkbox">
                        {isSelected && <FaCheck />}
                      </div>
                      <span className="option-label">{option.label}</span>
                    </div>
                  );
                })
              ) : (
                <div className="no-options">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>
      
      {hint && (
        <div className="form-hint">
          {hint}
        </div>
      )}
      
      {error && (
        <div className="form-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
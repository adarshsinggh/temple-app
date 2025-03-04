import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchInput = ({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  className = '',
  debounceTime = 300
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [timer, setTimer] = useState(null);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
    
    // Debounce search
    if (timer) {
      clearTimeout(timer);
    }
    
    if (onSearch) {
      const newTimer = setTimeout(() => {
        onSearch(newValue);
      }, debounceTime);
      
      setTimer(newTimer);
    }
  };

  const handleClear = () => {
    setLocalValue('');
    if (onChange) {
      onChange('');
    }
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className={`search-input-container ${className}`}>
      <div className="search-input-icon">
        <FaSearch />
      </div>
      <input
        type="text"
        className="search-input"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {localValue && (
        <button
          type="button"
          className="search-input-clear"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
import React, { useState } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';

const DateRangePicker = ({ 
  label,
  startDate,
  endDate,
  onChange,
  required = false,
  className = '',
  error,
  hint
}) => {
  const formatDateForInput = (date) => {
    if (!date) return '';
    
    // If date is already a string in YYYY-MM-DD format, return as is
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
      return date.substr(0, 10);
    }
    
    // Otherwise convert to YYYY-MM-DD
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    return d.toISOString().substr(0, 10);
  };

  const handleStartDateChange = (e) => {
    onChange({ 
      startDate: e.target.value, 
      endDate: endDate 
    });
  };

  const handleEndDateChange = (e) => {
    onChange({ 
      startDate: startDate, 
      endDate: e.target.value 
    });
  };

  return (
    <div className={`form-group date-range-picker ${className} ${error ? 'has-error' : ''}`}>
      {label && (
        <label className="form-label">
          {label} {required && <span className="required-mark">*</span>}
        </label>
      )}
      
      <div className="date-range-inputs">
        <div className="date-input-container">
          <input
            type="date"
            className="form-control"
            value={formatDateForInput(startDate)}
            onChange={handleStartDateChange}
            placeholder="Start Date"
            aria-label="Start Date"
          />
          <FaCalendarAlt className="date-icon" />
        </div>
        
        <span className="date-range-separator">to</span>
        
        <div className="date-input-container">
          <input
            type="date"
            className="form-control"
            value={formatDateForInput(endDate)}
            onChange={handleEndDateChange}
            placeholder="End Date"
            aria-label="End Date"
            min={formatDateForInput(startDate)}
          />
          <FaCalendarAlt className="date-icon" />
        </div>
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

export default DateRangePicker;
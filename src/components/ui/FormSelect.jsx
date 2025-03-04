import React from 'react';

const FormSelect = ({
  id,
  label,
  value,
  onChange,
  options = [],
  error,
  hint,
  required = false,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
  labelClassName = '',
  selectClassName = '',
  ...props
}) => {
  return (
    <div className={`form-group ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className={`form-label ${labelClassName}`}
        >
          {label} {required && <span className="required-mark">*</span>}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`form-select ${selectClassName}`}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          (error ? `${id}-error` : '') + 
          (hint ? `${id}-hint` : '')
        }
        required={required}
        {...props}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      {hint && (
        <div id={`${id}-hint`} className="form-hint">
          {hint}
        </div>
      )}
      {error && (
        <div id={`${id}-error`} className="form-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default FormSelect;
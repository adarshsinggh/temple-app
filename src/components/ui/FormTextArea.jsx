import React from 'react';

const FormTextarea = ({
  id,
  name,
  label,
  value,
  onChange,
  error,
  hint,
  required = false,
  disabled = false,
  rows = 3,
  maxLength,
  placeholder = '',
  className = '',
  labelClassName = '',
  textareaClassName = '',
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
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className={`form-control form-textarea ${textareaClassName}`}
        rows={rows}
        disabled={disabled}
        maxLength={maxLength}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          (error ? `${id}-error` : '') + 
          (hint ? `${id}-hint` : '')
        }
        required={required}
        {...props}
      />
      
      {maxLength && (
        <div className="character-count">
          {value ? value.length : 0}/{maxLength} characters
        </div>
      )}
      
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

export default FormTextarea;
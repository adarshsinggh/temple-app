import React from 'react';

const FormInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  required = false,
  disabled = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
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
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className={`form-control ${inputClassName}`}
        disabled={disabled}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          (error ? `${id}-error` : '') + 
          (hint ? `${id}-hint` : '')
        }
        required={required}
        {...props}
      />
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

export default FormInput;
import React from 'react';

const Card = ({ 
  title, 
  subtitle, 
  children, 
  actions, 
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  ...props
}) => {
  return (
    <div className={`card ${className}`} {...props}>
      {(title || subtitle) && (
        <div className={`card-header ${headerClassName}`}>
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
      )}
      <div className={`card-body ${bodyClassName}`}>
        {children}
      </div>
      {actions && (
        <div className={`card-footer ${footerClassName}`}>
          {actions}
        </div>
      )}
    </div>
  );
};

export default Card;
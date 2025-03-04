import React from 'react';

const Badge = ({
  children,
  variant = 'primary', // primary, success, warning, danger, info, secondary
  size = 'md', // sm, md, lg
  rounded = true,
  className = '',
  ...props
}) => {
  const badgeClasses = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    rounded ? 'badge-rounded' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses} {...props}>
      {children}
    </span>
  );
};

export default Badge;
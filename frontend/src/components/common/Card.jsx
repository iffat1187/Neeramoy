import React from 'react';

export const Card = ({ children, className = '', hover = true, ...props }) => {
  const hoverClass = hover ? 'hover:shadow-md transition-shadow' : '';
  return (
    <div className={`bg-surface-container-lowest rounded-xl p-space-md shadow-sm ${hoverClass} ${className}`} {...props}>
      {children}
    </div>
  );
};

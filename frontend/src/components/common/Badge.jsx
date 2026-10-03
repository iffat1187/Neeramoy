import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const baseClasses = "px-2 py-0.5 rounded-md font-label-sm text-label-sm font-bold flex items-center gap-1";
  const variants = {
    primary: "bg-primary text-on-primary",
    secondary: "bg-secondary-container/40 text-on-secondary-container",
    tertiary: "bg-tertiary-fixed text-on-tertiary-fixed",
    surface: "bg-surface-container text-on-surface-variant"
  };

  return (
    <span className={`${baseClasses} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

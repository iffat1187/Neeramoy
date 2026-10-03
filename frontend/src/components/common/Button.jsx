import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "font-label-lg text-label-lg px-space-md py-space-sm rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm";
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-container",
    secondary: "bg-surface-container text-on-surface hover:bg-surface-container-high",
    outline: "border border-outline text-on-surface hover:bg-surface-container-low"
  };

  return (
    <button className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

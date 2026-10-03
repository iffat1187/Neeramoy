import React from 'react';

export const Input = ({ icon, className = '', ...props }) => {
  return (
    <div className={`relative flex items-center w-full bg-surface-container-low rounded-xl px-space-md py-space-xs transition-all focus-within:bg-surface-container-lowest focus-within:shadow-[0_2px_8px_rgba(0,103,92,0.12)] ${className}`}>
      {icon && <span className="material-symbols-outlined text-outline text-[20px] mr-space-xs shrink-0">{icon}</span>}
      <input 
        className="w-full bg-transparent border-0 outline-none text-body-md font-body-md text-on-surface placeholder:text-outline-variant"
        {...props} 
      />
    </div>
  );
};

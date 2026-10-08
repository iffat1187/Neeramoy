import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

export const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Dimmed Background Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-surface-container-lowest w-full max-w-sm rounded-[24px] p-6 shadow-xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Warning Icon */}
        <div className="w-24 h-24 bg-[#FFF9E6] dark:bg-[#FFC107]/20 rounded-full flex items-center justify-center mb-5 mt-2">
          <span className="material-symbols-outlined text-[#FFC107] text-[48px] font-bold">new_releases</span>
        </div>
        
        {/* Typography */}
        <h2 className="text-primary font-headline-md font-bold mb-2 text-center">Are you sure?</h2>
        <p className="text-on-surface-variant font-body-md mb-8 text-center bg-primary/10 px-4 py-1.5 rounded-lg text-primary font-medium">
          You want to logout from Neeramoy?
        </p>
        
        {/* Action Buttons */}
        <div className="flex w-full gap-3">
          <Button variant="outline" className="flex-1 border-outline-variant text-on-surface hover:bg-surface-container" onClick={onClose}>
            No, Cancel
          </Button>
          <Button variant="primary" className="flex-1" onClick={onConfirm}>
            Yes, Logout!
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

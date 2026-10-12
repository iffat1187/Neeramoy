import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export const CancelOrderConfirmationModal = ({ isOpen, onClose, onConfirm, loading = false }) => {
  const cancelBtnRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow || 'auto';
      };
    }
  }, [isOpen]);

  // Focus Keep Order button on open and handle Escape key for accessibility
  useEffect(() => {
    if (!isOpen) return;

    if (cancelBtnRef.current) {
      cancelBtnRef.current.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !loading) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen || !mounted) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-order-dialog-title"
      aria-describedby="cancel-order-dialog-desc"
    >
      {/* Modal Dialog Content */}
      <div 
        className="relative bg-surface-container-lowest border border-outline-variant/40 w-full max-w-sm rounded-[24px] p-6 shadow-2xl flex flex-col items-center animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close dialog"
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Warning Icon Badge */}
        <div className="w-16 h-16 bg-error-container/30 text-error rounded-full flex items-center justify-center mb-4 mt-1 border border-error/20">
          <span className="material-symbols-outlined text-[32px]">warning</span>
        </div>

        {/* Dialog Title */}
        <h2 id="cancel-order-dialog-title" className="text-on-surface font-headline-sm font-bold mb-2 text-center">
          Cancel Order?
        </h2>

        {/* Dialog Description */}
        <p id="cancel-order-dialog-desc" className="text-on-surface-variant font-body-md mb-6 text-center leading-relaxed">
          Are you sure you want to cancel this order? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex w-full gap-3">
          <button 
            ref={cancelBtnRef}
            type="button"
            className="flex-1 font-label-lg text-label-lg px-space-md py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm border border-outline-variant text-on-surface hover:bg-surface-container font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClose}
            disabled={loading}
          >
            Keep Order
          </button>
          <button 
            type="button"
            className="flex-1 bg-error text-on-error hover:bg-error/90 font-label-lg text-label-lg px-space-md py-2.5 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                <span>Cancelling...</span>
              </>
            ) : (
              'Yes, Cancel Order'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

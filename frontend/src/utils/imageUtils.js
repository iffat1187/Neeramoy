/**
 * Utility functions and constants for medicine image handling across customer-facing and admin pages.
 */

export const FALLBACK_MEDICINE_IMAGE = 'https://via.placeholder.com/150';

/**
 * Handles image loading errors by replacing the failed src with the fallback placeholder image.
 * Prevents infinite reload loops by clearing the onerror handler before assignment.
 */
export const handleImageError = (e) => {
  if (e && e.currentTarget && e.currentTarget.src !== FALLBACK_MEDICINE_IMAGE) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = FALLBACK_MEDICINE_IMAGE;
  }
};

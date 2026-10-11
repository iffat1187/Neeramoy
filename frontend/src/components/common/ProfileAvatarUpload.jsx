import React, { useState, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../services/apiClient';

export const ProfileAvatarUpload = ({ size = 'lg', showSubtext = true, onUploadSuccess, className = '' }) => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

  const sizeClasses = {
    sm: 'w-16 h-16 text-xl',
    md: 'w-20 h-20 text-2xl',
    lg: 'w-24 h-24 text-3xl',
    xl: 'w-32 h-32 text-4xl'
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');

    // Client-side validation
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Please choose a valid image format (JPEG, PNG, or WebP).');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > MAX_SIZE) {
      setError('Image file size must be less than 5 MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Instant local preview
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const updatedUser = await apiClient.postFormData('/auth/profile-picture', formData);
      
      // Update local auth context immediately
      if (updatedUser) {
        updateUser(updatedUser);
      }

      setSuccess('Profile picture updated successfully!');
      if (onUploadSuccess) onUploadSuccess(updatedUser);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      console.error('Failed to upload profile picture:', err);
      setError(err.message || 'Failed to upload image. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const currentImage = previewUrl || user?.profileImage;

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <div className="relative group">
        <div
          className={`${sizeClasses[size] || sizeClasses.lg} rounded-full overflow-hidden border-2 border-outline-variant/40 bg-surface-container-high flex items-center justify-center relative shadow-md`}
        >
          {currentImage ? (
            <img
              src={currentImage}
              alt={user?.name || 'User avatar'}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-primary text-on-primary flex items-center justify-center font-bold font-headline-md select-none">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}

          {isUploading && (
            <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white text-[11px] font-bold gap-1 z-10 animate-fade-in">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </div>
          )}
        </div>

        {/* Upload Trigger Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-on-primary rounded-full border-2 border-surface flex items-center justify-center shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
          aria-label="Upload profile picture"
          title="Change profile picture"
        >
          <span className="material-symbols-outlined text-[16px]">photo_camera</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {showSubtext && (
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-label-sm font-bold text-primary hover:underline focus:outline-none disabled:opacity-50 inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">upload</span>
            {currentImage ? 'Replace Photo' : 'Upload Photo'}
          </button>
          <p className="text-[11px] text-on-surface-variant mt-0.5">JPEG, PNG, or WebP (max 5 MB)</p>
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 rounded-lg bg-error-container/20 text-error text-[12px] font-medium border border-error/30 max-w-xs animate-shake flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mt-2 p-2 rounded-lg bg-success-container/30 text-success text-[12px] font-medium border border-success/30 max-w-xs flex items-center gap-1.5">
          <span className="material-symbols-outlined text-[16px] shrink-0">check_circle</span>
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};

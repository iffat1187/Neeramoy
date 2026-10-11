import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { ProfileAvatarUpload } from '../../components/common/ProfileAvatarUpload';

export const ProfilePage = () => {
  const { user } = useAuth();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passErrors, setPassErrors] = useState({});
  const [passSuccess, setPassSuccess] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = () => {
    const newErrors = {};
    if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) newErrors.newPassword = 'New password must be at least 6 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setPassErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      // Mock password update
      setPassSuccess('Password changed successfully.');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPassErrors({});
      // Clear success feedback after some time
      setTimeout(() => setPassSuccess(''), 4000);
    }
  };

  const handleCancelPassword = () => {
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPassErrors({});
    setPassSuccess('');
  };

  return (
    <div className="space-y-space-lg max-w-4xl">
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
        <div className="p-space-md md:p-space-xl border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <ProfileAvatarUpload size="sm" showSubtext={false} />
            <div>
              <h2 className="font-headline-sm font-bold text-on-surface">{user?.name}</h2>
              <p className="font-body-sm text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">badge</span> 
                {user?.role === 'ADMIN' ? 'NM-ADMIN-001' : 'NM-CUST-98214'}
              </p>
            </div>
          </div>
          <Link to="/account/profile/edit">
            <Button variant="outline" className="w-full md:w-auto text-primary border-primary hover:bg-primary/5">
              <span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
            </Button>
          </Link>
        </div>

        <div className="p-space-md md:p-space-xl space-y-space-xl">
          {/* Profile Picture Section */}
          <div className="p-space-md bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col sm:flex-row items-center sm:items-start gap-space-lg">
            <ProfileAvatarUpload size="lg" showSubtext={true} />
            <div className="flex-1 text-center sm:text-left">
              <h4 className="font-headline-sm font-bold text-on-surface">Profile Picture</h4>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Upload or replace your profile photo (JPEG, PNG, or WebP up to 5 MB). Your photo will appear in the navigation bar and across your account.
              </p>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="font-headline-sm font-bold text-on-surface flex items-center gap-2 mb-space-md">
              <div className="w-8 h-8 rounded-full bg-surface-container-low text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">person</span>
              </div>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md md:gap-space-xl pl-10">
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">Full Name</p>
                <p className="font-body-md text-on-surface font-medium">{user?.name || 'Not provided'}</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">Phone Number</p>
                <div className="flex items-center gap-2">
                  <p className="font-body-md text-on-surface font-medium">{user?.phone || 'Not provided'}</p>
                  {user?.phone && <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-[10px] font-bold">Primary</span>}
                </div>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">Email Address</p>
                <p className="font-body-md text-on-surface font-medium">{user?.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant mb-1">Gender</p>
                <p className="font-body-md text-on-surface font-medium">{user?.gender || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Default Delivery Address */}
          <div>
            <h3 className="font-headline-sm font-bold text-on-surface flex items-center gap-2 mb-space-md">
              <div className="w-8 h-8 rounded-full bg-surface-container-low text-primary flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
              Default Delivery Address
            </h3>
            <div className="bg-surface-container-low rounded-xl p-space-md pl-10 ml-10">
              {user?.address ? (
                <>
                  <p className="font-body-md text-on-surface mb-2">{user.address}</p>
                  <div className="flex items-center gap-space-md text-body-sm text-on-surface-variant">
                    <span>{user.area || 'N/A'}, {user.city || 'N/A'}</span>
                    <span>{user.postalCode || 'N/A'}</span>
                  </div>
                </>
              ) : (
                <p className="font-body-md text-on-surface-variant">No default address saved.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-md md:p-space-xl">
        <div className="mb-6">
          <h3 className="font-headline-sm font-bold text-on-surface flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-surface-container-low text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">shield_lock</span>
            </div>
            Security / Change Password
          </h3>
          <p className="text-on-surface-variant text-body-sm mt-2 ml-10">
            Update your password to keep your account secure. Use a strong password.
          </p>
        </div>

        {passSuccess && (
          <div className="mb-6 ml-10 p-4 rounded-xl bg-success-container/30 text-success border border-success/30 flex items-center gap-3">
            <span className="material-symbols-outlined">check_circle</span>
            <span className="font-bold text-body-sm">{passSuccess}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="ml-10 space-y-4 max-w-lg">
          <div>
            <label className="block text-label-sm font-bold text-on-surface mb-1">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? "text" : "password"} 
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className={`w-full p-3 pr-12 rounded-xl border ${passErrors.currentPassword ? 'border-error' : 'border-outline-variant/50'} bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary`}
                placeholder="Enter current password"
              />
              <button 
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">{showCurrentPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {passErrors.currentPassword && <p className="text-error text-[10px] mt-1">{passErrors.currentPassword}</p>}
          </div>

          <div>
            <label className="block text-label-sm font-bold text-on-surface mb-1">New Password</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"} 
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className={`w-full p-3 pr-12 rounded-xl border ${passErrors.newPassword ? 'border-error' : 'border-outline-variant/50'} bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary`}
                placeholder="Enter new password"
              />
              <button 
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">{showNewPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {passErrors.newPassword && <p className="text-error text-[10px] mt-1">{passErrors.newPassword}</p>}
          </div>

          <div>
            <label className="block text-label-sm font-bold text-on-surface mb-1">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className={`w-full p-3 pr-12 rounded-xl border ${passErrors.confirmPassword ? 'border-error' : 'border-outline-variant/50'} bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary`}
                placeholder="Confirm new password"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            {passErrors.confirmPassword && <p className="text-error text-[10px] mt-1">{passErrors.confirmPassword}</p>}
          </div>

          <div className="pt-4 flex items-center gap-3">
            <Button type="button" variant="outline" onClick={handleCancelPassword}>Cancel</Button>
            <Button type="submit" variant="primary">Change Password</Button>
          </div>
        </form>
      </div>

    </div>
  );
};

const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, 'src', 'pages', 'admin', 'AdminProfilePage.jsx');
const content = `import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const AdminProfilePage = () => {
  const { user, updateUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passErrors, setPassErrors] = useState({});
  const [passSuccess, setPassSuccess] = useState('');

  // Sync form data if user changes from context
  useEffect(() => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || ''
    });
  }, [user]);

  const validateProfile = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim() || !/^\\S+@\\S+\\.\\S+$/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) newErrors.phone = 'Valid phone number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (validateProfile()) {
      updateUser(formData);
      setIsEditing(false);
      setSuccessMsg('Profile information updated successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleCancelProfile = () => {
    setIsEditing(false);
    setErrors({});
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || ''
    });
  };

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
      setTimeout(() => setPassSuccess(''), 4000);
    }
  };

  return (
    <div className="p-space-lg flex flex-col h-full gap-space-lg max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-space-md">
        <div>
          <h1 className="font-headline-md font-bold text-on-surface">Admin Profile</h1>
          <p className="text-on-surface-variant text-body-sm">Manage your personal information and security settings.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-space-lg">
        {/* Left Column: Profile Card */}
        <div className="w-full lg:w-1/3 flex flex-col gap-space-md">
          <Card className="p-space-lg flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-xl font-bold mb-4 relative shadow-lg">
              {user?.name?.charAt(0) || 'A'}
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-success text-on-primary rounded-full flex items-center justify-center border-4 border-surface">
                <span className="material-symbols-outlined text-[16px]">verified</span>
              </div>
            </div>
            <h2 className="font-headline-sm font-bold text-on-surface">{user?.name}</h2>
            <p className="text-primary font-label-md font-bold mt-1 uppercase tracking-wider">{user?.role || 'ADMINISTRATOR'}</p>
            
            <div className="w-full mt-6 bg-surface-container rounded-xl p-4 text-left border border-outline-variant/30">
              <div className="flex items-center justify-between mb-3 border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant text-body-sm">Account Status</span>
                <span className="bg-success-container text-on-success-container text-[10px] px-2 py-0.5 rounded font-bold uppercase">Active</span>
              </div>
              <div className="flex items-center justify-between mb-3 border-b border-outline-variant/30 pb-2">
                <span className="text-on-surface-variant text-body-sm">Joined Date</span>
                <span className="text-on-surface text-body-sm font-medium">12 Jan 2024</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant text-body-sm">Last Login</span>
                <span className="text-on-surface text-body-sm font-medium">Today, 09:30 AM</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Forms */}
        <div className="w-full lg:w-2/3 flex flex-col gap-space-lg">
          {/* Personal Information Form */}
          <Card className="p-space-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-sm font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person</span>
                Personal Information
              </h3>
              {!isEditing && (
                <Button variant="outline" onClick={() => setIsEditing(true)} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
                </Button>
              )}
            </div>

            {successMsg && (
              <div className="mb-6 p-4 rounded-xl bg-success-container/30 text-success border border-success/30 flex items-center gap-3">
                <span className="material-symbols-outlined">check_circle</span>
                <span className="font-bold text-body-sm">{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-sm font-bold text-on-surface mb-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    disabled={!isEditing}
                    className={\`w-full p-3 rounded-xl border \${errors.name ? 'border-error' : 'border-outline-variant/50'} bg-surface-container-lowest text-on-surface focus:outline-none \${isEditing ? 'focus:border-primary' : 'opacity-70'}\`}
                  />
                  {errors.name && <p className="text-error text-[10px] mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-label-sm font-bold text-on-surface mb-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    disabled={!isEditing}
                    className={\`w-full p-3 rounded-xl border \${errors.email ? 'border-error' : 'border-outline-variant/50'} bg-surface-container-lowest text-on-surface focus:outline-none \${isEditing ? 'focus:border-primary' : 'opacity-70'}\`}
                  />
                  {errors.email && <p className="text-error text-[10px] mt-1">{errors.email}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-label-sm font-bold text-on-surface mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    disabled={!isEditing}
                    className={\`w-full p-3 rounded-xl border \${errors.phone ? 'border-error' : 'border-outline-variant/50'} bg-surface-container-lowest text-on-surface focus:outline-none \${isEditing ? 'focus:border-primary' : 'opacity-70'}\`}
                  />
                  {errors.phone && <p className="text-error text-[10px] mt-1">{errors.phone}</p>}
                </div>
              </div>
              
              {isEditing && (
                <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/30 mt-6">
                  <Button type="button" variant="outline" onClick={handleCancelProfile}>Cancel</Button>
                  <Button type="submit" variant="primary">Save Changes</Button>
                </div>
              )}
            </form>
          </Card>

          {/* Change Password Form */}
          <Card className="p-space-lg">
            <h3 className="font-headline-sm font-bold text-on-surface flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary">lock</span>
              Change Password
            </h3>

            {passSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-success-container/30 text-success border border-success/30 flex items-center gap-3">
                <span className="material-symbols-outlined">check_circle</span>
                <span className="font-bold text-body-sm">{passSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
              <div>
                <label className="block text-label-sm font-bold text-on-surface mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className={\`w-full p-3 rounded-xl border \${passErrors.currentPassword ? 'border-error' : 'border-outline-variant/50'} bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary\`}
                  placeholder="Enter current password"
                />
                {passErrors.currentPassword && <p className="text-error text-[10px] mt-1">{passErrors.currentPassword}</p>}
              </div>
              <div>
                <label className="block text-label-sm font-bold text-on-surface mb-1">New Password</label>
                <input 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className={\`w-full p-3 rounded-xl border \${passErrors.newPassword ? 'border-error' : 'border-outline-variant/50'} bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary\`}
                  placeholder="Enter new password"
                />
                {passErrors.newPassword && <p className="text-error text-[10px] mt-1">{passErrors.newPassword}</p>}
              </div>
              <div>
                <label className="block text-label-sm font-bold text-on-surface mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className={\`w-full p-3 rounded-xl border \${passErrors.confirmPassword ? 'border-error' : 'border-outline-variant/50'} bg-surface-container-lowest text-on-surface focus:outline-none focus:border-primary\`}
                  placeholder="Confirm new password"
                />
                {passErrors.confirmPassword && <p className="text-error text-[10px] mt-1">{passErrors.confirmPassword}</p>}
              </div>
              <div className="pt-2">
                <Button type="submit" variant="primary">Update Password</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync(targetPath, content);
console.log('Done writing AdminProfilePage.jsx');

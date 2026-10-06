import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';

export const AdminProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateUser(formData);
    alert('Profile updated successfully!');
  };

  return (
    <div className="space-y-space-md">
      <h1 className="font-headline-md font-bold mb-6">ফার্মাসিস্ট ও এডমিন প্রোফাইল সেটিংস</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <Card className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-xl mb-4 relative">
              {user?.name?.charAt(0) || 'A'}
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-secondary text-on-secondary rounded-full flex items-center justify-center border-2 border-surface-container-lowest">
                <span className="material-symbols-outlined text-[16px]">verified</span>
              </div>
            </div>
            <h2 className="font-headline-sm font-bold text-on-surface">{user?.name}</h2>
            <p className="text-on-surface-variant text-body-sm mb-4">Superintendent Pharmacist</p>
            <div className="w-full bg-primary-container/20 p-3 rounded-lg border border-primary/20 text-left">
              <p className="text-[10px] text-on-surface-variant font-bold uppercase mb-1">DGDA License</p>
              <p className="font-bold text-primary">DA-DH-2024-9182</p>
            </div>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Card className="p-6">
            <h3 className="font-headline-sm font-bold border-b border-outline-variant/30 pb-3 mb-6">Personal & Official Credentials</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-label-sm font-bold text-on-surface mb-2">Full Legal Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-surface-container p-3 rounded-xl border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-label-sm font-bold text-on-surface mb-2">Official Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-surface-container p-3 rounded-xl border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors" 
                />
              </div>
              <div>
                <label className="block text-label-sm font-bold text-on-surface mb-2">Official Contact</label>
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-surface-container p-3 rounded-xl border border-outline-variant/30 focus:border-primary focus:outline-none transition-colors" 
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="primary" onClick={handleSave}>Save Profile Information</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

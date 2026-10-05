import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const EditProfilePage = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    gender: user?.gender || 'Male',
    address: user?.address || '',
    city: user?.city || 'Dhaka',
    area: user?.area || '',
    postalCode: user?.postalCode || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(formData.phone)) {
      newErrors.phone = 'Enter a valid Bangladeshi phone number';
    }
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.area.trim()) newErrors.area = 'Area is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      updateUser(formData);
      navigate('/account/profile');
    }
  };

  const handleCancel = () => {
    navigate('/account/profile');
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
      <div className="p-space-md md:p-space-xl border-b border-outline-variant/30">
        <h2 className="font-headline-md font-bold text-on-surface">Edit Profile</h2>
        <p className="font-body-sm text-on-surface-variant">Update your personal information and default delivery address.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-space-md md:p-space-xl space-y-space-xl">
        {/* Personal Information */}
        <div>
          <h3 className="font-headline-sm font-bold text-on-surface flex items-center gap-2 mb-space-md">
            <div className="w-8 h-8 rounded-full bg-surface-container-low text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md md:gap-space-lg pl-0 md:pl-10">
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-1">Full Name *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Tanvir Hasan"
                icon="person"
              />
              {errors.name && <p className="text-error text-[12px] mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-label-sm text-on-surface-variant mb-1">Phone Number *</label>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+880"
                icon="phone_iphone"
              />
              {errors.phone && <p className="text-error text-[12px] mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block font-label-sm text-on-surface-variant mb-1">Email Address</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                icon="mail"
              />
              {errors.email && <p className="text-error text-[12px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block font-label-sm text-on-surface-variant mb-1">Gender</label>
              <div className="flex gap-2 h-10">
                {['Male', 'Female', 'Other'].map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={`flex-1 flex items-center justify-center gap-1 rounded-xl text-label-sm font-bold border transition-colors ${
                      formData.gender === g 
                        ? 'bg-primary text-on-primary border-primary' 
                        : 'bg-surface-container-low text-on-surface border-transparent hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {g === 'Male' ? 'male' : g === 'Female' ? 'female' : 'diversity_3'}
                    </span>
                    {g}
                  </button>
                ))}
              </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md md:gap-space-lg pl-0 md:pl-10">
            <div className="md:col-span-2">
              <label className="block font-label-sm text-on-surface-variant mb-1">Full Street Address *</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House, Flat, Road, etc."
                icon="home_work"
              />
              {errors.address && <p className="text-error text-[12px] mt-1">{errors.address}</p>}
            </div>

            <div>
              <label className="block font-label-sm text-on-surface-variant mb-1">Division / City *</label>
              <div className="relative">
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-surface-container-low rounded-xl px-space-md py-space-xs transition-all focus-within:bg-surface-container-lowest focus-within:shadow-[0_2px_8px_rgba(0,103,92,0.12)] border-0 outline-none text-body-md text-on-surface h-[38px] appearance-none"
                >
                  <option value="Dhaka">Dhaka</option>
                  <option value="Chittagong">Chittagong</option>
                  <option value="Sylhet">Sylhet</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none">expand_more</span>
              </div>
              {errors.city && <p className="text-error text-[12px] mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block font-label-sm text-on-surface-variant mb-1">Area / Thana *</label>
              <Input
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g. Dhanmondi"
              />
              {errors.area && <p className="text-error text-[12px] mt-1">{errors.area}</p>}
            </div>

            <div>
              <label className="block font-label-sm text-on-surface-variant mb-1">Postal Code *</label>
              <Input
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="e.g. 1209"
              />
              {errors.postalCode && <p className="text-error text-[12px] mt-1">{errors.postalCode}</p>}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-primary-container/10 p-space-md rounded-xl flex gap-space-sm pl-0 md:pl-10">
          <span className="material-symbols-outlined text-primary shrink-0">security</span>
          <p className="font-body-sm text-on-surface-variant">
            Your personal information is securely stored and processed in accordance with the DGDA and national data protection guidelines. We do not share your health data with unauthorized third parties.
          </p>
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-end gap-space-md pt-space-lg border-t border-outline-variant/30 pl-0 md:pl-10">
          <Button type="button" variant="outline" onClick={handleCancel} className="w-full md:w-auto text-on-surface-variant border-outline-variant">
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="w-full md:w-auto">
            <span className="material-symbols-outlined text-[18px]">save</span> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

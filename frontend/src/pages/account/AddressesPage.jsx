import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Input } from '../../components/common/Input';

export const AddressesPage = () => {
  const { user, updateUser } = useAuth();
  
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: 'Dhaka',
    area: '',
    postalCode: ''
  });
  const [errors, setErrors] = useState({});

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingAddress(null);
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: '',
      city: 'Dhaka',
      area: '',
      postalCode: ''
    });
    setErrors({});
  };

  const handleEdit = (addr) => {
    setIsAdding(false);
    setEditingAddress(addr.id);
    setFormData({ ...addr });
    setErrors({});
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingAddress(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.area.trim()) newErrors.area = 'Area is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    let newAddresses;
    if (isAdding) {
      const newAddr = { ...formData, id: Date.now().toString(), isDefault: addresses.length === 0 };
      newAddresses = [...addresses, newAddr];
    } else {
      newAddresses = addresses.map(a => a.id === editingAddress ? { ...a, ...formData } : a);
    }

    setAddresses(newAddresses);
    
    // Update context user.addresses
    const updates = { addresses: newAddresses };
    // If we just added the first address or edited the default one, update user main address fields
    const defaultAddr = newAddresses.find(a => a.isDefault) || newAddresses[0];
    if (defaultAddr) {
      updates.address = defaultAddr.address;
      updates.city = defaultAddr.city;
      updates.area = defaultAddr.area;
      updates.postalCode = defaultAddr.postalCode;
    }
    updateUser(updates);

    setIsAdding(false);
    setEditingAddress(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const newAddresses = addresses.filter(a => a.id !== id);
      setAddresses(newAddresses);
      updateUser({ addresses: newAddresses });
    }
  };

  const handleSetDefault = (id) => {
    const newAddresses = addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    }));
    setAddresses(newAddresses);
    
    const defaultAddr = newAddresses.find(a => a.id === id);
    if (defaultAddr) {
      updateUser({ 
        addresses: newAddresses,
        address: defaultAddr.address,
        city: defaultAddr.city,
        area: defaultAddr.area,
        postalCode: defaultAddr.postalCode
      });
    }
  };

  if (isAdding || editingAddress) {
    return (
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
        <div className="p-space-md md:p-space-xl border-b border-outline-variant/30">
          <h2 className="font-headline-md font-bold text-on-surface">{isAdding ? 'Add New Address' : 'Edit Address'}</h2>
        </div>
        <form onSubmit={handleSave} className="p-space-md md:p-space-xl space-y-space-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-1">Full Name *</label>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="Recipient Name" />
              {errors.name && <p className="text-error text-[12px] mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-1">Phone Number *</label>
              <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="+880" />
              {errors.phone && <p className="text-error text-[12px] mt-1">{errors.phone}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block font-label-sm text-on-surface-variant mb-1">Full Street Address *</label>
              <Input name="address" value={formData.address} onChange={handleChange} placeholder="House, Flat, Road, etc." />
              {errors.address && <p className="text-error text-[12px] mt-1">{errors.address}</p>}
            </div>
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-1">Division / City *</label>
              <select name="city" value={formData.city} onChange={handleChange} className="w-full bg-surface-container-low rounded-xl px-space-md py-space-xs transition-all h-[38px] appearance-none outline-none border-0 text-body-md text-on-surface">
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Sylhet">Sylhet</option>
              </select>
              {errors.city && <p className="text-error text-[12px] mt-1">{errors.city}</p>}
            </div>
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-1">Area / Thana *</label>
              <Input name="area" value={formData.area} onChange={handleChange} placeholder="e.g. Dhanmondi" />
              {errors.area && <p className="text-error text-[12px] mt-1">{errors.area}</p>}
            </div>
            <div>
              <label className="block font-label-sm text-on-surface-variant mb-1">Postal Code *</label>
              <Input name="postalCode" value={formData.postalCode} onChange={handleChange} placeholder="e.g. 1209" />
              {errors.postalCode && <p className="text-error text-[12px] mt-1">{errors.postalCode}</p>}
            </div>
          </div>
          <div className="flex gap-space-md pt-space-md border-t border-outline-variant/30 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button type="submit" variant="primary">Save Address</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-space-md">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-md font-bold text-on-surface">Saved Addresses</h2>
        <Button variant="primary" onClick={handleAddNew}>
          <span className="material-symbols-outlined text-[18px]">add</span> Add New
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {addresses.map(addr => (
            <div key={addr.id} className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-space-sm">
                  <h3 className="font-label-lg font-bold text-on-surface">{addr.name}</h3>
                  {addr.isDefault && <Badge variant="success" text="Default" />}
                </div>
                <p className="font-body-sm text-on-surface-variant mb-1">{addr.phone}</p>
                <p className="font-body-sm text-on-surface mb-2">{addr.address}</p>
                <p className="font-body-sm text-on-surface-variant">{addr.area}, {addr.city} - {addr.postalCode}</p>
              </div>
              <div className="flex gap-space-sm mt-space-md pt-space-sm border-t border-outline-variant/30">
                {!addr.isDefault && (
                  <Button variant="outline" onClick={() => handleSetDefault(addr.id)} className="flex-1 text-primary border-primary hover:bg-primary/5 text-[12px] py-1">
                    Set Default
                  </Button>
                )}
                <Button variant="outline" onClick={() => handleEdit(addr)} className="flex-1 text-[12px] py-1">
                  Edit
                </Button>
                <Button variant="outline" onClick={() => handleDelete(addr.id)} className="flex-1 text-error border-error hover:bg-error/5 text-[12px] py-1">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-low p-space-xl rounded-2xl border border-outline-variant/30 text-center">
          <span className="material-symbols-outlined text-[48px] text-outline mb-space-sm">location_on</span>
          <h3 className="font-headline-sm font-bold text-on-surface mb-space-xs">No addresses saved</h3>
          <p className="font-body-sm text-on-surface-variant mb-space-md">Add an address to speed up checkout.</p>
          <Button variant="primary" onClick={handleAddNew}>Add New Address</Button>
        </div>
      )}
    </div>
  );
};

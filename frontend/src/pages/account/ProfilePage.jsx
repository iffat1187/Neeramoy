import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';

export const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
      <div className="p-space-md md:p-space-xl border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md font-bold relative">
            {user?.name?.charAt(0) || 'U'}
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-secondary text-on-secondary rounded-full flex items-center justify-center border border-surface-container-lowest">
              <span className="material-symbols-outlined text-[12px]">verified</span>
            </div>
          </div>
          <div>
            <h2 className="font-headline-sm font-bold text-on-surface">{user?.name}</h2>
            <p className="font-body-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">badge</span> 
              NM-CUST-98214
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
  );
};

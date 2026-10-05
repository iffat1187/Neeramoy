import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AccountLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const navItems = [
    { name: 'Overview', path: '/account', icon: 'dashboard' },
    { name: 'My Profile', path: '/account/profile', icon: 'person' },
    { name: 'Orders & Live Tracking', path: '/orders', icon: 'receipt_long' },
    { name: 'Prescription Vault', path: '/prescriptions', icon: 'prescriptions' },
    { name: 'Saved Addresses', path: '/account/addresses', icon: 'location_on' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-margin-desktop py-space-xl">
      <div className="flex flex-col md:flex-row gap-space-xl">
        {/* Sidebar */}
        <div className="hidden md:block w-72 shrink-0">
          <div className="bg-surface-container-low rounded-2xl p-space-md border border-outline-variant/30 flex flex-col items-center mb-space-md">
            <div className="w-20 h-20 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-xl font-bold mb-space-sm relative">
              {user?.name?.charAt(0) || 'U'}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-secondary text-on-secondary rounded-full flex items-center justify-center border-2 border-surface-container-low">
                <span className="material-symbols-outlined text-[14px]">verified</span>
              </div>
            </div>
            <h2 className="font-headline-md font-bold text-on-surface text-center">{user?.name}</h2>
            <p className="font-body-md text-on-surface-variant text-center">{user?.phone}</p>
          </div>
          
          <nav className="bg-surface-container-low rounded-2xl border border-outline-variant/30 overflow-hidden">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/account/profile' && location.pathname.startsWith('/account/profile'));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-space-md px-space-md py-space-md border-b border-outline-variant/20 transition-colors ${
                    isActive ? 'bg-primary-container/10 text-primary border-l-4 border-l-primary' : 'text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-label-lg font-bold">{item.name}</span>
                </Link>
              );
            })}
            <button
              onClick={() => { navigate('/'); logout(); }}
              className="w-full flex items-center gap-space-md px-space-md py-space-md text-error hover:bg-error-container/10 transition-colors text-left"
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="font-label-lg font-bold">Logout</span>
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

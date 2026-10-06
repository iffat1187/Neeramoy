import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Badge } from '../common/Badge';

export const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: 'dashboard' },
    { name: 'Orders', path: '/admin/orders', icon: 'shopping_cart' },
    { name: 'Prescriptions Review', path: '/admin/prescriptions', icon: 'prescriptions' },
    { name: 'Medicines', path: '/admin/medicines', icon: 'medication' },
    { name: 'Inventory & Stock', path: '/admin/inventory', icon: 'inventory_2' },
    { name: 'Customers', path: '/admin/customers', icon: 'groups' },
    { name: 'Admin Profile & Staff', path: '/admin/profile', icon: 'admin_panel_settings' },
  ];

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  return (
    <div className="flex min-h-screen bg-surface-container-low text-on-surface font-body-md antialiased">
      {/* Mobile Header & Menu Toggle */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-space-md z-50">
        <Link to="/admin" className="flex items-center gap-2">
          <img src="/logo.png" alt="Neeramoy" className="h-6 w-auto" />
          <span className="font-headline-sm font-bold text-primary">RX OPERATIONS</span>
        </Link>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-on-surface">
          <span className="material-symbols-outlined">{isMobileMenuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-surface-container-lowest shadow-[4px_0_24px_rgba(0,0,0,0.04)] border-r border-outline-variant/30 z-40 transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0 mt-16' : '-translate-x-full lg:translate-x-0 lg:mt-0'}`}>
        <div className="hidden lg:flex p-space-md border-b border-outline-variant/30 items-center gap-3">
          <img src="/logo.png" alt="Neeramoy" className="h-8 w-auto" />
          <div className="flex flex-col">
            <span className="font-headline-sm font-bold text-primary leading-tight">Neeramoy</span>
            <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">RX OPERATIONS</span>
          </div>
        </div>

        <div className="p-space-xs flex justify-between bg-primary text-on-primary text-[10px] font-bold">
          <span className="flex items-center gap-1 px-2 py-1"><span className="material-symbols-outlined text-[12px]">verified</span> Licensed E-Dispensary</span>
          <span className="px-2 py-1 bg-primary-container text-on-primary-container rounded">Govt. Verified</span>
        </div>

        <nav className="p-space-md space-y-2 mt-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-space-sm py-2.5 rounded-xl transition-colors ${
                  isActive ? 'bg-primary text-on-primary' : 'text-on-surface hover:bg-surface-container'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-label-md font-bold">{item.name}</span>
                </div>
                {item.name === 'Orders' && <Badge variant="success" text="14 New" />}
                {item.name === 'Prescriptions Review' && <Badge variant="error" text="8 Pending" />}
                {item.name === 'Inventory & Stock' && <Badge variant="warning" text="5 Low" />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-space-md border-t border-outline-variant/30">
          <div className="bg-surface-container-low rounded-xl p-space-sm mb-space-sm border border-outline-variant/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase">Cold Chain Sync</span>
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
            </div>
            <span className="text-[11px] text-on-surface">Central Vault: 4.2°C (Optimal)</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-space-sm py-2 w-full text-error hover:bg-error-container/20 rounded-xl transition-colors">
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0 p-space-md lg:p-space-xl min-w-0">
        {/* Top Header Bar for Desktop */}
        <header className="hidden lg:flex items-center justify-between bg-surface-container-lowest border border-outline-variant/30 rounded-2xl px-space-md py-space-sm mb-space-xl shadow-sm">
          <div className="flex items-center gap-space-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-secondary"></div>
              <span className="text-[12px] font-bold text-on-surface">Dispensary Live</span>
            </div>
            <div className="h-4 w-px bg-outline-variant/50"></div>
            <span className="text-[12px] text-on-surface-variant">Hub: Central Dhaka Fulfillment</span>
          </div>
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px] text-primary">medication</span>
              <span className="text-[12px] font-bold text-on-surface">Pharmacist on Duty: Dr. Sharmin Rashid</span>
              <span className="text-[10px] bg-primary-container text-on-primary-container px-1.5 py-0.5 rounded font-bold ml-2">(Reg: A-14920)</span>
            </div>
            <button className="flex items-center gap-1.5 text-primary hover:bg-primary-container/20 px-3 py-1.5 rounded-lg transition-colors">
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span className="text-[12px] font-bold">Open Storefront</span>
            </button>
            <button 
              onClick={toggleTheme} 
              className="flex items-center justify-center w-8 h-8 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-surface-container hover:bg-surface-container-high text-on-surface"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              title={isDarkMode ? "Light mode" : "Dark mode"}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isDarkMode ? 'light_mode' : 'dark_mode'}
              </span>
            </button>
            <div className="relative">
              <span className="material-symbols-outlined text-outline">notifications</span>
              <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-error"></div>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">SR</div>
              <div className="flex flex-col">
                <span className="text-[12px] font-bold text-on-surface">Dr. Sharmin</span>
                <span className="text-[10px] text-on-surface-variant">Superintendent</span>
              </div>
            </div>
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

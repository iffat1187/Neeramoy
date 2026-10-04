import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const { cartCount, cartTotal } = useCart();
  const { user, isLoggedIn, logout } = useAuth();
  
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Top Strip */}
      <div className="bg-primary text-on-primary py-space-xs text-body-sm font-body-sm hidden md:block">
        <div className="max-w-7xl mx-auto px-margin-desktop flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <div className="flex items-center gap-1.5 opacity-90">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span>DGDA Licensed: DA-DH-2024-9182</span>
            </div>
            <div className="flex items-center gap-1.5 opacity-90">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              <span>24/7 Helpline: <strong>09612-NEERA (63372)</strong></span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-secondary-fixed">
            <span className="material-symbols-outlined text-[16px]">bolt</span>
            <span>Express 2-Hour Delivery in Dhaka</span>
          </div>
          <div className="flex items-center gap-space-sm opacity-90">
            <span className="material-symbols-outlined text-[16px]">location_on</span>
            <span>Dhaka City</span>
          </div>
        </div>
      </div>
      
      {/* Main Bar */}
      <div className="h-20 max-w-7xl mx-auto px-margin-desktop flex items-center justify-between gap-space-lg">
        <Link to="/" className="flex items-center gap-space-xs shrink-0">
          <img src="/logo.png" alt="Neeramoy Logo" className="h-8 w-auto object-contain" />
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary tracking-tight font-bold">নিরাময়</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Healthcare</span>
          </div>
        </Link>
        
        <div className="flex-1 max-w-xl hidden md:flex items-center bg-surface-container-low rounded-xl px-space-md py-space-xs focus-within:bg-surface-container-lowest focus-within:shadow-[0_2px_8px_rgba(0,103,92,0.12)] transition-all">
          <span className="material-symbols-outlined text-outline text-[20px] mr-space-xs shrink-0">search</span>
          <input 
            type="text" 
            placeholder="Search by medicine brand, generic name..." 
            className="w-full bg-transparent border-0 outline-none text-body-md text-on-surface placeholder:text-outline-variant h-10"
          />
        </div>
        
        <div className="flex items-center gap-space-md shrink-0">
          <button onClick={() => navigate('/login')} className="hidden lg:flex items-center gap-2 bg-primary-container text-on-primary-container px-space-md py-2.5 rounded-xl font-label-lg font-bold hover:bg-primary hover:text-on-primary transition-all">
            <span className="material-symbols-outlined text-[20px]">upload_file</span>
            <span>প্রেসক্রিপশন আপলোড</span>
          </button>
          
          {isLoggedIn && (
            <Link to="/orders" className="hidden sm:flex items-center gap-2 px-space-sm py-2 rounded-lg text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-[24px]">receipt_long</span>
              <div className="flex flex-col text-left">
                <span className="font-label-sm font-bold text-on-surface">Orders</span>
              </div>
            </Link>
          )}

          <Link to="/cart" className="flex items-center gap-2 bg-surface-container px-space-md py-2 rounded-xl hover:bg-surface-container-high transition-colors">
            <div className="relative flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[24px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-on-secondary text-[10px] flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="font-label-sm font-bold text-on-surface">Cart</span>
              <span className="font-price-md text-price-md text-primary font-bold">৳ {cartTotal}</span>
            </div>
          </Link>

          {isLoggedIn ? (
            <div className="hidden lg:flex items-center gap-3 pl-space-xs cursor-pointer group relative">
              <div className="flex items-center gap-2 group-hover:opacity-80">
                <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-label-sm font-bold text-on-surface">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-on-surface-variant">Account</span>
                </div>
              </div>
              <div className="absolute top-full right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 hidden group-hover:block overflow-hidden py-1">
                <button className="w-full text-left px-4 py-2 hover:bg-surface-container text-body-sm text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">person</span> Profile
                </button>
                <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-error-container/20 text-body-sm text-error flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">logout</span> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden lg:flex items-center gap-2 pl-space-xs cursor-pointer text-primary hover:text-primary-container-dark font-bold font-label-lg transition-colors">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Category Bar */}
      <div className="bg-surface-container-low border-t border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <nav className="flex items-center overflow-x-auto py-2 gap-space-md text-label-md font-label-md no-scrollbar">
            <Link to="/search" className="whitespace-nowrap transition-colors bg-primary-container text-on-primary-container font-bold px-3 py-1.5 rounded-lg">প্রেসক্রিপশন ওষুধ</Link>
            <Link to="/search" className="whitespace-nowrap text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">সাধারণ ওষুধ (OTC)</Link>
            <Link to="/search" className="whitespace-nowrap text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">ডায়াবেটিস ও ইনসুলিন</Link>
            <Link to="/search" className="whitespace-nowrap text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">মা ও শিশু স্বাস্থ্য</Link>
            <Link to="/search" className="whitespace-nowrap text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">মেডিকেল ডিভাইস</Link>
            <Link to="/search" className="whitespace-nowrap text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">সার্জিক্যাল ও হাইজিন</Link>
            <Link to="/search" className="whitespace-nowrap text-on-surface-variant hover:text-on-surface transition-colors px-3 py-1.5">বিশেষ অফার</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

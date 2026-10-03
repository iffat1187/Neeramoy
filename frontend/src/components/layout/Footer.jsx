import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="w-full bg-surface-container text-on-surface-variant pt-space-2xl pb-space-xl mt-space-2xl shadow-[0_-1px_8px_rgba(0,0,0,0.03)] border-t border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl pb-space-2xl">
          
          <div className="space-y-space-md">
            <div className="flex items-center gap-space-sm">
              <img alt="Neeramoy Brand Logo" className="h-7 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1WevWq68kahKBgmF-DHxxsQi68HIUK_Skiskpaf1OD1uWIsR0J5srB6HNv5Dd8Pcz9G5gdHmnkF227BBj4IPzh1V0F2PPqLZnHYdGw9RZmh-xAKbdPkH9p3nb7u9t4W6Ipq5swim3rh3lXigrlPzZD8s36VCiY5y-133nBsyQY9Ifn-0paSzSHlD8Uady3B6vdQXGAxuG-fv61GTe37U2sC4qUA86rOLVx-G9f72hdcee3ymrasQg6VYKM" />
              <span className="font-headline-sm text-headline-sm text-primary font-bold">নিরাময় হেলথকেয়ার</span>
            </div>
            <p className="font-body-sm text-body-sm leading-relaxed">Government licensed digital pharmacy platform ensuring 100% genuine temperature-monitored medicines delivered across Bangladesh with clinical vigilance.</p>
            <div className="flex items-center gap-space-xs bg-surface-container-lowest p-space-sm rounded-xl">
              <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface font-bold">DGDA Gov. Licensed</div>
                <div className="text-[11px] text-outline">Registration # DA-DH-2024-9182</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-space-sm">
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Customer Support</h4>
            <div className="space-y-space-xs font-body-sm flex flex-col">
              <div className="flex items-center gap-space-xs text-on-surface font-bold">
                <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                <span>09612-NEERA (63372)</span>
              </div>
              <div className="flex items-center gap-space-xs mt-2">
                <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
                <span>support@neeramoy.com.bd</span>
              </div>
              <div className="flex items-center gap-space-xs mt-2">
                <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                <span>24/7 Live Pharmacist Service</span>
              </div>
              <Link to="/contact" className="hover:text-primary transition-colors mt-2">Contact Us</Link>
            </div>
          </div>

          <div className="space-y-space-sm">
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Quick Links</h4>
            <div className="flex flex-col gap-2 font-body-sm">
              <Link to="/search" className="hover:text-primary transition-colors">Medicine Categories</Link>
              <Link to="/login" className="hover:text-primary transition-colors">Upload Prescription / Help</Link>
              <Link to="/about" className="hover:text-primary transition-colors">About Neeramoy</Link>
              <Link to="/admin" className="hover:text-primary transition-colors text-outline">Pharmacy Admin Portal</Link>
            </div>
          </div>

          <div className="space-y-space-sm">
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Secure Payments</h4>
            <p className="font-body-sm mb-3">We support seamless digital payments and cash on delivery across Bangladesh.</p>
            <div className="flex flex-wrap gap-3">
              <div className="bg-surface-container-lowest w-16 h-10 rounded-lg border border-outline-variant/50 shadow-sm flex items-center justify-center p-1.5 hover:border-outline-variant transition-colors">
                <img src="https://commons.wikimedia.org/wiki/Special:FilePath/BKash_Logo.svg" alt="bKash" className="w-full h-full object-contain" />
              </div>
              <div className="bg-surface-container-lowest w-16 h-10 rounded-lg border border-outline-variant/50 shadow-sm flex items-center justify-center p-1.5 hover:border-outline-variant transition-colors">
                <img src="https://commons.wikimedia.org/wiki/Special:FilePath/Rocket_mobile_banking_logo.svg" alt="Rocket" className="w-full h-full object-contain" />
              </div>
              <div className="bg-surface-container-lowest w-20 h-10 rounded-lg border border-outline-variant/50 shadow-sm flex items-center justify-center p-1.5 hover:border-outline-variant transition-colors">
                <img src="https://sslcommerz.com/wp-content/uploads/2021/11/logo.png" alt="SSLCommerz" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-space-lg border-t border-outline-variant/30 text-[11px] text-outline leading-relaxed space-y-2">
          <p><strong>Disclaimer:</strong> Neeramoy is a licensed retail pharmacy platform. Information provided is for educational purposes and not a substitute for professional medical advice.</p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-space-md gap-space-sm font-label-sm">
            <p>© 2024 Neeramoy Healthcare Bangladesh Ltd. All Rights Reserved.</p>
            <div className="flex items-center gap-space-md text-on-surface-variant">
              <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-surface-container text-on-surface-variant pt-space-2xl pb-space-xl mt-space-2xl shadow-[0_-1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-7xl mx-auto px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl pb-space-2xl">
          <div className="space-y-space-md">
            <div className="flex items-center gap-space-sm">
              <img alt="Neeramoy Brand Logo" className="h-7 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1WevWq68kahKBgmF-DHxxsQi68HIUK_Skiskpaf1OD1uWIsR0J5srB6HNv5Dd8Pcz9G5gdHmnkF227BBj4IPzh1V0F2PPqLZnHYdGw9RZmh-xAKbdPkH9p3nb7u9t4W6Ipq5swim3rh3lXigrlPzZD8s36VCiY5y-133nBsyQY9Ifn-0paSzSHlD8Uady3B6vdQXGAxuG-fv61GTe37U2sC4qUA86rOLVx-G9f72hdcee3ymrasQg6VYKM"/>
              <span className="font-headline-sm text-headline-sm text-primary font-bold">নিরাময় হেলথকেয়ার</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Government licensed digital pharmacy platform ensuring 100% genuine temperature-monitored medicines delivered across Bangladesh with clinical vigilance.</p>
            <div className="flex items-center gap-space-xs bg-surface-container-lowest p-space-sm rounded-xl">
              <span className="material-symbols-outlined text-secondary text-[24px]">verified</span>
              <div>
                <div className="font-label-sm text-label-sm text-on-surface font-bold">DGDA Gov. Licensed</div>
                <div className="text-[11px] text-outline">Registration # DA-DH-2024-9182</div>
              </div>
            </div>
          </div>
          <div className="space-y-space-sm">
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Emergency &amp; Support</h4>
            <div className="space-y-space-xs font-body-sm text-body-sm">
              <div className="flex items-center gap-space-xs text-on-surface font-bold">
                <span className="material-symbols-outlined text-primary text-[18px]">call</span>
                <span>09612-NEERA (63372) / 01700-000000</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">mail</span>
                <span>support@neeramoy.com.bd</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                <span>24 Hours / 7 Days Live Pharmacist Service</span>
              </div>
            </div>
            <div className="pt-space-xs">
              <div className="font-label-sm text-label-sm text-on-surface mb-1">Dhaka &amp; National Hubs</div>
              <p className="text-[11px] text-outline leading-tight">Mohakhali C/A, Mirpur 10, Dhanmondi 27, Uttara Sector 3, Agrabad Chattogram, Zindabazar Sylhet.</p>
            </div>
          </div>
          <div className="space-y-space-sm">
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Verified Partner Manufacturers</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Sourced directly from leading pharmaceuticals ensuring genuine batch &amp; intact expiry:</p>
            <div className="flex flex-wrap gap-space-xs text-[11px] font-label-md">
              <span className="bg-surface-container-lowest px-2 py-1 rounded-md text-on-surface">Square Pharmaceuticals</span>
              <span className="bg-surface-container-lowest px-2 py-1 rounded-md text-on-surface">Beximco Pharma</span>
              <span className="bg-surface-container-lowest px-2 py-1 rounded-md text-on-surface">Incepta</span>
              <span className="bg-surface-container-lowest px-2 py-1 rounded-md text-on-surface">Renata Limited</span>
              <span className="bg-surface-container-lowest px-2 py-1 rounded-md text-on-surface">Acme Labs</span>
              <span className="bg-surface-container-lowest px-2 py-1 rounded-md text-on-surface">Healthcare Pharma</span>
              <span className="bg-surface-container-lowest px-2 py-1 rounded-md text-on-surface">Popular Pharma</span>
            </div>
          </div>
          <div className="space-y-space-sm">
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Guaranteed Safe Payments</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Instant zero-charge cashless payment or Cash on Delivery (COD) across 64 districts:</p>
            <div className="flex flex-wrap gap-space-xs text-[11px] font-label-md">
              <span className="bg-surface-container-lowest px-2.5 py-1 rounded-lg text-primary font-bold">bKash</span>
              <span className="bg-surface-container-lowest px-2.5 py-1 rounded-lg text-primary font-bold">Nagad</span>
              <span className="bg-surface-container-lowest px-2.5 py-1 rounded-lg text-primary font-bold">Rocket</span>
              <span className="bg-surface-container-lowest px-2.5 py-1 rounded-lg text-on-surface">Visa</span>
              <span className="bg-surface-container-lowest px-2.5 py-1 rounded-lg text-on-surface">Mastercard</span>
              <span className="bg-surface-container-lowest px-2.5 py-1 rounded-lg text-secondary font-bold">Cash on Delivery (COD)</span>
            </div>
            <div className="pt-space-xs">
              <div className="font-label-sm text-label-sm text-on-surface mb-1">Cold-Chain Guarantee</div>
              <div className="text-[11px] text-outline">2°C - 8°C temperature-insulated ice packs for insulins &amp; biologics.</div>
            </div>
          </div>
        </div>
        <div className="pt-space-lg text-[11px] text-outline leading-relaxed space-y-2">
          <p><strong>Medical Disclaimer:</strong> Neeramoy is a licensed retail and digital pharmacy platform. Information provided is for educational and wellness assistance only and is not intended as a substitute for professional medical advice, diagnosis, or treatment. Prescription drugs (Rx) are dispensed strictly following receipt and clinical verification of a registered medical practitioner's prescription.</p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-space-md gap-space-sm font-label-sm text-label-sm">
            <p>© 2024 Neeramoy Healthcare Bangladesh Ltd. All Rights Reserved.</p>
            <div className="flex items-center gap-space-md text-on-surface-variant">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-primary transition-colors" href="#">Prescription Policy</a>
              <a className="hover:text-primary transition-colors" href="#">DGDA Compliance</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

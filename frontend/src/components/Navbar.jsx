import React from 'react';

const categories = [
  { name: "Home", path: "/" },
  { name: "Medicine", path: "/category/medicines" },
  { name: "Prescription", path: "/prescription", icon: "upload_file" },
  { name: "Healthcare", path: "/healthcare" },
  { name: "Beauty", path: "/beauty" },
  { name: "Baby & Mom Care", path: "/category/baby-mom-care" },
  { name: "Herbal", path: "/category/herbal" },
  { name: "Home Care", path: "/category/homecare" },
  { name: "Supplement", path: "/category/supplement" },
  { name: "Food and Nutrition", path: "/category/food" },
  { name: "Pet Care", path: "/category/pet-care" },
  { name: "Veterinary", path: "/category/veterinary" },
  { name: "Homeopathy", path: "/category/homeopathy" },
  { name: "Browse by Health Concern", path: "/health-concern" }
];

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="bg-primary text-on-primary py-space-xs text-body-sm font-body-sm">
        <div className="max-w-7xl mx-auto px-margin-desktop flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center flex-wrap gap-space-md">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <span className="font-label-sm text-label-sm tracking-wide">DGDA Licensed: DA-DH-2024-9182</span>
            </div>
            <span className="opacity-40 text-xs">|</span>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[16px]">support_agent</span>
              <span>24/7 Helpline: <strong>09612-NEERA (63372)</strong></span>
            </div>
            <span className="opacity-40 text-xs hidden md:inline">|</span>
            <div className="hidden md:flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-[16px]">bolt</span>
              <span className="text-secondary-fixed font-label-sm text-label-sm">Express 2-Hour Delivery in Dhaka</span>
            </div>
          </div>
          <div className="flex items-center gap-space-lg">
            <div className="flex items-center gap-space-xs cursor-pointer hover:text-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              <span className="text-body-sm font-body-sm truncate max-w-[200px]">Dhaka City (Dhanmondi, Gulshan, Uttara)</span>
              <span className="material-symbols-outlined text-[14px]">expand_more</span>
            </div>
            <div className="flex items-center bg-primary-container px-space-xs py-0.5 rounded-full text-label-sm font-label-sm">
              <button className="px-space-xs py-0.5 rounded-full bg-surface-container-lowest text-primary font-bold" type="button">বাংলা</button>
              <button className="px-space-xs py-0.5 rounded-full text-on-primary-container opacity-80 hover:opacity-100" type="button">EN</button>
            </div>
          </div>
      </div>
      </div>
      <div className="h-20 max-w-7xl mx-auto px-margin-desktop flex items-center justify-between gap-space-lg">
        <div className="flex items-center gap-space-md shrink-0">
          <img alt="Neeramoy Brand Logo" className="h-8 w-auto object-contain" src="https://lh3.googleusercontent.com/aida/AEtjO1WevWq68kahKBgmF-DHxxsQi68HIUK_Skiskpaf1OD1uWIsR0J5srB6HNv5Dd8Pcz9G5gdHmnkF227BBj4IPzh1V0F2PPqLZnHYdGw9RZmh-xAKbdPkH9p3nb7u9t4W6Ipq5swim3rh3lXigrlPzZD8s36VCiY5y-133nBsyQY9Ifn-0paSzSHlD8Uady3B6vdQXGAxuG-fv61GTe37U2sC4qUA86rOLVx-G9f72hdcee3ymrasQg6VYKM"/>
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary tracking-tight font-bold">নিরাময়</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Neeramoy Healthcare</span>
          </div>
        </div>
        <div className="flex-1 max-w-2xl">
          <div className="relative flex items-center w-full bg-surface-container-low rounded-xl px-space-md py-space-xs transition-all focus-within:bg-surface-container-lowest focus-within:shadow-[0_2px_8px_rgba(0,103,92,0.12)]">
            <span className="material-symbols-outlined text-outline text-[20px] mr-space-xs shrink-0">search</span>
            <input className="w-full bg-transparent border-0 outline-none text-body-md font-body-md text-on-surface placeholder:text-outline-variant pr-space-xl" placeholder="Search by medicine brand, generic name e.g. Paracetamol, Esomeprazole, or health product..." type="text"/>
            <button className="absolute right-space-sm p-1.5 rounded-lg bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center" title="Upload Prescription Photo" type="button">
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-space-md shrink-0">
          <a className="hidden lg:flex items-center gap-space-xs px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:text-primary transition-colors" data-path="login" href="/login">
            <span className="material-symbols-outlined text-[24px]">person</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-outline">Account</span>
              <span className="font-label-sm text-label-sm text-on-surface">Login</span>
            </div>
          </a>
          <a className="hidden lg:flex items-center gap-space-xs px-space-sm py-space-xs rounded-lg text-on-surface-variant hover:text-primary transition-colors" data-path="orders" href="/orders">
            <span className="material-symbols-outlined text-[24px]">receipt_long</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-outline">Orders</span>
              <span className="font-label-sm text-label-sm text-on-surface">0</span>
            </div>
          </a>
          <a className="flex items-center gap-space-xs bg-surface-container px-space-md py-space-sm rounded-xl hover:bg-surface-container-high transition-colors" data-path="cart" href="/cart">
            <div className="relative flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[24px]">shopping_cart</span>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-on-secondary text-[10px] flex items-center justify-center font-bold">0</span>
            </div>
            <div className="hidden sm:flex flex-col text-left leading-tight">
              <span className="font-price-md text-price-md text-primary">Cart</span>
            </div>
          </a>
        </div>
      </div>
      <div className="bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <nav className="flex items-center justify-start overflow-x-auto py-space-xs gap-space-sm text-label-md font-label-md" data-active-classes="bg-primary-container text-on-primary-container font-bold rounded-lg">
            {categories.map((category, index) => (
              <a key={index} className="flex items-center gap-1.5 px-space-sm py-1.5 rounded-lg text-on-surface-variant hover:text-on-surface whitespace-nowrap transition-colors" href={category.path}>
                {category.icon && <span className="material-symbols-outlined text-[18px]">{category.icon}</span>}
                <span>{category.name}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

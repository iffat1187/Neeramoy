const fs = require('fs');
const path = require('path');

const files = {
  "src/context/AuthContext.jsx": `import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Mock auth state
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Mock login logic
    if (email && password) {
      setUser({
        name: 'Hasan Mahmud',
        email: email,
        phone: '01711223344'
      });
      return true;
    }
    return false;
  };

  const register = (userData) => {
    // Mock register logic
    setUser({
      name: userData.fullName,
      email: userData.email,
      phone: userData.phone
    });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn: !!user,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
`,
  "src/App.jsx": `import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { LandingPage } from './pages/LandingPage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="category/:id" element={<SearchResultsPage />} />
              <Route path="product/:id" element={<ProductDetailsPage />} />
              <Route path="cart" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="search" element={<SearchResultsPage />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<PlaceholderPage title="Admin Dashboard" />} />
              <Route path="prescriptions" element={<PlaceholderPage title="Prescription Review" />} />
              <Route path="orders" element={<PlaceholderPage title="Order Management" />} />
              <Route path="inventory" element={<PlaceholderPage title="Inventory Management" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
`,
  "src/components/layout/Navbar.jsx": `import React from 'react';
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
          <img src="https://lh3.googleusercontent.com/aida/AEtjO1WevWq68kahKBgmF-DHxxsQi68HIUK_Skiskpaf1OD1uWIsR0J5srB6HNv5Dd8Pcz9G5gdHmnkF227BBj4IPzh1V0F2PPqLZnHYdGw9RZmh-xAKbdPkH9p3nb7u9t4W6Ipq5swim3rh3lXigrlPzZD8s36VCiY5y-133nBsyQY9Ifn-0paSzSHlD8Uady3B6vdQXGAxuG-fv61GTe37U2sC4qUA86rOLVx-G9f72hdcee3ymrasQg6VYKM" alt="Neeramoy Logo" className="h-8 w-auto object-contain" />
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
`,
  "src/pages/LoginPage.jsx": `import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggedIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // The route they intended to go to before being asked to login
  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    // Mock Auth logic
    if (login(email, password)) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="w-full bg-background min-h-[80vh] flex items-center justify-center py-space-2xl px-margin-desktop">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-xl">
        <div className="text-center mb-space-xl">
          <h1 className="font-headline-xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="font-body-md text-on-surface-variant">Log in to your Neeramoy account to access your orders and fast checkout.</p>
        </div>

        {error && (
          <div className="bg-error-container/20 text-error p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1">Email or Phone Number</label>
            <input 
              type="text" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
              placeholder="e.g. user@example.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-label-md text-on-surface">Password</label>
              <a href="#" className="text-[12px] text-primary hover:underline font-bold">Forgot Password?</a>
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center gap-2 pb-2">
            <input type="checkbox" id="remember" className="w-4 h-4 text-primary accent-primary" />
            <label htmlFor="remember" className="text-body-sm text-on-surface-variant">Remember me</label>
          </div>

          <Button type="submit" className="w-full py-3.5 text-[16px]">Login</Button>
        </form>

        <div className="mt-space-lg pt-space-lg border-t border-outline-variant/30 text-center">
          <p className="font-body-sm text-on-surface-variant">
            Don't have an account? <Link to="/register" state={{ from: location.state?.from }} className="text-primary font-bold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
`,
  "src/pages/RegisterPage.jsx": `import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isLoggedIn } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    window.scrollTo(0, 0);
    if (isLoggedIn) {
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, from]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    // Mock Auth logic
    if (register(formData)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="w-full bg-background min-h-[80vh] flex items-center justify-center py-space-2xl px-margin-desktop">
      <div className="max-w-md w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-xl">
        <div className="text-center mb-space-lg">
          <h1 className="font-headline-xl font-bold text-primary mb-2">Create Account</h1>
          <p className="font-body-md text-on-surface-variant">Join Neeramoy for seamless healthcare access.</p>
        </div>

        {error && (
          <div className="bg-error-container/20 text-error p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block font-label-md text-on-surface mb-1">Full Name *</label>
            <input 
              type="text" name="fullName"
              value={formData.fullName} onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
              placeholder="e.g. Hasan Mahmud"
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface mb-1">Phone Number *</label>
            <input 
              type="tel" name="phone"
              value={formData.phone} onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
              placeholder="01XXXXXXXXX"
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface mb-1">Email Address</label>
            <input 
              type="email" name="email"
              value={formData.email} onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
              placeholder="Optional"
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface mb-1">Password *</label>
            <input 
              type="password" name="password"
              value={formData.password} onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block font-label-md text-on-surface mb-1">Confirm Password *</label>
            <input 
              type="password" name="confirmPassword"
              value={formData.confirmPassword} onChange={handleInputChange}
              className="w-full px-4 py-2.5 rounded-xl border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
              placeholder="••••••••"
            />
          </div>

          <Button type="submit" className="w-full py-3.5 text-[16px] mt-2">Create Account</Button>
        </form>

        <div className="mt-space-lg pt-space-lg border-t border-outline-variant/30 text-center">
          <p className="font-body-sm text-on-surface-variant">
            Already have an account? <Link to="/login" state={{ from: location.state?.from }} className="text-primary font-bold hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
`,
  "src/pages/CheckoutPage.jsx": `import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user } = useAuth();
  const { 
    cartItems, 
    cartCount, 
    cartSubtotal, 
    cartSavings, 
    deliveryCharge, 
    cartTotal,
    deliveryMethod,
    setDeliveryMethod,
    clearCart
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Dhaka',
    area: '',
    postalCode: '',
    instructions: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auth Guard
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
      return;
    }
    
    if (!isLoggedIn) {
      // Preserve destination
      navigate('/login', { state: { from: location } });
    }
  }, [cartItems, isLoggedIn, navigate, location]);

  // Pre-fill user data
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone
      }));
    }
  }, [isLoggedIn, user]);

  if (cartItems.length === 0 || !isLoggedIn) {
    return null; 
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(?:\\+88|88)?(01[3-9]\\d{8})$/.test(formData.phone)) {
      newErrors.phone = 'Valid BD phone number required';
    }
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.area.trim()) newErrors.area = 'Area is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Navigate to order confirmation and pass state
      const orderDetails = {
        orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
        date: new Date().toISOString(),
        items: [...cartItems],
        total: cartTotal,
        paymentMethod,
        deliveryDetails: formData
      };
      clearCart();
      navigate('/order-confirmation', { state: { orderDetails } });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-background min-h-screen pb-space-2xl">
      {/* Breadcrumb & Header */}
      <div className="w-full bg-surface-container-low py-space-sm border-b border-outline-variant/20 mb-space-lg">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <nav className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant">
            <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/cart')}>Cart</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-bold">Checkout</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-margin-desktop">
        <h1 className="font-headline-xl font-bold text-on-surface tracking-tight mb-space-lg">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
          
          {/* Left: Forms */}
          <div className="lg:col-span-7 space-y-space-lg">
            
            {/* Delivery Information */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-xl">
              <div className="flex items-center gap-3 mb-space-md pb-space-sm border-b border-outline-variant/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">1</div>
                <h2 className="font-headline-md font-bold text-on-surface">Delivery Information</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="md:col-span-2">
                  <label className="block font-label-md text-on-surface mb-1">Full Name *</label>
                  <input 
                    type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                    className={\`w-full px-4 py-2.5 rounded-lg border \${errors.fullName ? 'border-error bg-error/5' : 'border-outline-variant/50'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface\`}
                    placeholder="e.g. Hasan Mahmud"
                  />
                  {errors.fullName && <p className="text-error text-[12px] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block font-label-md text-on-surface mb-1">Phone Number *</label>
                  <input 
                    type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                    className={\`w-full px-4 py-2.5 rounded-lg border \${errors.phone ? 'border-error bg-error/5' : 'border-outline-variant/50'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface\`}
                    placeholder="01XXXXXXXXX"
                  />
                  {errors.phone && <p className="text-error text-[12px] mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block font-label-md text-on-surface mb-1">Email Address</label>
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
                    placeholder="Optional"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-label-md text-on-surface mb-1">Detailed Address *</label>
                  <input 
                    type="text" name="address" value={formData.address} onChange={handleInputChange}
                    className={\`w-full px-4 py-2.5 rounded-lg border \${errors.address ? 'border-error bg-error/5' : 'border-outline-variant/50'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface\`}
                    placeholder="House/Flat No, Road Name, Block, etc."
                  />
                  {errors.address && <p className="text-error text-[12px] mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block font-label-md text-on-surface mb-1">City *</label>
                  <select 
                    name="city" value={formData.city} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chittagong">Chittagong</option>
                    <option value="Sylhet">Sylhet</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-md text-on-surface mb-1">Area *</label>
                  <input 
                    type="text" name="area" value={formData.area} onChange={handleInputChange}
                    className={\`w-full px-4 py-2.5 rounded-lg border \${errors.area ? 'border-error bg-error/5' : 'border-outline-variant/50'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface\`}
                    placeholder="e.g. Gulshan 1, Dhanmondi"
                  />
                  {errors.area && <p className="text-error text-[12px] mt-1">{errors.area}</p>}
                </div>

                <div>
                  <label className="block font-label-md text-on-surface mb-1">Postal Code</label>
                  <input 
                    type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface"
                    placeholder="e.g. 1212"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-label-md text-on-surface mb-1">Delivery Instructions</label>
                  <textarea 
                    name="instructions" value={formData.instructions} onChange={handleInputChange} rows="2"
                    className="w-full px-4 py-2.5 rounded-lg border border-outline-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface resize-none"
                    placeholder="Any specific instructions for the delivery person (Optional)"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-xl">
              <div className="flex items-center gap-3 mb-space-md pb-space-sm border-b border-outline-variant/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">2</div>
                <h2 className="font-headline-md font-bold text-on-surface">Delivery Method</h2>
              </div>
              
              <div className="space-y-3">
                <label className={\`flex items-start p-4 rounded-xl border cursor-pointer transition-colors \${deliveryMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:bg-surface-container'}\`}>
                  <div className="flex h-5 items-center">
                    <input type="radio" name="deliveryMethod" value="standard" checked={deliveryMethod === 'standard'} onChange={() => setDeliveryMethod('standard')} className="w-4 h-4 text-primary focus:ring-primary border-outline" />
                  </div>
                  <div className="ml-3 flex-1 flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <span className="block font-label-lg font-bold text-on-surface">Standard Delivery</span>
                      <span className="block font-body-sm text-on-surface-variant mt-1">Delivery in 1-2 business days</span>
                    </div>
                    <span className="font-price-md font-bold text-primary mt-2 sm:mt-0">৳ 60</span>
                  </div>
                </label>
                
                <label className={\`flex items-start p-4 rounded-xl border cursor-pointer transition-colors \${deliveryMethod === 'express' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:bg-surface-container'}\`}>
                  <div className="flex h-5 items-center">
                    <input type="radio" name="deliveryMethod" value="express" checked={deliveryMethod === 'express'} onChange={() => setDeliveryMethod('express')} className="w-4 h-4 text-primary focus:ring-primary border-outline" />
                  </div>
                  <div className="ml-3 flex-1 flex flex-col sm:flex-row sm:justify-between">
                    <div>
                      <span className="block font-label-lg font-bold text-on-surface">Express Delivery</span>
                      <span className="block font-body-sm text-on-surface-variant mt-1">Same day delivery (Order before 2 PM)</span>
                    </div>
                    <span className="font-price-md font-bold text-primary mt-2 sm:mt-0">৳ 120</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-xl">
              <div className="flex items-center gap-3 mb-space-md pb-space-sm border-b border-outline-variant/30">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">3</div>
                <h2 className="font-headline-md font-bold text-on-surface">Payment Method</h2>
              </div>
              
              <div className="space-y-3">
                <label className={\`flex items-center p-4 rounded-xl border cursor-pointer transition-colors \${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:bg-surface-container'}\`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-primary focus:ring-primary border-outline" />
                  <div className="ml-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant">payments</span>
                    <span className="font-label-lg font-bold text-on-surface">Cash on Delivery</span>
                  </div>
                </label>

                <label className={\`flex items-center p-4 rounded-xl border cursor-pointer transition-colors \${paymentMethod === 'bkash' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:bg-surface-container'}\`}>
                  <input type="radio" name="paymentMethod" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="w-4 h-4 text-primary focus:ring-primary border-outline" />
                  <div className="ml-3 flex items-center gap-3">
                    <div className="bg-pink-600 text-white font-bold px-2 py-0.5 rounded text-xs">bKash</div>
                    <span className="font-label-lg font-bold text-on-surface">Pay with bKash</span>
                  </div>
                </label>

                <label className={\`flex items-center p-4 rounded-xl border cursor-pointer transition-colors \${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:bg-surface-container'}\`}>
                  <input type="radio" name="paymentMethod" value="online" checked={paymentMethod === 'online'} onChange={() => setPaymentMethod('online')} className="w-4 h-4 text-primary focus:ring-primary border-outline" />
                  <div className="ml-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant">credit_card</span>
                    <span className="font-label-lg font-bold text-on-surface">Online Payment (Cards / Net Banking)</span>
                  </div>
                </label>
              </div>
              
              {paymentMethod !== 'cod' && (
                <div className="mt-4 p-3 bg-secondary-container/20 text-on-surface-variant rounded-lg text-sm flex items-start gap-2">
                  <span className="material-symbols-outlined text-[16px] mt-0.5">info</span>
                  <p>You will be redirected to the secure payment gateway after clicking "Place Order".</p>
                </div>
              )}
            </div>

          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 p-space-xl sticky top-24">
              <h2 className="font-headline-md font-bold text-on-surface mb-space-lg pb-space-sm border-b border-outline-variant/30">Order Summary</h2>
              
              {/* Items Preview */}
              <div className="max-h-[300px] overflow-y-auto mb-space-md pr-2 space-y-3 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded bg-surface-container-low border border-outline-variant/20 p-1 shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-label-md font-bold text-on-surface truncate">{item.name}</h4>
                      <p className="text-[11px] text-on-surface-variant">{item.quantity} x ৳ {item.price}</p>
                    </div>
                    <span className="font-label-md font-bold text-on-surface whitespace-nowrap">৳ {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-space-md mb-space-xl pt-space-md border-t border-outline-variant/30">
                <div className="flex justify-between items-center text-body-md text-on-surface">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-price-md font-bold">৳ {cartSubtotal}</span>
                </div>
                
                {cartSavings > 0 && (
                  <div className="flex justify-between items-center text-body-md text-secondary">
                    <span>Discount</span>
                    <span className="font-price-md font-bold">- ৳ {cartSavings}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center text-body-md text-on-surface">
                  <span>Delivery ({deliveryMethod === 'express' ? 'Express' : 'Standard'})</span>
                  <span className="font-price-md font-bold">৳ {deliveryCharge}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-space-md border-t border-outline-variant/30 mb-space-lg">
                <span className="font-headline-sm font-bold text-on-surface">Grand Total</span>
                <span className="font-headline-xl font-bold text-primary">৳ {cartTotal}</span>
              </div>
              
              <Button variant="primary" className="w-full py-4 text-[16px] shadow-md" onClick={handlePlaceOrder}>
                Place Order 
                {paymentMethod !== 'cod' && <span className="material-symbols-outlined ml-1">lock</span>}
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
`
};

for (const [filePath, content] of Object.entries(files)) {
  const fullPath = path.join('D:\\Neeramoy\\frontend', filePath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
}
console.log('Auth setup and checkout integration completed.');

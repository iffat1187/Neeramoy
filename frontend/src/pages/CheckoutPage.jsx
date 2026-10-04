import React, { useEffect, useState } from 'react';
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
    } else if (!/^(?:\+88|88)?(01[3-9]\d{8})$/.test(formData.phone)) {
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
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.fullName ? 'border-error bg-error/5' : 'border-outline-variant/50'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface`}
                    placeholder="e.g. Hasan Mahmud"
                  />
                  {errors.fullName && <p className="text-error text-[12px] mt-1">{errors.fullName}</p>}
                </div>

                <div>
                  <label className="block font-label-md text-on-surface mb-1">Phone Number *</label>
                  <input 
                    type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.phone ? 'border-error bg-error/5' : 'border-outline-variant/50'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface`}
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
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.address ? 'border-error bg-error/5' : 'border-outline-variant/50'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface`}
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
                    className={`w-full px-4 py-2.5 rounded-lg border ${errors.area ? 'border-error bg-error/5' : 'border-outline-variant/50'} focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-surface`}
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
                <label className={`flex items-start p-4 rounded-xl border cursor-pointer transition-colors ${deliveryMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:bg-surface-container'}`}>
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
                
                <label className={`flex items-start p-4 rounded-xl border cursor-pointer transition-colors ${deliveryMethod === 'express' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:bg-surface-container'}`}>
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
                <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:bg-surface-container'}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-primary focus:ring-primary border-outline" />
                  <div className="ml-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant">payments</span>
                    <span className="font-label-lg font-bold text-on-surface">Cash on Delivery</span>
                  </div>
                </label>

                <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'bkash' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:bg-surface-container'}`}>
                  <input type="radio" name="paymentMethod" value="bkash" checked={paymentMethod === 'bkash'} onChange={() => setPaymentMethod('bkash')} className="w-4 h-4 text-primary focus:ring-primary border-outline" />
                  <div className="ml-3 flex items-center gap-3">
                    <div className="bg-pink-600 text-white font-bold px-2 py-0.5 rounded text-xs">bKash</div>
                    <span className="font-label-lg font-bold text-on-surface">Pay with bKash</span>
                  </div>
                </label>

                <label className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'online' ? 'border-primary bg-primary/5' : 'border-outline-variant/40 hover:bg-surface-container'}`}>
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

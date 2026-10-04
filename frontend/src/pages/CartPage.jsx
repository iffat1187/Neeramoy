import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useCart } from '../context/CartContext';

export const CartPage = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartCount, 
    cartSubtotal, 
    cartSavings, 
    deliveryCharge, 
    cartTotal 
  } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hasRxItem = cartItems.some(item => !item.isOtc);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-space-2xl min-h-[60vh] bg-background">
        <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center text-outline mb-6">
          <span className="material-symbols-outlined text-[48px]">shopping_cart_checkout</span>
        </div>
        <h2 className="font-headline-lg font-bold text-on-surface">Your Cart is Empty</h2>
        <p className="font-body-md text-on-surface-variant mt-2 mb-8 text-center max-w-md">
          Looks like you haven't added any medicines or healthcare products to your cart yet.
        </p>
        <Button onClick={() => navigate('/search')} className="px-8 py-3 text-lg">
          Browse Medicines
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-background min-h-screen pb-space-2xl">
      {/* Breadcrumb */}
      <div className="w-full bg-surface-container-low py-space-sm border-b border-outline-variant/20 mb-space-lg">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <nav className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant">
            <span className="hover:text-primary transition-colors cursor-pointer flex items-center" onClick={() => navigate('/')}>
              <span className="material-symbols-outlined text-[16px] mr-1">home</span> হোম
            </span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-bold">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-margin-desktop">
        <div className="flex items-center justify-between mb-space-lg">
          <h1 className="font-headline-xl font-bold text-on-surface tracking-tight">Shopping Cart</h1>
          <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-md font-bold">
            {cartCount} Items
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-space-md">
            <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-space-md bg-surface-container-low border-b border-outline-variant/30 text-label-md font-label-md text-outline tracking-wider uppercase">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              {/* Items */}
              <div className="divide-y divide-outline-variant/20">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-space-md flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center hover:bg-surface-container-lowest/50 transition-colors">
                    
                    {/* Details */}
                    <div className="col-span-6 flex gap-space-md w-full">
                      <div className="w-20 h-20 bg-surface-container-low rounded-xl border border-outline-variant/20 flex items-center justify-center p-1 shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.id}`)}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {item.isOtc ? (
                            <Badge variant="secondary" className="px-1.5 py-0 text-[9px]"><span className="w-1 h-1 rounded-full bg-secondary"></span> OTC</Badge>
                          ) : (
                            <Badge variant="tertiary" className="px-1.5 py-0 text-[9px]">Rx Required</Badge>
                          )}
                        </div>
                        <h3 className="font-headline-sm font-bold text-on-surface truncate cursor-pointer hover:text-primary transition-colors" onClick={() => navigate(`/product/${item.id}`)}>
                          {item.name}
                        </h3>
                        <p className="text-[11px] text-on-surface-variant truncate mb-1">Generic: {item.genericName}</p>
                        <p className="text-[10px] text-outline uppercase">{item.manufacturer}</p>
                      </div>
                    </div>

                    {/* Mobile Only: Price & Quantity Row */}
                    <div className="md:hidden flex items-center justify-between w-full mt-2 border-t border-outline-variant/10 pt-3">
                      <div className="flex flex-col">
                        <span className="font-price-md font-bold text-primary">৳ {item.price * item.quantity}</span>
                        <span className="text-[10px] text-outline">৳ {item.price} / {item.unit}</span>
                      </div>
                      
                      <div className="flex items-center bg-surface-container-low rounded-lg border border-outline-variant/30 h-8">
                        <button 
                          className="w-8 h-full flex items-center justify-center text-on-surface hover:text-primary transition-colors disabled:opacity-30"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-8 h-full flex items-center justify-center font-label-md font-bold text-on-surface bg-surface-container-lowest">
                          {item.quantity}
                        </span>
                        <button 
                          className="w-8 h-full flex items-center justify-center text-on-surface hover:text-primary transition-colors disabled:opacity-30"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                      
                      <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>

                    {/* Desktop Columns */}
                    <div className="hidden md:flex col-span-2 justify-center flex-col items-center">
                      <span className="font-price-md font-bold text-on-surface">৳ {item.price}</span>
                      <span className="text-[10px] text-outline">/ {item.unit}</span>
                    </div>

                    <div className="hidden md:flex col-span-2 justify-center">
                      <div className="flex items-center bg-surface-container-low rounded-lg border border-outline-variant/30 h-9 shadow-sm">
                        <button 
                          className="w-8 h-full flex items-center justify-center text-on-surface hover:text-primary transition-colors disabled:opacity-30"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <span className="material-symbols-outlined text-[16px]">remove</span>
                        </button>
                        <span className="w-8 h-full flex items-center justify-center font-label-md font-bold text-on-surface bg-surface-container-lowest">
                          {item.quantity}
                        </span>
                        <button 
                          className="w-8 h-full flex items-center justify-center text-on-surface hover:text-primary transition-colors disabled:opacity-30"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                        >
                          <span className="material-symbols-outlined text-[16px]">add</span>
                        </button>
                      </div>
                    </div>

                    <div className="hidden md:flex col-span-2 justify-end items-center gap-2">
                      <span className="font-price-lg font-bold text-primary">৳ {item.price * item.quantity}</span>
                      <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 flex items-center justify-center rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors ml-1" title="Remove item">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {hasRxItem && (
              <div className="bg-tertiary-container/10 border border-tertiary/20 rounded-xl p-space-md flex items-start gap-3">
                <span className="material-symbols-outlined text-tertiary mt-0.5">prescriptions</span>
                <div>
                  <h4 className="font-headline-sm font-bold text-on-surface">Prescription Required</h4>
                  <p className="font-body-sm text-on-surface-variant mt-1">
                    Your cart contains Rx (prescription) medicines. You will need to upload a valid prescription image or PDF during checkout. Our pharmacist will verify the order before dispatch.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 p-space-xl sticky top-24">
              <h2 className="font-headline-md font-bold text-on-surface mb-space-lg pb-space-sm border-b border-outline-variant/30">Order Summary</h2>
              
              <div className="space-y-space-md mb-space-xl">
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
                  <span className="flex items-center gap-1">Delivery Charge <span className="material-symbols-outlined text-[14px] text-outline cursor-help" title="Standard delivery inside Dhaka">info</span></span>
                  <span className="font-price-md font-bold">৳ {deliveryCharge}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-space-md border-t border-outline-variant/30 mb-space-lg">
                <span className="font-headline-sm font-bold text-on-surface">Total</span>
                <span className="font-headline-xl font-bold text-primary">৳ {cartTotal}</span>
              </div>
              
              <div className="space-y-space-sm">
                <Button variant="primary" className="w-full py-4 text-[16px] shadow-md" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout <span className="material-symbols-outlined ml-1">arrow_forward</span>
                </Button>
                <Button variant="outline" className="w-full py-3 border-outline-variant text-on-surface-variant" onClick={() => navigate('/')}>
                  Continue Shopping
                </Button>
              </div>
              
              <div className="flex items-center justify-center gap-3 mt-space-lg pt-space-lg border-t border-outline-variant/20 opacity-60">
                <span className="material-symbols-outlined text-[24px]">verified_user</span>
                <span className="font-label-sm uppercase tracking-wider">Secure Checkout</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

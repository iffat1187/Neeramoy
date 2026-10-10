import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { useCart } from '../context/CartContext';

export const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;
  const { clearCart } = useCart();
  const hasCleared = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (orderDetails && !hasCleared.current) {
      clearCart();
      hasCleared.current = true;
    }
  }, [orderDetails, clearCart]);

  if (!orderDetails) {
    return <Navigate to="/" replace />;
  }

  const formatPaymentMethod = (method) => {
    if (method === 'cod') return 'Cash on Delivery';
    if (method === 'bkash') return 'bKash Payment';
    if (method === 'online') return 'Online Payment / Card';
    return method;
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full bg-background min-h-screen pb-space-2xl">
      {/* Success Hero Area */}
      <div className="bg-primary pt-space-2xl pb-space-3xl text-on-primary text-center px-margin-desktop">
        <div className="max-w-3xl mx-auto">
          <div className="w-20 h-20 bg-on-primary text-primary rounded-full flex items-center justify-center mx-auto mb-space-lg shadow-lg">
            <span className="material-symbols-outlined text-[48px]">check_circle</span>
          </div>
          <h1 className="font-headline-xl font-bold mb-2">Order Placed Successfully!</h1>
          <p className="font-body-lg text-primary-container mb-space-xl">
            Thank you for choosing Neeramoy. We have received your order and are processing it now.
          </p>
          <div className="inline-block bg-primary-container-dark/20 border border-primary-container/30 px-space-xl py-space-sm rounded-xl">
            <p className="text-[12px] uppercase tracking-wider text-primary-container mb-1">Order Number</p>
            <p className="font-headline-md font-bold">{orderDetails.orderId}</p>
            <p className="text-body-sm text-primary-container mt-1">{formatDate(orderDetails.createdAt || orderDetails.date)}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-margin-desktop -mt-space-xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-space-lg">
            
            {/* Customer & Delivery Details */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 overflow-hidden">
              <div className="bg-surface-container-low px-space-lg py-space-md border-b border-outline-variant/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <h3 className="font-headline-sm font-bold text-on-surface">Customer & Delivery Info</h3>
              </div>
              <div className="p-space-lg grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                <div>
                  <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Customer</p>
                  <p className="font-label-md font-bold text-on-surface mb-0.5">{orderDetails.deliveryDetails.fullName}</p>
                  <p className="font-body-sm text-on-surface-variant">{orderDetails.deliveryDetails.phone}</p>
                  {orderDetails.deliveryDetails.email && <p className="font-body-sm text-on-surface-variant">{orderDetails.deliveryDetails.email}</p>}
                </div>
                <div>
                  <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Delivery Method</p>
                  <p className="font-label-md font-bold text-on-surface capitalize">{orderDetails.deliveryMethod} Delivery</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Delivery Address</p>
                  <p className="font-body-md text-on-surface">
                    {orderDetails.deliveryDetails.address},<br />
                    {orderDetails.deliveryDetails.area}, {orderDetails.deliveryDetails.city} {orderDetails.deliveryDetails.postalCode}
                  </p>
                  {orderDetails.deliveryDetails.instructions && (
                    <div className="mt-2 p-2 bg-surface-container-low rounded text-body-sm">
                      <strong>Note:</strong> {orderDetails.deliveryDetails.instructions}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 overflow-hidden">
              <div className="bg-surface-container-low px-space-lg py-space-md border-b border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">medication</span>
                  <h3 className="font-headline-sm font-bold text-on-surface">Order Items ({orderDetails.items.length})</h3>
                </div>
              </div>
              <div className="p-space-lg">
                <div className="divide-y divide-outline-variant/20">
                  {orderDetails.items.map((item) => (
                    <div key={item.medicineId || item.id} className="py-space-md first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-space-md min-w-0">
                        <div className="w-16 h-16 bg-surface-container-low rounded-lg p-1 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-label-md font-bold text-on-surface truncate">{item.name}</h4>
                          <p className="text-body-sm text-outline mt-1">Qty: {item.quantity} × ৳ {item.price}</p>
                        </div>
                      </div>
                      <div className="font-label-md font-bold text-on-surface whitespace-nowrap text-right">
                        ৳ {item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-space-lg">
            
            {/* Payment Summary */}
            <div className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 overflow-hidden">
              <div className="bg-surface-container-low px-space-lg py-space-md border-b border-outline-variant/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                <h3 className="font-headline-sm font-bold text-on-surface">Payment Information</h3>
              </div>
              <div className="p-space-lg">
                <div className="flex items-center justify-between mb-space-md">
                  <div>
                    <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Method</p>
                    <p className="font-label-md font-bold text-on-surface">{formatPaymentMethod(orderDetails.paymentMethod)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Status</p>
                    <span className="inline-block bg-secondary-container/40 text-secondary-fixed-dim px-2 py-0.5 rounded font-bold text-[12px] capitalize">{orderDetails.paymentStatus}</span>
                  </div>
                </div>

                <div className="pt-space-md border-t border-outline-variant/30 space-y-3">
                  <div className="flex justify-between text-body-md text-on-surface">
                    <span>Subtotal</span>
                    <span className="font-price-md font-bold">৳ {orderDetails.subtotal}</span>
                  </div>
                  {orderDetails.discount > 0 && (
                    <div className="flex justify-between text-body-md text-secondary">
                      <span>Discount</span>
                      <span className="font-price-md font-bold">- ৳ {orderDetails.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-body-md text-on-surface">
                    <span>Delivery Charge</span>
                    <span className="font-price-md font-bold">৳ {orderDetails.deliveryCharge}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-space-md mt-space-md border-t border-outline-variant/30">
                  <span className="font-headline-sm font-bold text-on-surface">Grand Total</span>
                  <span className="font-headline-xl font-bold text-primary">৳ {orderDetails.total}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-space-md">
              <Button onClick={() => navigate('/orders')} className="w-full py-4 text-[16px] shadow-sm">
                View My Orders
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="w-full py-3">
                Continue Shopping
              </Button>
            </div>
            
            <div className="bg-surface-container-low rounded-xl p-space-md text-center text-body-sm text-on-surface-variant border border-outline-variant/30">
              Need help with this order? <br/>
              Contact our 24/7 Helpline: <strong className="text-on-surface">09612-NEERA</strong>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

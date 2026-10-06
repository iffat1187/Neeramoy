import React, { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { Button } from '../components/common/Button';

export const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { getOrder } = useOrder();

  const order = getOrder(orderId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auth Guard
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location } });
    }
  }, [isLoggedIn, navigate, location]);

  if (!isLoggedIn) return null;

  if (!order) {
    return (
      <div className="w-full bg-background min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-headline-md text-on-surface mb-2">Order Not Found</h2>
        <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
      </div>
    );
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Processing': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full bg-background min-h-screen pb-space-2xl">
      <div className="w-full bg-surface-container-low py-space-sm border-b border-outline-variant/20 mb-space-lg">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <nav className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant">
            <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/orders')}>My Orders</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-bold">{order.orderId}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-margin-desktop">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-space-lg">
          <div>
            <h1 className="font-headline-xl font-bold text-on-surface tracking-tight mb-1">Order Details</h1>
            <p className="text-body-md text-on-surface-variant">Order #{order.orderId} • Placed on {formatDate(order.date || order.createdAt)}</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full font-label-md font-bold border inline-block w-fit ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          
          <div className="lg:col-span-7 space-y-space-lg">
            
            <div className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 overflow-hidden">
              <div className="bg-surface-container-low px-space-lg py-space-md border-b border-outline-variant/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">local_shipping</span>
                <h3 className="font-headline-sm font-bold text-on-surface">Customer & Delivery Info</h3>
              </div>
              <div className="p-space-lg grid grid-cols-1 md:grid-cols-2 gap-space-lg">
                <div>
                  <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Customer</p>
                  <p className="font-label-md font-bold text-on-surface mb-0.5">{order.customerDetails?.name}</p>
                  <p className="font-body-sm text-on-surface-variant">{order.customerDetails?.phone}</p>
                  {order.customerDetails?.email && <p className="font-body-sm text-on-surface-variant">{order.customerDetails.email}</p>}
                </div>
                <div>
                  <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Delivery Method</p>
                  <p className="font-label-md font-bold text-on-surface capitalize">{order.deliveryMethod} Delivery</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Delivery Address</p>
                  <p className="font-body-md text-on-surface">
                    {order.deliveryDetails?.address},<br />
                    {order.deliveryDetails?.area}, {order.deliveryDetails?.city} {order.deliveryDetails?.postalCode}
                  </p>
                  {order.deliveryDetails?.instructions && (
                    <div className="mt-2 p-2 bg-surface-container-low rounded text-body-sm">
                      <strong>Note:</strong> {order.deliveryDetails.instructions}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 overflow-hidden">
              <div className="bg-surface-container-low px-space-lg py-space-md border-b border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">medication</span>
                  <h3 className="font-headline-sm font-bold text-on-surface">Ordered Items ({order.items.length})</h3>
                </div>
              </div>
              <div className="p-space-lg">
                <div className="divide-y divide-outline-variant/20">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-space-md first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-space-md min-w-0">
                        <div className="w-16 h-16 bg-surface-container-low rounded-lg p-1 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-label-md font-bold text-on-surface truncate">{item.name}</h4>
                          <p className="text-[11px] text-on-surface-variant truncate">{item.genericName}</p>
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

          <div className="lg:col-span-5 space-y-space-lg">
            
            <div className="bg-surface-container-lowest rounded-2xl shadow-md border border-outline-variant/30 overflow-hidden">
              <div className="bg-surface-container-low px-space-lg py-space-md border-b border-outline-variant/30 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">payments</span>
                <h3 className="font-headline-sm font-bold text-on-surface">Payment Summary</h3>
              </div>
              <div className="p-space-lg">
                <div className="flex items-center justify-between mb-space-md">
                  <div>
                    <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Method</p>
                    <p className="font-label-md font-bold text-on-surface">{formatPaymentMethod(order.paymentMethod)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Status</p>
                    <span className="inline-block bg-secondary-container/40 text-secondary-fixed-dim px-2 py-0.5 rounded font-bold text-[12px]">Pending</span>
                  </div>
                </div>

                <div className="pt-space-md border-t border-outline-variant/30 space-y-3">
                  <div className="flex justify-between text-body-md text-on-surface">
                    <span>Subtotal</span>
                    <span className="font-price-md font-bold">৳ {order.subtotal}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-body-md text-secondary">
                      <span>Discount</span>
                      <span className="font-price-md font-bold">- ৳ {order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-body-md text-on-surface">
                    <span>Delivery Charge</span>
                    <span className="font-price-md font-bold">৳ {order.deliveryCharge}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-space-md mt-space-md border-t border-outline-variant/30">
                  <span className="font-headline-sm font-bold text-on-surface">Grand Total</span>
                  <span className="font-headline-xl font-bold text-primary">৳ {order.total}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

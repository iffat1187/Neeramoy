import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { Button } from '../components/common/Button';

export const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(err.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return <div className="p-8 text-center">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="w-full bg-surface-container-lowest rounded-2xl p-space-2xl flex flex-col items-center justify-center border border-outline-variant/30">
        <h2 className="font-headline-md text-on-surface mb-4">{error || 'Order Not Found'}</h2>
        <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
      </div>
    );
  }

  const handleCancelOrder = async () => {
     if (window.confirm("Are you sure you want to cancel this order?")) {
        try {
           setCancelling(true);
           const updated = await orderService.cancelOrder(order.id);
           setOrder(updated);
        } catch (err) {
           alert(err.message || 'Failed to cancel order');
        } finally {
           setCancelling(false);
        }
     }
  };

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
    <div className="space-y-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate('/orders')} className="text-primary hover:underline text-body-sm font-bold flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Orders
          </button>
          <h1 className="font-headline-xl font-bold text-on-surface tracking-tight mb-1">Order Details</h1>
          <p className="text-body-md text-on-surface-variant">Order #{order.orderId || order.id} • Placed on {formatDate(order.createdAt || order.date)}</p>
        </div>
        <span className={`px-4 py-1.5 rounded-full font-label-md font-bold border inline-block w-fit ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg mt-6">
        
        <div className="lg:col-span-7 space-y-space-lg">
          
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="bg-surface-container-low px-space-lg py-space-md border-b border-outline-variant/30 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">local_shipping</span>
              <h3 className="font-headline-sm font-bold text-on-surface">Customer & Delivery Info</h3>
            </div>
            <div className="p-space-lg grid grid-cols-1 md:grid-cols-2 gap-space-lg">
              <div>
                <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Customer</p>
                <p className="font-label-md font-bold text-on-surface mb-0.5">{order.deliveryDetails?.fullName}</p>
                <p className="font-body-sm text-on-surface-variant">{order.deliveryDetails?.phone}</p>
              </div>
              <div>
                <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Delivery Method</p>
                <p className="font-label-md font-bold text-on-surface capitalize">{order.deliveryMethod || 'Standard'} Delivery</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Delivery Address</p>
                <p className="font-body-md text-on-surface">
                  {order.deliveryDetails?.address}, {order.deliveryDetails?.area}, {order.deliveryDetails?.city} {order.deliveryDetails?.postalCode}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="bg-surface-container-low px-space-lg py-space-md border-b border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">medication</span>
                <h3 className="font-headline-sm font-bold text-on-surface">Ordered Items ({order.items.length})</h3>
              </div>
            </div>
            <div className="p-space-lg">
              <div className="divide-y divide-outline-variant/20">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-space-md first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-space-md min-w-0">
                      <div className="w-16 h-16 bg-surface-container-low border border-outline-variant/30 rounded-lg p-1 shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-label-md font-bold text-on-surface truncate">{item.name}</h4>
                        {item.genericName && <p className="text-[11px] text-on-surface-variant truncate">{item.genericName}</p>}
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
          
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
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
                  <span className="inline-block bg-secondary-container/40 text-secondary-fixed-dim px-2 py-0.5 rounded font-bold text-[12px]">{order.paymentStatus || 'Pending'}</span>
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
                  <span className="font-price-md font-bold">৳ {order.deliveryFee || order.deliveryCharge || 0}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-space-md mt-space-md border-t border-outline-variant/30">
                <span className="font-headline-sm font-bold text-on-surface">Grand Total</span>
                <span className="font-headline-xl font-bold text-primary">৳ {order.total}</span>
              </div>
            </div>
          </div>
          
          {(order.status === 'Pending' || order.status === 'Confirmed' || order.status === 'Processing') && (
             <div className="bg-error-container/10 rounded-2xl border border-error/20 p-space-lg text-center">
                <p className="text-body-sm text-on-surface-variant mb-4">Need to cancel this order? You can only cancel before it is shipped.</p>
                <Button variant="outline" className="w-full text-error border-error hover:bg-error-container/20" onClick={handleCancelOrder} disabled={cancelling}>
                   {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </Button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};

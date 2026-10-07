const fs = require('fs');
const path = require('path');

// OrdersPage.jsx
const ordersPageContent = `import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { Button } from '../components/common/Button';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const { orders } = useOrder();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-space-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline-xl font-bold text-on-surface tracking-tight">My Orders</h1>
          <p className="text-body-md text-on-surface-variant mt-1">View and track your recent orders.</p>
        </div>
        <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-label-sm font-bold">
          {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-2xl text-center mt-6">
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-space-md">
            <span className="material-symbols-outlined text-[40px] text-outline">receipt_long</span>
          </div>
          <h2 className="font-headline-md font-bold text-on-surface mb-2">No orders yet</h2>
          <p className="font-body-md text-on-surface-variant mb-space-lg">Looks like you haven't made any purchases yet.</p>
          <Button onClick={() => navigate('/')}>Start Shopping</Button>
        </div>
      ) : (
        <div className="space-y-space-md mt-6">
          {orders.map(order => (
            <div key={order.orderId || order.id} className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col md:flex-row md:items-stretch">
              
              <div className="flex-1 p-space-lg">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-outline-variant/30">
                  <div>
                    <p className="font-headline-sm font-bold text-primary">{order.orderId || order.id}</p>
                    <p className="text-body-sm text-on-surface-variant mt-0.5">Placed on {formatDate(order.createdAt || order.date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={\`px-3 py-1 rounded-full font-label-sm font-bold border \${getStatusColor(order.status)}\`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">local_shipping</span>
                    <span className="capitalize">{order.deliveryMethod || 'Standard'} Delivery</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-body-sm text-on-surface">
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">payments</span>
                    <span className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
                    <span className="text-outline-variant text-[12px] ml-1">({order.paymentStatus || 'Pending'})</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {order.items.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="w-14 h-14 rounded-lg bg-surface-container-low border border-outline-variant/30 p-1 shrink-0 relative group">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                      {item.quantity > 1 && (
                        <span className="absolute -top-1 -right-1 bg-surface-variant text-on-surface-variant text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-14 h-14 rounded-lg bg-surface-container-low border border-outline-variant/30 flex items-center justify-center shrink-0">
                      <span className="font-label-md font-bold text-on-surface-variant">+{order.items.length - 4}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-surface-container-low md:w-64 p-space-lg flex flex-col justify-center border-t md:border-t-0 md:border-l border-outline-variant/30">
                <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Order Total</p>
                <p className="font-headline-md font-bold text-on-surface mb-1">৳ {order.total}</p>
                <p className="text-body-sm text-on-surface-variant mb-space-md">{order.items.reduce((acc, i) => acc + i.quantity, 0)} Items</p>
                <Button variant="outline" className="w-full py-2.5 bg-surface-container-lowest" onClick={() => navigate(\`/orders/\${order.orderId || order.id}\`)}>
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
`;

const orderDetailsPageContent = `import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../context/OrderContext';
import { Button } from '../components/common/Button';

export const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, updateOrderStatus } = useOrder();

  const order = getOrder(orderId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!order) {
    return (
      <div className="w-full bg-surface-container-lowest rounded-2xl p-space-2xl flex flex-col items-center justify-center border border-outline-variant/30">
        <h2 className="font-headline-md text-on-surface mb-4">Order Not Found</h2>
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
    <div className="space-y-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button onClick={() => navigate('/orders')} className="text-primary hover:underline text-body-sm font-bold flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Orders
          </button>
          <h1 className="font-headline-xl font-bold text-on-surface tracking-tight mb-1">Order Details</h1>
          <p className="text-body-md text-on-surface-variant">Order #{order.orderId || order.id} • Placed on {formatDate(order.createdAt || order.date)}</p>
        </div>
        <span className={\`px-4 py-1.5 rounded-full font-label-md font-bold border inline-block w-fit \${getStatusColor(order.status)}\`}>
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
                <p className="font-label-md font-bold text-on-surface mb-0.5">{order.customer?.name || order.customerDetails?.name}</p>
                <p className="font-body-sm text-on-surface-variant">{order.customer?.phone || order.customerDetails?.phone}</p>
              </div>
              <div>
                <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Delivery Method</p>
                <p className="font-label-md font-bold text-on-surface capitalize">{order.deliveryMethod || 'Standard'} Delivery</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Delivery Address</p>
                <p className="font-body-md text-on-surface">
                  {order.customer?.address || order.deliveryDetails?.address}
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
                <Button variant="outline" className="w-full text-error border-error hover:bg-error-container/20" onClick={() => {
                   if (window.confirm("Are you sure you want to cancel this order?")) {
                      updateOrderStatus(order.id || order.orderId, 'Cancelled');
                   }
                }}>Cancel Order</Button>
             </div>
          )}

        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'OrdersPage.jsx'), ordersPageContent);
fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'OrderDetailsPage.jsx'), orderDetailsPageContent);
console.log('Done');

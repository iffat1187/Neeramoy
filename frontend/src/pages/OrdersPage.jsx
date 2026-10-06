import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOrder } from '../context/OrderContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const OrdersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn } = useAuth();
  const { orders } = useOrder();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auth Guard
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: location } });
    }
  }, [isLoggedIn, navigate, location]);

  if (!isLoggedIn) {
    return null;
  }

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
    <div className="w-full bg-background min-h-[80vh] pb-space-2xl">
      <div className="w-full bg-surface-container-low py-space-sm border-b border-outline-variant/20 mb-space-lg">
        <div className="max-w-7xl mx-auto px-margin-desktop">
          <nav className="flex items-center gap-2 text-label-md font-label-md text-on-surface-variant">
            <span className="hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/login')}>Account</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-bold">My Orders</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-margin-desktop">
        <div className="flex items-center justify-between mb-space-lg">
          <h1 className="font-headline-xl font-bold text-on-surface tracking-tight">My Orders</h1>
          <span className="bg-surface-container-high text-on-surface-variant px-3 py-1 rounded-full font-label-sm font-bold">
            {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-2xl text-center">
            <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-space-md">
              <span className="material-symbols-outlined text-[40px] text-outline">receipt_long</span>
            </div>
            <h2 className="font-headline-md font-bold text-on-surface mb-2">No orders yet</h2>
            <p className="font-body-md text-on-surface-variant mb-space-lg">Looks like you haven't made any purchases yet.</p>
            <Button onClick={() => navigate('/')}>Start Shopping</Button>
          </div>
        ) : (
          <div className="space-y-space-md">
            {orders.map(order => (
              <div key={order.orderId} className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden flex flex-col md:flex-row md:items-stretch">
                
                <div className="flex-1 p-space-lg">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-outline-variant/30">
                    <div>
                      <p className="font-headline-sm font-bold text-primary">{order.orderId}</p>
                      <p className="text-body-sm text-on-surface-variant mt-0.5">Placed on {formatDate(order.date || order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full font-label-sm font-bold border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-1.5 text-body-sm text-on-surface">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">local_shipping</span>
                      <span className="capitalize">{order.deliveryMethod} Delivery</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-body-sm text-on-surface">
                      <span className="material-symbols-outlined text-[16px] text-on-surface-variant">payments</span>
                      <span className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}</span>
                      <span className="text-outline-variant text-[12px] ml-1">(Pending)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div key={idx} className="w-14 h-14 rounded-lg bg-surface-container-low border border-outline-variant/30 p-1 shrink-0 relative group">
                        <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
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
                  <Button variant="outline" className="w-full py-2.5 bg-surface-container-lowest" onClick={() => navigate(`/orders/${order.orderId}`)}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

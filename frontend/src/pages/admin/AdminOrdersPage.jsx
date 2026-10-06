import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const AdminOrdersPage = () => {
  const { orders, updateOrderStatus } = useOrder();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };

  return (
    <div className="space-y-space-md h-full flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="font-headline-md font-bold text-on-surface">অর্ডার ব্যবস্থাপনা ও লাইভ ডিসপ্যাচ কন্ট্রোল</h1>
          <p className="text-on-surface-variant text-body-sm">Order Management & Pharmacist Dispensing Queue • Real-time cold-chain & express routing</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-surface-container-high text-on-surface px-4 py-2 rounded-xl flex items-center gap-2 text-label-md font-bold hover:bg-surface-container-highest">
            <span className="material-symbols-outlined text-[18px]">download</span> Export (CSV)
          </button>
          <button className="bg-primary text-on-primary px-4 py-2 rounded-xl flex items-center gap-2 text-label-md font-bold hover:opacity-90">
            <span className="material-symbols-outlined text-[18px]">add</span> নতুন অনলাইন অর্ডার তৈরি
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/30">
        <button className="px-4 py-2 bg-surface-container text-on-surface rounded-full text-label-sm font-bold whitespace-nowrap">সকল অর্ডার (All) <span className="text-on-surface-variant ml-1">{orders.length}</span></button>
        <button className="px-4 py-2 bg-primary text-on-primary rounded-full text-label-sm font-bold whitespace-nowrap">নতুন অপেক্ষমান (Pending) <span className="opacity-80 ml-1">{orders.filter(o => o.status === 'Pending').length}</span></button>
        <button className="px-4 py-2 bg-surface-container text-on-surface rounded-full text-label-sm font-bold whitespace-nowrap">অনুমোদিত (Confirmed) <span className="text-on-surface-variant ml-1">{orders.filter(o => o.status === 'Confirmed').length}</span></button>
        <button className="px-4 py-2 bg-surface-container text-on-surface rounded-full text-label-sm font-bold whitespace-nowrap">প্যাকিং ও প্রস্তুতি <span className="text-on-surface-variant ml-1">{orders.filter(o => o.status === 'Processing').length}</span></button>
        <button className="px-4 py-2 bg-surface-container text-on-surface rounded-full text-label-sm font-bold whitespace-nowrap">ডেলিভারির পথে (Shipped) <span className="text-on-surface-variant ml-1">{orders.filter(o => o.status === 'Shipped').length}</span></button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline-variant text-[20px]">search</span>
          <input type="text" placeholder="Search by Order ID, Customer Phone..." className="w-full pl-10 pr-4 py-2 rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:outline-none focus:border-primary text-body-sm" />
        </div>
        <select className="border border-outline-variant/50 rounded-xl px-3 py-2 bg-surface-container-lowest text-body-sm">
          <option>All Payment Methods</option>
          <option>bKash</option>
          <option>Cash on Delivery</option>
        </select>
        <select className="border border-outline-variant/50 rounded-xl px-3 py-2 bg-surface-container-lowest text-body-sm">
          <option>All Statuses</option>
          <option>Pending</option>
          <option>Confirmed</option>
        </select>
      </div>
      
      <div className="flex gap-4 flex-1 min-h-[500px]">
        {/* Left pane - Table */}
        <div className="flex-1 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-auto flex flex-col">
          <table className="w-full text-left border-collapse text-body-sm">
            <thead className="text-on-surface-variant font-bold text-[11px] uppercase tracking-wider bg-surface-container-low sticky top-0 z-10">
              <tr>
                <th className="p-4 border-b border-outline-variant/30">অর্ডার আইডি ও সময়</th>
                <th className="p-4 border-b border-outline-variant/30">কাস্টমার ও ঠিকানা</th>
                <th className="p-4 border-b border-outline-variant/30">ওষুধের তালিকা</th>
                <th className="p-4 border-b border-outline-variant/30">বিল ও পেমেন্ট</th>
                <th className="p-4 border-b border-outline-variant/30">স্ট্যাটাস</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {orders.map(order => {
                const isSelected = selectedOrder && (selectedOrder.id === order.id || selectedOrder.orderId === order.orderId);
                return (
                <tr key={order.id || order.orderId} className={`cursor-pointer transition-colors ${isSelected ? 'bg-primary-container/10 border-l-4 border-primary' : 'hover:bg-surface-container border-l-4 border-transparent'}`} onClick={() => setSelectedOrder(order)}>
                  <td className="p-4 align-top">
                    <div className="font-bold text-primary text-label-md">#{order.id || order.orderId}</div>
                    <div className="text-[11px] text-on-surface-variant mt-1">{order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '12:30 PM'}</div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="font-bold text-on-surface">{order.shippingAddress?.fullName || 'Tanvir Hasan'}</div>
                    <div className="text-[11px] text-on-surface-variant mt-1 max-w-[150px] leading-tight flex items-start gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {order.shippingAddress?.address || 'House 42, Road 7/A, Dhanmondi'}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="line-clamp-2 max-w-[200px] leading-tight text-on-surface">{order.items?.map(i => `${i.name} (${i.quantity})`).join(', ') || 'Napa Extra, Sergel'}</div>
                    <Badge variant="primary" text="কোল্ড-চেইন এক্সপ্রেস" className="mt-2 inline-block" />
                  </td>
                  <td className="p-4 align-top">
                    <div className="font-price-md font-bold text-on-surface">৳{order.total || order.amount}</div>
                    <div className="text-[11px] font-bold text-success flex items-center gap-1 mt-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> bKash
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <Badge variant={order.status === 'Pending' ? 'warning' : order.status === 'Delivered' ? 'success' : 'primary'} text={order.status} />
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>

        {/* Right pane - Details */}
        {selectedOrder ? (
          <div className="w-[400px] bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex flex-col overflow-hidden shrink-0">
            <div className="p-space-md border-b border-outline-variant/30 flex justify-between items-start bg-surface-container-low/50">
              <div>
                <h2 className="font-headline-md font-bold text-primary">#{selectedOrder.id || selectedOrder.orderId}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-body-sm text-on-surface-variant">24 Nov 2026, 12:30 PM</span>
                  <Badge variant="success" text="Paid (bKash)" />
                </div>
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-primary-container rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">print</span></button>
                <button onClick={() => setSelectedOrder(null)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg transition-colors"><span className="material-symbols-outlined text-[20px]">close</span></button>
              </div>
            </div>
            
            <div className="flex-1 overflow-auto p-space-md space-y-space-md">
              
              {/* Status Update Card */}
              <div className="bg-primary-container/10 border border-primary/20 rounded-xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-bold text-label-sm text-on-surface">Update Order Status</span>
                  <Badge variant={selectedOrder.status === 'Pending' ? 'warning' : 'primary'} text={selectedOrder.status} />
                </div>
                <select 
                  className="w-full p-2.5 rounded-lg border border-primary/30 bg-surface-container-lowest text-on-surface font-bold text-body-sm focus:border-primary focus:outline-none"
                  value={selectedOrder.status}
                  onChange={(e) => handleStatusChange(selectedOrder.id || selectedOrder.orderId, e.target.value)}
                >
                  <option value="Pending">Pending (অপেক্ষমান)</option>
                  <option value="Confirmed">Confirmed (অনুমোদিত)</option>
                  <option value="Processing">Processing (প্যাকিং চলছে)</option>
                  <option value="Shipped">Shipped (ডেলিভারির পথে)</option>
                  <option value="Delivered">Delivered (ডেলিভারি সম্পন্ন)</option>
                  <option value="Cancelled">Cancelled (বাতিল)</option>
                </select>
                <button className="w-full mt-3 bg-primary text-on-primary py-2 rounded-lg font-bold text-label-sm flex items-center justify-center gap-2">
                  Update Status <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-bold text-label-sm text-on-surface-variant uppercase mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">person</span> Customer Details
                </h3>
                <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/30 text-body-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Name:</span>
                    <span className="font-bold text-on-surface">{selectedOrder.shippingAddress?.fullName || 'Tanvir Hasan'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Phone:</span>
                    <span className="font-bold text-on-surface">{selectedOrder.shippingAddress?.phone || '+880 1712-345678'}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block mb-1">Delivery Address:</span>
                    <span className="text-on-surface">{selectedOrder.shippingAddress?.address || 'House 42, Road 7/A'}, {selectedOrder.shippingAddress?.area || 'Dhanmondi'}, {selectedOrder.shippingAddress?.city || 'Dhaka'}</span>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-bold text-label-sm text-on-surface-variant uppercase mb-2 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">medication</span> Order Items
                </h3>
                <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 divide-y divide-outline-variant/20">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 flex justify-between items-start text-body-sm">
                      <div className="pr-2">
                        <div className="font-bold text-on-surface">{item.name}</div>
                        <div className="text-[10px] text-on-surface-variant mt-0.5">{item.brand || 'Medicine'}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-price-sm font-bold">৳{item.price * item.quantity}</div>
                        <div className="text-[10px] text-on-surface-variant">৳{item.price} x {item.quantity}</div>
                      </div>
                    </div>
                  ))}
                  {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                    <div className="p-4 text-center text-on-surface-variant text-body-sm">No items found</div>
                  )}
                </div>
              </div>
              
              {/* Totals */}
              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 space-y-2 text-body-sm">
                <div className="flex justify-between text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>৳{selectedOrder.total || selectedOrder.amount}</span>
                </div>
                <div className="flex justify-between text-on-surface-variant">
                  <span>Delivery Fee</span>
                  <span>৳60</span>
                </div>
                <div className="flex justify-between font-bold text-label-lg text-primary pt-2 border-t border-outline-variant/30">
                  <span>Grand Total</span>
                  <span className="font-price-lg">৳{(selectedOrder.total || selectedOrder.amount || 0) + 60}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-[400px] bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex items-center justify-center text-on-surface-variant flex-col shrink-0">
            <span className="material-symbols-outlined text-[48px] opacity-20 mb-4">receipt_long</span>
            <p className="font-bold">Select an order to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../../services/orderService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { MOCK_MEDICINES } from '../../mockData/medicines';

export const AdminOrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [successMsg, setSuccessMsg] = useState('');
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Customer requested');
  const [customReason, setCustomReason] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAdminOrderById(orderId);
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
      <div className="p-space-lg flex flex-col items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-[48px] text-error mb-4">error</span>
        <h2 className="font-headline-md font-bold text-on-surface mb-4">Order Not Found</h2>
        <button 
          onClick={() => navigate('/admin/orders')}
          className="px-4 py-2 bg-primary text-on-primary rounded-lg font-bold"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const handleStatusChange = async (newStatus) => {
    try {
      await orderService.updateOrderStatusByAdmin(order.id, newStatus);
      setSuccessMsg(`Order status updated to ${newStatus}`);
      fetchOrder();
    } catch (err) {
      alert(err.message || 'Failed to update status');
    }
    setStatusMenuOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleApproveOrder = async () => {
    try {
      await orderService.updateOrderStatusByAdmin(order.id, 'Confirmed');
      setApproveModalOpen(false);
      setSuccessMsg('Order approved successfully.');
      fetchOrder();
    } catch (err) {
      alert(err.message || 'Failed to approve order');
    }
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleCancelOrder = async () => {
    const finalReason = cancelReason === 'Other' ? customReason : cancelReason;
    if (!finalReason.trim()) {
      alert("Please provide a cancellation reason.");
      return;
    }
    try {
      await orderService.updateOrderStatusByAdmin(order.id, 'Cancelled');
      setCancelModalOpen(false);
      setSuccessMsg('Order cancelled successfully.');
      fetchOrder();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    }
    setCancelReason('Customer requested');
    setCustomReason('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      case 'Confirmed': return <Badge variant="primary">Confirmed</Badge>;
      case 'Processing': return <Badge variant="secondary">Processing</Badge>;
      case 'Shipped': return <Badge variant="tertiary">Shipped</Badge>;
      case 'Delivered': return <Badge variant="success">Delivered</Badge>;
      case 'Cancelled': return <Badge variant="error">Cancelled</Badge>;
      default: return <Badge variant="surface">{status}</Badge>;
    }
  };

  const statusOptions = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const isCancellable = ['Pending', 'Confirmed', 'Processing'].includes(order.status);

  return (
    <div className="p-space-lg flex flex-col gap-space-lg max-w-5xl mx-auto">
      {successMsg && (
        <div className="bg-primary-container text-on-primary-container p-3 rounded-lg font-bold flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined">check_circle</span>
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin/orders')}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="flex flex-col">
            <h1 className="font-headline-md font-bold text-on-surface flex items-center gap-3">
              Order {order.id}
              {getStatusBadge(order.status)}
            </h1>
            <span className="text-body-sm text-on-surface-variant">Placed on {new Date(order.createdAt).toLocaleString('en-GB')}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {order.status === 'Pending' && (
            <button 
              onClick={() => setApproveModalOpen(true)}
              className="bg-success text-on-success px-4 py-2 rounded-lg font-label-md font-bold hover:opacity-90 transition-colors"
            >
              Approve Order
            </button>
          )}
          {isCancellable && (
            <button 
              onClick={() => setCancelModalOpen(true)}
              className="bg-error-container text-on-error-container px-4 py-2 rounded-lg font-label-md font-bold hover:bg-error/20 transition-colors"
            >
              Cancel Order
            </button>
          )}

          <div className="relative">
            <button 
              onClick={() => setStatusMenuOpen(!statusMenuOpen)}
              className="flex items-center gap-2 bg-surface-container border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md font-bold hover:bg-surface-container-high transition-colors"
            >
              Update Status
              <span className="material-symbols-outlined text-[20px]">{statusMenuOpen ? 'expand_less' : 'expand_more'}</span>
            </button>
            
            {statusMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-surface border border-outline-variant/30 rounded-xl shadow-lg overflow-hidden z-20">
                {statusOptions.map(s => (
                  <button 
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`w-full text-left px-4 py-3 text-body-sm transition-colors hover:bg-surface-container-low ${order.status === s ? 'font-bold bg-surface-container-lowest text-primary' : 'text-on-surface'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {order.status === 'Cancelled' && order.cancellationReason && (
        <div className="bg-error-container/50 border border-error/20 text-on-error-container p-4 rounded-xl flex items-start gap-3">
          <span className="material-symbols-outlined text-error">info</span>
          <div>
            <h4 className="font-bold text-error">Order Cancelled</h4>
            <p className="text-body-sm mt-1">Reason: {order.cancellationReason}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Customer & Delivery Details */}
        <Card className="p-space-md md:col-span-1 flex flex-col gap-space-md">
          <div className="flex flex-col gap-2">
            <h3 className="font-label-md font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
              <span className="material-symbols-outlined text-[18px]">person</span> Customer Details
            </h3>
            <span className="text-body-md text-on-surface font-semibold">{order.deliveryDetails?.fullName || order.customer?.name || 'Guest User'}</span>
            <span className="text-body-sm text-on-surface-variant">{order.deliveryDetails?.phone || order.customer?.phone || 'No phone provided'}</span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-label-md font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span> Delivery Address
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              {order.deliveryDetails?.address || order.customer?.address || 'No address provided'}
            </p>
            <span className="mt-1 text-label-sm font-bold text-primary px-2 py-1 bg-primary/10 rounded inline-block w-max">
              {order.deliveryMethod || 'Standard Delivery'}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-label-md font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
              <span className="material-symbols-outlined text-[18px]">payments</span> Payment Info
            </h3>
            <div className="flex justify-between items-center text-body-sm">
              <span className="text-on-surface-variant">Method:</span>
              <span className="font-medium text-on-surface">{order.paymentMethod || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center text-body-sm">
              <span className="text-on-surface-variant">Status:</span>
              <Badge variant={order.paymentStatus === 'Paid' ? 'success' : 'warning'}>{order.paymentStatus || 'Pending'}</Badge>
            </div>
          </div>
        </Card>

        {/* Order Items */}
        <Card className="p-0 md:col-span-2 overflow-hidden flex flex-col">
          <div className="p-space-md border-b border-outline-variant/30 bg-surface-container-lowest">
            <h3 className="font-label-lg font-bold text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined">shopping_basket</span> Order Items
            </h3>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-4 border-b border-outline-variant/20">Item</th>
                  <th className="p-4 border-b border-outline-variant/20 text-center">Qty</th>
                  <th className="p-4 border-b border-outline-variant/20 text-right">Price</th>
                  <th className="p-4 border-b border-outline-variant/20 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items?.map((item, idx) => {
                  const resolvedMed = MOCK_MEDICINES.find(m => m.id === item.id);
                  const displayImage = resolvedMed?.image || item.image || 'https://via.placeholder.com/150';
                  const displayGeneric = resolvedMed?.genericName || '';
                  
                  return (
                    <tr key={idx} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-surface-container-highest/20 p-1 shrink-0">
                            <img src={displayImage} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-on-surface text-body-sm">{item.name}</span>
                            {displayGeneric && <span className="text-[10px] text-on-surface-variant">{displayGeneric}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-center font-bold text-on-surface">{item.quantity}</td>
                      <td className="p-4 text-right text-on-surface-variant text-body-sm">৳{item.price}</td>
                      <td className="p-4 text-right font-price-sm font-bold text-primary">৳{(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-space-md bg-surface-container-lowest border-t border-outline-variant/30 flex justify-end">
            <div className="w-full max-w-sm flex flex-col gap-2">
              <div className="flex justify-between text-body-sm text-on-surface-variant">
                <span>Subtotal</span>
                <span className="font-medium">৳{order.subtotal?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-body-sm text-on-surface-variant">
                <span>Delivery Fee</span>
                <span className="font-medium">৳{order.deliveryFee?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-body-sm text-error">
                <span>Discount</span>
                <span className="font-medium">- ৳{order.discount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-label-lg font-bold text-on-surface pt-2 border-t border-outline-variant/30 mt-1">
                <span>Grand Total</span>
                <span className="font-price-md text-primary">৳{order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Cancellation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/50 backdrop-blur-sm">
          <div className="bg-surface rounded-xl shadow-lg border border-outline-variant/30 w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-space-md border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-sm font-bold text-on-surface text-error flex items-center gap-2">
                <span className="material-symbols-outlined">cancel</span> Cancel Order
              </h2>
              <button onClick={() => setCancelModalOpen(false)} className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-space-md flex flex-col gap-4">
              <p className="text-body-md text-on-surface-variant">
                Are you sure you want to cancel order <strong className="text-on-surface">{order.id}</strong>? This action cannot be undone.
              </p>
              <div className="flex flex-col gap-2">
                <label className="font-label-sm font-bold text-on-surface">Cancellation Reason</label>
                <select 
                  className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-error"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                >
                  <option value="Customer requested">Customer requested</option>
                  <option value="Out of stock">Out of stock</option>
                  <option value="Payment issue">Payment issue</option>
                  <option value="Delivery issue">Delivery issue</option>
                  <option value="Other">Other</option>
                </select>
                {cancelReason === 'Other' && (
                  <input 
                    type="text" 
                    placeholder="Enter reason..." 
                    className="mt-2 w-full bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary text-body-sm"
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                  />
                )}
              </div>
            </div>
            <div className="p-space-md border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-low">
              <button onClick={() => setCancelModalOpen(false)} className="px-4 py-2 rounded-lg font-label-md font-bold text-on-surface hover:bg-surface-container-high transition-colors">Abort</button>
              <button onClick={handleCancelOrder} className="px-4 py-2 rounded-lg font-label-md font-bold bg-error text-on-error hover:bg-error/90 transition-colors">Confirm Cancellation</button>
            </div>
          </div>
        </div>
      )}

      {/* Approval Modal */}
      {approveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/50 backdrop-blur-sm">
          <div className="bg-surface rounded-xl shadow-lg border border-outline-variant/30 w-full max-w-sm overflow-hidden flex flex-col animate-scale-in">
            <div className="p-space-md border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-sm font-bold text-on-surface">Approve Order</h2>
              <button onClick={() => setApproveModalOpen(false)} className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-space-md">
              <p className="text-body-md text-on-surface">Are you sure you want to approve this order?</p>
              <div className="mt-4 p-3 bg-surface-container-lowest rounded-lg border border-outline-variant/30 flex flex-col gap-1 text-body-sm">
                <div><span className="font-bold">Order:</span> {order.id}</div>
                <div><span className="font-bold">Total:</span> ৳{order.total?.toLocaleString()}</div>
              </div>
            </div>
            <div className="p-space-md border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-low">
              <button onClick={() => setApproveModalOpen(false)} className="px-4 py-2 rounded-lg font-label-md font-bold text-on-surface hover:bg-surface-container-high transition-colors">Cancel</button>
              <button onClick={handleApproveOrder} className="px-4 py-2 rounded-lg font-label-md font-bold bg-success text-on-success hover:opacity-90 transition-colors">Confirm Approval</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

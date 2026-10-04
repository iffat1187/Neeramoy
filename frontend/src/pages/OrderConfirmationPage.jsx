import React, { useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../components/common/Button';

export const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!orderDetails) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full bg-background min-h-[80vh] flex flex-col items-center justify-center py-space-2xl px-margin-desktop">
      <div className="bg-surface-container-lowest rounded-2xl shadow-lg border border-outline-variant/30 p-space-xl max-w-2xl w-full text-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-space-lg">
          <span className="material-symbols-outlined text-[40px] text-primary">check_circle</span>
        </div>
        
        <h1 className="font-headline-xl font-bold text-on-surface mb-2">Order Confirmed!</h1>
        <p className="font-body-md text-on-surface-variant mb-space-xl">
          Thank you for shopping with Neeramoy. Your order <span className="font-bold text-on-surface">#{orderDetails.orderId}</span> has been placed successfully.
        </p>

        <div className="bg-surface-container-low rounded-xl p-space-md text-left space-y-4 mb-space-xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Payment Method</p>
              <p className="font-label-md font-bold text-on-surface capitalize">{orderDetails.paymentMethod === 'cod' ? 'Cash on Delivery' : orderDetails.paymentMethod}</p>
            </div>
            <div>
              <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Total Amount</p>
              <p className="font-label-md font-bold text-primary">৳ {orderDetails.total}</p>
            </div>
            <div className="col-span-2 border-t border-outline-variant/30 pt-4">
              <p className="text-[11px] text-outline uppercase tracking-wider mb-1">Delivery Address</p>
              <p className="font-body-sm text-on-surface">
                <span className="font-bold">{orderDetails.deliveryDetails.fullName}</span><br />
                {orderDetails.deliveryDetails.phone}<br />
                {orderDetails.deliveryDetails.address}, {orderDetails.deliveryDetails.area}, {orderDetails.deliveryDetails.city} {orderDetails.deliveryDetails.postalCode}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-space-sm">
          <Button variant="outline" onClick={() => navigate('/admin/orders')} className="w-full sm:w-auto">
            View as Admin (Mock)
          </Button>
          <Button onClick={() => navigate('/')} className="w-full sm:w-auto px-8">
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

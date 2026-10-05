import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const { orders } = useOrder();

  const activeOrdersCount = orders ? orders.filter(o => !['Delivered', 'Cancelled'].includes(o.status)).length : 0;
  const recentOrders = orders ? [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 2) : [];

  return (
    <div className="flex flex-col gap-space-xl">
      {/* Mobile Profile Header (Hidden on Desktop) */}
      <div className="md:hidden bg-surface-container-low p-space-md rounded-2xl flex items-center justify-between border border-outline-variant/30">
        <div className="flex items-center gap-space-md">
          <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-md font-bold relative">
            {user?.name?.charAt(0) || 'U'}
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-secondary text-on-secondary rounded-full flex items-center justify-center border border-surface-container-low">
              <span className="material-symbols-outlined text-[12px]">verified</span>
            </div>
          </div>
          <div>
            <h2 className="font-headline-sm font-bold text-on-surface">{user?.name}</h2>
            <p className="font-body-sm text-on-surface-variant">{user?.phone}</p>
            <div className="mt-1 flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-secondary text-[14px]">shield</span>
              <span className="font-label-sm text-secondary font-bold">Verified Member</span>
            </div>
          </div>
        </div>
        <Link to="/account/profile/edit" className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high">
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm md:gap-space-md">
        <div className="bg-surface-container-low p-space-md rounded-2xl border border-outline-variant/30 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Orders</span>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-headline-xl font-bold text-on-surface">{orders?.length || 0}</span>
            {activeOrdersCount > 0 && <Badge variant="success" text={`${activeOrdersCount} Active`} />}
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-2xl border border-outline-variant/30 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Prescriptions</span>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">prescriptions</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-headline-xl font-bold text-on-surface">3</span>
            <Badge variant="warning" text="1 Pending" />
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-2xl border border-outline-variant/30 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Health Cash</span>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-headline-lg font-bold text-tertiary">৳240</span>
            <span className="font-label-sm text-on-surface-variant">Instant off</span>
          </div>
        </div>

        <div className="bg-surface-container-low p-space-md rounded-2xl border border-outline-variant/30 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider">Saved Addr</span>
            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">location_on</span>
            </div>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-headline-xl font-bold text-on-surface">2</span>
            <span className="font-label-sm text-on-surface-variant">Home, Work</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="flex justify-between items-end mb-space-sm">
          <h3 className="font-headline-md font-bold text-on-surface">Quick Actions</h3>
          <span className="font-label-sm text-on-surface-variant">Tap to launch</span>
        </div>
        <div className="grid grid-cols-2 gap-space-sm md:gap-space-md">
          <div className="bg-surface-container-low p-space-md rounded-2xl border border-outline-variant/30 cursor-pointer hover:bg-surface-container-high transition-colors">
            <div className="flex justify-between items-start mb-space-md">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined">near_me</span>
              </div>
              <Badge variant="success" text="LIVE" />
            </div>
            <h4 className="font-label-lg font-bold text-on-surface">Track Order</h4>
            <p className="font-body-sm text-primary font-bold">#NRM-94821</p>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-2xl border border-outline-variant/30 cursor-pointer hover:bg-surface-container-high transition-colors">
            <div className="flex justify-between items-start mb-space-md">
              <div className="w-10 h-10 rounded-full bg-surface-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">upload_file</span>
              </div>
              <div className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded text-[10px] font-bold">10 min</div>
            </div>
            <h4 className="font-label-lg font-bold text-on-surface">Upload Rx</h4>
            <p className="font-body-sm text-on-surface-variant">Fast pharmacist review</p>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-2xl border border-outline-variant/30 cursor-pointer hover:bg-surface-container-high transition-colors">
            <div className="flex justify-between items-start mb-space-md">
              <div className="w-10 h-10 rounded-full bg-surface-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
            </div>
            <h4 className="font-label-lg font-bold text-on-surface">My Rx Slips</h4>
            <p className="font-body-sm text-on-surface-variant">3 approved digital copies</p>
          </div>

          <div className="bg-surface-container-low p-space-md rounded-2xl border border-outline-variant/30 cursor-pointer hover:bg-surface-container-high transition-colors">
            <div className="flex justify-between items-start mb-space-md">
              <div className="w-10 h-10 rounded-full bg-surface-container text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">location_on</span>
              </div>
            </div>
            <h4 className="font-label-lg font-bold text-on-surface">Addresses</h4>
            <p className="font-body-sm text-on-surface-variant">Manage 2 drop locations</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex justify-between items-end mb-space-sm">
          <h3 className="font-headline-md font-bold text-on-surface">Recent Orders</h3>
          <Link to="/orders" className="font-label-sm text-primary font-bold hover:underline flex items-center gap-1">
            View All ({orders?.length || 0}) <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </Link>
        </div>
        <div className="space-y-space-md">
          {recentOrders.length > 0 ? recentOrders.map(order => (
            <div key={order.id} className="bg-surface-container-low rounded-2xl p-space-md border border-outline-variant/30">
              <div className="flex justify-between items-start mb-space-md">
                <div>
                  <h4 className="font-label-lg font-bold text-on-surface">#{order.id}</h4>
                  <p className="font-body-sm text-on-surface-variant">{order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-price-md font-bold text-primary">৳{order.total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="bg-primary-container/10 rounded-xl p-space-sm flex items-start gap-space-sm mb-space-md">
                <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">ac_unit</span>
                <div>
                  <p className="font-label-sm font-bold text-primary">In Packaging • Cold-Chain Buffer</p>
                  <p className="font-body-sm text-on-surface-variant text-[12px]">Medicines preserved at 2°C - 8°C in transit box</p>
                </div>
              </div>

              <div className="flex items-center gap-space-sm mb-space-md text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px]">medication</span>
                <span className="truncate">{order.items?.map(i => i.name).join(', ')} ({order.items?.length || 0} items)</span>
                <span className="bg-surface-container-high px-2 py-0.5 rounded text-[10px] font-bold shrink-0">{order.paymentMethod || 'bKash Paid'}</span>
              </div>

              <div className="flex gap-space-sm">
                <Button variant="primary" className="flex-1 bg-secondary text-on-secondary hover:bg-secondary-fixed">
                  <span className="material-symbols-outlined text-[18px]">my_location</span> Track Order
                </Button>
                <Button variant="secondary" className="flex-1">
                  <span className="material-symbols-outlined text-[18px]">receipt</span> Invoice
                </Button>
              </div>
            </div>
          )) : (
            <div className="bg-surface-container-low rounded-2xl p-space-xl border border-outline-variant/30 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-container mx-auto flex items-center justify-center text-outline mb-space-md">
                <span className="material-symbols-outlined text-[32px]">shopping_bag</span>
              </div>
              <h4 className="font-headline-sm font-bold text-on-surface mb-space-xs">No orders yet</h4>
              <p className="font-body-sm text-on-surface-variant mb-space-md">When you place an order, it will appear here.</p>
              <Link to="/search">
                <Button variant="primary">Start Shopping</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Care & Account Mobile Links */}
      <div className="md:hidden">
        <h3 className="font-headline-md font-bold text-on-surface mb-space-sm">Care & Account</h3>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl overflow-hidden divide-y divide-outline-variant/20">
          <Link to="/prescriptions" className="flex items-center gap-space-md p-space-md hover:bg-surface-container-low transition-colors">
            <div className="w-10 h-10 rounded-full bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">prescriptions</span>
            </div>
            <div className="flex-1">
              <h4 className="font-label-lg font-bold text-on-surface">Prescription History</h4>
              <p className="font-body-sm text-on-surface-variant text-[12px]">3 slips saved • 1 pending check</p>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </Link>
          
          <div className="flex items-center gap-space-md p-space-md hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-surface-container text-tertiary flex items-center justify-center">
              <span className="material-symbols-outlined">alarm</span>
            </div>
            <div className="flex-1">
              <h4 className="font-label-lg font-bold text-on-surface">Chronic Refill Reminders</h4>
              <p className="font-body-sm text-tertiary text-[12px] font-bold">Next: Monas 10mg in 6 days</p>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </div>

          <div className="flex items-center gap-space-md p-space-md hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-surface-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined">notifications</span>
            </div>
            <div className="flex-1">
              <h4 className="font-label-lg font-bold text-on-surface">Notifications</h4>
              <p className="font-body-sm text-on-surface-variant text-[12px]">SMS & WhatsApp updates on</p>
            </div>
            <span className="material-symbols-outlined text-outline">chevron_right</span>
          </div>

          <div className="flex items-center gap-space-md p-space-md hover:bg-surface-container-low transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined">support_agent</span>
            </div>
            <div className="flex-1">
              <h4 className="font-label-lg font-bold text-on-surface">Emergency Pharmacist Hotline</h4>
              <p className="font-body-sm text-primary text-[12px]">Direct call 16263 (24/7 Available)</p>
            </div>
            <span className="material-symbols-outlined text-primary">call</span>
          </div>

          <button onClick={logout} className="w-full flex items-center gap-space-md p-space-md hover:bg-error-container/10 transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-error-container/50 text-error flex items-center justify-center">
              <span className="material-symbols-outlined">logout</span>
            </div>
            <div className="flex-1">
              <h4 className="font-label-lg font-bold text-error">Sign Out</h4>
              <p className="font-body-sm text-error/80 text-[12px]">End active session on this device</p>
            </div>
            <span className="material-symbols-outlined text-error">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../../components/common/Pagination';

export const AdminOrdersPage = () => {
  const { orders } = useOrder();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPayment, setFilterPayment] = useState('All');

  const filteredOrders = orders.filter(o => {
    const q = searchQuery.toLowerCase();
    const matchSearch = o.id.toLowerCase().includes(q) || (o.customer?.phone && o.customer.phone.includes(q)) || (o.customer?.name && o.customer.name.toLowerCase().includes(q));
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    const matchPayment = filterPayment === 'All' || o.paymentMethod === filterPayment;
    return matchSearch && matchStatus && matchPayment;
  }).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  const { currentPage, totalPages, totalItems, paginatedItems, goToPage, pageSize } = usePagination(filteredOrders, 20);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    goToPage(1);
  };
  const handleFilterStatus = (s) => {
    setFilterStatus(s);
    goToPage(1);
  };
  const handleFilterPayment = (e) => {
    setFilterPayment(e.target.value);
    goToPage(1);
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

  return (
    <div className="space-y-space-md h-full flex flex-col p-space-lg">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h1 className="font-headline-md font-bold text-on-surface">Order Management</h1>
          <p className="text-on-surface-variant text-body-sm">View and manage all customer orders.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/30">
        {['All', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
          <button 
            key={s}
            onClick={() => handleFilterStatus(s)}
            className={`px-4 py-2 rounded-full text-label-sm font-bold whitespace-nowrap transition-colors ${filterStatus === s ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}`}
          >
            {s} <span className="opacity-80 ml-1">{s === 'All' ? orders.length : orders.filter(o => o.status === s).length}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline-variant text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Search by Order ID, Customer Name or Phone..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:outline-none focus:border-primary text-body-sm text-on-surface"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <select 
          className="border border-outline-variant/50 rounded-xl px-3 py-2 bg-surface-container-lowest text-body-sm text-on-surface focus:outline-none focus:border-primary"
          value={filterPayment}
          onChange={handleFilterPayment}
        >
          <option value="All">All Payment Methods</option>
          <option value="bKash">bKash</option>
          <option value="Cash on Delivery">Cash on Delivery</option>
        </select>
      </div>

      <div className="flex-1 overflow-auto bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low text-label-sm font-bold text-on-surface-variant sticky top-0 z-10">
            <tr>
              <th className="p-4 border-b border-outline-variant/30">Order ID & Date</th>
              <th className="p-4 border-b border-outline-variant/30">Customer & Location</th>
              <th className="p-4 border-b border-outline-variant/30">Items</th>
              <th className="p-4 border-b border-outline-variant/30">Total Value</th>
              <th className="p-4 border-b border-outline-variant/30">Status</th>
              <th className="p-4 border-b border-outline-variant/30 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map(order => (
              <tr key={order.id} className="border-b border-outline-variant/20 hover:bg-surface-container transition-colors">
                <td className="p-4">
                  <div className="font-bold text-on-surface">{order.id}</div>
                  <div className="text-[10px] text-on-surface-variant">{new Date(order.createdAt).toLocaleString('en-GB')}</div>
                </td>
                <td className="p-4">
                  <div className="text-body-sm text-on-surface font-medium">{order.customer?.name}</div>
                  <div className="text-[10px] text-on-surface-variant">{order.customer?.phone} • {order.customer?.address?.split(',')[0]}</div>
                </td>
                <td className="p-4 text-body-sm text-on-surface font-medium">{order.items?.length || 0} items</td>
                <td className="p-4 font-price-sm font-bold text-primary">৳{order.total?.toLocaleString()}</td>
                <td className="p-4">{getStatusBadge(order.status)}</td>
                <td className="p-4 text-right">
                  <Link to={`/admin/orders/${order.id}`} className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-label-sm font-bold hover:bg-surface-container-highest transition-colors inline-block">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-on-surface-variant">No orders found matching your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
        {paginatedItems.length > 0 && (
          <div className="px-space-md pb-space-md">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={goToPage} 
              totalItems={totalItems} 
              pageSize={pageSize} 
              itemName="orders"
            />
          </div>
        )}
      </div>
    </div>
  );
};

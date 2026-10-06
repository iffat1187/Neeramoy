const fs = require('fs');
const path = require('path');

// 1. Update App.jsx to include AdminOrderDetailsPage
const appPath = path.join(__dirname, 'src', 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

if (!appContent.includes('AdminOrderDetailsPage')) {
  appContent = appContent.replace(
    "import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';",
    "import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';\nimport { AdminOrderDetailsPage } from './pages/admin/AdminOrderDetailsPage';"
  );
  
  appContent = appContent.replace(
    "<Route path=\"orders\" element={<AdminOrdersPage />} />",
    "<Route path=\"orders\" element={<AdminOrdersPage />} />\n              <Route path=\"orders/:orderId\" element={<AdminOrderDetailsPage />} />"
  );
  fs.writeFileSync(appPath, appContent);
}

// 2. Update OrderContext.jsx to include some initial mock orders
const orderContextPath = path.join(__dirname, 'src', 'context', 'OrderContext.jsx');
let orderContextContent = fs.readFileSync(orderContextPath, 'utf8');

if (!orderContextContent.includes('ORD-5531')) {
  const initialOrdersStr = `[
    {
      id: 'ORD-5531',
      orderId: 'ORD-5531',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'Pending',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Express (3 Hours)',
      customer: {
        name: 'Sadia Islam',
        phone: '01922334455',
        address: 'House 12, Road 4, Banani, Dhaka'
      },
      items: [
        { id: '1', name: 'Napa Extra 500mg', price: 35, quantity: 2, image: 'https://via.placeholder.com/150' },
        { id: '2', name: 'Maxpro 20mg Tablet', price: 70, quantity: 1, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 140,
      deliveryFee: 60,
      discount: 0,
      total: 200
    },
    {
      id: 'ORD-5532',
      orderId: 'ORD-5532',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'Processing',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard (12-24 Hours)',
      customer: {
        name: 'Kamrul Hasan',
        phone: '01833445566',
        address: 'House 5, Road 2, Nasirabad, Chittagong'
      },
      items: [
        { id: '3', name: 'Sergel 20mg', price: 70, quantity: 3, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 210,
      deliveryFee: 40,
      discount: 10,
      total: 240
    }
  ]`;
  
  orderContextContent = orderContextContent.replace(
    'const [orders, setOrders] = useState([]);',
    `const [orders, setOrders] = useState(${initialOrdersStr});`
  );
  fs.writeFileSync(orderContextPath, orderContextContent);
}

// 3. Create AdminOrderDetailsPage.jsx
const adminOrderDetailsPath = path.join(__dirname, 'src', 'pages', 'admin', 'AdminOrderDetailsPage.jsx');
const adminOrderDetailsContent = `import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const AdminOrderDetailsPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { getOrder, updateOrderStatus } = useOrder();
  
  const [successMsg, setSuccessMsg] = useState('');
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  const order = getOrder(orderId);

  if (!order) {
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

  const handleStatusChange = (newStatus) => {
    updateOrderStatus(order.id, newStatus);
    setStatusMenuOpen(false);
    setSuccessMsg(\`Order status updated to \${newStatus}\`);
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
                  className={\`w-full text-left px-4 py-3 text-body-sm transition-colors hover:bg-surface-container-low \${order.status === s ? 'font-bold bg-surface-container-lowest text-primary' : 'text-on-surface'}\`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        {/* Customer & Delivery Details */}
        <Card className="p-space-md md:col-span-1 flex flex-col gap-space-md">
          <div className="flex flex-col gap-2">
            <h3 className="font-label-md font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
              <span className="material-symbols-outlined text-[18px]">person</span> Customer Details
            </h3>
            <span className="text-body-md text-on-surface font-semibold">{order.customer?.name || 'Guest User'}</span>
            <span className="text-body-sm text-on-surface-variant">{order.customer?.phone || 'No phone provided'}</span>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="font-label-md font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-2">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span> Delivery Address
            </h3>
            <p className="text-body-sm text-on-surface-variant">
              {order.customer?.address || 'No address provided'}
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
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-highest/20 p-1 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <span className="font-medium text-on-surface text-body-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-center font-bold text-on-surface">{item.quantity}</td>
                    <td className="p-4 text-right text-on-surface-variant text-body-sm">৳{item.price}</td>
                    <td className="p-4 text-right font-price-sm font-bold text-primary">৳{(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
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
    </div>
  );
};
`;
fs.writeFileSync(adminOrderDetailsPath, adminOrderDetailsContent);

// 4. Update AdminOrdersPage.jsx to use Link and standard state
const adminOrdersPath = path.join(__dirname, 'src', 'pages', 'admin', 'AdminOrdersPage.jsx');
const adminOrdersContent = `import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';

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
            onClick={() => setFilterStatus(s)}
            className={\`px-4 py-2 rounded-full text-label-sm font-bold whitespace-nowrap transition-colors \${filterStatus === s ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}\`}
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="border border-outline-variant/50 rounded-xl px-3 py-2 bg-surface-container-lowest text-body-sm text-on-surface focus:outline-none focus:border-primary"
          value={filterPayment}
          onChange={(e) => setFilterPayment(e.target.value)}
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
            {filteredOrders.map(order => (
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
                  <Link to={\`/admin/orders/\${order.id}\`} className="bg-surface-container-high text-on-surface px-4 py-2 rounded-lg text-label-sm font-bold hover:bg-surface-container-highest transition-colors inline-block">
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
      </div>
    </div>
  );
};
`;
fs.writeFileSync(adminOrdersPath, adminOrdersContent);

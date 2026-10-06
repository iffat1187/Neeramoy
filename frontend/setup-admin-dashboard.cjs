const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const servicesDir = path.join(srcDir, 'services');

if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

// 1. Write dashboardService.js
const dashboardServicePath = path.join(servicesDir, 'dashboardService.js');
const dashboardServiceContent = `/**
 * Dashboard Service
 * 
 * In a real backend environment, this service would export a single method like:
 * export const fetchDashboardData = async () => apiClient.get('/api/admin/dashboard');
 * 
 * For now, this acts as the aggregation layer for the frontend mock state to 
 * ensure the UI components don't know the difference between mock and real data.
 */

export const buildDashboardData = (orders, inventory, prescriptions, customers) => {
  // KPIs
  const today = new Date().toDateString();
  const todayOrdersList = orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const todayRevenue = todayOrdersList.reduce((sum, o) => sum + (o.total || 0), 0);
  const todayOrders = todayOrdersList.length;
  
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const pendingPrescriptionsCount = prescriptions.filter(p => p.status === 'Pending').length;
  const lowStockItems = inventory.filter(i => i.stock <= i.reorderLevel && i.stock > 0);
  const outOfStockItems = inventory.filter(i => i.stock === 0);
  const lowStockCount = lowStockItems.length + outOfStockItems.length;
  const totalCustomers = customers.length;

  // Order Status Chart
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  
  const orderStatus = Object.keys(statusCounts).map(status => ({ name: status, value: statusCounts[status] }));

  // Revenue Overview (Last 7 Days)
  const revenueMap = {};
  for(let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    revenueMap[d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })] = 0;
  }
  orders.forEach(o => {
    const dateStr = new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    if (revenueMap[dateStr] !== undefined && o.status !== 'Cancelled') {
      revenueMap[dateStr] += o.total;
    }
  });
  const revenueOverview = Object.keys(revenueMap).map(k => ({ date: k, revenue: revenueMap[k] }));

  // Orders Overview (Last 7 Days)
  const ordersOverviewMap = {};
  for(let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    ordersOverviewMap[d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })] = 0;
  }
  orders.forEach(o => {
    const dateStr = new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    if (ordersOverviewMap[dateStr] !== undefined) {
      ordersOverviewMap[dateStr] += 1;
    }
  });
  const ordersOverview = Object.keys(ordersOverviewMap).map(k => ({ date: k, orders: ordersOverviewMap[k] }));

  // Category Distribution
  const catMap = inventory.reduce((acc, m) => {
    acc[m.category] = (acc[m.category] || 0) + 1;
    return acc;
  }, {});
  const categoryDistribution = Object.keys(catMap).map(c => ({ name: c.charAt(0).toUpperCase() + c.slice(1), value: catMap[c] }));

  // Top Selling Medicines (from orders)
  const itemMap = {};
  orders.forEach(o => {
    if (o.status !== 'Cancelled') {
      o.items.forEach(item => {
        if (!itemMap[item.id]) {
          itemMap[item.id] = { id: item.id, name: item.name, quantity: 0, revenue: 0 };
        }
        itemMap[item.id].quantity += item.quantity;
        itemMap[item.id].revenue += (item.quantity * item.price);
      });
    }
  });
  
  const topSellingMedicines = Object.values(itemMap)
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5)
    .map(t => {
      const med = inventory.find(i => i.id === t.id);
      return { ...t, image: med?.image || 'https://via.placeholder.com/150', category: med?.category || 'Unknown' };
    });

  return {
    kpis: {
      todayRevenue,
      todayOrders,
      pendingOrders: pendingOrdersCount,
      pendingPrescriptions: pendingPrescriptionsCount,
      lowStock: lowStockCount,
      totalCustomers
    },
    revenueOverview,
    ordersOverview,
    orderStatus,
    inventoryStatus: [
      { name: 'In Stock', value: inventory.length - lowStockCount },
      { name: 'Low Stock', value: lowStockItems.length },
      { name: 'Out of Stock', value: outOfStockItems.length }
    ],
    categoryDistribution,
    topSellingMedicines,
    recentOrders: [...orders].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    needsAttention: {
      pendingOrders: orders.filter(o => o.status === 'Pending').slice(0,3),
      lowStockItems: [...lowStockItems, ...outOfStockItems].sort((a,b) => a.stock - b.stock).slice(0,3),
      pendingPrescriptions: prescriptions.filter(p => p.status === 'Pending').slice(0,3)
    },
    customerOverview: {
      total: customers.length,
      new: customers.filter(c => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(c.registrationDate) >= thirtyDaysAgo;
      }).length,
      withOrders: customers.filter(c => c.orders && c.orders.length > 0).length
    },
    prescriptionOverview: {
      pending: pendingPrescriptionsCount,
      approved: prescriptions.filter(p => p.status === 'Approved').length,
      rejected: prescriptions.filter(p => p.status === 'Rejected').length
    }
  };
};
`;
fs.writeFileSync(dashboardServicePath, dashboardServiceContent);

// 2. Write AdminDashboardPage.jsx
const dashboardPagePath = path.join(srcDir, 'pages', 'admin', 'AdminDashboardPage.jsx');
const dashboardPageContent = `import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useTheme } from '../../context/ThemeContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { buildDashboardData } from '../../services/dashboardService';

// Hooks to get domain state
import { useOrder } from '../../context/OrderContext';
import { useInventory } from '../../context/InventoryContext';
import { usePrescription } from '../../context/PrescriptionContext';
import { MOCK_CUSTOMERS } from '../../mockData/customers';

export const AdminDashboardPage = () => {
  const { isDarkMode } = useTheme();
  
  const { orders } = useOrder();
  const { inventory } = useInventory();
  const { prescriptions } = usePrescription();
  const customers = MOCK_CUSTOMERS;

  // Derive dashboard data using the service
  const data = useMemo(() => buildDashboardData(orders, inventory, prescriptions, customers), [orders, inventory, prescriptions, customers]);

  const COLORS = isDarkMode ? ['#7AD7BE', '#FFB783', '#B1C7E9', '#FFB4AB', '#E2C2FF'] : ['#00675c', '#a85500', '#2a5a8a', '#ba1a1a', '#6a4d9c'];

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
    <div className="p-space-lg flex flex-col gap-space-lg">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Dashboard</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Good morning, Admin. Here is today's overview as of {new Date().toLocaleDateString('en-GB')}.</p>
        </div>
        <div className="flex items-center gap-space-sm bg-surface-container rounded-lg p-1 border border-outline-variant/30">
          <button className="px-3 py-1 rounded-md bg-surface-container-high text-on-surface font-bold text-label-sm shadow-sm">7d</button>
          <button className="px-3 py-1 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 font-medium text-label-sm transition-colors">30d</button>
          <button className="px-3 py-1 rounded-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 font-medium text-label-sm transition-colors">12m</button>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-sm">
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-primary">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Today's Revenue</span>
          <span className="text-primary font-headline-md font-bold">৳{data.kpis.todayRevenue.toLocaleString()}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-secondary">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Today's Orders</span>
          <span className="text-secondary font-headline-md font-bold">{data.kpis.todayOrders}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-warning">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Pending Orders</span>
          <span className="text-warning-dark font-headline-md font-bold">{data.kpis.pendingOrders}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-tertiary">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Pending Rx</span>
          <span className="text-tertiary font-headline-md font-bold">{data.kpis.pendingPrescriptions}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-error">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Low/Out of Stock</span>
          <span className="text-error font-headline-md font-bold">{data.kpis.lowStock}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-outline-variant">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Total Customers</span>
          <span className="text-on-surface font-headline-md font-bold">{data.kpis.totalCustomers}</span>
        </Card>
      </div>

      {/* Primary Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* 3. Revenue Overview */}
        <Card className="p-space-md lg:col-span-2 flex flex-col">
          <h3 className="font-label-lg font-bold text-on-surface mb-4">Revenue Overview</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenueOverview} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 11 }} tickFormatter={(val) => \`৳\${val}\`} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-container-highest)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px', color: 'var(--color-on-surface)' }} />
                <Line type="monotone" dataKey="revenue" stroke={isDarkMode ? '#7AD7BE' : '#00675c'} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* 4 & 5. Order Stats */}
        <div className="flex flex-col gap-space-lg">
          <Card className="p-space-md flex-1">
            <h3 className="font-label-md font-bold text-on-surface mb-2">Orders Volume</h3>
            <div className="h-[100px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.ordersOverview} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.2} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 9 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 9 }} />
                  <Tooltip cursor={{ fill: 'var(--color-surface-container-high)' }} contentStyle={{ backgroundColor: 'var(--color-surface-container-highest)', borderColor: 'var(--color-outline-variant)', borderRadius: '4px' }} />
                  <Bar dataKey="orders" fill={isDarkMode ? '#FFB783' : '#a85500'} radius={[4, 4, 0, 0]} name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-space-md flex-1 flex flex-col justify-center">
            <h3 className="font-label-md font-bold text-on-surface mb-2">Order Status</h3>
            <div className="h-[100px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.orderStatus} cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={2} dataKey="value">
                    {data.orderStatus.map((entry, index) => (
                      <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-container)', border: '1px solid var(--color-outline-variant)', borderRadius: '4px', fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Secondary Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-lg">
        {/* 6. Inventory Overview */}
        <Card className="p-space-md">
          <h3 className="font-label-md font-bold text-on-surface mb-4">Inventory Status</h3>
          <div className="flex flex-col gap-3">
            {data.inventoryStatus.map((stat, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-outline-variant/20 last:border-0 pb-2 last:pb-0">
                <span className="text-body-sm text-on-surface-variant flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  {stat.name}
                </span>
                <span className="font-bold text-on-surface">{stat.value} items</span>
              </div>
            ))}
          </div>
        </Card>

        {/* 7. Category Distribution */}
        <Card className="p-space-md">
          <h3 className="font-label-md font-bold text-on-surface mb-4">Category Split</h3>
          <div className="flex flex-col gap-3">
            {data.categoryDistribution.slice(0, 3).map((cat, idx) => (
              <div key={idx} className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px] text-on-surface font-medium">
                  <span>{cat.name}</span>
                  <span>{cat.value}</span>
                </div>
                <div className="w-full bg-surface-container-highest rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: \`\${Math.min(100, (cat.value / inventory.length) * 100)}%\`, backgroundColor: COLORS[idx % COLORS.length] }}></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 11. Customer Overview */}
        <Card className="p-space-md">
          <h3 className="font-label-md font-bold text-on-surface mb-4">Customer Stats</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-on-surface-variant">New (30d)</span>
              <span className="font-bold text-tertiary">+{data.customerOverview.new}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-on-surface-variant">Active</span>
              <span className="font-bold text-primary">{data.customerOverview.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-on-surface-variant">With Orders</span>
              <span className="font-bold text-on-surface">{data.customerOverview.withOrders}</span>
            </div>
          </div>
        </Card>

        {/* 12. Prescription Overview */}
        <Card className="p-space-md">
          <h3 className="font-label-md font-bold text-on-surface mb-4">Prescriptions</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-on-surface-variant">Pending Review</span>
              <span className="font-bold text-warning-dark">{data.prescriptionOverview.pending}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-on-surface-variant">Approved</span>
              <span className="font-bold text-success">{data.prescriptionOverview.approved}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body-sm text-on-surface-variant">Rejected</span>
              <span className="font-bold text-error">{data.prescriptionOverview.rejected}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* 8. Top Selling Medicines */}
        <Card className="p-0 overflow-hidden flex flex-col lg:col-span-1">
          <div className="p-space-md border-b border-outline-variant/30 bg-surface-container-lowest">
            <h3 className="font-label-lg font-bold text-on-surface">Top Selling</h3>
          </div>
          <div className="p-space-md flex flex-col gap-4">
            {data.topSellingMedicines.map((med, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-surface-container-highest/20 p-1 shrink-0">
                  <img src={med.image} alt={med.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="font-bold text-on-surface text-label-md">{med.name}</span>
                  <span className="text-[10px] text-on-surface-variant uppercase">{med.category}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-primary font-price-sm">৳{med.revenue.toLocaleString()}</span>
                  <span className="text-[10px] text-on-surface-variant">{med.quantity} sold</span>
                </div>
              </div>
            ))}
            {data.topSellingMedicines.length === 0 && (
              <div className="text-body-sm text-on-surface-variant text-center py-4">No sales data available.</div>
            )}
          </div>
        </Card>

        {/* 9. Recent Orders */}
        <Card className="p-0 overflow-hidden flex flex-col lg:col-span-2">
          <div className="p-space-md border-b border-outline-variant/30 bg-surface-container-lowest flex justify-between items-center">
            <h3 className="font-label-lg font-bold text-on-surface">Recent Orders</h3>
            <Link to="/admin/orders" className="text-primary text-[12px] font-bold hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase tracking-wider">
                <tr>
                  <th className="p-3 border-b border-outline-variant/20 font-semibold">Order</th>
                  <th className="p-3 border-b border-outline-variant/20 font-semibold">Customer</th>
                  <th className="p-3 border-b border-outline-variant/20 font-semibold">Amount</th>
                  <th className="p-3 border-b border-outline-variant/20 font-semibold">Status</th>
                  <th className="p-3 border-b border-outline-variant/20 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map(o => (
                  <tr key={o.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors text-body-sm text-on-surface">
                    <td className="p-3">
                      <div className="font-bold">{o.id}</div>
                      <div className="text-[10px] text-on-surface-variant">{new Date(o.createdAt).toLocaleDateString('en-GB')}</div>
                    </td>
                    <td className="p-3 font-medium">{o.customer?.name}</td>
                    <td className="p-3 font-price-sm text-primary font-bold">৳{o.total?.toLocaleString()}</td>
                    <td className="p-3">{getStatusBadge(o.status)}</td>
                    <td className="p-3 text-right">
                      <Link to={\`/admin/orders/\${o.id}\`} className="text-on-surface-variant hover:text-primary transition-colors inline-block">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      
      {/* 10. Needs Attention */}
      <Card className="p-space-md bg-error-container/10 border border-error/20">
        <h3 className="font-label-lg font-bold text-on-surface mb-4 flex items-center gap-2 text-error">
          <span className="material-symbols-outlined">warning</span> Needs Attention
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          <div className="flex flex-col gap-2">
            <h4 className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider text-[11px]">Pending Orders</h4>
            {data.needsAttention.pendingOrders.length > 0 ? data.needsAttention.pendingOrders.map(o => (
              <div key={o.id} className="flex justify-between items-center text-body-sm bg-surface p-2 rounded border border-outline-variant/20">
                <span>{o.id}</span>
                <Link to={\`/admin/orders/\${o.id}\`} className="text-primary hover:underline text-[11px] font-bold">Review</Link>
              </div>
            )) : <span className="text-[12px] text-on-surface-variant italic">All caught up</span>}
          </div>
          
          <div className="flex flex-col gap-2">
            <h4 className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider text-[11px]">Low Stock Alerts</h4>
            {data.needsAttention.lowStockItems.length > 0 ? data.needsAttention.lowStockItems.map(m => (
              <div key={m.id} className="flex justify-between items-center text-body-sm bg-surface p-2 rounded border border-outline-variant/20">
                <span className="truncate max-w-[150px]">{m.name}</span>
                <span className={\`font-bold \${m.stock === 0 ? 'text-error' : 'text-warning-dark'}\`}>{m.stock} left</span>
              </div>
            )) : <span className="text-[12px] text-on-surface-variant italic">Inventory healthy</span>}
          </div>
          
          <div className="flex flex-col gap-2">
            <h4 className="font-label-sm font-bold text-on-surface-variant uppercase tracking-wider text-[11px]">Pending Prescriptions</h4>
            {data.needsAttention.pendingPrescriptions.length > 0 ? data.needsAttention.pendingPrescriptions.map(p => (
              <div key={p.id} className="flex justify-between items-center text-body-sm bg-surface p-2 rounded border border-outline-variant/20">
                <span className="truncate max-w-[150px]">{p.title}</span>
                <Link to="/admin/prescriptions" className="text-primary hover:underline text-[11px] font-bold">Review</Link>
              </div>
            )) : <span className="text-[12px] text-on-surface-variant italic">All caught up</span>}
          </div>
        </div>
      </Card>
    </div>
  );
};
`;
fs.writeFileSync(dashboardPagePath, dashboardPageContent);

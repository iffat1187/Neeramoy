import React from 'react';
import { useOrder } from '../../context/OrderContext';
import { usePrescription } from '../../context/PrescriptionContext';
import { useInventory } from '../../context/InventoryContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminDashboardPage = () => {
  const { orders } = useOrder();
  const { prescriptions } = usePrescription();
  const { inventory } = useInventory();

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const pendingRx = prescriptions.filter(rx => rx.status === 'Pending').length;
  const lowStock = inventory.filter(m => m.status === 'Low Stock' || m.status === 'Out of Stock').length;
  
  const revenue = orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + (o.total || o.amount || 0), 0);

  // Revenue & Orders Data (Mocking daily data for the last 7 days based on total orders)
  const chartData = [
    { name: 'Mon', revenue: 4000, orders: 24 },
    { name: 'Tue', revenue: 3000, orders: 18 },
    { name: 'Wed', revenue: 2000, orders: 12 },
    { name: 'Thu', revenue: 2780, orders: 16 },
    { name: 'Fri', revenue: 1890, orders: 10 },
    { name: 'Sat', revenue: 2390, orders: 14 },
    { name: 'Sun', revenue: 3490, orders: 20 },
  ];

  // Order Status Data
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});
  const statusData = Object.keys(statusCounts).map(status => ({ name: status, value: statusCounts[status] }));
  const COLORS = ['#FFBB28', '#00C49F', '#0088FE', '#FF8042', '#8884d8', '#ffc658'];

  // Top Selling Medicines Data
  const medicineSales = {};
  orders.forEach(order => {
    order.items?.forEach(item => {
      medicineSales[item.name] = (medicineSales[item.name] || 0) + (item.quantity || 1);
    });
  });
  const topMedicines = Object.keys(medicineSales)
    .map(name => ({ name: name.substring(0, 15), sales: medicineSales[name] }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return (
    <div className="space-y-space-xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-space-md">
        <div>
          <h1 className="font-headline-lg font-bold text-on-surface mb-1">স্বাগতম, ডাঃ শারমিন রশীদ <Badge variant="success" text="সুপারিনটেনডেন্ট ফার্মাসিস্ট" /></h1>
          <p className="text-on-surface-variant font-body-sm">(Head of Clinical Dispatch)</p>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Link to="/admin/prescriptions" className="bg-primary text-on-primary px-4 py-2 rounded-xl flex items-center gap-2 text-label-md font-bold hover:opacity-90">
            <span className="material-symbols-outlined">prescriptions</span>
            Review {pendingRx} Pending Rx
          </Link>
          <Link to="/admin/orders" className="bg-surface-container-high text-on-surface px-4 py-2 rounded-xl flex items-center gap-2 text-label-md font-bold hover:bg-surface-container-highest">
            Dispatch Queue ({pendingOrders})
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <Card className="p-space-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-on-surface-variant text-label-sm font-bold uppercase">আজকের মোট অর্ডার</span>
            <div className="w-8 h-8 rounded bg-primary-container text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
          </div>
          <h3 className="font-display-sm font-bold text-on-surface mb-1">৳{revenue.toLocaleString()}</h3>
          <p className="text-primary font-bold text-label-sm">{orders.length} টি অর্ডার সম্পন্ন</p>
        </Card>

        <Card className="p-space-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-on-surface-variant text-label-sm font-bold uppercase">পেন্ডিং ও ডিসপ্যাচ কিউ</span>
            <div className="w-8 h-8 rounded bg-warning-container/30 text-warning flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">pending_actions</span>
            </div>
          </div>
          <h3 className="font-display-sm font-bold text-on-surface mb-1">{pendingOrders} টি অপেক্ষমান</h3>
          <p className="text-on-surface-variant text-label-sm">কোল্ড চেইন এক্সপ্রেস + সাধারণ</p>
        </Card>

        <Card className="p-space-lg flex flex-col justify-between border-error/30">
          <div className="flex justify-between items-start mb-4">
            <span className="text-on-surface-variant text-label-sm font-bold uppercase">প্রেসক্রিপশন ভেরিফিকেশন</span>
            <div className="w-8 h-8 rounded bg-error-container text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">prescriptions</span>
            </div>
          </div>
          <h3 className="font-display-sm font-bold text-error mb-1">{pendingRx} টি যাচাই বাকি</h3>
          <p className="text-on-surface-variant text-label-sm">ফার্মাসিস্ট সিগনেচার আবশ্যক</p>
        </Card>

        <Card className="p-space-lg flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-on-surface-variant text-label-sm font-bold uppercase">স্টক সতর্কতা (LOW STOCK)</span>
            <div className="w-8 h-8 rounded bg-surface-container-high text-on-surface flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
            </div>
          </div>
          <h3 className="font-display-sm font-bold text-on-surface mb-1">{lowStock} টি ঔষধ শেষ পর্যায়ে</h3>
          <p className="text-on-surface-variant text-label-sm">রি-অর্ডার ট্রিগার সক্রিয়</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {/* Revenue Overview Chart */}
        <Card className="lg:col-span-2 p-space-md flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-headline-sm font-bold text-on-surface">Revenue Overview</h2>
            <select className="border border-outline-variant/50 rounded-lg px-2 py-1 bg-surface-container-lowest text-body-sm">
              <option>7 Days</option>
              <option>30 Days</option>
              <option>12 Months</option>
            </select>
          </div>
          <div className="flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} tickFormatter={(val) => `৳${val}`} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#005A4A" strokeWidth={3} dot={{ r: 4, fill: '#005A4A' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Order Status Distribution */}
        <Card className="p-space-md flex flex-col">
          <h2 className="font-headline-sm font-bold text-on-surface mb-4">Order Status</h2>
          <div className="flex-1 h-64 flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="block font-display-sm font-bold text-on-surface">{orders.length}</span>
              <span className="block text-[10px] text-on-surface-variant uppercase font-bold">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {statusData.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                <span className="text-on-surface-variant truncate flex-1">{entry.name}</span>
                <span className="font-bold">{entry.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {/* Orders Overview Chart */}
        <Card className="lg:col-span-2 p-space-md flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-headline-sm font-bold text-on-surface">Orders Overview</h2>
          </div>
          <div className="flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
                <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="orders" fill="#005A4A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Selling Medicines */}
        <Card className="p-space-md flex flex-col">
          <h2 className="font-headline-sm font-bold text-on-surface mb-4">Top Selling Medicines</h2>
          <div className="flex-1 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topMedicines} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e0e0e0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#737373' }} width={80} />
                <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="sales" fill="#0BA170" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 p-space-md flex flex-col">
          <div className="flex justify-between items-center mb-space-md pb-space-sm border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary bg-primary-container p-1.5 rounded-lg text-[20px]">local_shipping</span>
              <h2 className="font-headline-sm font-bold text-on-surface">সাম্প্রতিক অর্ডার ও ডিসপ্যাচ কিউ</h2>
            </div>
            <Link to="/admin/orders" className="text-primary text-label-sm font-bold hover:underline">সকল অর্ডার দেখুন (View All)</Link>
          </div>
          
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse text-body-sm">
              <thead className="text-on-surface-variant font-bold text-[11px] uppercase tracking-wider bg-surface-container-low">
                <tr>
                  <th className="p-3 rounded-tl-lg">অর্ডার আইডি</th>
                  <th className="p-3">গ্রাহক ও ডেলিভারি</th>
                  <th className="p-3">ওষুধের তালিকা</th>
                  <th className="p-3 text-right rounded-tr-lg">মূল্য (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id || order.orderId} className="hover:bg-surface-container/50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-primary">#{order.id || order.orderId}</div>
                      <div className="text-[10px] text-on-surface-variant mt-0.5">{order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '12:30 PM'}</div>
                      <Badge variant={order.status === 'Pending' ? 'warning' : 'primary'} text={order.status} className="mt-1" />
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-on-surface">{order.shippingAddress?.fullName || 'Tanvir Hasan'}</div>
                      <div className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">location_on</span>
                        {order.shippingAddress?.area || 'Dhanmondi'}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="line-clamp-2">{order.items?.map(i => i.name).join(', ') || 'Napa Extra, Sergel 20mg'}</div>
                      <Badge variant="primary" text="কোল্ড-চেইন এক্সপ্রেস" className="mt-1 inline-block" />
                    </td>
                    <td className="p-3 text-right font-price-sm font-bold">৳{order.total || order.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Pending Rx */}
        <Card className="p-space-md flex flex-col border-error/20">
          <div className="flex justify-between items-center mb-space-md pb-space-sm border-b border-outline-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error bg-error-container/50 p-1.5 rounded-lg text-[20px]">prescriptions</span>
              <h2 className="font-headline-sm font-bold text-error">জরুরি প্রেসক্রিপশন কিউ</h2>
            </div>
          </div>
          
          <div className="flex-1 overflow-auto space-y-3">
            {prescriptions.filter(rx => rx.status === 'Pending').slice(0,4).map(rx => (
              <div key={rx.id} className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-3 hover:border-primary transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold text-primary text-label-sm">#{rx.id.toUpperCase()}</div>
                  <span className="text-[10px] text-on-surface-variant">5 মিনিট পূর্বে</span>
                </div>
                <div className="text-body-sm font-bold text-on-surface mb-1">রোগী: {rx.customerName}</div>
                <div className="text-[11px] text-on-surface-variant mb-3 line-clamp-1">প্রেসক্রাইবড: {rx.title || rx.fileName}</div>
                
                <div className="flex gap-2">
                  <button className="flex-1 bg-primary text-on-primary text-[11px] font-bold py-1.5 rounded-lg flex justify-center items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">visibility</span> রিভিউ ও অনুমোদন
                  </button>
                  <button className="px-2 bg-error-container/20 text-error rounded-lg flex justify-center items-center">
                    <span className="material-symbols-outlined text-[16px]">close</span>
                  </button>
                </div>
              </div>
            ))}
            {pendingRx === 0 && (
              <div className="text-center py-8 text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px] mb-2 opacity-50">task_alt</span>
                <p className="font-bold">No pending prescriptions</p>
              </div>
            )}
          </div>
          <Link to="/admin/prescriptions" className="mt-3 text-center text-primary text-label-sm font-bold hover:underline block pt-2 border-t border-outline-variant/30">সকল প্রেসক্রিপশন দেখুন (View All)</Link>
        </Card>
      </div>
    </div>
  );
};

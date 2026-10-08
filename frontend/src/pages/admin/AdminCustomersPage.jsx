import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useTheme } from '../../context/ThemeContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_CUSTOMERS } from '../../mockData/customers';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../../components/common/Pagination';

export const AdminCustomersPage = () => {
  const { isDarkMode } = useTheme();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterOrderActivity, setFilterOrderActivity] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Modal State
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setCustomers(MOCK_CUSTOMERS);
      setLoading(false);
    }, 400);
  }, []);

  // KPIs
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const newCustomers = customers.filter(c => new Date(c.registrationDate) >= new Date(new Date().setMonth(new Date().getMonth() - 1))).length;
  const customersWithOrders = customers.filter(c => c.orders.length > 0).length;
  const totalOrdersAll = customers.reduce((sum, c) => sum + c.orders.length, 0);
  const avgOrders = totalCustomers > 0 ? (totalOrdersAll / totalCustomers).toFixed(1) : 0;

  // Chart Data
  const statusData = [
    { name: 'Active', value: activeCustomers },
    { name: 'Inactive', value: totalCustomers - activeCustomers }
  ];

  const registrationTrend = [
    { month: 'Jun', users: 2 },
    { month: 'Jul', users: 5 },
    { month: 'Aug', users: 3 },
    { month: 'Sep', users: 8 },
    { month: 'Oct', users: 4 }
  ];

  const orderActivityData = [
    { period: 'Week 1', orders: 12 },
    { period: 'Week 2', orders: 19 },
    { period: 'Week 3', orders: 15 },
    { period: 'Week 4', orders: 25 }
  ];

  const handleStatusToggle = (id) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = c.status === 'Active' ? 'Inactive' : 'Active';
        setSuccessMsg(`${c.name}'s account has been marked as ${newStatus}.`);
        setTimeout(() => setSuccessMsg(''), 5000);
        return { ...c, status: newStatus };
      }
      return c;
    }));
    
    // update modal if open
    if (selectedCustomer && selectedCustomer.id === id) {
      setSelectedCustomer(prev => ({...prev, status: prev.status === 'Active' ? 'Inactive' : 'Active'}));
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setFilterOrderActivity('All');
    setSortBy('Newest');
  };

  let filtered = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    const matchOrders = filterOrderActivity === 'All' ? true : (filterOrderActivity === 'Has Orders' ? c.orders.length > 0 : c.orders.length === 0);
    return matchSearch && matchStatus && matchOrders;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'Name') return a.name.localeCompare(b.name);
    if (sortBy === 'Total Orders') return b.orders.length - a.orders.length;
    if (sortBy === 'Total Spent') {
      const aSpent = a.orders.reduce((sum, o) => sum + o.total, 0);
      const bSpent = b.orders.reduce((sum, o) => sum + o.total, 0);
      return bSpent - aSpent;
    }
    // Default Newest
    return new Date(b.registrationDate) - new Date(a.registrationDate);
  });

  const { currentPage, totalPages, totalItems, paginatedItems, goToPage, pageSize } = usePagination(filtered, 20);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    goToPage(1);
  };
  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value);
    goToPage(1);
  };
  const handleFilterOrder = (e) => {
    setFilterOrderActivity(e.target.value);
    goToPage(1);
  };
  const handleSortBy = (e) => {
    setSortBy(e.target.value);
    goToPage(1);
  };
  const handleClearFilters = () => {
    clearFilters();
    goToPage(1);
  };

  if (loading) return <div className="p-space-lg text-on-surface">Loading customers...</div>;

  return (
    <div className="p-space-lg flex flex-col gap-space-lg">
      {successMsg && <div className="bg-primary-container text-on-primary-container p-3 rounded-lg font-bold mb-2">{successMsg}</div>}
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Customer Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage customers, view account activity, and monitor customer orders.</p>
        </div>
        <div className="flex items-center gap-space-sm">
          <button className="flex items-center gap-2 bg-surface-container border border-outline-variant text-on-surface px-4 py-2 rounded-lg font-label-md font-bold hover:bg-surface-container-high transition-colors shrink-0">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export Customers
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-sm">
        <Card className="p-space-md flex flex-col gap-2">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Total Customers</span>
          <span className="text-on-surface font-headline-md font-bold">{totalCustomers}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-primary">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Active</span>
          <span className="text-primary font-headline-md font-bold">{activeCustomers}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-tertiary">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">New (30 Days)</span>
          <span className="text-tertiary font-headline-md font-bold">{newCustomers}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-secondary">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">With Orders</span>
          <span className="text-secondary font-headline-md font-bold">{customersWithOrders}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Total Orders</span>
          <span className="text-on-surface font-headline-md font-bold">{totalOrdersAll}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Avg Orders/Cust</span>
          <span className="text-on-surface font-headline-md font-bold">{avgOrders}</span>
        </Card>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        <Card className="p-space-md">
          <h3 className="font-label-md font-bold text-on-surface mb-2">Customer Growth</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={registrationTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-container-highest)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="users" stroke={isDarkMode ? '#7AD7BE' : '#00675c'} strokeWidth={3} dot={{ r: 4 }} name="New Customers" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-space-md">
          <h3 className="font-label-md font-bold text-on-surface mb-2">Order Activity (Last 4 Weeks)</h3>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderActivityData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} />
                <Tooltip cursor={{ fill: 'var(--color-surface-container-high)' }} contentStyle={{ backgroundColor: 'var(--color-surface-container-highest)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px' }} />
                <Bar dataKey="orders" fill={isDarkMode ? '#FFB783' : '#a85500'} radius={[4, 4, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-space-md">
          <h3 className="font-label-md font-bold text-on-surface mb-2">Customer Status</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value">
                  <Cell fill={isDarkMode ? '#7AD7BE' : '#00675c'} />
                  <Cell fill={isDarkMode ? '#FFB4AB' : '#ba1a1a'} />
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-container)', border: 'none', borderRadius: '4px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: isDarkMode ? '#7AD7BE' : '#00675c' }}></span> Active</div>
            <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: isDarkMode ? '#FFB4AB' : '#ba1a1a' }}></span> Inactive</div>
          </div>
        </Card>
      </div>

      {/* Customer List */}
      <Card className="overflow-hidden flex flex-col">
        <div className="p-space-md border-b border-outline-variant/30 flex flex-col md:flex-row gap-space-md bg-surface-container-low justify-between">
          <div className="flex items-center gap-space-md flex-1">
            <div className="flex items-center bg-surface-container rounded-lg px-3 py-2 border border-outline-variant/30 focus-within:border-primary flex-1 max-w-md">
              <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
              <input 
                type="text" 
                placeholder="Search by name, email, or phone..." 
                className="bg-transparent border-none outline-none text-on-surface text-body-md w-full"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-space-sm">
            <select className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-lg px-3 py-1.5 font-body-sm focus:outline-none focus:border-primary" value={filterStatus} onChange={handleFilterStatus}>
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-lg px-3 py-1.5 font-body-sm focus:outline-none focus:border-primary" value={filterOrderActivity} onChange={handleFilterOrder}>
              <option value="All">All Order Activity</option>
              <option value="Has Orders">Has Orders</option>
              <option value="No Orders">No Orders</option>
            </select>
            <select className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-lg px-3 py-1.5 font-body-sm focus:outline-none focus:border-primary" value={sortBy} onChange={handleSortBy}>
              <option value="Newest">Sort: Newest</option>
              <option value="Name">Sort: Name</option>
              <option value="Total Orders">Sort: Total Orders</option>
              <option value="Total Spent">Sort: Total Spent</option>
            </select>
            <button onClick={handleClearFilters} className="text-on-surface-variant hover:text-primary text-[11px] font-bold underline px-2">Clear</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">person_off</span>
              <h3 className="font-headline-sm text-on-surface mb-2">No customers found</h3>
              <p className="text-body-sm text-on-surface-variant">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-surface-container-highest/20 text-on-surface-variant font-label-sm tracking-wider uppercase">
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Customer</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Contact</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Registered</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Orders</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Total Spent</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Last Order</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Status</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map(c => {
                  const spent = c.orders.reduce((sum, o) => sum + o.total, 0);
                  const lastOrder = c.orders.length > 0 ? c.orders.sort((a,b) => new Date(b.date) - new Date(a.date))[0].date : 'Never';
                  return (
                    <tr key={c.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full bg-surface-container-highest" />
                          <div className="flex flex-col">
                            <span className="font-bold text-on-surface text-label-md">{c.name}</span>
                            <span className="text-[10px] text-on-surface-variant">{c.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col text-body-sm text-on-surface">
                          <span>{c.email}</span>
                          <span className="text-on-surface-variant">{c.phone}</span>
                        </div>
                      </td>
                      <td className="p-4 text-body-sm text-on-surface">{c.registrationDate}</td>
                      <td className="p-4 text-body-sm font-bold text-on-surface">{c.orders.length}</td>
                      <td className="p-4 font-price-md text-primary">৳{spent.toLocaleString()}</td>
                      <td className="p-4 text-body-sm text-on-surface-variant">{lastOrder}</td>
                      <td className="p-4">
                        <Badge variant={c.status === 'Active' ? 'primary' : 'error'} className={c.status === 'Active' ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'}>
                          {c.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <button onClick={() => setSelectedCustomer(c)} className="text-primary hover:bg-surface-container-high px-3 py-1.5 rounded-md text-[12px] font-bold transition-colors">
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        {paginatedItems.length > 0 && (
          <div className="px-space-md pb-space-md">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={goToPage} 
              totalItems={totalItems} 
              pageSize={pageSize} 
              itemName="customers"
            />
          </div>
        )}
      </Card>

      {/* Customer Details Drawer / Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-scrim/50 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-2xl h-full shadow-lg border-l border-outline-variant/30 overflow-y-auto flex flex-col">
            <div className="p-space-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low sticky top-0 z-10">
              <h2 className="font-headline-md font-bold text-on-surface">Customer Details</h2>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-space-lg flex-1 flex flex-col gap-space-lg">
              {/* Profile & Controls */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-space-md">
                <div className="flex items-center gap-space-md">
                  <img src={selectedCustomer.avatar} alt={selectedCustomer.name} className="w-20 h-20 rounded-full bg-surface-container border-2 border-outline-variant/30" />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-headline-sm font-bold text-on-surface">{selectedCustomer.name}</h3>
                    <div className="text-body-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">mail</span> {selectedCustomer.email}
                    </div>
                    <div className="text-body-md text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px]">call</span> {selectedCustomer.phone}
                    </div>
                    <div className="mt-1">
                      <Badge variant={selectedCustomer.status === 'Active' ? 'primary' : 'error'}>{selectedCustomer.status}</Badge>
                      <span className="text-[11px] text-on-surface-variant ml-2">Registered: {selectedCustomer.registrationDate}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleStatusToggle(selectedCustomer.id)}
                  className={`px-4 py-2 rounded-lg font-label-md font-bold transition-colors ${selectedCustomer.status === 'Active' ? 'bg-error-container text-on-error-container hover:bg-error/20' : 'bg-primary-container text-on-primary-container hover:bg-primary/20'}`}
                >
                  {selectedCustomer.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <Card className="p-space-md bg-surface-container-low border-none shadow-none">
                  <h4 className="font-label-md font-bold text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">location_on</span> Default Address
                  </h4>
                  {selectedCustomer.address ? (
                    <div className="text-body-sm text-on-surface-variant flex flex-col gap-1">
                      <span className="text-on-surface font-medium">{selectedCustomer.address.address}</span>
                      <span>{selectedCustomer.address.area}, {selectedCustomer.address.city} - {selectedCustomer.address.postalCode}</span>
                    </div>
                  ) : (
                    <span className="text-body-sm text-on-surface-variant italic">No address saved.</span>
                  )}
                </Card>

                <Card className="p-space-md bg-surface-container-low border-none shadow-none">
                  <h4 className="font-label-md font-bold text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">bar_chart</span> Statistics
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-outline">Total Spent</span>
                      <span className="font-bold text-primary font-price-md">৳{selectedCustomer.orders.reduce((s,o)=>s+o.total,0).toLocaleString()}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-outline">Total Orders</span>
                      <span className="font-bold text-on-surface">{selectedCustomer.orders.length}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-outline">Completed</span>
                      <span className="font-bold text-secondary">{selectedCustomer.orders.filter(o=>o.orderStatus==='Delivered').length}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-outline">Cancelled</span>
                      <span className="font-bold text-error">{selectedCustomer.orders.filter(o=>o.orderStatus==='Cancelled').length}</span>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Orders */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-headline-sm font-bold text-on-surface">Recent Orders</h4>
                  {selectedCustomer.orders.length > 0 && (
                    <button className="text-primary font-bold text-[12px] hover:underline flex items-center gap-1">
                      View All <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  )}
                </div>
                
                {selectedCustomer.orders.length === 0 ? (
                  <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 text-center flex flex-col items-center">
                    <span className="material-symbols-outlined text-[32px] text-outline-variant mb-2">receipt_long</span>
                    <span className="text-body-md text-on-surface-variant">Customer has no order history.</span>
                  </div>
                ) : (
                  <div className="border border-outline-variant/30 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-surface-container-low text-[11px] text-on-surface-variant uppercase tracking-wider">
                        <tr>
                          <th className="p-3 border-b border-outline-variant/30 font-semibold">Order</th>
                          <th className="p-3 border-b border-outline-variant/30 font-semibold">Date</th>
                          <th className="p-3 border-b border-outline-variant/30 font-semibold">Total</th>
                          <th className="p-3 border-b border-outline-variant/30 font-semibold">Status</th>
                          <th className="p-3 border-b border-outline-variant/30 text-right"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCustomer.orders.sort((a,b) => new Date(b.date) - new Date(a.date)).map(o => (
                          <tr key={o.id} className="border-b border-outline-variant/10 hover:bg-surface-container-lowest transition-colors text-body-sm text-on-surface">
                            <td className="p-3 font-medium">{o.id}</td>
                            <td className="p-3 text-on-surface-variant">{o.date}</td>
                            <td className="p-3 font-price-sm font-bold text-primary">৳{o.total} <span className="text-[10px] text-outline font-normal">({o.items} items)</span></td>
                            <td className="p-3">
                              <Badge variant={o.orderStatus === 'Delivered' ? 'secondary' : (o.orderStatus === 'Cancelled' ? 'error' : 'tertiary')} className="text-[10px]">
                                {o.orderStatus}
                              </Badge>
                            </td>
                            <td className="p-3 text-right">
                              <button className="text-on-surface-variant hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

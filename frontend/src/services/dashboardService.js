/**
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

import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useTheme } from '../../context/ThemeContext';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../../components/common/Pagination';

export const AdminInventoryPage = () => {
  const { inventory, activityHistory, updateStock } = useInventory();
  const { isDarkMode } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');

  const [modalState, setModalState] = useState({ isOpen: false, med: null, type: null }); // type: 'adjust' | 'restock' | 'addStock'
  const [adjustData, setAdjustData] = useState({ type: 'add', qty: 0, reason: 'Manual correction' });
  const [successMsg, setSuccessMsg] = useState('');

  // KPIs
  const totalSkus = inventory.length;
  const inStock = inventory.filter(m => m.status === 'In Stock').length;
  const lowStock = inventory.filter(m => m.status === 'Low Stock').length;
  const outOfStock = inventory.filter(m => m.status === 'Out of Stock').length;
  const stockValue = inventory.reduce((sum, m) => sum + (m.price * m.stock), 0);

  // Health Chart Data
  const healthData = [
    { name: 'In Stock', value: inStock },
    { name: 'Low Stock', value: lowStock },
    { name: 'Out of Stock', value: outOfStock }
  ];

  // Mock Trend Data
  const trendData = [
    { day: 'Mon', added: 120, sold: 80 },
    { day: 'Tue', added: 50, sold: 95 },
    { day: 'Wed', added: 200, sold: 110 },
    { day: 'Thu', added: 0, sold: 70 },
    { day: 'Fri', added: 150, sold: 130 },
    { day: 'Sat', added: 30, sold: 150 },
    { day: 'Sun', added: 0, sold: 90 },
  ];

  const categories = [...new Set(inventory.map(m => m.category || 'Uncategorized'))];

  // Filtering
  const filteredInventory = inventory.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || m.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
    const matchesType = filterType === 'All' || (filterType === 'OTC' ? m.isOtc : !m.isOtc);
    return matchesSearch && matchesCategory && matchesStatus && matchesType;
  });

  const { currentPage, totalPages, totalItems, paginatedItems, goToPage, pageSize } = usePagination(filteredInventory, 20);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    goToPage(1);
  };
  const handleFilterCat = (e) => {
    setFilterCategory(e.target.value);
    goToPage(1);
  };
  const handleFilterStatus = (e) => {
    setFilterStatus(e.target.value);
    goToPage(1);
  };
  const handleFilterType = (e) => {
    setFilterType(e.target.value);
    goToPage(1);
  };

  const needsAttention = inventory.filter(m => m.status !== 'In Stock').sort((a, b) => a.stock - b.stock);

  const openModal = (med, type) => {
    setModalState({ isOpen: true, med, type });
    setAdjustData({ type: 'add', qty: type === 'restock' && med ? (med.reorderLevel * 2) : 0, reason: (type === 'restock' || type === 'addStock') ? 'New shipment' : 'Manual correction' });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, med: null, type: null });
  };

  const handleSaveAdjustment = (e) => {
    e.preventDefault();
    const med = modalState.med;
    if (!med) return;
    let newStock = med.stock;
    const qty = parseInt(adjustData.qty, 10) || 0;
    
    if (qty <= 0 && (modalState.type === 'addStock' || modalState.type === 'restock' || adjustData.type !== 'set')) {
      alert('Quantity must be greater than 0');
      return;
    }

    if (modalState.type === 'restock' || modalState.type === 'addStock') {
      newStock += qty;
    } else {
      if (adjustData.type === 'add') newStock += qty;
      else if (adjustData.type === 'remove') newStock = Math.max(0, newStock - qty);
      else if (adjustData.type === 'set') newStock = qty;
    }

    updateStock(med.id, newStock, adjustData.reason, modalState.type === 'restock' ? 'Restock' : (modalState.type === 'addStock' ? 'Add Stock' : 'Adjust'));
    setSuccessMsg(`${med.name} stock updated from ${med.stock} → ${newStock}.`);
    setTimeout(() => setSuccessMsg(''), 5000);
    closeModal();
  };

  const renderBadge = (status) => {
    if (status === 'In Stock') return <Badge variant="primary" className="px-1.5 py-0.5 text-[10px]"><span className="w-1.5 h-1.5 rounded-full bg-primary"></span> In Stock</Badge>;
    if (status === 'Low Stock') return <Badge variant="tertiary" className="px-1.5 py-0.5 text-[10px]"><span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Low Stock</Badge>;
    return <Badge variant="error" className="bg-error-container text-on-error-container px-1.5 py-0.5 text-[10px]"><span className="w-1.5 h-1.5 rounded-full bg-error"></span> Out of Stock</Badge>;
  };

  return (
    <div className="p-space-lg flex flex-col gap-space-lg">
      {successMsg && <div className="bg-primary-container text-on-primary-container p-3 rounded-lg font-bold mb-2">{successMsg}</div>}
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Inventory Management</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Monitor stock levels, identify low-stock medicines, and manage inventory efficiently.</p>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="flex items-center bg-surface-container rounded-lg px-3 py-2 border border-outline-variant/30 focus-within:border-primary">
            <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Search by SKU or name..." 
              className="bg-transparent border-none outline-none text-on-surface text-body-md w-full md:w-64"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <button onClick={() => openModal(null, 'addStock')} className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md font-bold hover:bg-primary/90 transition-colors shrink-0">
            <span className="material-symbols-outlined text-[20px]">inventory_2</span>
            Add Stock
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-space-sm">
        <Card className="p-space-md flex flex-col gap-2">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Total SKUs</span>
          <span className="text-on-surface font-headline-md font-bold">{totalSkus}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-primary">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">In Stock</span>
          <span className="text-primary font-headline-md font-bold">{inStock}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-tertiary">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Low Stock</span>
          <span className="text-tertiary font-headline-md font-bold">{lowStock}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-error">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Out of Stock</span>
          <span className="text-error font-headline-md font-bold">{outOfStock}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Stock Value</span>
          <span className="text-on-surface font-headline-md font-bold">৳{stockValue.toLocaleString()}</span>
        </Card>
      </div>

      {/* Analytics & Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Charts */}
        <div className="flex flex-col gap-space-lg lg:col-span-1">
          <Card className="p-space-md flex-1">
            <h3 className="font-label-md font-bold text-on-surface mb-2">Inventory Health</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={healthData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
                    <Cell fill={isDarkMode ? '#72F8E4' : '#00675c'} />
                    <Cell fill={isDarkMode ? '#FFB783' : '#815100'} />
                    <Cell fill={isDarkMode ? '#FFB4AB' : '#ba1a1a'} />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-container)', border: 'none', borderRadius: '4px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: isDarkMode ? '#72F8E4' : '#00675c' }}></span> In Stock</div>
              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: isDarkMode ? '#FFB783' : '#815100' }}></span> Low</div>
              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: isDarkMode ? '#FFB4AB' : '#ba1a1a' }}></span> Out</div>
            </div>
          </Card>
          <Card className="p-space-md flex-1">
            <h3 className="font-label-md font-bold text-on-surface mb-2">Stock Trend (7 Days)</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 10 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-container-highest)', borderColor: 'var(--color-outline-variant)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="added" stroke={isDarkMode ? '#7AD7BE' : '#00675c'} strokeWidth={2} dot={false} name="Added" />
                  <Line type="monotone" dataKey="sold" stroke={isDarkMode ? '#FFB783' : '#815100'} strokeWidth={2} dot={false} name="Sold" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Needs Attention */}
        <Card className="p-space-md lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-error">warning</span>
            <h3 className="font-headline-sm font-bold text-on-surface">Needs Attention</h3>
            <Badge variant="error" className="ml-2 bg-error-container text-on-error-container">{needsAttention.length} Items</Badge>
          </div>
          <div className="overflow-auto flex-1 max-h-[300px]">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low text-on-surface-variant text-[11px] uppercase sticky top-0 z-10">
                <tr>
                  <th className="p-3 border-b border-outline-variant/30">Medicine</th>
                  <th className="p-3 border-b border-outline-variant/30">Stock</th>
                  <th className="p-3 border-b border-outline-variant/30">Reorder</th>
                  <th className="p-3 border-b border-outline-variant/30">Status</th>
                  <th className="p-3 border-b border-outline-variant/30 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {needsAttention.map(med => (
                  <tr key={'attn-'+med.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low transition-colors">
                    <td className="p-3">
                      <span className="font-bold text-on-surface text-body-sm">{med.name}</span>
                      <div className="text-[10px] text-on-surface-variant">{med.sku}</div>
                    </td>
                    <td className="p-3 font-bold text-body-sm">{med.stock}</td>
                    <td className="p-3 text-body-sm">{med.reorderLevel}</td>
                    <td className="p-3">{renderBadge(med.status)}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => openModal(med, 'restock')} className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 rounded-md text-[11px] font-bold transition-colors">Restock</button>
                    </td>
                  </tr>
                ))}
                {needsAttention.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-on-surface-variant text-body-sm">All items are sufficiently stocked.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Main Inventory Table */}
      <Card className="overflow-hidden flex flex-col">
        <div className="p-space-md border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-space-md bg-surface-container-low">
          <div className="flex items-center gap-space-md">
            <h3 className="font-headline-sm font-bold text-on-surface">Full Inventory</h3>
          </div>
          
          <div className="flex flex-wrap items-center gap-space-sm">
            <select className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-lg px-3 py-1.5 font-body-sm focus:outline-none focus:border-primary" value={filterCategory} onChange={handleFilterCat}>
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-lg px-3 py-1.5 font-body-sm focus:outline-none focus:border-primary" value={filterStatus} onChange={handleFilterStatus}>
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
            <select className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-lg px-3 py-1.5 font-body-sm focus:outline-none focus:border-primary" value={filterType} onChange={handleFilterType}>
              <option value="All">All Types (Rx/OTC)</option>
              <option value="Rx">Rx</option>
              <option value="OTC">OTC</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredInventory.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">No items found matching your filters.</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container-highest/20 text-on-surface-variant font-label-sm tracking-wider uppercase">
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Product</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">SKU / Category</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Stock</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Status</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Value</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map(med => (
                  <tr key={med.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-highest/20 p-1 shrink-0">
                          <img src={med.image} alt={med.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface text-label-md">{med.name}</span>
                          <span className="text-[10px] text-on-surface-variant">{med.genericName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-body-sm font-medium text-on-surface">{med.sku}</span>
                        <span className="text-[10px] text-on-surface-variant capitalize">{med.category}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-body-sm font-bold text-on-surface">{med.stock}</span>
                        <span className="text-[10px] text-on-surface-variant">Reorder: {med.reorderLevel}</span>
                      </div>
                    </td>
                    <td className="p-4">{renderBadge(med.status)}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-price-md font-bold text-primary">৳{(med.stock * med.price).toLocaleString()}</span>
                        <span className="text-[10px] text-on-surface-variant">৳{med.price} / unit</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => openModal(med, 'adjust')} className="text-primary hover:bg-surface-container-high px-2 py-1.5 rounded-md text-[12px] font-bold transition-colors">Adjust Stock</button>
                    </td>
                  </tr>
                ))}
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
              itemName="items"
            />
          </div>
        )}
      </Card>

      {/* Recent Activity */}
      <Card className="p-space-md">
        <h3 className="font-headline-sm font-bold text-on-surface mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-on-surface-variant text-[11px] uppercase border-b border-outline-variant/30">
                <th className="pb-2 font-semibold">Date</th>
                <th className="pb-2 font-semibold">Action</th>
                <th className="pb-2 font-semibold">Medicine</th>
                <th className="pb-2 font-semibold">Quantity</th>
                <th className="pb-2 font-semibold">Reason</th>
              </tr>
            </thead>
            <tbody>
              {activityHistory.slice(0, 5).map(act => (
                <tr key={act.id} className="border-b border-outline-variant/10 text-body-sm text-on-surface">
                  <td className="py-3 text-[11px] text-on-surface-variant">{act.date}</td>
                  <td className="py-3"><Badge variant="surface" className="text-[10px]">{act.action}</Badge></td>
                  <td className="py-3 font-medium">{act.medicineName}</td>
                  <td className={`py-3 font-bold ${act.quantity.startsWith('-') ? 'text-error' : 'text-primary'}`}>{act.quantity}</td>
                  <td className="py-3 text-on-surface-variant">{act.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Adjust/Restock Modal */}
      {modalState.isOpen && (modalState.med || modalState.type === 'addStock') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/50 backdrop-blur-sm">
          <div className="bg-surface rounded-xl shadow-lg border border-outline-variant/30 w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-space-md border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-sm font-bold text-on-surface">{modalState.type === 'addStock' ? 'Add Stock' : (modalState.type === 'restock' ? 'Restock Medicine' : 'Adjust Stock')}</h2>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-space-md">
              {modalState.type === 'addStock' && (
                <div className="flex flex-col gap-1 mb-4">
                  <label className="font-label-sm font-bold text-on-surface">Select Medicine</label>
                  <select 
                    className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                    value={modalState.med ? modalState.med.id : ''}
                    onChange={(e) => {
                      const selected = inventory.find(m => m.id === e.target.value);
                      setModalState({...modalState, med: selected});
                    }}
                    required
                  >
                    <option value="" disabled>Select a medicine...</option>
                    {inventory.map(m => (
                      <option key={m.id} value={m.id}>{m.name} (SKU: {m.sku})</option>
                    ))}
                  </select>
                </div>
              )}
              {modalState.med && (
              <div className="flex items-center gap-3 mb-6 bg-surface-container-lowest p-3 rounded-lg border border-outline-variant/20">
                <div className="w-12 h-12 rounded-md bg-surface-container-highest/20 p-1">
                  <img src={modalState.med.image} alt={modalState.med.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-on-surface text-label-md">{modalState.med.name}</span>
                  <span className="text-[11px] text-on-surface-variant">Current Stock: <strong className="text-on-surface">{modalState.med.stock}</strong> | Reorder: {modalState.med.reorderLevel}</span>
                  <span className="text-[11px] text-primary font-bold mt-1">
                    Updated Stock Preview: {
                      modalState.type === 'restock' || modalState.type === 'addStock' ? modalState.med.stock + (parseInt(adjustData.qty)||0) : 
                      (adjustData.type === 'add' ? modalState.med.stock + (parseInt(adjustData.qty)||0) : 
                       adjustData.type === 'remove' ? Math.max(0, modalState.med.stock - (parseInt(adjustData.qty)||0)) : 
                       (parseInt(adjustData.qty)||0))
                    }
                  </span>
                </div>
              </div>
              )}
              
              <form id="adjustForm" onSubmit={handleSaveAdjustment} className="flex flex-col gap-4">
                {modalState.type === 'adjust' && (
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm font-bold text-on-surface">Adjustment Type</label>
                    <select 
                      className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                      value={adjustData.type}
                      onChange={(e) => setAdjustData({...adjustData, type: e.target.value})}
                    >
                      <option value="add">Add Stock</option>
                      <option value="remove">Remove Stock</option>
                      <option value="set">Set Exact Stock</option>
                    </select>
                  </div>
                )}
                
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">{(modalState.type === 'restock' || modalState.type === 'addStock') ? 'Quantity to Add' : 'Quantity'}</label>
                  <input 
                    type="number" min="0" required 
                    className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                    value={adjustData.qty}
                    onChange={(e) => setAdjustData({...adjustData, qty: e.target.value})}
                  />
                  {modalState.type === 'restock' && <span className="text-[10px] text-primary mt-1">Suggested restock: {modalState.med.reorderLevel * 2}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">Reason</label>
                  <select 
                    className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary"
                    value={adjustData.reason}
                    onChange={(e) => setAdjustData({...adjustData, reason: e.target.value})}
                  >
                    <option value="New shipment">New shipment</option>
                    <option value="Manual correction">Manual correction</option>
                    <option value="Damaged stock">Damaged stock</option>
                    <option value="Returned stock">Returned stock</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="p-space-md border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-low mt-auto">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg font-label-md font-bold text-on-surface hover:bg-surface-container-high transition-colors">Cancel</button>
              <button form="adjustForm" type="submit" className="px-4 py-2 rounded-lg font-label-md font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors">Confirm {modalState.type === 'addStock' ? 'Add Stock' : (modalState.type === 'restock' ? 'Restock' : 'Adjustment')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const fs = require('fs');
const path = require('path');

const medicineServicePath = path.join(__dirname, 'src', 'services', 'medicineService.js');
let medicineServiceContent = fs.readFileSync(medicineServicePath, 'utf8');

if (!medicineServiceContent.includes('getAll()')) {
  medicineServiceContent = medicineServiceContent.replace(
    'async getTopSelling() {',
    `async getAll() {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_MEDICINES), 300));
  },
  async getTopSelling() {`
  );
  fs.writeFileSync(medicineServicePath, medicineServiceContent);
}

const adminMedicinesPageContent = `import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { medicineService } from '../../services/medicineService';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const AdminMedicinesPage = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterType, setFilterType] = useState('All');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  useEffect(() => {
    medicineService.getAll().then(data => {
      // Add a stock mock value if not present, and active status
      const processed = data.map(m => ({
        ...m,
        stock: m.stock !== undefined ? m.stock : (m.inStock ? Math.floor(Math.random() * 50) + 10 : 0),
        active: m.active !== undefined ? m.active : true
      }));
      setMedicines(processed);
      setLoading(false);
    });
  }, []);

  // Calculate KPIs
  const totalMedicines = medicines.length;
  const activeMedicines = medicines.filter(m => m.active).length;
  const outOfStock = medicines.filter(m => m.stock === 0).length;
  const lowStock = medicines.filter(m => m.stock > 0 && m.stock <= 10).length;
  const rxMedicines = medicines.filter(m => !m.isOtc).length;
  const otcMedicines = medicines.filter(m => m.isOtc).length;
  
  const categories = [...new Set(medicines.map(m => m.category || 'Uncategorized'))];
  const totalCategories = categories.length;

  // Category Stats
  const categoryStats = categories.map(cat => {
    const catMeds = medicines.filter(m => m.category === cat);
    return {
      name: cat,
      total: catMeds.length,
      active: catMeds.filter(m => m.active).length,
      outOfStock: catMeds.filter(m => m.stock === 0).length
    };
  }).sort((a, b) => b.total - a.total);

  // Chart Data
  const rxOtcData = [
    { name: 'Rx (Prescription)', value: rxMedicines },
    { name: 'OTC', value: otcMedicines }
  ];
  const COLORS = ['#0d8275', '#51dbc8', '#a85500', '#ba1a1a'];

  const stockData = [
    { name: 'In Stock', value: totalMedicines - outOfStock - lowStock },
    { name: 'Low Stock', value: lowStock },
    { name: 'Out of Stock', value: outOfStock }
  ];

  // Filtering
  const filteredMedicines = medicines.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (m.genericName && m.genericName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = filterCategory === 'All' || m.category === filterCategory;
    const matchesType = filterType === 'All' || (filterType === 'OTC' ? m.isOtc : !m.isOtc);
    return matchesSearch && matchesCategory && matchesType;
  });

  const toggleStatus = (id) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, active: !m.active } : m));
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingMedicine(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMedicine(null);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const medData = {
      name: formData.get('name'),
      genericName: formData.get('genericName'),
      manufacturer: formData.get('manufacturer'),
      category: formData.get('category'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      isOtc: formData.get('type') === 'OTC',
      active: true,
      image: editingMedicine?.image || 'https://via.placeholder.com/150'
    };

    if (editingMedicine) {
      setMedicines(medicines.map(m => m.id === editingMedicine.id ? { ...m, ...medData } : m));
    } else {
      setMedicines([...medicines, { ...medData, id: 'm' + Date.now() }]);
    }
    closeModal();
  };

  if (loading) {
    return <div className="p-6 text-on-surface">Loading catalog...</div>;
  }

  return (
    <div className="p-space-lg flex flex-col gap-space-lg">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-1">
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Medicines & Catalog</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Manage medicines, categories, pricing, stock, Rx/OTC status, and availability.</p>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="flex items-center bg-surface-container rounded-lg px-3 py-2 border border-outline-variant/30 focus-within:border-primary">
            <span className="material-symbols-outlined text-outline mr-2 text-[20px]">search</span>
            <input 
              type="text" 
              placeholder="Search medicines..." 
              className="bg-transparent border-none outline-none text-on-surface text-body-md w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded-lg font-label-md font-bold hover:bg-primary/90 transition-colors shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Medicine
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-space-sm">
        <Card className="p-space-md flex flex-col gap-2">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Total</span>
          <span className="text-on-surface font-headline-md font-bold">{totalMedicines}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-primary">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Active</span>
          <span className="text-primary font-headline-md font-bold">{activeMedicines}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-error">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Out of Stock</span>
          <span className="text-error font-headline-md font-bold">{outOfStock}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2 border-b-4 border-tertiary">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Low Stock</span>
          <span className="text-tertiary font-headline-md font-bold">{lowStock}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Rx Meds</span>
          <span className="text-on-surface font-headline-md font-bold">{rxMedicines}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">OTC Meds</span>
          <span className="text-on-surface font-headline-md font-bold">{otcMedicines}</span>
        </Card>
        <Card className="p-space-md flex flex-col gap-2">
          <span className="text-outline font-label-sm font-semibold uppercase tracking-wider text-[10px]">Categories</span>
          <span className="text-on-surface font-headline-md font-bold">{totalCategories}</span>
        </Card>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Category Distribution */}
        <Card className="p-space-lg lg:col-span-2">
          <h3 className="font-headline-sm font-bold text-on-surface mb-6">Medicines by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-outline-variant)" opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-on-surface-variant)', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface-container-highest)', borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-surface)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--color-on-surface)' }}
                />
                <Bar dataKey="total" name="Total Meds" fill="var(--color-primary)" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Rx vs OTC & Stock */}
        <div className="flex flex-col gap-space-lg">
          <Card className="p-space-md flex-1">
            <h3 className="font-label-md font-bold text-on-surface mb-2">Rx vs OTC</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={rxOtcData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
                    {rxOtcData.map((entry, index) => <Cell key={\`cell-\${index}\`} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-container)', border: 'none', borderRadius: '4px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-[#0d8275]"></span> Rx</div>
              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-[#51dbc8]"></span> OTC</div>
            </div>
          </Card>
          
          <Card className="p-space-md flex-1">
            <h3 className="font-label-md font-bold text-on-surface mb-2">Stock Status</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={stockData} cx="50%" cy="50%" innerRadius={30} outerRadius={50} paddingAngle={2} dataKey="value">
                    <Cell fill="var(--color-primary)" />
                    <Cell fill="var(--color-tertiary)" />
                    <Cell fill="var(--color-error)" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface-container)', border: 'none', borderRadius: '4px', fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-2">
              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-primary"></span> In Stock</div>
              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Low</div>
              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant"><span className="w-2 h-2 rounded-full bg-error"></span> Out</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Categories Overview */}
      <Card className="p-space-lg overflow-x-auto">
        <h3 className="font-headline-sm font-bold text-on-surface mb-4">Categories Overview</h3>
        <div className="flex gap-4 min-w-max pb-2">
          {categoryStats.map(cat => (
            <div key={cat.name} className="flex flex-col gap-1 bg-surface-container-low border border-outline-variant/30 p-3 rounded-lg min-w-[140px]">
              <span className="font-label-md font-bold text-on-surface capitalize">{cat.name}</span>
              <div className="flex justify-between items-center text-[11px] text-on-surface-variant mt-1">
                <span>Total: {cat.total}</span>
                <span className={cat.outOfStock > 0 ? 'text-error font-bold' : ''}>OOS: {cat.outOfStock}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Catalog Table Area */}
      <Card className="overflow-hidden flex flex-col">
        {/* Table Filters */}
        <div className="p-space-md border-b border-outline-variant/30 flex flex-wrap items-center justify-between gap-space-md bg-surface-container-low">
          <div className="flex items-center gap-space-md">
            <h3 className="font-headline-sm font-bold text-on-surface">Catalog</h3>
            <Badge variant="surface">{filteredMedicines.length} items</Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-space-sm">
            <select 
              className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-lg px-3 py-1.5 font-body-sm focus:outline-none focus:border-primary"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            <select 
              className="bg-surface-container text-on-surface border border-outline-variant/30 rounded-lg px-3 py-1.5 font-body-sm focus:outline-none focus:border-primary"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="All">All Types (Rx/OTC)</option>
              <option value="Rx">Prescription (Rx)</option>
              <option value="OTC">OTC</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {filteredMedicines.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-[48px] text-outline-variant mb-4">search_off</span>
              <h3 className="font-headline-sm text-on-surface mb-2">No medicines found</h3>
              <p className="text-body-sm text-on-surface-variant max-w-md">Try adjusting your search query or filters to find what you're looking for.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-highest/20 text-on-surface-variant font-label-sm tracking-wider uppercase">
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Medicine</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Category</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Price</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Stock</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Type</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold">Status</th>
                  <th className="p-4 border-b border-outline-variant/30 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="align-middle">
                {filteredMedicines.map(med => (
                  <tr key={med.id} className="border-b border-outline-variant/20 hover:bg-surface-container-low/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-highest/20 p-1 flex-shrink-0">
                          <img src={med.image} alt={med.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-label-md font-bold text-on-surface">{med.name}</span>
                          <span className="text-[11px] text-on-surface-variant truncate max-w-[150px]" title={med.genericName}>{med.genericName}</span>
                          <span className="text-[10px] text-outline mt-0.5">{med.manufacturer}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-body-sm text-on-surface capitalize">{med.category}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-price-md font-bold text-primary">৳{med.price}</span>
                    </td>
                    <td className="p-4">
                      {med.stock > 10 ? (
                        <span className="text-body-sm font-medium text-on-surface">{med.stock} units</span>
                      ) : med.stock > 0 ? (
                        <span className="text-body-sm font-bold text-tertiary">{med.stock} units (Low)</span>
                      ) : (
                        <Badge variant="error" className="bg-error-container text-on-error-container px-1.5 py-0.5 text-[10px]">Out of Stock</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      {med.isOtc ? (
                        <Badge variant="secondary" className="px-1.5 py-0.5 text-[10px]">OTC</Badge>
                      ) : (
                        <Badge variant="primary" className="px-1.5 py-0.5 text-[10px]">Rx</Badge>
                      )}
                    </td>
                    <td className="p-4">
                      {med.active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-secondary">
                          <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-outline">
                          <span className="w-1.5 h-1.5 rounded-full bg-outline"></span> Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toggleStatus(med.id)} className="p-1.5 rounded-md hover:bg-surface-container-high text-on-surface-variant transition-colors" title={med.active ? "Deactivate" : "Activate"}>
                          <span className="material-symbols-outlined text-[18px]">{med.active ? 'visibility_off' : 'visibility'}</span>
                        </button>
                        <button onClick={() => handleEdit(med)} className="p-1.5 rounded-md hover:bg-surface-container-high text-primary transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-scrim/50 backdrop-blur-sm">
          <div className="bg-surface rounded-xl shadow-lg border border-outline-variant/30 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-space-md border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-sm font-bold text-on-surface">{editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}</h2>
              <button onClick={closeModal} className="p-1 rounded-full hover:bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-space-md overflow-y-auto">
              <form id="medicineForm" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label className="font-label-sm font-bold text-on-surface">Medicine Name</label>
                  <input name="name" defaultValue={editingMedicine?.name} required className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">Generic Name</label>
                  <input name="genericName" defaultValue={editingMedicine?.genericName} required className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">Manufacturer</label>
                  <input name="manufacturer" defaultValue={editingMedicine?.manufacturer} required className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">Category</label>
                  <select name="category" defaultValue={editingMedicine?.category || 'fever'} className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary">
                    <option value="fever">Fever</option>
                    <option value="gastric">Gastric</option>
                    <option value="allergy">Allergy</option>
                    <option value="pain">Pain</option>
                    <option value="vitamins">Vitamins</option>
                    <option value="diabetes">Diabetes</option>
                    <option value="heart">Heart</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">Type</label>
                  <select name="type" defaultValue={editingMedicine?.isOtc ? 'OTC' : 'Rx'} className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary">
                    <option value="Rx">Prescription (Rx)</option>
                    <option value="OTC">OTC</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">Price (৳)</label>
                  <input name="price" type="number" step="0.01" defaultValue={editingMedicine?.price} required className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm font-bold text-on-surface">Stock Quantity</label>
                  <input name="stock" type="number" defaultValue={editingMedicine?.stock || 0} required className="bg-surface-container border border-outline-variant/30 rounded-lg px-3 py-2 text-on-surface focus:outline-none focus:border-primary" />
                </div>
              </form>
            </div>
            <div className="p-space-md border-t border-outline-variant/30 flex justify-end gap-3 bg-surface-container-low mt-auto">
              <button onClick={closeModal} className="px-4 py-2 rounded-lg font-label-md font-bold text-on-surface hover:bg-surface-container-high transition-colors">Cancel</button>
              <button form="medicineForm" type="submit" className="px-4 py-2 rounded-lg font-label-md font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors">Save Medicine</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'admin', 'AdminMedicinesPage.jsx'), adminMedicinesPageContent);

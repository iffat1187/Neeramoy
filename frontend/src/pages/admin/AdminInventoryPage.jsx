import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const AdminInventoryPage = () => {
  const { inventory, updateStock } = useInventory();
  const [editingMedId, setEditingMedId] = useState(null);
  const [editStock, setEditStock] = useState('');

  const handleEditClick = (med) => {
    setEditingMedId(med.id);
    setEditStock(med.stock.toString());
  };

  const handleSave = (id) => {
    updateStock(id, parseInt(editStock, 10) || 0);
    setEditingMedId(null);
  };

  return (
    <div className="space-y-space-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-headline-md font-bold">ফার্মেসি ইনভেন্টরি ও কোল্ড-চেইন স্টক কন্ট্রোল</h1>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low text-label-sm font-bold text-on-surface-variant sticky top-0">
            <tr>
              <th className="p-4 border-b border-outline-variant/30">Medicine Formulation</th>
              <th className="p-4 border-b border-outline-variant/30">SKU</th>
              <th className="p-4 border-b border-outline-variant/30">Price</th>
              <th className="p-4 border-b border-outline-variant/30">Current Stock</th>
              <th className="p-4 border-b border-outline-variant/30">Status</th>
              <th className="p-4 border-b border-outline-variant/30">Action</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(med => (
              <tr key={med.id} className="border-b border-outline-variant/20 hover:bg-surface-container transition-colors">
                <td className="p-4">
                  <div className="font-bold text-on-surface">{med.name}</div>
                  <div className="text-[10px] text-on-surface-variant">{med.category}</div>
                </td>
                <td className="p-4 text-body-sm">{med.sku}</td>
                <td className="p-4 font-price-sm">৳{med.price}</td>
                <td className="p-4">
                  {editingMedId === med.id ? (
                    <input 
                      type="number" 
                      value={editStock} 
                      onChange={(e) => setEditStock(e.target.value)}
                      className="w-20 p-1 border border-outline-variant rounded"
                    />
                  ) : (
                    <span className="font-bold">{med.stock}</span>
                  )}
                </td>
                <td className="p-4">
                  <Badge variant={med.status === 'In Stock' ? 'success' : med.status === 'Low Stock' ? 'warning' : 'error'} text={med.status} />
                </td>
                <td className="p-4">
                  {editingMedId === med.id ? (
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => handleSave(med.id)}>Save</Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingMedId(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <button className="text-primary font-bold text-label-sm hover:underline" onClick={() => handleEditClick(med)}>Update Stock</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

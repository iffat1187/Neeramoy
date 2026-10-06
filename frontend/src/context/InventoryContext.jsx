import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_MEDICINES } from '../mockData/medicines';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([]);
  const [activityHistory, setActivityHistory] = useState([]);

  useEffect(() => {
    // Initialize inventory from MOCK_MEDICINES
    const initialInventory = MOCK_MEDICINES.map((med, index) => {
      const stock = med.inStock ? Math.floor(Math.random() * 50) + 1 : 0;
      const reorderLevel = Math.floor(Math.random() * 15) + 5;
      let status = 'In Stock';
      if (stock === 0) status = 'Out of Stock';
      else if (stock <= reorderLevel) status = 'Low Stock';

      return {
        ...med,
        sku: `SKU-${med.name.substring(0,3).toUpperCase()}-${1000 + index}`,
        stock,
        reorderLevel,
        status,
        lastUpdated: new Date().toLocaleDateString('en-GB')
      };
    });
    setInventory(initialInventory);

    // Mock initial activities
    setActivityHistory([
      { id: 'a1', medicineName: 'Napa Extra', action: 'Restock', quantity: '+50', reason: 'New shipment', date: new Date().toLocaleString('en-GB') },
      { id: 'a2', medicineName: 'Maxpro 20', action: 'Adjust', quantity: '-2', reason: 'Damaged stock', date: new Date(Date.now() - 86400000).toLocaleString('en-GB') },
    ]);
  }, []);

  const updateStock = (id, newStock, reason, actionType = 'Adjust') => {
    setInventory(prev => prev.map(med => {
      if (med.id === id) {
        let status = 'In Stock';
        if (newStock === 0) status = 'Out of Stock';
        else if (newStock <= med.reorderLevel) status = 'Low Stock';
        
        const diff = newStock - med.stock;
        
        setActivityHistory(acts => [
          {
            id: 'act-' + Date.now(),
            medicineName: med.name,
            action: actionType,
            quantity: diff > 0 ? `+${diff}` : diff.toString(),
            reason: reason,
            date: new Date().toLocaleString('en-GB')
          },
          ...acts
        ]);

        return {
          ...med,
          stock: newStock,
          status,
          lastUpdated: new Date().toLocaleDateString('en-GB')
        };
      }
      return med;
    }));
  };

  return (
    <InventoryContext.Provider value={{
      inventory,
      activityHistory,
      updateStock
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

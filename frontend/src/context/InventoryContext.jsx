import React, { createContext, useContext, useState } from 'react';

const InventoryContext = createContext();

export const useInventory = () => useContext(InventoryContext);

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState([
    {
      id: 'med-1',
      name: 'Sergel 20mg Capsule',
      sku: 'SKU-SER-20',
      category: 'Acid Reducer',
      price: 70,
      stock: 15,
      status: 'Low Stock',
      lastUpdated: '11/10/2024'
    },
    {
      id: 'med-2',
      name: 'Lantus Solostar 100 IU/ml',
      sku: 'SKU-LAN-100',
      category: 'Diabetes',
      price: 1020,
      stock: 3,
      status: 'Out of Stock',
      lastUpdated: '09/10/2024'
    },
    {
      id: 'med-3',
      name: 'Napa Extra 500mg',
      sku: 'SKU-NAP-EXT',
      category: 'Pain Relief',
      price: 35,
      stock: 22,
      status: 'In Stock',
      lastUpdated: '08/10/2024'
    },
    {
      id: 'med-4',
      name: 'Maxpro 20mg Tablet',
      sku: 'SKU-MAX-20',
      category: 'Acid Reducer',
      price: 70,
      stock: 450,
      status: 'In Stock',
      lastUpdated: '01/10/2024'
    }
  ]);

  const updateStock = (id, newStock) => {
    setInventory(prev => prev.map(med => {
      if (med.id === id) {
        let status = 'In Stock';
        if (newStock <= 0) status = 'Out of Stock';
        else if (newStock <= 20) status = 'Low Stock';
        
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
      updateStock
    }}>
      {children}
    </InventoryContext.Provider>
  );
};

import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const { isLoggedIn, user } = useAuth();

  const addOrder = (order) => {
    // Only logged in users can add orders, but we assume Auth Guard handled this.
    // Attach a status if not present
    const newOrder = {
      ...order,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const getOrder = (orderId) => {
    return orders.find(o => o.orderId === orderId);
  };
  
  // Clear orders when user logs out
  // Simple mock: just keep the list for now, or reset if not logged in
  const userOrders = isLoggedIn ? orders : [];

  return (
    <OrderContext.Provider value={{
      orders: userOrders,
      addOrder,
      getOrder
    }}>
      {children}
    </OrderContext.Provider>
  );
};

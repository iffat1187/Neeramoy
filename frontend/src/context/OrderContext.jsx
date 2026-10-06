import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const useOrder = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-5531',
      orderId: 'ORD-5531',
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      status: 'Pending',
      paymentMethod: 'bKash',
      paymentStatus: 'Paid',
      deliveryMethod: 'Express (3 Hours)',
      customer: {
        name: 'Sadia Islam',
        phone: '01922334455',
        address: 'House 12, Road 4, Banani, Dhaka'
      },
      items: [
        { id: 'm1', name: 'Napa Extra 500mg', price: 35, quantity: 2, image: 'https://via.placeholder.com/150' },
        { id: 'm2', name: 'Maxpro 20mg Tablet', price: 70, quantity: 1, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 140,
      deliveryFee: 60,
      discount: 0,
      total: 200
    },
    {
      id: 'ORD-5532',
      orderId: 'ORD-5532',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      status: 'Processing',
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      deliveryMethod: 'Standard (12-24 Hours)',
      customer: {
        name: 'Kamrul Hasan',
        phone: '01833445566',
        address: 'House 5, Road 2, Nasirabad, Chittagong'
      },
      items: [
        { id: 'm3', name: 'Sergel 20mg', price: 70, quantity: 3, image: 'https://via.placeholder.com/150' }
      ],
      subtotal: 210,
      deliveryFee: 40,
      discount: 10,
      total: 240
    }
  ]);
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
    return orders.find(o => o.id === orderId || o.orderId === orderId);
  };

  const updateOrderStatus = (orderId, newStatus, reason = null) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderId === orderId) {
        return { ...o, status: newStatus, ...(reason && { cancellationReason: reason }) };
      }
      return o;
    }));
  };
  
  // Clear orders when user logs out
  // Simple mock: just keep the list for now, or reset if not logged in
  const userOrders = isLoggedIn ? orders : [];

  return (
    <OrderContext.Provider value={{
      orders: userOrders,
      addOrder,
      getOrder,
      updateOrderStatus
    }}>
      {children}
    </OrderContext.Provider>
  );
};

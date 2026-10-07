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
        { id: 'm1', name: 'Napa Extra 500mg', price: 35, quantity: 2, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf8QgTeefksxI4jClTU-PDm5OQGVzeqSviWKknUQk2hH5iwHllB_t5r66_8hNU2NhKf8S2XjuM3BefCKC0GCSUX9L8XVd-EYMaJ8JwU5NXz9caJugnojSHHG0KPp2KiwJ7iZ09un8E53fvU7vNufU9X3dKh4YjZkZJWIb_m6hwU39LDq6QaRO_pV86Q22FbrHsX90z9msuDxPMvrJera8fBrFq3NY17SYtrnRNfvCihcC4rvsIMXUk' },
        { id: 'm2', name: 'Maxpro 20mg Tablet', price: 70, quantity: 1, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQj3-lgFODFI5vzOkC4eapSi8EnH7Nb4M5OUcW69JUvPSPCmf7nRyL_hqSX_NHnikYAurvlLX6Qf6_zLn8f3f222UZya3RloN3579elgODymD0d9vZgOTp3MLu2R-Ma2o2APRT4kKjiZDY_9mQeD9hsxRUx6wr3MBuFfywXsSnyj_KkC_P96CwTtgWp_Nyxq05T9drSiozNdLu9jMasnthMq5A0Jn6QBebJ3jrIgQQn0miKJb-c8Vs' }
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
        { id: 'm3', name: 'Monas 10', price: 70, quantity: 3, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeDFEaSDObBgWG7mxSHvgK6s8c859NxIdvWWrvxYar3WjA6_HnEcYy5GCRXaBbm81KYRHKnyjub6Kg2ltQjdV2Wm0x5-GKDthSatrXU1PkqH0MdjBlDFO_op3DKMEBAOWE7EDbmqStL4_aYS9MASteW9zDSlOus4G3KLEdl8ShmqtgRV8mJKJjG81UEA7Ge4Tde0CR81FCQv5fcVDMyJXAUQpe_WnxatKFDnpnsaBZ-LqhkoUa0TGg' }
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

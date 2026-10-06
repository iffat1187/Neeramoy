import React, { createContext, useContext, useState } from 'react';

const PrescriptionContext = createContext();

export const usePrescription = () => useContext(PrescriptionContext);

export const PrescriptionProvider = ({ children }) => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'rx-1',
      title: 'Dr. Rahman - Monas 10mg',
      uploadDate: '10 Oct 2024',
      status: 'Approved',
      fileName: 'prescription_rahman.pdf',
      type: 'pdf',
      preview: null,
      customerName: 'Tanvir Hasan',
      phone: '+880 1712-345678'
    },
    {
      id: 'rx-2',
      title: 'Dr. Siddique - Insulin',
      uploadDate: '05 Oct 2024',
      status: 'Pending',
      fileName: 'insulin_slip.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/150',
      customerName: 'Tanvir Hasan',
      phone: '+880 1712-345678'
    }
  ]);

  const addPrescription = (rx) => {
    setPrescriptions(prev => [rx, ...prev]);
  };

  const updatePrescriptionStatus = (id, status, reason = '') => {
    setPrescriptions(prev => prev.map(rx => rx.id === id ? { ...rx, status, reason } : rx));
  };

  const deletePrescription = (id) => {
    setPrescriptions(prev => prev.filter(rx => rx.id !== id));
  };

  return (
    <PrescriptionContext.Provider value={{
      prescriptions,
      addPrescription,
      updatePrescriptionStatus,
      deletePrescription
    }}>
      {children}
    </PrescriptionContext.Provider>
  );
};

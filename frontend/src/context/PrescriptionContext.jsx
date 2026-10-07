import React, { createContext, useContext, useState } from 'react';

const PrescriptionContext = createContext();

export const usePrescription = () => useContext(PrescriptionContext);

export const PrescriptionProvider = ({ children }) => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'RX-8842',
      title: 'Dr. Rahman - Monas 10mg',
      uploadDate: new Date(Date.now() - 172800000).toISOString(),
      status: 'Approved',
      fileName: 'prescription_rahman.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=PDF+Document',
      customerName: 'Tanvir Hasan',
      phone: '01712345678',
      reviewedBy: 'Admin',
      reviewedDate: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'RX-8843',
      title: 'Dr. Siddique - Insulin',
      uploadDate: new Date(Date.now() - 3600000).toISOString(),
      status: 'Pending',
      fileName: 'insulin_slip.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Prescription+Image',
      customerName: 'Tanvir Hasan',
      phone: '01712345678'
    },
    {
      id: 'RX-8844',
      title: 'General checkup - Napa',
      uploadDate: new Date(Date.now() - 7200000).toISOString(),
      status: 'Pending',
      fileName: 'handwritten.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Handwritten+RX',
      customerName: 'Sadia Islam',
      phone: '01922334455'
    },
    {
      id: 'RX-8845',
      title: 'Dr. Ahmed - Inhaler',
      uploadDate: new Date(Date.now() - 259200000).toISOString(),
      status: 'Rejected',
      reason: 'Image unclear',
      fileName: 'blur_cam.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Blurry+Image',
      customerName: 'Kamrul Hasan',
      phone: '01833445566',
      reviewedBy: 'Admin',
      reviewedDate: new Date(Date.now() - 172800000).toISOString()
    }
  ]);

  const addPrescription = (rx) => {
    setPrescriptions(prev => [rx, ...prev]);
  };

  const updatePrescriptionStatus = (id, status, reason = '') => {
    setPrescriptions(prev => prev.map(rx => rx.id === id ? { ...rx, status, reason, reviewedDate: new Date().toISOString(), reviewedBy: 'Admin' } : rx));
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

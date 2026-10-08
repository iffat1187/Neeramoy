import React, { createContext, useContext, useState } from 'react';

const PrescriptionContext = createContext();

export const usePrescription = () => useContext(PrescriptionContext);

export const PrescriptionProvider = ({ children }) => {
  const [prescriptions, setPrescriptions] = useState([
    {
      id: 'RX-8842',
      title: 'Dr. Rahman - Monas 10mg',
      uploadDate: new Date(Date.now() - 172800000).toISOString(),
      status: 'APPROVED',
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
      status: 'PENDING',
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
      status: 'PENDING',
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
      status: 'REJECTED',
      rejectionReason: 'Image unclear',
      fileName: 'blur_cam.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Blurry+Image',
      customerName: 'Kamrul Hasan',
      phone: '01833445566',
      reviewedBy: 'Admin',
      reviewedDate: new Date(Date.now() - 172800000).toISOString()
    },
{
      id: 'RX-9001',
      title: 'Prescription 1',
      uploadDate: new Date(Date.now() - 3600000).toISOString(),
      status: 'APPROVED',
      fileName: 'doc_1.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+1',
      customerName: 'Customer 1',
      phone: '01999888771'
    },
{
      id: 'RX-9002',
      title: 'Prescription 2',
      uploadDate: new Date(Date.now() - 7200000).toISOString(),
      status: 'REJECTED',
      fileName: 'doc_2.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+2',
      customerName: 'Customer 2',
      phone: '01999888772'
    },
{
      id: 'RX-9003',
      title: 'Prescription 3',
      uploadDate: new Date(Date.now() - 10800000).toISOString(),
      status: 'PENDING',
      fileName: 'doc_3.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+3',
      customerName: 'Customer 3',
      phone: '01999888773'
    },
{
      id: 'RX-9004',
      title: 'Prescription 4',
      uploadDate: new Date(Date.now() - 14400000).toISOString(),
      status: 'APPROVED',
      fileName: 'doc_4.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+4',
      customerName: 'Customer 4',
      phone: '01999888774'
    },
{
      id: 'RX-9005',
      title: 'Prescription 5',
      uploadDate: new Date(Date.now() - 18000000).toISOString(),
      status: 'REJECTED',
      fileName: 'doc_5.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+5',
      customerName: 'Customer 5',
      phone: '01999888775'
    },
{
      id: 'RX-9006',
      title: 'Prescription 6',
      uploadDate: new Date(Date.now() - 21600000).toISOString(),
      status: 'PENDING',
      fileName: 'doc_6.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+6',
      customerName: 'Customer 6',
      phone: '01999888776'
    },
{
      id: 'RX-9007',
      title: 'Prescription 7',
      uploadDate: new Date(Date.now() - 25200000).toISOString(),
      status: 'APPROVED',
      fileName: 'doc_7.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+7',
      customerName: 'Customer 7',
      phone: '01999888777'
    },
{
      id: 'RX-9008',
      title: 'Prescription 8',
      uploadDate: new Date(Date.now() - 28800000).toISOString(),
      status: 'REJECTED',
      fileName: 'doc_8.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+8',
      customerName: 'Customer 8',
      phone: '01999888778'
    },
{
      id: 'RX-9009',
      title: 'Prescription 9',
      uploadDate: new Date(Date.now() - 32400000).toISOString(),
      status: 'PENDING',
      fileName: 'doc_9.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+9',
      customerName: 'Customer 9',
      phone: '01999888779'
    },
{
      id: 'RX-9010',
      title: 'Prescription 10',
      uploadDate: new Date(Date.now() - 36000000).toISOString(),
      status: 'APPROVED',
      fileName: 'doc_10.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+10',
      customerName: 'Customer 10',
      phone: '01999888770'
    },
{
      id: 'RX-9011',
      title: 'Prescription 11',
      uploadDate: new Date(Date.now() - 39600000).toISOString(),
      status: 'REJECTED',
      fileName: 'doc_11.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+11',
      customerName: 'Customer 11',
      phone: '01999888771'
    },
{
      id: 'RX-9012',
      title: 'Prescription 12',
      uploadDate: new Date(Date.now() - 43200000).toISOString(),
      status: 'PENDING',
      fileName: 'doc_12.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+12',
      customerName: 'Customer 12',
      phone: '01999888772'
    },
{
      id: 'RX-9013',
      title: 'Prescription 13',
      uploadDate: new Date(Date.now() - 46800000).toISOString(),
      status: 'APPROVED',
      fileName: 'doc_13.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+13',
      customerName: 'Customer 13',
      phone: '01999888773'
    },
{
      id: 'RX-9014',
      title: 'Prescription 14',
      uploadDate: new Date(Date.now() - 50400000).toISOString(),
      status: 'REJECTED',
      fileName: 'doc_14.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+14',
      customerName: 'Customer 14',
      phone: '01999888774'
    },
{
      id: 'RX-9015',
      title: 'Prescription 15',
      uploadDate: new Date(Date.now() - 54000000).toISOString(),
      status: 'PENDING',
      fileName: 'doc_15.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+15',
      customerName: 'Customer 15',
      phone: '01999888775'
    },
{
      id: 'RX-9016',
      title: 'Prescription 16',
      uploadDate: new Date(Date.now() - 57600000).toISOString(),
      status: 'APPROVED',
      fileName: 'doc_16.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+16',
      customerName: 'Customer 16',
      phone: '01999888776'
    },
{
      id: 'RX-9017',
      title: 'Prescription 17',
      uploadDate: new Date(Date.now() - 61200000).toISOString(),
      status: 'REJECTED',
      fileName: 'doc_17.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+17',
      customerName: 'Customer 17',
      phone: '01999888777'
    },
{
      id: 'RX-9018',
      title: 'Prescription 18',
      uploadDate: new Date(Date.now() - 64800000).toISOString(),
      status: 'PENDING',
      fileName: 'doc_18.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+18',
      customerName: 'Customer 18',
      phone: '01999888778'
    },
{
      id: 'RX-9019',
      title: 'Prescription 19',
      uploadDate: new Date(Date.now() - 68400000).toISOString(),
      status: 'APPROVED',
      fileName: 'doc_19.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+19',
      customerName: 'Customer 19',
      phone: '01999888779'
    },
{
      id: 'RX-9020',
      title: 'Prescription 20',
      uploadDate: new Date(Date.now() - 72000000).toISOString(),
      status: 'REJECTED',
      fileName: 'doc_20.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+20',
      customerName: 'Customer 20',
      phone: '01999888770'
    },
{
      id: 'RX-9021',
      title: 'Prescription 21',
      uploadDate: new Date(Date.now() - 75600000).toISOString(),
      status: 'PENDING',
      fileName: 'doc_21.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+21',
      customerName: 'Customer 21',
      phone: '01999888771'
    },
{
      id: 'RX-9022',
      title: 'Prescription 22',
      uploadDate: new Date(Date.now() - 79200000).toISOString(),
      status: 'APPROVED',
      fileName: 'doc_22.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+22',
      customerName: 'Customer 22',
      phone: '01999888772'
    },
{
      id: 'RX-9023',
      title: 'Prescription 23',
      uploadDate: new Date(Date.now() - 82800000).toISOString(),
      status: 'REJECTED',
      fileName: 'doc_23.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+23',
      customerName: 'Customer 23',
      phone: '01999888773'
    },
{
      id: 'RX-9024',
      title: 'Prescription 24',
      uploadDate: new Date(Date.now() - 86400000).toISOString(),
      status: 'PENDING',
      fileName: 'doc_24.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+24',
      customerName: 'Customer 24',
      phone: '01999888774'
    },
{
      id: 'RX-9025',
      title: 'Prescription 25',
      uploadDate: new Date(Date.now() - 90000000).toISOString(),
      status: 'APPROVED',
      fileName: 'doc_25.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+25',
      customerName: 'Customer 25',
      phone: '01999888775'
    },
{
      id: 'RX-9026',
      title: 'Prescription 26',
      uploadDate: new Date(Date.now() - 93600000).toISOString(),
      status: 'REJECTED',
      fileName: 'doc_26.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+26',
      customerName: 'Customer 26',
      phone: '01999888776'
    },
{
      id: 'RX-9027',
      title: 'Prescription 27',
      uploadDate: new Date(Date.now() - 97200000).toISOString(),
      status: 'PENDING',
      fileName: 'doc_27.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+27',
      customerName: 'Customer 27',
      phone: '01999888777'
    },
{
      id: 'RX-9028',
      title: 'Prescription 28',
      uploadDate: new Date(Date.now() - 100800000).toISOString(),
      status: 'APPROVED',
      fileName: 'doc_28.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+28',
      customerName: 'Customer 28',
      phone: '01999888778'
    },
{
      id: 'RX-9029',
      title: 'Prescription 29',
      uploadDate: new Date(Date.now() - 104400000).toISOString(),
      status: 'REJECTED',
      fileName: 'doc_29.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+29',
      customerName: 'Customer 29',
      phone: '01999888779'
    },
{
      id: 'RX-9030',
      title: 'Prescription 30',
      uploadDate: new Date(Date.now() - 108000000).toISOString(),
      status: 'PENDING',
      fileName: 'doc_30.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+30',
      customerName: 'Customer 30',
      phone: '01999888770'
    },
{
      id: 'RX-9031',
      title: 'Prescription 31',
      uploadDate: new Date(Date.now() - 111600000).toISOString(),
      status: 'APPROVED',
      fileName: 'doc_31.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+31',
      customerName: 'Customer 31',
      phone: '01999888771'
    },
{
      id: 'RX-9032',
      title: 'Prescription 32',
      uploadDate: new Date(Date.now() - 115200000).toISOString(),
      status: 'REJECTED',
      fileName: 'doc_32.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+32',
      customerName: 'Customer 32',
      phone: '01999888772'
    },
{
      id: 'RX-9033',
      title: 'Prescription 33',
      uploadDate: new Date(Date.now() - 118800000).toISOString(),
      status: 'PENDING',
      fileName: 'doc_33.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+33',
      customerName: 'Customer 33',
      phone: '01999888773'
    },
{
      id: 'RX-9034',
      title: 'Prescription 34',
      uploadDate: new Date(Date.now() - 122400000).toISOString(),
      status: 'APPROVED',
      fileName: 'doc_34.pdf',
      type: 'pdf',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+34',
      customerName: 'Customer 34',
      phone: '01999888774'
    },
{
      id: 'RX-9035',
      title: 'Prescription 35',
      uploadDate: new Date(Date.now() - 126000000).toISOString(),
      status: 'REJECTED',
      fileName: 'doc_35.jpg',
      type: 'image',
      preview: 'https://via.placeholder.com/400x500.png?text=Preview+35',
      customerName: 'Customer 35',
      phone: '01999888775'
    }
  ]);

  const addPrescription = (rx) => {
    setPrescriptions(prev => [rx, ...prev]);
  };

  const updatePrescriptionStatus = (id, status, reason = '') => {
    setPrescriptions(prev => prev.map(rx => rx.id === id ? { ...rx, status, rejectionReason: reason, reviewedDate: new Date().toISOString(), reviewedBy: 'Admin' } : rx));
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

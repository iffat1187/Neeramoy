const fs = require('fs');
const path = require('path');

const contextContent = `import React, { createContext, useContext, useState } from 'react';

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
`;

const pageContent = `import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../context/AuthContext';
import { usePrescription } from '../../context/PrescriptionContext';

export const PrescriptionsPage = () => {
  const { prescriptions, addPrescription, deletePrescription } = usePrescription();
  const { user } = useAuth();
  
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [viewingRx, setViewingRx] = useState(null);
  const fileInputRef = useRef(null);
  
  // Filter only the active user's prescriptions based on phone matching mock data structure
  // In a real app, this would use customerId or happen via backend query
  const userPrescriptions = prescriptions.filter(rx => rx.phone === user?.phone || user?.phone === undefined);

  const pendingCount = userPrescriptions.filter(rx => rx.status === 'PENDING').length;
  const approvedCount = userPrescriptions.filter(rx => rx.status === 'APPROVED').length;
  const rejectedCount = userPrescriptions.filter(rx => rx.status === 'REJECTED').length;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a JPG, PNG, or PDF file.');
      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB.');
      setSelectedFile(null);
      return;
    }

    setUploadError('');
    
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedFile({ file, preview: e.target.result, type: 'image' });
      reader.readAsDataURL(file);
    } else {
      setSelectedFile({ file, preview: null, type: 'pdf' });
    }
  };

  const handleUploadSubmit = () => {
    if (!selectedFile) return;

    const newRx = {
      id: \`RX-\${Math.floor(1000 + Math.random() * 9000)}\`,
      title: \`Uploaded - \${selectedFile.file.name.substring(0, 15)}...\`,
      uploadDate: new Date().toISOString(),
      status: 'PENDING',
      fileName: selectedFile.file.name,
      type: selectedFile.type === 'pdf' ? 'pdf' : 'image',
      preview: selectedFile.preview || 'https://via.placeholder.com/400x500.png?text=PDF+Document',
      customerName: user?.name || 'Unknown',
      phone: user?.phone || 'Unknown'
    };

    addPrescription(newRx);
    setSelectedFile(null);
    setIsUploading(false);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      deletePrescription(id);
      if (viewingRx && viewingRx.id === id) setViewingRx(null);
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'APPROVED') return <Badge variant="success" text="Approved" />;
    if (status === 'REJECTED') return <Badge variant="error" text="Rejected" />;
    return <Badge variant="warning" text="Pending" />;
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return isoString; // fallback
    }
  };

  // Preview Modal
  if (viewingRx) {
    return (
      <div className="space-y-space-md">
        <button onClick={() => setViewingRx(null)} className="text-primary hover:underline text-body-sm font-bold flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Prescriptions
        </button>
        
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="bg-surface-container-low px-space-lg py-space-md border-b border-outline-variant/30 flex items-center justify-between">
            <div>
              <h2 className="font-headline-sm font-bold text-on-surface">{viewingRx.title}</h2>
              <p className="font-body-sm text-on-surface-variant">ID: {viewingRx.id} • Uploaded: {formatDate(viewingRx.uploadDate)}</p>
            </div>
            {getStatusBadge(viewingRx.status)}
          </div>
          
          <div className="p-space-lg">
            {viewingRx.status === 'REJECTED' && viewingRx.rejectionReason && (
              <div className="mb-space-lg p-space-md bg-error-container/20 border border-error/30 rounded-xl">
                <p className="font-label-md font-bold text-error mb-1">Rejection Reason:</p>
                <p className="text-body-sm text-on-surface">{viewingRx.rejectionReason}</p>
              </div>
            )}
            
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-center p-space-md min-h-[400px]">
              {viewingRx.type === 'pdf' ? (
                <div className="text-center">
                  <span className="material-symbols-outlined text-[64px] text-primary mb-4">picture_as_pdf</span>
                  <p className="font-label-lg font-bold text-on-surface">{viewingRx.fileName}</p>
                </div>
              ) : (
                <img src={viewingRx.preview} alt="Prescription" className="max-w-full max-h-[600px] object-contain rounded-lg shadow-sm" />
              )}
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-space-lg border-t border-outline-variant/30 flex justify-end">
            <Button variant="outline" className="text-error border-error hover:bg-error-container/10" onClick={() => handleDelete(viewingRx.id)}>
              Delete Prescription
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Upload UI
  if (isUploading) {
    return (
      <div className="space-y-space-md">
        <button onClick={() => { setIsUploading(false); setSelectedFile(null); setUploadError(''); }} className="text-primary hover:underline text-body-sm font-bold flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Prescriptions
        </button>

        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-xl">
          <h2 className="font-headline-md font-bold text-on-surface mb-space-md">Upload New Prescription</h2>
          <p className="font-body-sm text-on-surface-variant mb-space-xl">Upload an image (JPG/PNG) or PDF of your prescription.</p>

          <div className="border-2 border-dashed border-primary/30 bg-primary-container/5 rounded-2xl p-space-xl text-center flex flex-col items-center justify-center min-h-[200px]">
            {selectedFile ? (
              <div className="flex flex-col items-center">
                {selectedFile.type === 'image' && selectedFile.preview ? (
                  <img src={selectedFile.preview} alt="Preview" className="max-h-40 rounded-xl mb-space-md shadow-sm" />
                ) : (
                  <span className="material-symbols-outlined text-[64px] text-primary mb-space-md">picture_as_pdf</span>
                )}
                <p className="font-label-lg font-bold text-on-surface mb-1">{selectedFile.file.name}</p>
                <p className="font-body-sm text-on-surface-variant">{(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
                <button onClick={() => setSelectedFile(null)} className="mt-space-md text-error text-label-sm font-bold hover:underline">
                  Remove file
                </button>
              </div>
            ) : (
              <>
                <span className="material-symbols-outlined text-[48px] text-primary mb-space-md">cloud_upload</span>
                <p className="font-label-lg font-bold text-on-surface mb-2">Drag and drop or click to upload</p>
                <p className="font-body-sm text-on-surface-variant mb-space-md">Supports JPG, PNG, PDF up to 5MB</p>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Select File
                </Button>
              </>
            )}
            <input
              type="file"
              accept="image/jpeg, image/png, application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </div>

          {uploadError && <p className="text-error text-body-sm mt-space-sm">{uploadError}</p>}

          <div className="flex gap-space-md mt-space-xl justify-end">
            <Button variant="outline" onClick={() => { setIsUploading(false); setSelectedFile(null); setUploadError(''); }}>Cancel</Button>
            <Button variant="primary" onClick={handleUploadSubmit} disabled={!selectedFile}>
              Upload Prescription
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Main List UI
  return (
    <div className="space-y-space-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-xl font-bold text-on-surface tracking-tight">My Prescriptions</h1>
          <p className="text-body-md text-on-surface-variant mt-1">Upload and manage your prescriptions for faster ordering.</p>
        </div>
        <Button variant="primary" onClick={() => setIsUploading(true)}>
          <span className="material-symbols-outlined text-[18px]">add</span> Upload Prescription
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-space-md mb-6">
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-md text-center">
          <p className="font-headline-md font-bold text-on-surface">{pendingCount}</p>
          <p className="text-body-sm text-on-surface-variant">Pending</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-md text-center">
          <p className="font-headline-md font-bold text-success">{approvedCount}</p>
          <p className="text-body-sm text-on-surface-variant">Approved</p>
        </div>
        <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-space-md text-center">
          <p className="font-headline-md font-bold text-error">{rejectedCount}</p>
          <p className="text-body-sm text-on-surface-variant">Rejected</p>
        </div>
      </div>

      {userPrescriptions.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-2xl text-center mt-6">
          <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-space-md">
            <span className="material-symbols-outlined text-[40px] text-outline">prescriptions</span>
          </div>
          <h2 className="font-headline-md font-bold text-on-surface mb-2">No prescriptions yet</h2>
          <p className="font-body-md text-on-surface-variant mb-space-lg">Upload your prescriptions for easy access and quick orders.</p>
          <Button onClick={() => setIsUploading(true)}>Upload Prescription</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-space-md">
          {userPrescriptions.map(rx => (
            <div key={rx.id} className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 flex gap-space-md shadow-sm">
              <div className="w-24 h-24 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0 border border-outline-variant/30 overflow-hidden relative">
                {rx.type === 'pdf' ? (
                  <span className="material-symbols-outlined text-[32px] text-primary">picture_as_pdf</span>
                ) : (
                  <img src={rx.preview} alt="Prescription" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex flex-col justify-between flex-1 min-w-0">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-label-lg font-bold text-on-surface truncate pr-4">{rx.title}</h3>
                    <div className="shrink-0">{getStatusBadge(rx.status)}</div>
                  </div>
                  <p className="font-body-sm text-on-surface-variant">Uploaded: {formatDate(rx.uploadDate)}</p>
                  {rx.status === 'REJECTED' && rx.rejectionReason && (
                    <p className="text-[12px] text-error mt-1 truncate">Reason: {rx.rejectionReason}</p>
                  )}
                </div>
                <div className="flex gap-space-md mt-space-sm">
                  <Button variant="outline" className="flex-1 py-1 text-primary border-primary hover:bg-primary-container/10 text-label-sm" onClick={() => setViewingRx(rx)}>
                    View Details
                  </Button>
                  <Button variant="outline" className="flex-1 py-1 text-error border-error hover:bg-error-container/10 text-label-sm" onClick={() => handleDelete(rx.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'context', 'PrescriptionContext.jsx'), contextContent);
fs.writeFileSync(path.join(__dirname, 'src', 'pages', 'account', 'PrescriptionsPage.jsx'), pageContent);

console.log("Done");

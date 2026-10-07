const fs = require('fs');
const path = require('path');

// 1. Update PrescriptionContext.jsx
const pContextPath = path.join(__dirname, 'src', 'context', 'PrescriptionContext.jsx');
let pContextContent = fs.readFileSync(pContextPath, 'utf8');

// Update mock prescriptions to be more realistic
const newMockData = `[
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
  ]`;

// We just replace the useState array initialization
pContextContent = pContextContent.replace(
  /const \[prescriptions, setPrescriptions\] = useState\(\[[\s\S]*?\]\);/,
  `const [prescriptions, setPrescriptions] = useState(${newMockData});`
);

// Update updatePrescriptionStatus to take more fields
pContextContent = pContextContent.replace(
  /const updatePrescriptionStatus = \(id, status, reason = ''\) => {[\s\S]*?};/,
  `const updatePrescriptionStatus = (id, status, reason = '') => {
    setPrescriptions(prev => prev.map(rx => rx.id === id ? { ...rx, status, reason, reviewedDate: new Date().toISOString(), reviewedBy: 'Admin' } : rx));
  };`
);

fs.writeFileSync(pContextPath, pContextContent);

// 2. Rewrite AdminPrescriptionsPage.jsx
const adminRxPath = path.join(__dirname, 'src', 'pages', 'admin', 'AdminPrescriptionsPage.jsx');
const adminRxContent = `import React, { useState } from 'react';
import { usePrescription } from '../../context/PrescriptionContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const AdminPrescriptionsPage = () => {
  const { prescriptions, updatePrescriptionStatus } = usePrescription();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [selectedRx, setSelectedRx] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [customRejectReason, setCustomRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const filteredPrescriptions = prescriptions.filter(rx => {
    const q = searchQuery.toLowerCase();
    const matchSearch = rx.id.toLowerCase().includes(q) || rx.customerName.toLowerCase().includes(q) || rx.phone.includes(q);
    const matchStatus = filterStatus === 'All' || (filterStatus === 'Pending' && rx.status === 'Pending') || (filterStatus === 'Reviewed' && rx.status !== 'Pending') || rx.status === filterStatus;
    return matchSearch && matchStatus;
  }).sort((a,b) => new Date(b.uploadDate) - new Date(a.uploadDate));

  const handleApprove = () => {
    updatePrescriptionStatus(selectedRx.id, 'Approved');
    setSuccessMsg(\`Prescription \${selectedRx.id} approved successfully.\`);
    setSelectedRx(null);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleReject = () => {
    const reasonToUse = rejectReason === 'Other' ? customRejectReason : rejectReason;
    if (!reasonToUse.trim()) {
      alert('Please provide a rejection reason.');
      return;
    }
    updatePrescriptionStatus(selectedRx.id, 'Rejected', reasonToUse);
    setSuccessMsg(\`Prescription \${selectedRx.id} rejected.\`);
    setSelectedRx(null);
    setShowRejectForm(false);
    setRejectReason('');
    setCustomRejectReason('');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const openReview = (rx) => {
    setSelectedRx(rx);
    setShowRejectForm(false);
    setRejectReason('');
    setCustomRejectReason('');
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Pending': return <Badge variant="warning">Pending</Badge>;
      case 'Approved': return <Badge variant="success">Approved</Badge>;
      case 'Rejected': return <Badge variant="error">Rejected</Badge>;
      default: return <Badge variant="surface">{status}</Badge>;
    }
  };

  return (
    <div className="p-space-lg flex flex-col h-full gap-space-lg relative">
      {successMsg && (
        <div className="bg-primary-container text-on-primary-container p-3 rounded-lg font-bold flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined">check_circle</span>
          {successMsg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-space-md">
        <div>
          <h1 className="font-headline-md font-bold text-on-surface">Prescription Review</h1>
          <p className="text-on-surface-variant text-body-sm">Verify clinical prescriptions before processing orders.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-outline-variant/30">
        {['All', 'Pending', 'Approved', 'Rejected'].map(s => (
          <button 
            key={s}
            onClick={() => setFilterStatus(s)}
            className={\`px-4 py-2 rounded-full text-label-sm font-bold whitespace-nowrap transition-colors \${filterStatus === s ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}\`}
          >
            {s} <span className="opacity-80 ml-1">{s === 'All' ? prescriptions.length : prescriptions.filter(p => p.status === s).length}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline-variant text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Search by Rx ID, Customer Name, or Phone..." 
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-outline-variant/50 bg-surface-container-lowest focus:outline-none focus:border-primary text-body-sm text-on-surface"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-surface-container-lowest rounded-2xl border border-outline-variant/30">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low text-label-sm font-bold text-on-surface-variant sticky top-0 z-10">
            <tr>
              <th className="p-4 border-b border-outline-variant/30">Rx ID & Date</th>
              <th className="p-4 border-b border-outline-variant/30">Patient Details</th>
              <th className="p-4 border-b border-outline-variant/30">Document</th>
              <th className="p-4 border-b border-outline-variant/30">Status</th>
              <th className="p-4 border-b border-outline-variant/30 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredPrescriptions.map(rx => (
              <tr key={rx.id} className="border-b border-outline-variant/20 hover:bg-surface-container transition-colors text-body-sm">
                <td className="p-4">
                  <div className="font-bold text-on-surface">{rx.id}</div>
                  <div className="text-[10px] text-on-surface-variant">{new Date(rx.uploadDate).toLocaleDateString('en-GB')} {new Date(rx.uploadDate).toLocaleTimeString('en-GB', {hour: '2-digit', minute:'2-digit'})}</div>
                </td>
                <td className="p-4">
                  <div className="font-medium text-on-surface">{rx.customerName}</div>
                  <div className="text-[10px] text-on-surface-variant">{rx.phone}</div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">{rx.type === 'pdf' ? 'picture_as_pdf' : 'image'}</span>
                    <span className="truncate max-w-[150px]">{rx.fileName}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1 items-start">
                    {getStatusBadge(rx.status)}
                    {rx.status !== 'Pending' && rx.reviewedDate && (
                      <span className="text-[10px] text-on-surface-variant">Reviewed: {new Date(rx.reviewedDate).toLocaleDateString('en-GB')}</span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => openReview(rx)}
                    className={\`px-4 py-2 rounded-lg text-label-sm font-bold transition-colors \${rx.status === 'Pending' ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}\`}
                  >
                    {rx.status === 'Pending' ? 'Review' : 'View Details'}
                  </button>
                </td>
              </tr>
            ))}
            {filteredPrescriptions.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-[48px] opacity-50">description</span>
                    <p>No prescriptions found matching your criteria.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Review Drawer Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 flex justify-end bg-scrim/50 backdrop-blur-sm">
          <div className="bg-surface w-full max-w-2xl h-full shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
            {/* Drawer Header */}
            <div className="p-space-md border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <div>
                <h2 className="font-headline-sm font-bold text-on-surface flex items-center gap-3">
                  {selectedRx.id} 
                  {getStatusBadge(selectedRx.status)}
                </h2>
                <span className="text-body-sm text-on-surface-variant">Uploaded on {new Date(selectedRx.uploadDate).toLocaleString('en-GB')}</span>
              </div>
              <button onClick={() => setSelectedRx(null)} className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-auto p-space-md flex flex-col gap-space-md">
              
              {selectedRx.status === 'Rejected' && (
                <div className="bg-error-container/20 border border-error/30 text-on-surface p-4 rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-error">info</span>
                  <div>
                    <h4 className="font-bold text-error">Prescription Rejected</h4>
                    <p className="text-body-sm mt-1">Reason: <span className="font-medium">{selectedRx.reason}</span></p>
                    <p className="text-[10px] text-on-surface-variant mt-1">By {selectedRx.reviewedBy} on {new Date(selectedRx.reviewedDate).toLocaleString('en-GB')}</p>
                  </div>
                </div>
              )}
              {selectedRx.status === 'Approved' && (
                <div className="bg-success-container/20 border border-success/30 text-on-surface p-4 rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-success">check_circle</span>
                  <div>
                    <h4 className="font-bold text-success">Prescription Approved</h4>
                    <p className="text-[10px] text-on-surface-variant mt-1">By {selectedRx.reviewedBy} on {new Date(selectedRx.reviewedDate).toLocaleString('en-GB')}</p>
                  </div>
                </div>
              )}

              <Card className="p-space-md grid grid-cols-2 gap-4">
                <div>
                  <span className="text-outline font-label-sm uppercase tracking-wider text-[10px] block mb-1">Patient Details</span>
                  <p className="font-bold text-on-surface">{selectedRx.customerName}</p>
                  <p className="text-body-sm text-on-surface-variant">{selectedRx.phone}</p>
                </div>
                <div>
                  <span className="text-outline font-label-sm uppercase tracking-wider text-[10px] block mb-1">Document Info</span>
                  <p className="font-medium text-on-surface">{selectedRx.title}</p>
                  <p className="text-body-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">{selectedRx.type === 'pdf' ? 'picture_as_pdf' : 'image'}</span> {selectedRx.fileName}
                  </p>
                </div>
              </Card>

              <div className="flex-1 flex flex-col">
                <span className="text-outline font-label-sm uppercase tracking-wider text-[10px] block mb-2">Original Document</span>
                <div className="flex-1 bg-[#f0f0f0] rounded-xl border border-outline-variant/30 overflow-hidden min-h-[300px] flex items-center justify-center p-2">
                  {selectedRx.preview ? (
                    <img 
                      src={selectedRx.preview} 
                      alt="Prescription Document" 
                      className="max-w-full max-h-full object-contain"
                      style={{ filter: 'none' }} /* Force no dark mode filters on the rx image */
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-[48px]">picture_as_pdf</span>
                      <p>PDF Preview not available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer / Actions */}
            {selectedRx.status === 'Pending' && (
              <div className="p-space-md border-t border-outline-variant/30 bg-surface-container-lowest">
                {!showRejectForm ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowRejectForm(true)}
                      className="flex-1 py-3 rounded-xl border-2 border-error text-error font-bold hover:bg-error-container transition-colors"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={handleApprove}
                      className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity"
                    >
                      Approve Prescription
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 animate-fade-in">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-error">Reject Prescription</h4>
                      <button onClick={() => setShowRejectForm(false)} className="text-body-sm text-on-surface-variant hover:underline">Cancel</button>
                    </div>
                    <select 
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-3 py-3 text-on-surface focus:outline-none focus:border-error"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    >
                      <option value="">Select a reason...</option>
                      <option value="Invalid prescription">Invalid prescription</option>
                      <option value="Prescription image unclear">Prescription image unclear</option>
                      <option value="Expired prescription">Expired prescription</option>
                      <option value="Missing information">Missing information</option>
                      <option value="Medicine information cannot be verified">Medicine information cannot be verified</option>
                      <option value="Other">Other</option>
                    </select>
                    
                    {rejectReason === 'Other' && (
                      <input 
                        type="text"
                        placeholder="Type custom reason..."
                        className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-3 py-3 text-on-surface focus:outline-none focus:border-error"
                        value={customRejectReason}
                        onChange={(e) => setCustomRejectReason(e.target.value)}
                      />
                    )}

                    <button 
                      onClick={handleReject}
                      className="w-full py-3 rounded-xl bg-error text-on-error font-bold hover:bg-error/90 transition-colors mt-2"
                    >
                      Confirm Rejection
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
`;
fs.writeFileSync(adminRxPath, adminRxContent);

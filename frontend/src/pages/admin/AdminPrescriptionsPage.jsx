import React, { useState } from 'react';
import { usePrescription } from '../../context/PrescriptionContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';

export const AdminPrescriptionsPage = () => {
  const { prescriptions, updatePrescriptionStatus } = usePrescription();
  const [selectedRx, setSelectedRx] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = () => {
    updatePrescriptionStatus(selectedRx.id, 'Approved');
    setSelectedRx(null);
  };

  const handleReject = () => {
    if (!rejectReason) return alert('Please select a rejection reason.');
    updatePrescriptionStatus(selectedRx.id, 'Rejected', rejectReason);
    setSelectedRx(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-space-md">
      <div className="flex justify-between items-center">
        <h1 className="font-headline-md font-bold">প্রেসক্রিপশন ক্লিনিক্যাল যাচাই ও অনুমোদন কনসোল</h1>
      </div>
      
      <div className="flex gap-4 h-[calc(100vh-180px)]">
        <div className="flex-1 overflow-auto space-y-3">
          {prescriptions.map(rx => (
            <Card key={rx.id} className="p-4 flex items-center justify-between cursor-pointer hover:border-primary transition-colors" onClick={() => setSelectedRx(rx)}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">{rx.type === 'pdf' ? 'picture_as_pdf' : 'image'}</span>
                </div>
                <div>
                  <h3 className="font-bold text-label-lg">{rx.title || rx.fileName}</h3>
                  <p className="text-body-sm text-on-surface-variant">{rx.customerName} • {rx.uploadDate}</p>
                </div>
              </div>
              <Badge variant={rx.status === 'Pending' ? 'warning' : rx.status === 'Approved' ? 'success' : 'error'} text={rx.status} />
            </Card>
          ))}
        </div>

        {selectedRx && (
          <div className="w-96 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 p-space-md overflow-auto flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-headline-sm font-bold text-primary">{selectedRx.title || selectedRx.fileName}</h2>
                <Badge variant={selectedRx.status === 'Pending' ? 'warning' : selectedRx.status === 'Approved' ? 'success' : 'error'} text={selectedRx.status} />
              </div>
              <button onClick={() => setSelectedRx(null)} className="text-on-surface-variant hover:text-on-surface"><span className="material-symbols-outlined">close</span></button>
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="bg-surface-container-low p-4 rounded-xl flex justify-center items-center h-48 border border-outline-variant/30">
                <span className="material-symbols-outlined text-[48px] text-outline-variant">preview</span>
                <span className="ml-2 text-on-surface-variant">Preview Image/PDF</span>
              </div>
              
              {selectedRx.status === 'Pending' && (
                <div className="space-y-3 mt-4">
                  <Button variant="primary" className="w-full" onClick={handleApprove}>Approve Prescription & Release Order</Button>
                  
                  <div className="border-t border-outline-variant/30 pt-3">
                    <select 
                      className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface mb-2"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    >
                      <option value="">Select Rejection Reason...</option>
                      <option value="Image unclear">Image unclear</option>
                      <option value="Prescription expired">Prescription expired</option>
                      <option value="Required information missing">Required information missing</option>
                      <option value="Invalid prescription">Invalid prescription</option>
                    </select>
                    <Button variant="outline" className="w-full text-error border-error hover:bg-error-container" onClick={handleReject}>Reject</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

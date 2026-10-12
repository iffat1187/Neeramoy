import { useState } from 'react';
import { usePrescription } from '../../context/PrescriptionContext';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { usePagination } from '../../hooks/usePagination';
import { Pagination } from '../../components/common/Pagination';

export const AdminPrescriptionsPage = () => {
  const { prescriptions, updatePrescriptionStatus, loading, error, refreshPrescriptions } = usePrescription();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [selectedRx, setSelectedRx] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [customRejectReason, setCustomRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const filteredPrescriptions = (prescriptions || []).filter(rx => {
    const q = searchQuery.toLowerCase();
    const rxId = String(rx.id || '').toLowerCase();
    const custName = String(rx.customerName || '').toLowerCase();
    const phone = String(rx.customerPhone || rx.phone || '');
    const matchSearch = rxId.includes(q) || custName.includes(q) || phone.includes(q);
    
    const s = rx.status?.toUpperCase();
    const matchStatus = 
      filterStatus === 'All' ||
      (filterStatus === 'Pending' && s === 'PENDING') ||
      (filterStatus === 'Approved' && s === 'APPROVED') ||
      (filterStatus === 'Rejected' && s === 'REJECTED') ||
      (filterStatus === 'Reviewed' && s !== 'PENDING') ||
      s === filterStatus.toUpperCase();

    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.uploadDate || b.createdAt || 0) - new Date(a.uploadDate || a.createdAt || 0));

  const { currentPage, totalPages, totalItems, paginatedItems, goToPage, pageSize } = usePagination(filteredPrescriptions, 20);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    goToPage(1);
  };

  const handleFilterStatus = (s) => {
    setFilterStatus(s);
    goToPage(1);
  };

  const handleApprove = async () => {
    if (isSubmitting || !selectedRx) return;
    setIsSubmitting(true);
    setActionError('');
    try {
      await updatePrescriptionStatus(selectedRx.id, 'APPROVED');
      setSuccessMsg(`Prescription ${selectedRx.id} approved successfully.`);
      setSelectedRx(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setActionError(err.message || 'Failed to approve prescription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (isSubmitting || !selectedRx) return;
    const reasonToUse = rejectReason === 'Other' ? customRejectReason.trim() : rejectReason.trim();
    if (!reasonToUse) {
      setActionError('Please provide a rejection reason.');
      return;
    }

    setIsSubmitting(true);
    setActionError('');
    try {
      await updatePrescriptionStatus(selectedRx.id, 'REJECTED', reasonToUse);
      setSuccessMsg(`Prescription ${selectedRx.id} rejected.`);
      setSelectedRx(null);
      setShowRejectForm(false);
      setRejectReason('');
      setCustomRejectReason('');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setActionError(err.message || 'Failed to reject prescription');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openReview = (rx) => {
    setSelectedRx(rx);
    setShowRejectForm(false);
    setRejectReason('');
    setCustomRejectReason('');
    setActionError('');
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    switch(s) {
      case 'PENDING': return <Badge variant="warning">Pending</Badge>;
      case 'APPROVED': return <Badge variant="success">Approved</Badge>;
      case 'REJECTED': return <Badge variant="error">Rejected</Badge>;
      default: return <Badge variant="surface">{status}</Badge>;
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return `${d.toLocaleDateString('en-GB')} ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`;
    } catch {
      return dateStr;
    }
  };

  const getTabCount = (statusKey) => {
    if (!prescriptions) return 0;
    if (statusKey === 'All') return prescriptions.length;
    const targetStatus = statusKey.toUpperCase();
    return prescriptions.filter(p => p.status?.toUpperCase() === targetStatus).length;
  };

  return (
    <div className="p-space-lg flex flex-col h-full gap-space-lg relative">
      {successMsg && (
        <div className="bg-primary-container text-on-primary-container p-3 rounded-lg font-bold flex items-center gap-2 transition-all">
          <span className="material-symbols-outlined">check_circle</span>
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-error-container/20 border border-error/30 text-error p-3 rounded-lg font-bold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined">error</span>
            <span>{error}</span>
          </div>
          <button 
            onClick={refreshPrescriptions}
            className="px-3 py-1 bg-error text-on-error rounded-lg text-xs font-bold hover:opacity-90"
          >
            Retry
          </button>
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
            onClick={() => handleFilterStatus(s)}
            className={`px-4 py-2 rounded-full text-label-sm font-bold whitespace-nowrap transition-colors ${filterStatus === s ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface'}`}
          >
            {s} <span className="opacity-80 ml-1">{getTabCount(s)}</span>
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
            onChange={handleSearch}
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
            {loading && paginatedItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-on-surface-variant">
                  <div className="flex flex-col items-center gap-2">
                    <span className="material-symbols-outlined text-[40px] text-primary animate-spin">progress_activity</span>
                    <p>Loading prescriptions...</p>
                  </div>
                </td>
              </tr>
            ) : paginatedItems.map(rx => {
              const isPdf = rx.type === 'pdf' || rx.fileUrl?.toLowerCase().endsWith('.pdf') || rx.fileType?.includes('pdf');
              const isPending = rx.status?.toUpperCase() === 'PENDING';
              return (
                <tr key={rx.id} className="border-b border-outline-variant/20 hover:bg-surface-container transition-colors text-body-sm">
                  <td className="p-4">
                    <div className="font-bold text-on-surface">{rx.id}</div>
                    <div className="text-[10px] text-on-surface-variant">{formatDateTime(rx.uploadDate || rx.createdAt)}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-on-surface">{rx.customerName || 'Customer'}</div>
                    <div className="text-[10px] text-on-surface-variant">{rx.customerPhone || rx.phone || 'N/A'}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">{isPdf ? 'picture_as_pdf' : 'image'}</span>
                      <span className="truncate max-w-[150px]">{rx.fileName}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 items-start">
                      {getStatusBadge(rx.status)}
                      {!isPending && (rx.reviewedDate || rx.reviewedAt) && (
                        <span className="text-[10px] text-on-surface-variant">Reviewed: {formatDateTime(rx.reviewedDate || rx.reviewedAt)}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => openReview(rx)}
                      className={`px-4 py-2 rounded-lg text-label-sm font-bold transition-colors ${isPending ? 'bg-primary text-on-primary hover:opacity-90' : 'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'}`}
                    >
                      {isPending ? 'Review' : 'View Details'}
                    </button>
                  </td>
                </tr>
              );
            })}
            {!loading && filteredPrescriptions.length === 0 && (
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
        {paginatedItems.length > 0 && (
          <div className="px-space-md pb-space-md">
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              onPageChange={goToPage} 
              totalItems={totalItems} 
              pageSize={pageSize} 
              itemName="prescriptions"
            />
          </div>
        )}
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
                <span className="text-body-sm text-on-surface-variant">Uploaded on {formatDateTime(selectedRx.uploadDate || selectedRx.createdAt)}</span>
              </div>
              <button onClick={() => setSelectedRx(null)} className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-auto p-space-md flex flex-col gap-space-md">
              {actionError && (
                <div className="bg-error-container/20 border border-error/30 text-error p-3 rounded-xl flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">error</span>
                  <span className="text-body-sm">{actionError}</span>
                </div>
              )}
              
              {selectedRx.status?.toUpperCase() === 'REJECTED' && (
                <div className="bg-error-container/20 border border-error/30 text-on-surface p-4 rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-error">info</span>
                  <div>
                    <h4 className="font-bold text-error">Prescription Rejected</h4>
                    <p className="text-body-sm mt-1">Reason: <span className="font-medium">{selectedRx.rejectionReason || selectedRx.reason}</span></p>
                    <p className="text-[10px] text-on-surface-variant mt-1">
                      By {selectedRx.reviewedBy || selectedRx.reviewerName || 'Staff'} on {formatDateTime(selectedRx.reviewedDate || selectedRx.reviewedAt)}
                    </p>
                  </div>
                </div>
              )}

              {selectedRx.status?.toUpperCase() === 'APPROVED' && (
                <div className="bg-success-container/20 border border-success/30 text-on-surface p-4 rounded-xl flex items-start gap-3">
                  <span className="material-symbols-outlined text-success">check_circle</span>
                  <div>
                    <h4 className="font-bold text-success">Prescription Approved</h4>
                    <p className="text-[10px] text-on-surface-variant mt-1">
                      By {selectedRx.reviewedBy || selectedRx.reviewerName || 'Staff'} on {formatDateTime(selectedRx.reviewedDate || selectedRx.reviewedAt)}
                    </p>
                  </div>
                </div>
              )}

              <Card className="p-space-md grid grid-cols-2 gap-4">
                <div>
                  <span className="text-outline font-label-sm uppercase tracking-wider text-[10px] block mb-1">Patient Details</span>
                  <p className="font-bold text-on-surface">{selectedRx.customerName || 'Customer'}</p>
                  <p className="text-body-sm text-on-surface-variant">{selectedRx.customerPhone || selectedRx.phone || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-outline font-label-sm uppercase tracking-wider text-[10px] block mb-1">Document Info</span>
                  <p className="font-medium text-on-surface truncate">{selectedRx.title || selectedRx.fileName}</p>
                  <p className="text-body-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      {selectedRx.type === 'pdf' || selectedRx.fileUrl?.toLowerCase().endsWith('.pdf') || selectedRx.fileType?.includes('pdf') ? 'picture_as_pdf' : 'image'}
                    </span> 
                    <span className="truncate">{selectedRx.fileName}</span>
                  </p>
                </div>
              </Card>

              <div className="flex-1 flex flex-col">
                <span className="text-outline font-label-sm uppercase tracking-wider text-[10px] block mb-2">Original Document</span>
                <div className="flex-1 bg-surface-container-low rounded-xl border border-outline-variant/30 overflow-hidden min-h-[350px] flex items-center justify-center p-4">
                  {selectedRx.type === 'pdf' || selectedRx.fileUrl?.toLowerCase().endsWith('.pdf') || selectedRx.fileType?.includes('pdf') ? (
                    <div className="flex flex-col items-center gap-3 text-center p-4">
                      <span className="material-symbols-outlined text-[64px] text-primary">picture_as_pdf</span>
                      <div>
                        <p className="font-label-lg font-bold text-on-surface">{selectedRx.fileName}</p>
                        <p className="text-body-sm text-on-surface-variant">PDF Prescription Document</p>
                      </div>
                      {selectedRx.fileUrl ? (
                        <a
                          href={selectedRx.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-label-md font-bold hover:opacity-90 transition-opacity mt-2"
                        >
                          <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                          Open / Download PDF in New Tab
                        </a>
                      ) : (
                        <p className="text-body-sm text-error">Document URL unavailable</p>
                      )}
                    </div>
                  ) : selectedRx.fileUrl || selectedRx.preview ? (
                    <div className="flex flex-col items-center w-full">
                      <img 
                        src={selectedRx.fileUrl || selectedRx.preview} 
                        alt={selectedRx.fileName || "Prescription Document"} 
                        className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm"
                        style={{ filter: 'none' }}
                      />
                      {selectedRx.fileUrl && (
                        <a
                          href={selectedRx.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary text-body-sm font-bold hover:underline mt-3"
                        >
                          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                          Open Full Resolution Image
                        </a>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-outline">
                      <span className="material-symbols-outlined text-[48px]">description</span>
                      <p>Document preview not available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer / Actions */}
            {selectedRx.status?.toUpperCase() === 'PENDING' && (
              <div className="p-space-md border-t border-outline-variant/30 bg-surface-container-lowest">
                {!showRejectForm ? (
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowRejectForm(true)}
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl border-2 border-error text-error font-bold hover:bg-error-container transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={handleApprove}
                      disabled={isSubmitting}
                      className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isSubmitting ? 'Approving...' : 'Approve Prescription'}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 animate-fade-in">
                    <div className="flex justify-between items-center mb-1">
                      <h4 className="font-bold text-error">Reject Prescription</h4>
                      <button 
                        onClick={() => { setShowRejectForm(false); setActionError(''); }}
                        disabled={isSubmitting}
                        className="text-body-sm text-on-surface-variant hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                    <select 
                      className="w-full bg-surface-container border border-outline-variant/50 rounded-lg px-3 py-3 text-on-surface focus:outline-none focus:border-error"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      disabled={isSubmitting}
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
                        disabled={isSubmitting}
                      />
                    )}

                    <button 
                      onClick={handleReject}
                      disabled={isSubmitting}
                      className="w-full py-3 rounded-xl bg-error text-on-error font-bold hover:bg-error/90 transition-colors mt-2 disabled:opacity-50"
                    >
                      {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
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

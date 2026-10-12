import { useState, useRef } from 'react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { usePrescription } from '../../context/PrescriptionContext';

export const PrescriptionsPage = () => {
  const { customerPrescriptions, prescriptions, addPrescription, deletePrescription, loading, error, refreshPrescriptions } = usePrescription();
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [viewingRx, setViewingRx] = useState(null);
  const fileInputRef = useRef(null);
  
  // Real customer prescriptions (backend filters by authenticated user)
  const userPrescriptions = customerPrescriptions || prescriptions || [];

  const pendingCount = userPrescriptions.filter(rx => rx.status?.toUpperCase() === 'PENDING').length;
  const approvedCount = userPrescriptions.filter(rx => rx.status?.toUpperCase() === 'APPROVED').length;
  const rejectedCount = userPrescriptions.filter(rx => rx.status?.toUpperCase() === 'REJECTED').length;

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

  const handleUploadSubmit = async () => {
    if (!selectedFile?.file) return;

    setIsSubmitting(true);
    setUploadError('');

    try {
      await addPrescription(selectedFile.file);
      setSelectedFile(null);
      setIsUploading(false);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setUploadError(err.message || 'Failed to upload prescription. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    setDeleteError('');

    try {
      await deletePrescription(id);
      if (viewingRx && viewingRx.id === id) setViewingRx(null);
    } catch (err) {
      setDeleteError(err.message || 'Failed to delete prescription. Please try again.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    if (s === 'APPROVED') return <Badge variant="success" text="Approved" />;
    if (s === 'REJECTED') return <Badge variant="error" text="Rejected" />;
    return <Badge variant="warning" text="Pending" />;
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return isNaN(d.getTime()) ? isoString : d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return isoString;
    }
  };

  // Preview Modal
  if (viewingRx) {
    const isPdf = viewingRx.type === 'pdf' || viewingRx.fileUrl?.toLowerCase().endsWith('.pdf') || viewingRx.fileType?.includes('pdf');

    return (
      <div className="space-y-space-md">
        <button onClick={() => setViewingRx(null)} className="text-primary hover:underline text-body-sm font-bold flex items-center gap-1 mb-2">
          <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back to Prescriptions
        </button>
        
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          <div className="bg-surface-container-low px-space-lg py-space-md border-b border-outline-variant/30 flex items-center justify-between">
            <div>
              <h2 className="font-headline-sm font-bold text-on-surface">{viewingRx.title || viewingRx.fileName}</h2>
              <p className="font-body-sm text-on-surface-variant">ID: {viewingRx.id} • Uploaded: {formatDate(viewingRx.uploadDate || viewingRx.createdAt)}</p>
            </div>
            {getStatusBadge(viewingRx.status)}
          </div>
          
          <div className="p-space-lg">
            {viewingRx.status?.toUpperCase() === 'REJECTED' && viewingRx.rejectionReason && (
              <div className="mb-space-lg p-space-md bg-error-container/20 border border-error/30 rounded-xl">
                <p className="font-label-md font-bold text-error mb-1">Rejection Reason:</p>
                <p className="text-body-sm text-on-surface">{viewingRx.rejectionReason}</p>
              </div>
            )}

            {deleteError && (
              <div className="mb-space-lg p-space-md bg-error-container/20 border border-error/30 rounded-xl text-error text-body-sm">
                {deleteError}
              </div>
            )}
            
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center justify-center p-space-md min-h-[400px]">
              {isPdf ? (
                <div className="text-center p-space-lg">
                  <span className="material-symbols-outlined text-[64px] text-primary mb-4">picture_as_pdf</span>
                  <p className="font-label-lg font-bold text-on-surface mb-2">{viewingRx.fileName}</p>
                  {viewingRx.fileUrl ? (
                    <a
                      href={viewingRx.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-xl font-label-md font-bold hover:opacity-90 transition-opacity mt-2"
                    >
                      <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                      Open / Download PDF
                    </a>
                  ) : (
                    <p className="text-body-sm text-on-surface-variant">PDF Document</p>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <img 
                    src={viewingRx.fileUrl || viewingRx.preview} 
                    alt={viewingRx.fileName || "Prescription"} 
                    className="max-w-full max-h-[600px] object-contain rounded-lg shadow-sm" 
                  />
                  {viewingRx.fileUrl && (
                    <a
                      href={viewingRx.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-body-sm font-bold hover:underline mt-3"
                    >
                      <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                      Open full resolution image
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-surface-container-lowest p-space-lg border-t border-outline-variant/30 flex justify-end">
            <Button 
              variant="outline" 
              className="text-error border-error hover:bg-error-container/10" 
              onClick={() => handleDelete(viewingRx.id)}
              disabled={deletingId === viewingRx.id}
            >
              {deletingId === viewingRx.id ? 'Deleting...' : 'Delete Prescription'}
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
            <Button variant="outline" onClick={() => { setIsUploading(false); setSelectedFile(null); setUploadError(''); }} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUploadSubmit} disabled={!selectedFile || isSubmitting}>
              {isSubmitting ? 'Uploading...' : 'Upload Prescription'}
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

      {deleteError && (
        <div className="p-space-md bg-error-container/20 border border-error/30 rounded-xl text-error text-body-sm flex items-center justify-between">
          <span>{deleteError}</span>
          <button onClick={() => setDeleteError('')} className="material-symbols-outlined text-[18px]">close</button>
        </div>
      )}

      {error && (
        <div className="p-space-md bg-error-container/20 border border-error/30 rounded-xl text-error text-body-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" className="py-1 px-3 text-xs border-error text-error" onClick={refreshPrescriptions}>
            Retry
          </Button>
        </div>
      )}

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

      {loading && userPrescriptions.length === 0 ? (
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 p-space-2xl text-center mt-6">
          <span className="material-symbols-outlined text-[40px] text-primary animate-spin mb-space-md">progress_activity</span>
          <p className="font-body-md text-on-surface-variant">Loading your prescriptions...</p>
        </div>
      ) : userPrescriptions.length === 0 ? (
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
          {userPrescriptions.map(rx => {
            const isPdf = rx.type === 'pdf' || rx.fileUrl?.toLowerCase().endsWith('.pdf') || rx.fileType?.includes('pdf');
            return (
              <div key={rx.id} className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 flex gap-space-md shadow-sm">
                <div className="w-24 h-24 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0 border border-outline-variant/30 overflow-hidden relative">
                  {isPdf ? (
                    <span className="material-symbols-outlined text-[32px] text-primary">picture_as_pdf</span>
                  ) : (
                    <img 
                      src={rx.fileUrl || rx.preview} 
                      alt={rx.fileName || "Prescription"} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerHTML = '<span class="material-symbols-outlined text-[32px] text-outline">description</span>';
                      }}
                    />
                  )}
                </div>
                <div className="flex flex-col justify-between flex-1 min-w-0">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-label-lg font-bold text-on-surface truncate pr-4">{rx.title || rx.fileName}</h3>
                      <div className="shrink-0">{getStatusBadge(rx.status)}</div>
                    </div>
                    <p className="font-body-sm text-on-surface-variant">Uploaded: {formatDate(rx.uploadDate || rx.createdAt)}</p>
                    {rx.status?.toUpperCase() === 'REJECTED' && rx.rejectionReason && (
                      <p className="text-[12px] text-error mt-1 truncate">Reason: {rx.rejectionReason}</p>
                    )}
                  </div>
                  <div className="flex gap-space-md mt-space-sm">
                    <Button variant="outline" className="flex-1 py-1 text-primary border-primary hover:bg-primary-container/10 text-label-sm" onClick={() => setViewingRx(rx)}>
                      View Details
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 py-1 text-error border-error hover:bg-error-container/10 text-label-sm" 
                      onClick={() => handleDelete(rx.id)}
                      disabled={deletingId === rx.id}
                    >
                      {deletingId === rx.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

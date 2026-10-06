import React, { useState, useRef } from 'react';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

import { usePrescription } from '../../context/PrescriptionContext';

export const PrescriptionsPage = () => {
  const { prescriptions, addPrescription, deletePrescription } = usePrescription();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate type (image or pdf)
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a JPG, PNG, or PDF file.');
      setSelectedFile(null);
      return;
    }

    // Validate size (e.g. max 5MB)
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
      id: `rx-${Date.now()}`,
      title: `Uploaded - ${selectedFile.file.name.substring(0, 20)}...`,
      uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Pending',
      fileName: selectedFile.file.name,
      type: selectedFile.type,
      preview: selectedFile.preview,
      customerName: 'Tanvir Hasan',
      phone: '+880 1712-345678'
    };

    addPrescription(newRx);
    setSelectedFile(null);
    setIsUploading(false);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      deletePrescription(id);
    }
  };

  if (isUploading) {
    return (
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
    );
  }

  return (
    <div className="space-y-space-md">
      <div className="flex justify-between items-center">
        <h2 className="font-headline-md font-bold text-on-surface">Prescription Vault</h2>
        <Button variant="primary" onClick={() => setIsUploading(true)}>
          <span className="material-symbols-outlined text-[18px]">add</span> Upload
        </Button>
      </div>

      {prescriptions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {prescriptions.map(rx => (
            <div key={rx.id} className="bg-surface-container-lowest p-space-md rounded-2xl border border-outline-variant/30 flex gap-space-md">
              <div className="w-20 h-24 bg-surface-container-low rounded-xl flex items-center justify-center shrink-0 border border-outline-variant/30 overflow-hidden">
                {rx.type === 'image' && rx.preview ? (
                  <img src={rx.preview} alt="Prescription" className="w-full h-full object-cover opacity-80" />
                ) : (
                  <span className="material-symbols-outlined text-[32px] text-primary">description</span>
                )}
              </div>
              <div className="flex flex-col justify-between flex-1">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-label-lg font-bold text-on-surface line-clamp-1" title={rx.title}>{rx.title}</h3>
                    <Badge variant={rx.status === 'Approved' ? 'success' : rx.status === 'Rejected' ? 'error' : 'warning'} text={rx.status} />
                  </div>
                  <p className="font-body-sm text-on-surface-variant">Uploaded: {rx.uploadDate}</p>
                </div>
                <div className="flex gap-space-sm mt-space-sm">
                  <Button variant="outline" className="flex-1 text-[12px] py-1 text-primary border-primary hover:bg-primary/5">
                    View
                  </Button>
                  <Button variant="outline" onClick={() => handleDelete(rx.id)} className="flex-1 text-[12px] py-1 text-error border-error hover:bg-error/5">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-low p-space-xl rounded-2xl border border-outline-variant/30 text-center">
          <span className="material-symbols-outlined text-[48px] text-outline mb-space-sm">prescriptions</span>
          <h3 className="font-headline-sm font-bold text-on-surface mb-space-xs">No prescriptions saved</h3>
          <p className="font-body-sm text-on-surface-variant mb-space-md">Upload your prescriptions for easy access and quick orders.</p>
          <Button variant="primary" onClick={() => setIsUploading(true)}>Upload Prescription</Button>
        </div>
      )}
    </div>
  );
};

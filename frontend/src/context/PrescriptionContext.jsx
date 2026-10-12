import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { prescriptionService } from '../services/prescriptionService';

const PrescriptionContext = createContext();

export const usePrescription = () => {
  const context = useContext(PrescriptionContext);
  if (!context) {
    throw new Error('usePrescription must be used within a PrescriptionProvider');
  }
  return context;
};

export const normalizePrescription = (dto) => {
  if (!dto) return dto;
  const isPdf = dto.fileType?.toLowerCase().includes('pdf') || dto.fileName?.toLowerCase().endsWith('.pdf');
  const upperStatus = dto.status ? dto.status.toString().toUpperCase() : 'PENDING';
  
  return {
    ...dto,
    status: upperStatus,
    title: dto.fileName || `Prescription #${dto.id ? String(dto.id).slice(-6) : ''}`,
    fileName: dto.fileName || 'Prescription',
    uploadDate: dto.createdAt || dto.uploadDate || new Date().toISOString(),
    customerName: dto.customerName || 'Customer',
    phone: dto.customerPhone || dto.phone || 'N/A',
    customerPhone: dto.customerPhone || dto.phone || 'N/A',
    type: isPdf ? 'pdf' : 'image',
    preview: dto.fileUrl || dto.preview || '',
    fileUrl: dto.fileUrl || dto.preview || '',
    rejectionReason: dto.rejectionReason || dto.reason || '',
    reason: dto.rejectionReason || dto.reason || '',
    reviewedDate: dto.reviewedAt || dto.reviewedDate || null,
    reviewedBy: dto.reviewerName || dto.reviewedBy || ''
  };
};

export const PrescriptionProvider = ({ children }) => {
  const { user, isLoggedIn } = useAuth();
  
  const [customerPrescriptions, setCustomerPrescriptions] = useState([]);
  const [adminPrescriptions, setAdminPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAdminOrStaff = user?.role === 'ADMIN' || user?.role === 'PHARMACY_STAFF';

  // Fetch prescriptions based on role and auth status
  const fetchPrescriptions = useCallback(async (adminStatusFilter) => {
    if (!isLoggedIn || !user) {
      setCustomerPrescriptions([]);
      setAdminPrescriptions([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isAdminOrStaff) {
        // Admin or staff loads all prescriptions (with optional filter)
        // Also fetch personal customer prescriptions
        const [adminList, myList] = await Promise.allSettled([
          prescriptionService.getAllPrescriptionsAdmin(adminStatusFilter),
          prescriptionService.getMyPrescriptions()
        ]);

        if (adminList.status === 'fulfilled') {
          const list = Array.isArray(adminList.value) ? adminList.value : [];
          setAdminPrescriptions(list.map(normalizePrescription));
        } else {
          console.error('Failed to load admin prescriptions:', adminList.reason);
          setError(adminList.reason?.message || 'Failed to load admin prescriptions');
          setAdminPrescriptions([]);
        }

        if (myList.status === 'fulfilled') {
          const list = Array.isArray(myList.value) ? myList.value : [];
          setCustomerPrescriptions(list.map(normalizePrescription));
        } else {
          setCustomerPrescriptions([]);
        }
      } else {
        // Customer loads only their own prescriptions
        const data = await prescriptionService.getMyPrescriptions();
        const list = Array.isArray(data) ? data : [];
        setCustomerPrescriptions(list.map(normalizePrescription));
      }
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
      setError(err.message || 'Failed to load prescriptions');
      setCustomerPrescriptions([]);
      setAdminPrescriptions([]);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, user, isAdminOrStaff]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  // Upload prescription (customer or admin)
  const addPrescription = async (fileInput) => {
    setLoading(true);
    setError(null);
    try {
      const fileToUpload = fileInput instanceof File ? fileInput : fileInput?.file || fileInput;
      if (!fileToUpload) {
        throw new Error('No valid file provided for upload.');
      }
      const created = await prescriptionService.uploadPrescription(fileToUpload);
      const normalized = normalizePrescription(created);
      
      setCustomerPrescriptions(prev => [normalized, ...prev]);
      if (isAdminOrStaff) {
        setAdminPrescriptions(prev => [normalized, ...prev]);
      }
      return normalized;
    } catch (err) {
      setError(err.message || 'Failed to upload prescription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Review prescription (Admin / Staff)
  const updatePrescriptionStatus = async (id, status, reason = '') => {
    setLoading(true);
    setError(null);
    try {
      const upperStatus = status ? status.toUpperCase() : 'APPROVED';
      let updated;
      if (upperStatus === 'APPROVED') {
        updated = await prescriptionService.approvePrescription(id);
      } else if (upperStatus === 'REJECTED') {
        updated = await prescriptionService.rejectPrescription(id, reason);
      } else {
        updated = await prescriptionService.reviewPrescription(id, {
          status: upperStatus,
          rejectionReason: reason
        });
      }
      const normalized = normalizePrescription(updated);
      setAdminPrescriptions(prev => prev.map(rx => rx.id === id ? normalized : rx));
      setCustomerPrescriptions(prev => prev.map(rx => rx.id === id ? normalized : rx));
      return normalized;
    } catch (err) {
      setError(err.message || 'Failed to update prescription status');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete prescription
  const deletePrescription = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await prescriptionService.deletePrescription(id);
      setCustomerPrescriptions(prev => prev.filter(rx => rx.id !== id));
      setAdminPrescriptions(prev => prev.filter(rx => rx.id !== id));
      return true;
    } catch (err) {
      setError(err.message || 'Failed to delete prescription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const prescriptions = isAdminOrStaff ? adminPrescriptions : customerPrescriptions;

  return (
    <PrescriptionContext.Provider value={{
      prescriptions,
      customerPrescriptions,
      adminPrescriptions,
      loading,
      error,
      addPrescription,
      updatePrescriptionStatus,
      deletePrescription,
      fetchPrescriptions,
      fetchAdminPrescriptions: (status) => fetchPrescriptions(status),
      refreshPrescriptions: () => fetchPrescriptions()
    }}>
      {children}
    </PrescriptionContext.Provider>
  );
};

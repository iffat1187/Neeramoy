import { apiClient } from './apiClient';

export const prescriptionService = {
  /**
   * Upload a prescription file (JPEG, PNG, or PDF up to 5MB)
   * @param {File} file
   */
  async uploadPrescription(file) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.postFormData('/prescriptions', formData);
  },

  /**
   * Retrieve the authenticated customer's prescriptions
   */
  async getMyPrescriptions() {
    return apiClient.get('/prescriptions');
  },

  /**
   * Retrieve details of a customer's prescription by ID
   * @param {string} id
   */
  async getPrescriptionById(id) {
    return apiClient.get(`/prescriptions/${id}`);
  },

  /**
   * Delete a prescription by ID
   * @param {string} id
   */
  async deletePrescription(id) {
    return apiClient.delete(`/prescriptions/${id}`);
  },

  /**
   * Retrieve all prescriptions for Admin / Pharmacy Staff with optional status filter
   * @param {string} [status] Optional filter: PENDING, APPROVED, REJECTED
   */
  async getAllPrescriptionsAdmin(status) {
    const params = status && status !== 'All' ? { status } : {};
    return apiClient.get('/admin/prescriptions', params);
  },

  /**
   * Retrieve prescription details for Admin by ID
   * @param {string} id
   */
  async getAdminPrescriptionById(id) {
    return apiClient.get(`/admin/prescriptions/${id}`);
  },

  /**
   * Review a prescription (Approve or Reject with reason)
   * @param {string} id
   * @param {{ status: 'APPROVED' | 'REJECTED', rejectionReason?: string }} reviewPayload
   */
  async reviewPrescription(id, { status, rejectionReason }) {
    return apiClient.patch(`/admin/prescriptions/${id}/review`, {
      status,
      rejectionReason: rejectionReason ? rejectionReason.trim() : ''
    });
  },

  /**
   * Approve a pending prescription
   * @param {string} id
   */
  async approvePrescription(id) {
    return apiClient.patch(`/admin/prescriptions/${id}/approve`);
  },

  /**
   * Reject a pending prescription with required reason
   * @param {string} id
   * @param {string} rejectionReason
   */
  async rejectPrescription(id, rejectionReason) {
    return apiClient.patch(`/admin/prescriptions/${id}/reject`, {
      rejectionReason: rejectionReason ? rejectionReason.trim() : ''
    });
  }
};

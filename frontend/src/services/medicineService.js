import { apiClient } from './apiClient';

export const medicineService = {
  async getAll(params = {}) {
    return apiClient.get('/medicines', params);
  },
  async getTopSelling() {
    // We can simulate top-selling by sorting by rating
    return apiClient.get('/medicines', { sort: 'rating', size: 10, page: 0 });
  },
  async getById(id) {
    return apiClient.get(`/medicines/${id}`);
  },
  async getCategories() {
    return apiClient.get('/categories');
  },
  
  // Admin Methods
  async create(medicineData) {
    return apiClient.post('/admin/medicines', medicineData);
  },
  
  async update(id, medicineData) {
    return apiClient.put(`/admin/medicines/${id}`, medicineData);
  },
  
  async delete(id) {
    return apiClient.delete(`/admin/medicines/${id}`);
  },
  
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.postFormData('/admin/images/upload', formData);
  }
};

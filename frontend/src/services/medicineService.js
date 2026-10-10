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
  }
};

import { MOCK_MEDICINES } from '../mockData/medicines';
import { apiClient } from './apiClient';

export const medicineService = {
  async getAll() {
    return new Promise(resolve => setTimeout(() => resolve(MOCK_MEDICINES), 300));
  },
  async getTopSelling() {
    // In future: return apiClient.get('/medicines/top-selling');
    return new Promise(resolve => setTimeout(() => resolve(MOCK_MEDICINES), 300));
  }
};

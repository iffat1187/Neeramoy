import { apiClient } from './apiClient';

export const orderService = {
  async createOrder(orderPayload) {
    return apiClient.post('/orders', orderPayload);
  },
  async getMyOrders() {
    return apiClient.get('/orders');
  },
  async getOrderById(id) {
    return apiClient.get(`/orders/${id}`);
  },
  async cancelOrder(id) {
    return apiClient.patch(`/orders/${id}/cancel`);
  },
  
  // Admin Endpoints
  async getAllOrdersAdmin() {
    return apiClient.get('/orders/admin/all');
  },
  async getAdminOrderById(id) {
    return apiClient.get(`/orders/admin/${id}`);
  },
  async updateOrderStatusByAdmin(id, status) {
    return apiClient.patch(`/orders/admin/${id}/status`, { status });
  }
};

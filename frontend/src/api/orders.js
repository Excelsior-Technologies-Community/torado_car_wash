import api from './axios';

export const ordersApi = {
  checkout: (data) => api.post('/orders/checkout', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
};

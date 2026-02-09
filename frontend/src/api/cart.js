import api from './axios';

export const cartApi = {
  add: (data) => api.post('/cart', data),
  get: () => api.get('/cart'),
  update: (id, data) => api.put(`/cart/${id}`, data),
  remove: (id) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart'),
};

import api from './axios';

export const servicesApi = {
  getAll: () => api.get('/services'),
  getById: (id) => api.get(`/services/${id}`),
  getPricing: (id) => api.get(`/services/${id}/pricing`),
  create: (formData) => api.post('/services', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/services/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/services/${id}`),
};

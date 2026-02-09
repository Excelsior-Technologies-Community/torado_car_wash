import api from './axios';

export const vehicleCategoriesApi = {
  getAll: () => api.get('/vehicle-categories'),
  create: (formData) => api.post('/vehicle-categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/vehicle-categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/vehicle-categories/${id}`),
};

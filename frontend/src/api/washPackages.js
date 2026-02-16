import api from './axiosConfig';

export const washPackagesApi = {
  getAll: () => api.get('/wash-packages'),
  getById: (id) => api.get(`/wash-packages/${id}`),
  create: (formData) => api.post('/wash-packages', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/wash-packages/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/wash-packages/${id}`),
};

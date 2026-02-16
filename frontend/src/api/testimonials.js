import api from './axiosConfig';

export const testimonialsApi = {
  getAll: (params) => api.get('/testimonials', { params }),
  getApproved: (params) => api.get('/testimonials/approved', { params }),
  getById: (id) => api.get(`/testimonials/${id}`),
  create: (formData) => api.post('/testimonials', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, formData) => api.put(`/testimonials/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => api.delete(`/testimonials/${id}`),
  approve: (id) => api.patch(`/testimonials/${id}/approve`),
};

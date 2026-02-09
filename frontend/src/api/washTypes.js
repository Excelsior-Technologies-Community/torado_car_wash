import api from './axios';

export const washTypesApi = {
  getAll: () => api.get('/wash-types'),
  create: (data) => api.post('/wash-types', data),
  update: (id, data) => api.put(`/wash-types/${id}`, data),
  delete: (id) => api.delete(`/wash-types/${id}`),
  
  getFeatures: () => api.get('/wash-types/features'),
  createFeature: (data) => api.post('/wash-types/features', data),
  updateFeature: (id, data) => api.put(`/wash-types/features/${id}`, data),
  deleteFeature: (id) => api.delete(`/wash-types/features/${id}`),
  
  assignFeature: (data) => api.post('/wash-types/features/assign', data),
  removeFeature: (data) => api.delete('/wash-types/features/remove', { data }),
};

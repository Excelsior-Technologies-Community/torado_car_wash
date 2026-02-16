import api from './axiosConfig';

export const contactApi = {
  submitContact: (data) => api.post('/contact', data)
};

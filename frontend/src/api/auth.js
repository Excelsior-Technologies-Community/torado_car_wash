import api from './axiosConfig';

export const authApi = {
  register: (data) => api.post('/users/register', data),
  login: (data) => api.post('/users/login', data),
  forgotPassword: (email) => api.post('/users/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/users/reset-password', { token, password }),
};

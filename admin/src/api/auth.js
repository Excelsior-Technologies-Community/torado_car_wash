import axios from './axios';

export const authAPI = {
  login: (credentials) => axios.post('/users/login', credentials),
  register: (data) => axios.post('/users/register', data),
  getProfile: () => axios.get('/users/profile'),
  updateProfile: (data) => axios.put('/users/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

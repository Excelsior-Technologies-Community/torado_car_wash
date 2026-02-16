import api from './axiosConfig';

export const profileApi = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response;
  },
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response;
  }
};

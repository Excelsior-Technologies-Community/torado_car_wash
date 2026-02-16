import api from './axiosConfig';

export const newsletterApi = {
  subscribe: (email) => api.post('/newsletter/subscribe', { email })
};

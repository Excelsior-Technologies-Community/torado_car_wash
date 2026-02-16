import api from './axiosConfig';

export const faqApi = {
  getAllFaqs: () => api.get('/faqs'),
  getFaqsByCategory: (categoryId) => api.get(`/faqs/category/${categoryId}`)
};

import axios from './axios';

const createFormData = (data) => {
  const formData = new FormData();
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (Array.isArray(data[key])) {
        data[key].forEach(item => formData.append(key, item));
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  return formData;
};

export const bookingsAPI = {
  getAll: (params) => axios.get('/bookings/admin/all', { params }),
  getById: (id) => axios.get(`/bookings/${id}`),
  create: (data) => axios.post('/bookings', data),
  updateStatus: (id, status) => axios.patch(`/bookings/${id}/status`, { status }),
  cancel: (id) => axios.patch(`/bookings/${id}/cancel`),
  getVehicleCategories: () => axios.get('/bookings/vehicle-categories'),
  getAvailableSlots: (params) => axios.get('/bookings/available-slots', { params }),
  getPricing: (params) => axios.get('/bookings/pricing', { params }),
};

export const productsAPI = {
  getAll: (params) => axios.get('/products/admin/all', { params }),
  getById: (id) => axios.get(`/products/${id}`),
  create: (data) => axios.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => axios.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => axios.delete(`/products/${id}`),
  deleteImage: (imageId) => axios.delete(`/products/images/${imageId}`),
  getCategories: () => axios.get('/products/categories'),
  createCategory: (data) => axios.post('/products/categories', data),
  getCategoriesAdmin: () => axios.get('/products/categories/admin/all'),
  updateCategory: (id, data) => axios.put(`/products/categories/${id}`, data),
  deleteCategory: (id) => axios.delete(`/products/categories/${id}`),
  getPendingReviews: () => axios.get('/products/reviews/pending'),
  approveReview: (reviewId) => axios.patch(`/products/reviews/${reviewId}/approve`),
  rejectReview: (reviewId) => axios.delete(`/products/reviews/${reviewId}`),
};

export const servicePricingAPI = {
  getAll: () => axios.get('/service-pricing'),
  create: (data) => axios.post('/service-pricing', data),
  update: (id, data) => axios.put(`/service-pricing/${id}`, data),
  delete: (id) => axios.delete(`/service-pricing/${id}`),
};

export const servicesAPI = {
  getAll: (params) => axios.get('/services', { params }),
  getById: (id) => axios.get(`/services/${id}`),
  create: (data) => axios.post('/services', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => axios.put(`/services/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => axios.delete(`/services/${id}`),
};

export const washPackagesAPI = {
  getAll: () => axios.get('/wash-packages'),
  getById: (id) => axios.get(`/wash-packages/${id}`),
  create: (data) => axios.post('/wash-packages', createFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => axios.put(`/wash-packages/${id}`, createFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => axios.delete(`/wash-packages/${id}`),
  getAllFeatures: () => axios.get('/wash-packages/features/all'),
  createFeature: (data) => axios.post('/wash-packages/features', data),
  updateFeature: (id, data) => axios.put(`/wash-packages/features/${id}`, data),
  deleteFeature: (id) => axios.delete(`/wash-packages/features/${id}`),
  assignFeature: (data) => axios.post('/wash-packages/features/assign', data),
  removeFeature: (data) => axios.delete('/wash-packages/features/remove', { data }),
  setPricing: (data) => axios.post('/wash-packages/pricing', data),
  deletePricing: (id) => axios.delete(`/wash-packages/pricing/${id}`),
};

export const washTypesAPI = {
  getAll: () => axios.get('/wash-types'),
  create: (data) => axios.post('/wash-types', data),
  update: (id, data) => axios.put(`/wash-types/${id}`, data),
  delete: (id) => axios.delete(`/wash-types/${id}`),
  getAllFeatures: () => axios.get('/wash-types/features'),
  createFeature: (data) => axios.post('/wash-types/features', data),
  updateFeature: (id, data) => axios.put(`/wash-types/features/${id}`, data),
  deleteFeature: (id) => axios.delete(`/wash-types/features/${id}`),
  assignFeature: (data) => axios.post('/wash-types/features/assign', data),
  removeFeature: (data) => axios.delete('/wash-types/features/remove', { data }),
};

export const vehicleCategoriesAPI = {
  getAll: () => axios.get('/vehicle-categories'),
  create: (data) => axios.post('/vehicle-categories', createFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => axios.put(`/vehicle-categories/${id}`, createFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => axios.delete(`/vehicle-categories/${id}`),
};

export const ordersAPI = {
  getAll: (params) => axios.get('/orders/admin/all', { params }),
  getById: (id) => axios.get(`/orders/${id}`),
  updateStatus: (id, status) => axios.put(`/orders/${id}/status`, { status }),
  cancel: (id) => axios.put(`/orders/${id}/cancel`),
};

export const blogsAPI = {
  getAll: (params) => axios.get('/blogs', { params }),
  getById: (id) => axios.get(`/blogs/${id}`),
  create: (data) => axios.post('/blogs', createFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => axios.put(`/blogs/${id}`, createFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => axios.delete(`/blogs/${id}`),
};

export const blogCategoriesAPI = {
  getAll: () => axios.get('/blog-categories'),
  create: (data) => axios.post('/blog-categories', data),
  update: (id, data) => axios.put(`/blog-categories/${id}`, data),
  delete: (id) => axios.delete(`/blog-categories/${id}`),
};

export const tagsAPI = {
  getAll: () => axios.get('/tags'),
  getById: (id) => axios.get(`/tags/${id}`),
  create: (data) => axios.post('/tags', data),
  update: (id, data) => axios.put(`/tags/${id}`, data),
  delete: (id) => axios.delete(`/tags/${id}`),
};

export const teamAPI = {
  getAll: () => axios.get('/team'),
  getById: (id) => axios.get(`/team/${id}`),
  create: (data) => axios.post('/team', createFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => axios.put(`/team/${id}`, createFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => axios.delete(`/team/${id}`),
};

export const faqsAPI = {
  getAll: () => axios.get('/faqs'),
  getById: (id) => axios.get(`/faqs/${id}`),
  getByCategory: (categoryId) => axios.get(`/faqs/category/${categoryId}`),
  create: (data) => axios.post('/faqs', data),
  update: (id, data) => axios.put(`/faqs/${id}`, data),
  delete: (id) => axios.delete(`/faqs/${id}`),
};

export const faqCategoriesAPI = {
  getAll: () => axios.get('/faq-categories'),
  getById: (id) => axios.get(`/faq-categories/${id}`),
  create: (data) => axios.post('/faq-categories', data),
  update: (id, data) => axios.put(`/faq-categories/${id}`, data),
  delete: (id) => axios.delete(`/faq-categories/${id}`),
};

export const testimonialsAPI = {
  getAll: () => axios.get('/testimonials'),
  getById: (id) => axios.get(`/testimonials/${id}`),
  getApproved: () => axios.get('/testimonials/approved'),
  create: (data) => axios.post('/testimonials', createFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => axios.put(`/testimonials/${id}`, createFormData(data), { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => axios.delete(`/testimonials/${id}`),
};

export const contactAPI = {
  getAll: (params) => axios.get('/contact', { params }),
  getById: (id) => axios.get(`/contact/${id}`),
  markAsRead: (id) => axios.patch(`/contact/${id}/read`),
  delete: (id) => axios.delete(`/contact/${id}`),
};

export const newsletterAPI = {
  getAll: () => axios.get('/newsletter/subscribers'),
  subscribe: (email) => axios.post('/newsletter/subscribe', { email }),
  unsubscribe: (token) => axios.get(`/newsletter/unsubscribe/${token}`),
};

export const contentAPI = {
  getAllPages: () => axios.get('/content/pages'),
  createPage: (data) => axios.post('/content/pages', data),
  updatePage: (id, data) => axios.put(`/content/pages/${id}`, data),
  deletePage: (id) => axios.delete(`/content/pages/${id}`),
  getSiteSettings: () => axios.get('/content/site-settings'),
  saveSiteSettings: (data) => axios.put('/content/site-settings', data),
};

export const cartAPI = {
  get: () => axios.get('/cart'),
  add: (data) => axios.post('/cart', data),
  update: (id, data) => axios.put(`/cart/${id}`, data),
  remove: (id) => axios.delete(`/cart/${id}`),
  clear: () => axios.delete('/cart'),
};

export const wishlistAPI = {
  get: () => axios.get('/wishlist'),
  add: (data) => axios.post('/wishlist', data),
  remove: (id) => axios.delete(`/wishlist/${id}`),
  clear: () => axios.delete('/wishlist'),
};

export const usersAPI = {
  getAll: () => axios.get('/users/admin'),
  getRoles: () => axios.get('/users/roles'),
  create: (data) => axios.post('/users/admin', data),
  update: (id, data) => axios.put(`/users/admin/${id}`, data),
  delete: (id) => axios.delete(`/users/admin/${id}`),
};

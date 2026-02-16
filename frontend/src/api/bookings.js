import api from './axiosConfig';

export const bookingsApi = {
  getVehicleCategories: () => api.get('/bookings/vehicle-categories'),
  getAvailableSlots: (params) => api.get('/bookings/available-slots', { params }),
  getPricing: (params) => api.get('/bookings/pricing', { params }),
  create: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
  getAll: () => api.get('/bookings/admin/all'),
  updateStatus: (id, data) => api.patch(`/bookings/${id}/status`, data),
};

import api from './axiosConfig';

export const bookingApi = {
  // Create booking
  create: (data) => api.post('/bookings', data),

  // Get user bookings
  getMyBookings: (params) => api.get('/bookings/my-bookings', { params }),

  // Get single booking
  getById: (id) => api.get(`/bookings/${id}`),

  // Cancel booking
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),

  // Admin: Get all bookings
  getAll: (params) => api.get('/bookings/admin/all', { params }),

  // Admin: Update status
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status`, { status })
};

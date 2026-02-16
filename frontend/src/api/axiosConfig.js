import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    const { success, message, data } = response.data;
    
    // Show success toast for POST, PUT, PATCH, DELETE
    if (['post', 'put', 'patch', 'delete'].includes(response.config.method)) {
      if (success && message) {
        toast.success(message);
      }
    }
    
    return response.data; // Return only data portion
  },
  (error) => {
    // Network error
    if (!error.response) {
      toast.error('Network error. Please check your connection.');
      return Promise.reject(error);
    }

    const { status, data } = error.response;
    const message = data?.message || 'Something went wrong';

    // Handle different status codes
    switch (status) {
      case 400:
        toast.warning(message); // Validation errors
        break;
      case 401:
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        break;
      case 403:
        toast.error('Access denied');
        break;
      case 404:
        toast.error(message);
        break;
      case 409:
        toast.warning(message); // Conflict (duplicate)
        break;
      case 500:
        toast.error('Server error. Please try again later.');
        break;
      default:
        toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;

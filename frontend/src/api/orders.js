import api from './axiosConfig'

export const ordersApi = {
    checkout: () => api.post('/orders/checkout', {}),
    getAll: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    cancel: (id) => api.put(`/orders/${id}/cancel`, {})
}

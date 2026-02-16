import api from './axiosConfig'

export const productsApi = {
    getAll: (params) => api.get('/products', { params }),
    getById: (id) => api.get(`/products/${id}`),
    getReviews: (id) => api.get(`/products/${id}/reviews`),
    createReview: (id, data) => api.post(`/products/${id}/reviews`, data),
}

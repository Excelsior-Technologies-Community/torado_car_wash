import api from './axiosConfig'

export const cartApi = {
    add: (product_id, quantity = 1) => api.post('/cart', { product_id, quantity }),
    getAll: () => api.get('/cart'),
    update: (id, quantity) => api.put(`/cart/${id}`, { quantity }),
    remove: (id) => api.delete(`/cart/${id}`)
}

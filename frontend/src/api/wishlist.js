import api from './axiosConfig'

export const wishlistApi = {
    add: (product_id) => api.post('/wishlist', { product_id }),
    getAll: () => api.get('/wishlist'),
    remove: (id) => api.delete(`/wishlist/${id}`)
}

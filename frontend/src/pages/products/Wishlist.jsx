import React, { useState, useEffect } from 'react'
import { FaTrash, FaShoppingCart } from 'react-icons/fa'
import { wishlistApi } from '../../api/wishlist'
import { cartApi } from '../../api/cart'
import { useNavigate } from 'react-router-dom'

function Wishlist() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchWishlist()
    }, [])

    const fetchWishlist = async () => {
        try {
            const response = await wishlistApi.getAll()
            const data = Array.isArray(response) ? response : (response.data || [])
            setItems(data)
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login')
            }
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    const handleRemove = async (id) => {
        try {
            await wishlistApi.remove(id)
            setItems(items.filter(item => item.id !== id))
        } catch (error) {
            // Toast handled by interceptor
        }
    }

    const handleAddToCart = async (productId, itemId) => {
        try {
            await cartApi.add(productId)
            await wishlistApi.remove(itemId)
            setItems(items.filter(item => item.id !== itemId))
        } catch (error) {
            // Toast handled by interceptor
        }
    }

    if (loading) return <div className='text-center py-20'>Loading...</div>

    return (
        <div className='max-w-7xl mx-auto px-6 py-12'>
            <h1 className='text-4xl font-bold mb-8'>My Wishlist</h1>
            
            {items && items.length === 0 ? (
                <div className='text-center py-20'>
                    <p className='text-gray-500 text-xl mb-4'>Your wishlist is empty</p>
                    <button onClick={() => navigate('/shop')} className='bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600'>
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {items.map((item) => (
                        <div key={item.id} className='bg-white rounded-lg shadow-md overflow-hidden'>
                            <img 
                                src={`http://localhost:5000/uploads/${item.image || 'placeholder.jpg'}`}
                                alt={item.name}
                                className='w-full h-48 object-cover'
                            />
                            <div className='p-4'>
                                <h3 className='font-semibold text-lg mb-2'>{item.name}</h3>
                                <p className='text-orange-500 font-bold text-xl mb-4'>${item.price}</p>
                                <div className='flex gap-2'>
                                    <button 
                                        onClick={() => handleAddToCart(item.product_id, item.id)}
                                        className='flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 flex items-center justify-center gap-2'
                                    >
                                        <FaShoppingCart /> Add to Cart
                                    </button>
                                    <button 
                                        onClick={() => handleRemove(item.id)}
                                        className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Wishlist

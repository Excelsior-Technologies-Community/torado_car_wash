import React, { useState, useEffect } from 'react'
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa'
import { cartApi } from '../../api/cart'
import { useNavigate } from 'react-router-dom'

function Cart() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetchCart()
    }, [])

    const fetchCart = async () => {
        try {
            const response = await cartApi.getAll()
            setItems(response.data || [])
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login')
            }
            setItems([])
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateQuantity = async (id, newQuantity) => {
        if (newQuantity < 1) return
        try {
            await cartApi.update(id, newQuantity)
            setItems(items.map(item => 
                item.id === id ? { ...item, quantity: newQuantity } : item
            ))
        } catch (error) {
            // Toast handled by interceptor
        }
    }

    const handleRemove = async (id) => {
        try {
            await cartApi.remove(id)
            setItems(items.filter(item => item.id !== id))
        } catch (error) {
            // Toast handled by interceptor
        }
    }

    const calculateTotal = () => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)
    }

    if (loading) return <div className='text-center py-20'>Loading...</div>

    return (
        <div className='max-w-7xl mx-auto px-6 py-12'>
            <h1 className='text-4xl font-bold mb-8'>Shopping Cart</h1>
            
            {items && items.length === 0 ? (
                <div className='text-center py-20'>
                    <p className='text-gray-500 text-xl mb-4'>Your cart is empty</p>
                    <button onClick={() => navigate('/shop')} className='bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600'>
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className='bg-white rounded-lg shadow-md overflow-x-auto mb-6'>
                        <table className='w-full'>
                            <thead className='bg-gray-50 border-b'>
                                <tr>
                                    <th className='text-left p-4'>Image</th>
                                    <th className='text-left p-4'>Product Name</th>
                                    <th className='text-left p-4'>Unit Price</th>
                                    <th className='text-left p-4'>Quantity</th>
                                    <th className='text-left p-4'>Total</th>
                                    <th className='text-left p-4'>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item) => (
                                    <tr key={item.id} className='border-b hover:bg-gray-50'>
                                        <td className='p-4'>
                                            <img 
                                                src={`http://localhost:5000/uploads/${item.image_path || 'placeholder.jpg'}`}
                                                alt={item.name}
                                                className='w-20 h-20 object-cover rounded'
                                            />
                                        </td>
                                        <td className='p-4 font-semibold'>{item.name}</td>
                                        <td className='p-4 text-orange-500 font-bold'>${item.price}</td>
                                        <td className='p-4'>
                                            <div className='flex items-center gap-2 border rounded w-fit'>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                    className='p-2 hover:bg-gray-100'
                                                >
                                                    <FaMinus size={12} />
                                                </button>
                                                <span className='px-4 font-semibold'>{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                    className='p-2 hover:bg-gray-100'
                                                >
                                                    <FaPlus size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className='p-4 font-bold'>${(item.price * item.quantity).toFixed(2)}</td>
                                        <td className='p-4'>
                                            <button 
                                                onClick={() => handleRemove(item.id)}
                                                className='text-red-500 hover:text-red-700'
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className='flex justify-end'>
                        <div className='bg-white rounded-lg shadow-md p-6 w-full md:w-96'>
                            <h3 className='text-2xl font-bold mb-4'>Cart Summary</h3>
                            <div className='flex justify-between mb-2'>
                                <span className='text-gray-600'>Subtotal:</span>
                                <span className='font-semibold'>${calculateTotal()}</span>
                            </div>
                            <div className='flex justify-between mb-4 text-xl font-bold border-t pt-2'>
                                <span>Total:</span>
                                <span className='text-orange-500'>${calculateTotal()}</span>
                            </div>
                            <button 
                                onClick={() => navigate('/checkout')}
                                className='w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold'
                            >
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Cart

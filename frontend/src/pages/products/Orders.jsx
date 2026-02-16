import React, { useState, useEffect } from 'react'
import { ordersApi } from '../../api/orders'
import { useNavigate } from 'react-router-dom'
import { FaEye, FaTimes } from 'react-icons/fa'

function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [orderDetails, setOrderDetails] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const response = await ordersApi.getAll()
            const data = Array.isArray(response) ? response : (response.data || [])
            setOrders(data)
        } catch (error) {
            if (error.response?.status === 401) {
                navigate('/login')
            }
            setOrders([])
        } finally {
            setLoading(false)
        }
    }

    const handleViewDetails = async (orderId) => {
        try {
            const response = await ordersApi.getById(orderId)
            const data = response.data || response
            setOrderDetails(data)
            setSelectedOrder(orderId)
        } catch (error) {
            console.error('Failed to fetch order details:', error)
        }
    }

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return
        try {
            await ordersApi.cancel(orderId)
            fetchOrders()
            setSelectedOrder(null)
            setOrderDetails(null)
        } catch (error) {
            console.error('Failed to cancel order:', error)
        }
    }

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Processing': 'bg-blue-100 text-blue-800',
            'Shipped': 'bg-purple-100 text-purple-800',
            'Delivered': 'bg-green-100 text-green-800',
            'Cancelled': 'bg-red-100 text-red-800'
        }
        return colors[status] || 'bg-gray-100 text-gray-800'
    }

    if (loading) return <div className='text-center py-20'>Loading...</div>

    return (
        <div className='max-w-7xl mx-auto px-6 py-12'>
            <h1 className='text-4xl font-bold mb-8'>My Orders</h1>
            
            {orders && orders.length === 0 ? (
                <div className='text-center py-20'>
                    <p className='text-gray-500 text-xl mb-4'>You have no orders yet</p>
                    <button onClick={() => navigate('/shop')} className='bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600'>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className='bg-white rounded-lg shadow-md overflow-x-auto'>
                    <table className='w-full'>
                        <thead className='bg-gray-50 border-b'>
                            <tr>
                                <th className='text-left p-4'>Order ID</th>
                                <th className='text-left p-4'>Date</th>
                                <th className='text-left p-4'>Items</th>
                                <th className='text-left p-4'>Total</th>
                                <th className='text-left p-4'>Status</th>
                                <th className='text-left p-4'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className='border-b hover:bg-gray-50'>
                                    <td className='p-4 font-semibold'>#{order.id}</td>
                                    <td className='p-4'>{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className='p-4'>{order.item_count} items</td>
                                    <td className='p-4 font-bold text-orange-500'>${order.total_amount}</td>
                                    <td className='p-4'>
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className='p-4'>
                                        <div className='flex gap-2'>
                                            <button 
                                                onClick={() => handleViewDetails(order.id)}
                                                className='text-blue-500 hover:text-blue-700'
                                            >
                                                <FaEye size={18} />
                                            </button>
                                            {order.status === 'Pending' && (
                                                <button 
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    className='text-red-500 hover:text-red-700'
                                                >
                                                    <FaTimes size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedOrder && orderDetails && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4' onClick={() => setSelectedOrder(null)}>
                    <div className='bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                        <div className='flex justify-between items-center p-6 border-b'>
                            <h2 className='text-2xl font-bold'>Order Details #{orderDetails.id}</h2>
                            <button onClick={() => setSelectedOrder(null)} className='text-gray-500 hover:text-gray-700'>
                                <FaTimes size={24} />
                            </button>
                        </div>
                        
                        <div className='p-6'>
                            <div className='grid md:grid-cols-2 gap-6 mb-6'>
                                <div>
                                    <h3 className='font-semibold mb-2'>Order Information</h3>
                                    <p className='text-sm text-gray-600'>Order Date: {new Date(orderDetails.created_at).toLocaleString()}</p>
                                    <p className='text-sm text-gray-600'>Status: <span className={`px-2 py-1 rounded text-xs ${getStatusColor(orderDetails.status)}`}>{orderDetails.status}</span></p>
                                </div>
                                <div>
                                    <h3 className='font-semibold mb-2'>Customer Information</h3>
                                    <p className='text-sm text-gray-600'>Name: {orderDetails.user_name}</p>
                                    <p className='text-sm text-gray-600'>Email: {orderDetails.email}</p>
                                    <p className='text-sm text-gray-600'>Phone: {orderDetails.phone}</p>
                                </div>
                            </div>

                            <h3 className='font-semibold mb-4'>Order Items</h3>
                            <div className='space-y-3 mb-6'>
                                {orderDetails.items && orderDetails.items.length > 0 && orderDetails.items.map((item) => (
                                    <div key={item.id} className='flex gap-4 items-center border-b pb-3'>
                                        {item.product_image && (
                                            <img 
                                                src={`http://localhost:5000/uploads/${item.product_image}`}
                                                alt={item.product_name}
                                                className='w-20 h-20 object-cover rounded'
                                            />
                                        )}
                                        <div className='flex-1'>
                                            <p className='font-semibold'>{item.product_name}</p>
                                            <p className='text-sm text-gray-600'>Quantity: {item.quantity}</p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='font-semibold'>${Number(item.price || 0).toFixed(2)}</p>
                                            <p className='text-sm text-gray-600'>Subtotal: ${(Number(item.price || 0) * Number(item.quantity || 0)).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='border-t pt-4'>
                                <div className='flex justify-between text-xl font-bold'>
                                    <span>Total Amount:</span>
                                    <span className='text-orange-500'>${orderDetails.total_amount}</span>
                                </div>
                            </div>

                            {orderDetails.status === 'Pending' && (
                                <button 
                                    onClick={() => handleCancelOrder(orderDetails.id)}
                                    className='w-full mt-6 bg-red-500 text-white py-3 rounded-lg hover:bg-red-600'
                                >
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Orders

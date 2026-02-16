import React, { useState, useEffect } from 'react'
import { cartApi } from '../../api/cart'
import { ordersApi } from '../../api/orders'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

function Checkout() {
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [couponCode, setCouponCode] = useState('')
    const [discount, setDiscount] = useState(0)
    const [shippingCost, setShippingCost] = useState(30)
    const [cardType, setCardType] = useState('visa')
    const [cardNumber, setCardNumber] = useState('')
    const [cvv, setCvv] = useState('')
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [postalCode, setPostalCode] = useState('')
    const [processing, setProcessing] = useState(false)
    const [errors, setErrors] = useState({})
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

    const calculateSubtotal = () => {
        return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    }

    const calculateTotal = () => {
        return (calculateSubtotal() + shippingCost - discount).toFixed(2)
    }

    const handleApplyCoupon = () => {
        if (couponCode.toUpperCase() === 'SAVE20') {
            setDiscount(20)
        }
    }

    const validateForm = () => {
        const newErrors = {}
        
        if (!country.trim()) newErrors.country = 'Country is required'
        if (!city.trim()) newErrors.city = 'City is required'
        if (!postalCode.trim()) {
            newErrors.postalCode = 'Postal code is required'
        } else if (!/^\d{5,6}$/.test(postalCode)) {
            newErrors.postalCode = 'Invalid postal code'
        }
        
        if (!cardNumber.trim()) {
            newErrors.cardNumber = 'Card number is required'
        } else if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Card number must be 16 digits'
        }
        
        if (!cvv.trim()) {
            newErrors.cvv = 'CVV is required'
        } else if (!/^\d{3,4}$/.test(cvv)) {
            newErrors.cvv = 'CVV must be 3-4 digits'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleCheckout = async () => {
        if (!validateForm()) {
            toast.error('Please fill all required fields correctly')
            return
        }
        setProcessing(true)
        try {
            await ordersApi.checkout()
            navigate('/orders')
        } catch (error) {
            // Toast handled by interceptor
        } finally {
            setProcessing(false)
        }
    }

    if (loading) return <div className='text-center py-20'>Loading...</div>

    if (items && items.length === 0) {
        return (
            <div className='max-w-7xl mx-auto px-6 py-12 text-center'>
                <p className='text-gray-500 text-xl mb-4'>Your cart is empty</p>
                <button onClick={() => navigate('/shop')} className='bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600'>
                    Continue Shopping
                </button>
            </div>
        )
    }

    return (
        <div className='max-w-7xl mx-auto px-6 py-12'>
            <h1 className='text-4xl font-bold mb-8'>Checkout</h1>
            
            <div className='grid lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-2 space-y-6'>
                    <div className='bg-white rounded-lg shadow-md p-6'>
                        <h2 className='text-2xl font-bold mb-4'>Calculate Shipping</h2>
                        <div className='grid md:grid-cols-2 gap-4'>
                            <div>
                                <input 
                                    type='text' 
                                    placeholder='Country'
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className={`border rounded px-4 py-2 w-full ${errors.country ? 'border-red-500' : ''}`}
                                />
                                {errors.country && <p className='text-red-500 text-sm mt-1'>{errors.country}</p>}
                            </div>
                            <div>
                                <input 
                                    type='text' 
                                    placeholder='City'
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className={`border rounded px-4 py-2 w-full ${errors.city ? 'border-red-500' : ''}`}
                                />
                                {errors.city && <p className='text-red-500 text-sm mt-1'>{errors.city}</p>}
                            </div>
                            <div>
                                <input 
                                    type='text' 
                                    placeholder='Postal Code'
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    className={`border rounded px-4 py-2 w-full ${errors.postalCode ? 'border-red-500' : ''}`}
                                />
                                {errors.postalCode && <p className='text-red-500 text-sm mt-1'>{errors.postalCode}</p>}
                            </div>
                            <button className='bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600'>
                                Calculate
                            </button>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg shadow-md p-6'>
                        <h2 className='text-2xl font-bold mb-4'>Payment Details</h2>
                        <div className='space-y-4'>
                            <div>
                                <label className='block mb-2 font-semibold'>Credit Card Type</label>
                                <select 
                                    value={cardType}
                                    onChange={(e) => setCardType(e.target.value)}
                                    className='w-full border rounded px-4 py-2'
                                >
                                    <option value='visa'>Visa</option>
                                    <option value='mastercard'>Mastercard</option>
                                    <option value='amex'>American Express</option>
                                </select>
                            </div>
                            <div>
                                <label className='block mb-2 font-semibold'>Credit Card Number</label>
                                <input 
                                    type='text'
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                                    placeholder='1234 5678 9012 3456'
                                    maxLength='16'
                                    className={`w-full border rounded px-4 py-2 ${errors.cardNumber ? 'border-red-500' : ''}`}
                                />
                                {errors.cardNumber && <p className='text-red-500 text-sm mt-1'>{errors.cardNumber}</p>}
                            </div>
                            <div>
                                <label className='block mb-2 font-semibold'>Card Verification Number (CVV)</label>
                                <input 
                                    type='text'
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                                    placeholder='123'
                                    maxLength='4'
                                    className={`w-full border rounded px-4 py-2 ${errors.cvv ? 'border-red-500' : ''}`}
                                />
                                {errors.cvv && <p className='text-red-500 text-sm mt-1'>{errors.cvv}</p>}
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg shadow-md p-6'>
                        <h2 className='text-2xl font-bold mb-4'>Coupon Code</h2>
                        <div className='flex gap-2'>
                            <input 
                                type='text'
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder='Enter coupon code'
                                className='flex-1 border rounded px-4 py-2'
                            />
                            <button 
                                onClick={handleApplyCoupon}
                                className='bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600'
                            >
                                Apply Coupon
                            </button>
                        </div>
                    </div>
                </div>

                <div className='lg:col-span-1'>
                    <div className='bg-white rounded-lg shadow-md p-6 sticky top-4'>
                        <h2 className='text-2xl font-bold mb-4'>Order Summary</h2>
                        <div className='space-y-3 mb-4'>
                            {items.map((item) => (
                                <div key={item.id} className='flex justify-between text-sm'>
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className='border-t pt-4 space-y-2'>
                            <div className='flex justify-between'>
                                <span className='text-gray-600'>Subtotal</span>
                                <span className='font-semibold'>${calculateSubtotal().toFixed(2)}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-gray-600'>Shipping</span>
                                <span className='font-semibold'>${shippingCost.toFixed(2)}</span>
                            </div>
                            {discount > 0 && (
                                <div className='flex justify-between text-green-600'>
                                    <span>Coupon</span>
                                    <span>-${discount.toFixed(2)}</span>
                                </div>
                            )}
                            <div className='flex justify-between text-xl font-bold border-t pt-2'>
                                <span>Total</span>
                                <span className='text-orange-500'>${calculateTotal()}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleCheckout}
                            disabled={processing}
                            className='w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-semibold mt-6 disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {processing ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout

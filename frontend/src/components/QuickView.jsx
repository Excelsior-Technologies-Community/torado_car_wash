import React, { useEffect, useState } from 'react'
import { FaTimes, FaShoppingCart, FaHeart, FaStar } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { productsApi } from '../api/products'

function QuickView({ product, onClose, onAddToCart, onAddToWishlist }) {
    const [quantity, setQuantity] = useState(1)
    const [selectedImage, setSelectedImage] = useState(0)
    const [reviews, setReviews] = useState([])
    const [loadingReviews, setLoadingReviews] = useState(false)
    const [submittingReview, setSubmittingReview] = useState(false)
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        review_content: '',
        review_message: ''
    })

    const productId = product?.id
    const images = product?.images || []
    const mainImage = images[selectedImage] || images[0]

    useEffect(() => {
        if (!productId) return
        const fetchReviews = async () => {
            setLoadingReviews(true)
            try {
                const response = await productsApi.getReviews(productId)
                setReviews(response.data || [])
            } catch (error) {
                console.error('Failed to fetch product reviews:', error)
                setReviews([])
            } finally {
                setLoadingReviews(false)
            }
        }
        fetchReviews()
    }, [productId])

    const handleReviewChange = (e) => {
        const { name, value } = e.target
        setReviewForm(prev => ({ ...prev, [name]: value }))
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        if (!token) {
            toast.warning('Please login to submit a review')
            return
        }
        if (!reviewForm.review_content.trim() && !reviewForm.review_message.trim()) {
            toast.warning('Please enter a review title or message')
            return
        }

        setSubmittingReview(true)
        try {
            await productsApi.createReview(productId, {
                rating: Number(reviewForm.rating),
                review_content: reviewForm.review_content.trim(),
                review_message: reviewForm.review_message.trim(),
            })
            setReviewForm({
                rating: 5,
                review_content: '',
                review_message: ''
            })
        } catch (error) {
            console.error('Failed to submit review:', error)
        } finally {
            setSubmittingReview(false)
        }
    }

    if (!product) return null

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4' onClick={onClose}>
            <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
                <div className='flex justify-between items-center p-6 border-b'>
                    <h2 className='text-2xl font-bold'>Quick View</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
                        <FaTimes size={24} />
                    </button>
                </div>
                
                <div className='grid md:grid-cols-2 gap-8 p-6'>
                    <div>
                        <img 
                            src={`http://localhost:5000/uploads/${mainImage}`} 
                            alt={product.name}
                            className='w-full h-96 object-cover rounded-lg mb-4'
                        />
                        {images.length > 1 && (
                            <div className='flex gap-2'>
                                {images.map((img, idx) => (
                                    <img 
                                        key={idx}
                                        src={`http://localhost:5000/uploads/${img}`}
                                        alt={`${product.name} ${idx + 1}`}
                                        className={`w-20 h-20 object-cover rounded cursor-pointer ${selectedImage === idx ? 'ring-2 ring-orange-500' : ''}`}
                                        onClick={() => setSelectedImage(idx)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <h3 className='text-3xl font-bold mb-4'>{product.name}</h3>
                        <p className='text-3xl text-orange-500 font-bold mb-4'>${product.price}</p>
                        <p className='text-gray-600 mb-6'>{product.description}</p>
                        <div className='grid grid-cols-2 gap-2 mb-6 text-sm'>
                            {product.brand && <p><span className='font-semibold'>Brand:</span> {product.brand}</p>}
                            {product.color && <p><span className='font-semibold'>Color:</span> {product.color}</p>}
                            {product.size && <p><span className='font-semibold'>Size:</span> {product.size}</p>}
                            {product.weight && <p><span className='font-semibold'>Weight:</span> {product.weight}</p>}
                            {product.dimensions && <p><span className='font-semibold'>Dimensions:</span> {product.dimensions}</p>}
                            {product.category_name && <p><span className='font-semibold'>Category:</span> {product.category_name}</p>}
                        </div>
                        
                        <div className='flex items-center gap-4 mb-6'>
                            <label className='font-semibold'>Quantity:</label>
                            <div className='flex items-center border rounded'>
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className='px-4 py-2 hover:bg-gray-100'
                                >-</button>
                                <span className='px-6 py-2 border-x'>{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className='px-4 py-2 hover:bg-gray-100'
                                >+</button>
                            </div>
                        </div>
                        
                        <div className='flex gap-4'>
                            <button 
                                onClick={() => onAddToCart(product.id, quantity)}
                                className='flex-1 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2'
                            >
                                <FaShoppingCart /> Add to Cart
                            </button>
                            <button 
                                onClick={() => onAddToWishlist(product.id)}
                                className='bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300'
                            >
                                <FaHeart />
                            </button>
                        </div>
                        
                        {product.stock_quantity !== undefined && (
                            <p className='mt-4 text-sm text-gray-500'>
                                Stock: {product.stock_quantity} available
                            </p>
                        )}
                    </div>
                </div>

                <div className='border-t p-6'>
                    <h4 className='text-xl font-semibold mb-4'>Customer Reviews</h4>

                    <form onSubmit={handleReviewSubmit} className='mb-8 bg-gray-50 p-4 rounded-lg'>
                        <div className='mb-3'>
                            <label className='block text-sm font-medium mb-2'>Rating</label>
                            <div className='flex items-center gap-2'>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type='button'
                                        onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                        className='text-2xl'
                                    >
                                        <FaStar className={star <= Number(reviewForm.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <input
                            name='review_content'
                            value={reviewForm.review_content}
                            onChange={handleReviewChange}
                            placeholder='Review title'
                            className='w-full border rounded-lg px-3 py-2 mb-3'
                        />
                        <textarea
                            name='review_message'
                            value={reviewForm.review_message}
                            onChange={handleReviewChange}
                            placeholder='Write your review'
                            rows={4}
                            className='w-full border rounded-lg px-3 py-2 mb-3'
                        />
                        <button
                            type='submit'
                            disabled={submittingReview}
                            className='bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50'
                        >
                            {submittingReview ? 'Submitting...' : 'Submit Review'}
                        </button>
                        <p className='text-xs text-gray-500 mt-2'>Submitted reviews are published after admin approval.</p>
                    </form>

                    {loadingReviews ? (
                        <p className='text-gray-500'>Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <p className='text-gray-500'>No approved reviews yet.</p>
                    ) : (
                        <div className='space-y-4'>
                            {reviews.map((review) => (
                                <div key={review.id} className='border rounded-lg p-4'>
                                    <div className='flex items-center justify-between mb-2'>
                                        <p className='font-semibold'>{review.user_name}</p>
                                        <div className='flex items-center gap-1'>
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    {review.review_content && <p className='font-medium mb-1'>{review.review_content}</p>}
                                    {review.review_message && <p className='text-gray-600'>{review.review_message}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default QuickView

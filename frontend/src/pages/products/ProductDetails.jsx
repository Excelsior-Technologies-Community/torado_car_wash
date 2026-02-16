import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FaHeart, FaShoppingCart, FaStar } from 'react-icons/fa'
import { productsApi } from '../../api/products'
import { cartApi } from '../../api/cart'
import { wishlistApi } from '../../api/wishlist'
import { toast } from 'react-toastify'

function ProductDetails() {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [reviews, setReviews] = useState([])
    const [loadingReviews, setLoadingReviews] = useState(false)
    const [submittingReview, setSubmittingReview] = useState(false)
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        review_content: '',
        review_message: ''
    })

    const uploadBaseUrl = useMemo(
        () => (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, ''),
        []
    )

    useEffect(() => {
        fetchProduct()
        fetchReviews()
    }, [id])

    const fetchProduct = async () => {
        setLoading(true)
        try {
            const response = await productsApi.getById(id)
            setProduct(response.data || null)
            setSelectedImage(0)
            setQuantity(1)
        } catch (error) {
            console.error('Error fetching product:', error)
            setProduct(null)
        } finally {
            setLoading(false)
        }
    }

    const fetchReviews = async () => {
        setLoadingReviews(true)
        try {
            const response = await productsApi.getReviews(id)
            setReviews(response.data || [])
        } catch (error) {
            console.error('Error fetching reviews:', error)
            setReviews([])
        } finally {
            setLoadingReviews(false)
        }
    }

    const handleAddToCart = async () => {
        if (!product) return
        try {
            await cartApi.add(product.id, quantity)
            toast.success('Added to cart!')
        } catch (error) {
            console.error('Add to cart error:', error)
        }
    }

    const handleAddToWishlist = async () => {
        if (!product) return
        try {
            await wishlistApi.add(product.id)
            toast.success('Added to wishlist!')
        } catch (error) {
            console.error('Add to wishlist error:', error)
        }
    }

    const handleReviewChange = (e) => {
        const { name, value } = e.target
        setReviewForm((prev) => ({ ...prev, [name]: value }))
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
            await productsApi.createReview(id, {
                rating: Number(reviewForm.rating),
                review_content: reviewForm.review_content.trim(),
                review_message: reviewForm.review_message.trim()
            })
            setReviewForm({
                rating: 5,
                review_content: '',
                review_message: ''
            })
        } catch (error) {
            console.error('Submit review error:', error)
        } finally {
            setSubmittingReview(false)
        }
    }

    if (loading) return <div className='text-center py-20'>Loading product...</div>
    if (!product) return <div className='text-center py-20'>Product not found</div>

    const images = Array.isArray(product.images) ? product.images : []
    const mainImage = images[selectedImage] || images[0]

    let additionalInfo = null
    if (product.additional_info) {
        try {
            additionalInfo =
                typeof product.additional_info === 'string'
                    ? JSON.parse(product.additional_info)
                    : product.additional_info
        } catch {
            additionalInfo = null
        }
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 py-10'>
            <div className='mb-6 text-sm text-gray-500'>
                <Link to='/' className='hover:text-orange-500'>Home</Link> /{' '}
                <Link to='/shop' className='hover:text-orange-500'>Shop</Link> /{' '}
                <span className='text-gray-700'>{product.name}</span>
            </div>

            <div className='grid lg:grid-cols-2 gap-8 lg:gap-12'>
                <div>
                    {mainImage ? (
                        <img
                            src={`${uploadBaseUrl}/uploads/${mainImage}`}
                            alt={product.name}
                            className='w-full h-[460px] object-cover rounded-2xl shadow-lg'
                        />
                    ) : (
                        <div className='w-full h-[460px] bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400'>
                            No image
                        </div>
                    )}

                    {images.length > 1 && (
                        <div className='grid grid-cols-5 gap-3 mt-4'>
                            {images.map((img, idx) => (
                                <button
                                    key={img || idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-orange-500' : 'border-transparent'}`}
                                >
                                    <img
                                        src={`${uploadBaseUrl}/uploads/${img}`}
                                        alt={`${product.name}-${idx + 1}`}
                                        className='w-full h-20 object-cover'
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h1 className='text-3xl sm:text-4xl font-bold mb-3'>{product.name}</h1>
                    <p className='text-orange-500 text-3xl font-bold mb-5'>${product.price}</p>
                    <p className='text-gray-600 leading-7 mb-6'>{product.description || 'No description available.'}</p>

                    <div className='grid sm:grid-cols-2 gap-3 text-sm mb-6'>
                        {product.category_name && <p><span className='font-semibold'>Category:</span> {product.category_name}</p>}
                        {product.brand && <p><span className='font-semibold'>Brand:</span> {product.brand}</p>}
                        {product.color && <p><span className='font-semibold'>Color:</span> {product.color}</p>}
                        {product.size && <p><span className='font-semibold'>Size:</span> {product.size}</p>}
                        {product.weight && <p><span className='font-semibold'>Weight:</span> {product.weight}</p>}
                        {product.dimensions && <p><span className='font-semibold'>Dimensions:</span> {product.dimensions}</p>}
                        <p><span className='font-semibold'>Stock:</span> {product.stock_quantity ?? 0}</p>
                    </div>

                    <div className='flex items-center gap-4 mb-6'>
                        <div className='flex items-center border rounded-lg overflow-hidden'>
                            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className='px-4 py-2 hover:bg-gray-100'>-</button>
                            <span className='px-4 py-2 border-x'>{quantity}</span>
                            <button onClick={() => setQuantity((q) => q + 1)} className='px-4 py-2 hover:bg-gray-100'>+</button>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className='inline-flex items-center gap-2 bg-orange-500 text-white px-5 py-3 rounded-lg hover:bg-orange-600'
                        >
                            <FaShoppingCart /> Add to Cart
                        </button>
                        <button
                            onClick={handleAddToWishlist}
                            className='inline-flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300'
                        >
                            <FaHeart />
                        </button>
                    </div>

                    {additionalInfo && Object.keys(additionalInfo).length > 0 && (
                        <div className='bg-gray-50 rounded-lg p-4'>
                            <h3 className='font-semibold mb-2'>Additional Info</h3>
                            <div className='space-y-1 text-sm text-gray-700'>
                                {Object.entries(additionalInfo).map(([key, value]) => (
                                    <p key={key}>
                                        <span className='font-medium'>{key}:</span> {String(value)}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className='mt-12 border-t pt-8'>
                <h2 className='text-2xl font-bold mb-5'>Customer Reviews</h2>

                <form onSubmit={handleReviewSubmit} className='bg-gray-50 rounded-lg p-5 mb-8'>
                    <label className='block text-sm font-medium mb-2'>Rating</label>
                    <div className='flex items-center gap-2 mb-4'>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type='button'
                                onClick={() => setReviewForm((prev) => ({ ...prev, rating: star }))}
                                className='text-2xl'
                            >
                                <FaStar className={star <= Number(reviewForm.rating) ? 'text-yellow-400' : 'text-gray-300'} />
                            </button>
                        ))}
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
    )
}

export default ProductDetails

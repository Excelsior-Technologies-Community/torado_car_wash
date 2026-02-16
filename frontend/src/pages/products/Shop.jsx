import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaHeart, FaEye, FaShoppingCart } from 'react-icons/fa'
import { productsApi } from '../../api/products'
import { wishlistApi } from '../../api/wishlist'
import { cartApi } from '../../api/cart'
import QuickView from '../../components/QuickView'
import { toast } from 'react-toastify'

function Shop() {
    const [products, setProducts] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [hoveredProduct, setHoveredProduct] = useState(null)
    const [wishlistItems, setWishlistItems] = useState([])
    const limit = 12

    useEffect(() => {
        fetchProducts()
        fetchWishlist()
    }, [currentPage])

    const fetchWishlist = async () => {
        try {
            const response = await wishlistApi.getAll()
            setWishlistItems(response.data || [])
        } catch (error) {
            console.error('Error fetching wishlist:', error)
        }
    }

    const fetchProducts = async () => {
        setLoading(true)
        try {
            const response = await productsApi.getAll({ page: currentPage, limit })
            // axiosConfig returns response.data, so response = { success, data, pagination }
            setProducts(response.data || [])
            setTotalPages(response.pagination?.pages || 1)
        } catch (error) {
            console.error('Error fetching products:', error)
            setProducts([])
            setTotalPages(1)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToWishlist = async (productId) => {
        try {
            const response = await wishlistApi.add(productId)
            if (!response.message) {
                toast.success('Added to wishlist!')
            }
            fetchWishlist()
        } catch (error) {
            // Toast handled by interceptor
        }
    }

    const isInWishlist = (productId) => {
        return wishlistItems.some(item => item.product_id === productId)
    }

    const handleAddToCart = async (productId, quantity = 1) => {
        try {
            const response = await cartApi.add(productId, quantity)
            if (!response.message) {
                toast.success('Added to cart!')
            }
            setSelectedProduct(null)
        } catch (error) {
            // Toast handled by interceptor
        }
    }

    const handleQuickView = async (productId) => {
        try {
            const response = await productsApi.getById(productId)
            setSelectedProduct(response.data)
        } catch (error) {
            console.error('Error fetching product:', error)
        }
    }

    return (
        <div className='max-w-7xl mx-auto px-6 py-12'>
            <div className='text-center mb-12'>
                <h6 className='text-orange-500 text-lg mb-2'>Our Products</h6>
                <h2 className='text-4xl font-bold'>
                    Get Your Necessary Product<br />From Our Online Shop
                </h2>
            </div>

            {loading ? (
                <div className='text-center py-20'>Loading...</div>
            ) : products.length === 0 ? (
                <div className='text-center py-20'>
                    <p className='text-gray-500 text-lg'>No products found</p>
                    <p className='text-gray-400 text-sm mt-2'>Check console for API response</p>
                </div>
            ) : (
                <>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                        {products.map((product) => (
                            <div 
                                key={product.id}
                                className='bg-white rounded-lg shadow-md overflow-hidden relative group h-[430px] flex flex-col'
                                onMouseEnter={() => setHoveredProduct(product.id)}
                                onMouseLeave={() => setHoveredProduct(null)}
                            >
                                <div className='relative overflow-hidden h-64 bg-gray-50 flex items-center justify-center'>
                                    <Link to={`/products/${product.id}`}>
                                        <img 
                                            src={product.images?.[0] ? `http://localhost:5000/uploads/${product.images[0]}` : '/images/404.jpg'}
                                            alt={product.name}
                                            className='w-full h-full object-contain group-hover:scale-105 transition-transform duration-300'
                                        />
                                    </Link>
                                    {hoveredProduct === product.id && (
                                        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2'>
                                            <button 
                                                onClick={() => handleAddToWishlist(product.id)}
                                                className={`p-3 rounded-full shadow-lg transition-colors ${
                                                    isInWishlist(product.id) 
                                                        ? 'bg-red-500 text-white' 
                                                        : 'bg-white hover:bg-orange-500 hover:text-white'
                                                }`}
                                            >
                                                <FaHeart />
                                            </button>
                                            <button 
                                                onClick={() => handleQuickView(product.id)}
                                                className='bg-white p-3 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-colors'
                                            >
                                                <FaEye />
                                            </button>
                                            <button 
                                                onClick={() => handleAddToCart(product.id)}
                                                className='bg-white p-3 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-colors'
                                            >
                                                <FaShoppingCart />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className='p-4 flex-1 flex flex-col min-h-[166px]'>
                                    <h3
                                        className='font-semibold text-lg mb-2'
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Link to={`/products/${product.id}`} className='hover:text-orange-500 transition-colors'>
                                            {product.name}
                                        </Link>
                                    </h3>
                                    <p
                                        className='text-sm text-gray-500 mb-2'
                                        style={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {product.description || 'No description available.'}
                                    </p>
                                    <p className='text-orange-500 font-bold text-xl'>${product.price}</p>
                                    <Link
                                        to={`/products/${product.id}`}
                                        className='inline-block mt-auto pt-3 text-sm font-medium text-blue-600 hover:text-blue-700'
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className='flex justify-center gap-2'>
                            <button 
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className='px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button 
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-4 py-2 border rounded ${
                                        currentPage === i + 1 
                                            ? 'bg-orange-500 text-white' 
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button 
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className='px-4 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {selectedProduct && (
                <QuickView 
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                />
            )}
        </div>
    )
}

export default Shop

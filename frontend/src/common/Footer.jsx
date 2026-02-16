import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axiosConfig'

function Footer() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async (e) => {
        e.preventDefault()
        if (!email) return
        
        setLoading(true)
        try {
            await api.post('/newsletter/subscribe', { email })
            setEmail('')
        } catch (error) {
            console.error('Subscription error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className='bg-[#2730b7] px-4 sm:px-6 lg:px-8 py-12 sm:py-14 lg:py-16 relative overflow-hidden'>
                <img src='/images/water.png' alt='' className='absolute bottom-0 right-0 opacity-30' />
                
                <div className='max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 text-white relative z-10'>

                    <div>
                        <Link to='/'><img src='/images/logo.svg' alt='Torado' className='h-12 mb-6' /></Link>
                        <p className='text-sm leading-relaxed mb-4'>
                            Level 13, 2 Elizabeth St,<br />
                            Melbourne, Victoria 3000, Australia
                        </p>
                        <p className='text-sm flex items-center gap-2'>
                            <span className='text-orange-500'>📞</span> +20 4324 5664 9035
                        </p>
                        <div className='flex gap-3 mt-6'>
                            <a href='#' className='w-10 h-10 bg-white text-[#2730b7] rounded flex items-center justify-center hover:bg-orange-500 hover:text-white transition'>f</a>
                            <a href='#' className='w-10 h-10 bg-white text-[#2730b7] rounded flex items-center justify-center hover:bg-orange-500 hover:text-white transition'>in</a>
                            <a href='#' className='w-10 h-10 bg-white text-[#2730b7] rounded flex items-center justify-center hover:bg-orange-500 hover:text-white transition'>t</a>
                            <a href='#' className='w-10 h-10 bg-white text-[#2730b7] rounded flex items-center justify-center hover:bg-orange-500 hover:text-white transition'>in</a>
                        </div>
                    </div>

                    <div>
                        <h3 className='text-xl font-bold mb-6'>About</h3>
                        <ul className='space-y-3 text-sm'>
                            <li><Link to='/' className='hover:text-orange-500 transition'>Home</Link></li>
                            <li><Link to='/aboutus' className='hover:text-orange-500 transition'>About Us</Link></li>
                            <li><Link to='/team' className='hover:text-orange-500 transition'>Our Team</Link></li>
                            <li><Link to='/blogs/left-sidebar' className='hover:text-orange-500 transition'>Our Blog</Link></li>
                            <li><Link to='/portfolio' className='hover:text-orange-500 transition'>Portfolio</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className='text-xl font-bold mb-6'>Services</h3>
                        <ul className='space-y-3 text-sm'>
                            <li><Link to='/services' className='hover:text-orange-500 transition'>Vacuum Clean</Link></li>
                            <li><Link to='/services' className='hover:text-orange-500 transition'>Break Fixing</Link></li>
                            <li><Link to='/services' className='hover:text-orange-500 transition'>Car Diagnostic</Link></li>
                            <li><Link to='/services' className='hover:text-orange-500 transition'>Oil Changing</Link></li>
                            <li><Link to='/services' className='hover:text-orange-500 transition'>Automated Wash</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className='text-xl font-bold mb-6'>Quick Links</h3>
                        <ul className='space-y-3 text-sm'>
                            <li><Link to='/contactus' className='hover:text-orange-500 transition'>Contact Us</Link></li>
                            <li><Link to='/termsandconditions' className='hover:text-orange-500 transition'>Terms & Conditions</Link></li>
                            <li><Link to='/privacypolicy' className='hover:text-orange-500 transition'>Privacy Policy</Link></li>
                            <li><Link to='/shop' className='hover:text-orange-500 transition'>Our Shop</Link></li>
                            <li><Link to='/wishlist' className='hover:text-orange-500 transition'>Wishlist</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className='text-xl font-bold mb-6'>Subscribe</h3>
                        <p className='text-sm mb-4'>Sign up our newsletter for update information, insight</p>
                        <form onSubmit={handleSubscribe} className='relative'>
                            <input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Enter Your Email'
                                required
                                disabled={loading}
                                className='w-full px-4 py-3 rounded bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50'
                            />
                            <button 
                                type='submit'
                                disabled={loading}
                                className='absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 text-white text-2xl rounded-full flex items-center justify-center hover:bg-orange-600 transition disabled:opacity-50'
                            >
                                →
                            </button>
                        </form>
                    </div>

                </div>

                <div className='max-w-7xl mx-auto mt-16 pt-8 border-t border-white/20 text-center text-sm text-white relative z-10'>
                    <p>© Torado All Rights Reserved by <span className='text-orange-500'>EnvyTheme</span></p>
                </div>
            </div>
        </>
    )
}

export default Footer

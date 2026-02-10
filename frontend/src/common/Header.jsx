import React from 'react'
import { useState } from 'react';
import { Link } from "react-router-dom"

//icons
import { FaCalendarDay, FaPhoneAlt, FaSearch, FaShoppingCart, FaUserAlt } from "react-icons/fa";




function Header() {

    const [isOpen, setIsOpen] = useState(false);


    return (
        <>
            <div className='mx-auto  px-4 py-2'>

                <div className='flex items-center justify-between '>


                    <div>
                        <img src="/images/logo.svg" alt="" className='h-12' />
                    </div>

                    <nav>
                        <ul className='flex gap-6 items-center'>
                            <li><Link to="/">Home</Link></li>

                            <li className="relative group">
                                <span className="cursor-pointer">Pages</span>
                                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-120">
                                    <div className="w-48 bg-white rounded-md shadow-lg border py-2">
                                        <Link to="/aboutus" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">About Us</Link>
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Team</Link>
                                        <Link to="/testimonials" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Testimonials</Link>
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Why Choose Us?</Link>
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Book Appointment</Link>
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Pricing Plans</Link>
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Portfolio</Link>
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">FAQ</Link>
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Terms & Conditions</Link>
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Privacy Policy</Link>
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">404 Page</Link>
                                    </div>
                                </div>
                            </li>

                            <li className="relative group">
                                <span className="cursor-pointer">Shop</span>
                                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-120">
                                    <div className="w-48 bg-white rounded-md shadow-lg border py-2">
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Shop</Link>
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Cart</Link>
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Wishlist</Link>
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Testimonials</Link>
                                    </div>
                                </div>
                            </li>

                            <li className="relative group">
                                <span className="cursor-pointer">Services</span>
                                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-120">
                                    <div className="w-48 bg-white rounded-md shadow-lg border py-2">
                                        <Link to="/" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100  z-120
                                        ">Services</Link>
                                    </div>
                                </div>
                            </li>

                            <li className="relative group">
                                <span className="cursor-pointer">Blog</span>
                                <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-120">
                                    <div className="w-48 bg-white rounded-md shadow-lg border py-2">
                                        <Link to="/blogs?view=left-sidebar" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Blog Left Sidebar</Link>
                                        <Link to="/blogs?view=right-sidebar" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Blog Right Sidebar</Link>
                                        <Link to="/blogs?view=grid" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">Blog Grid</Link>
                                        <Link to="/blogs" className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-100">All Blogs</Link>
                                    </div>
                                </div>
                            </li>

                            <li><Link to="/contact">Contact Us</Link></li>
                        </ul>
                    </nav>

                    <div className='flex gap-5'>

                        <div className='flex items-center gap-2'>
                            <FaPhoneAlt />
                            <p>
                                +91 000000000
                            </p>
                        </div>

                        <div className='flex items-center gap-2'>
                            <FaUserAlt />
                            <FaShoppingCart />
                            <FaSearch />
                        </div>

                        <button className='flex items-center gap-2 
                         bg-orange-500 p-3 rounded-lg text-white'>
                            Book Appointment
                            <FaCalendarDay />
                        </button>

                        {/* Sidebar  */}
                        <div className='z-100'>
                            <button
                                onClick={() => setIsOpen(true)}
                                className="p-3 m-4 text-white bg-orange-500 rounded-md focus:outline-none"
                            >
                                ☰
                            </button>

                            {isOpen && (
                                <div
                                    onClick={() => setIsOpen(false)}
                                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                                />
                            )}

                            <aside
                                className={`fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform duration-300
                                  ${isOpen ? "translate-x-0" : "translate-x-full"}`}
                            >
                                {/* Close Button */}
                                <div className="flex items-center justify-between p-4 border-b">
                                    <h2 className="text-lg font-semibold">Menu</h2>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-600 text-xl"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Menu Items */}
                                <nav className="p-4 space-y-4">
                                    <a href="#" className="block text-gray-700 hover:text-black">
                                        Dashboard
                                    </a>
                                    <a href="#" className="block text-gray-700 hover:text-black">
                                        Profile
                                    </a>
                                    <a href="#" className="block text-gray-700 hover:text-black">
                                        Settings
                                    </a>
                                </nav>
                            </aside>


                        </div>

                    </div>



                </div>



            </div>
        </>
    )
}

export default Header

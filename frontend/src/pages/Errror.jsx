import React from 'react'
import { Link } from 'react-router-dom'

function Errror() {
    return (
        <div className='max-w-4xl mx-auto px-6 py-12 text-center'>
            <img src="/images/404.jpg" alt="404 Not Found" className='w-full max-w-md mx-auto mb-8' />
            <h2 className='text-4xl font-bold mb-4'>Oops! Page Not Found</h2>
            <p className='text-gray-600 mb-8 text-lg'>
                The page you are looking for might have been removed had its name changed or is temporarily unavailable.
            </p>
            <Link to='/' className='inline-block px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors'>
                Return To Home Page
            </Link>
        </div>
    )
}

export default Errror

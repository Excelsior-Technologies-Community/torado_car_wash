import React from 'react'
import PricingPlan from '../components/PricingPlan'
import { FaCalendarDay, FaCheckCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import BrandSwiper from '../components/BrandSwiper'
import ServicesGrid from '../components/services/ServicesGrid'
import SingleTestimonialSwiper from '../components/testimonials/TestimonialSwiper'

function Portfolio() {
    return (
        <>
            <div>

                <div className='max-w-7xl mx-auto px-4 sm:px-6 my-10 sm:my-14'>
                    <ServicesGrid />
                </div>

                <div className='relative bg-[#681515] mb-12 overflow-hidden'>

                    <img src="/images/home-banner-bg-02.jpg" alt=""
                        className='hidden lg:block absolute w-12 right-20 bottom-6 animate-[bounce_3s_ease-in-out_infinite]'
                    />

                    <img src="/images/home-banner-bg-05-rotating.jpg" alt=""
                        className='hidden lg:block absolute right-10 top-10 w-10 animate-[spin_8s_ease-in-out_infinite]'
                    />

                    <div className='max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between px-4 sm:px-6 lg:px-12 py-10 gap-8'>

                        <div className='flex-2 text-white'>
                            <h2 className='text-2xl sm:text-3xl font-bold mb-4'>
                                Do You Need Professional Vehicle Wash! We Are Here
                            </h2>
                            <p>
                                Ask especially collecting terminated may son expression collecting lorem may so.
                            </p>
                        </div>

                        <div className='flex-1 relative flex items-center justify-center min-h-48'>



                            <Link to="/book" className='flex items-center gap-3 bg-white text-orange-500 text-lg font-semibold px-6 py-3 rounded-lg z-10 hover:bg-orange-500 hover:text-white transition'>
                                Book Appointment <FaCalendarDay />
                            </Link>

                        </div>

                    </div>

                </div>

                <div>
                    <SingleTestimonialSwiper />
                </div>




            </div>
        </>
    )
}

export default Portfolio

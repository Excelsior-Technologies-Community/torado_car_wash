import React, { useEffect, useState } from 'react'
import { FaQuoteRight, FaChevronLeft, FaChevronRight, FaCalendarDay } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import axios from 'axios'
import SingleTestimonialSwiper from './SingleTestimonialSwiper'

function TestimonialGrid() {
    const [testimonials, setTestimonials] = useState([])
    const [pagination, setPagination] = useState({})
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        axios.get(`http://localhost:5000/api/testimonials/approved?page=${currentPage}&limit=6`)
            .then(res => {
                setTestimonials(res.data.testimonials || [])
                setPagination(res.data.pagination || {})
            })
            .catch(err => console.error(err))
    }, [currentPage])

    const handlePageChange = (page) => {
        setCurrentPage(page)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    return (
        <div className='bg-gray-50 py-16'>

            <SingleTestimonialSwiper />

            <div className='relative  bg-[#681515] lg:min-h-84 mb-12'>

                <img src="/images/home-banner-bg-02.jpg" alt=""
                    className='absolute w-15 right-90 bottom-10 animate-[bounce_3s_ease-in-out_infinite]'
                />

                <img src="/images/home-banner-bg-05-rotating.jpg" alt=""
                    className='absolute right-45 top-25 w-12 animate-[spin_8s_ease-in-out_infinite]'
                />

                <div className='flex items-center justify-between px-12 py-15 gap-10'>

                    <div className='flex-2 text-white'>
                        <h2 className='text-3xl font-bold mb-4'>
                            Do You Need Professional Vehicle Wash! We Are Here
                        </h2>
                        <p>
                            Ask especially collecting terminated may son expression collecting lorem may so.
                        </p>
                    </div>

                    <div className='flex-1 relative flex items-center justify-center min-h-48'>



                        <button className='flex items-center gap-3 bg-white text-orange-500 text-lg font-semibold px-6 py-3 rounded-lg z-10 hover:bg-orange-500 hover:text-white transition'>
                            Book Appointment <FaCalendarDay />
                        </button>

                    </div>

                </div>

            </div>

            <div className='max-w-7xl mx-auto px-4'>



                <div className='mb-12'>
                    <h3 className='text-orange-500 font-semibold mb-2'>Testimonials</h3>
                    <h2 className='text-4xl font-bold'>What People Say About Us</h2>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className='bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition'>
                            <div className='flex flex-col items-center text-center'>
                                <div className='relative mb-6'>
                                    <img
                                        src={`http://localhost:5000/uploads/${testimonial.image}`}
                                        alt={testimonial.name}
                                        className='w-24 h-24 rounded-full object-cover border-4 border-gray-100'
                                    />
                                    <div className='absolute -bottom-2 -right-2 bg-orange-500 text-white rounded-full p-2'>
                                        <FaQuoteRight className='text-sm' />
                                    </div>
                                </div>
                                <p className='text-gray-600 mb-6 min-h-20'>{testimonial.message}</p>
                                <div className='w-12 h-1 bg-blue-600 mb-4'></div>
                                <h4 className='font-bold text-lg'>{testimonial.name}</h4>
                                <p className='text-gray-500 text-sm'>{testimonial.position}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='flex justify-center items-center gap-2'>
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className='w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition disabled:opacity-30 disabled:cursor-not-allowed'
                    >
                        <FaChevronLeft />
                    </button>

                    {pagination.totalPages > 0 && [...Array(pagination.totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`w-10 h-10 rounded-full border-2 font-semibold transition ${currentPage === index + 1
                                ? 'bg-orange-500 text-white border-orange-500'
                                : 'border-gray-800 hover:bg-orange-500 hover:text-white hover:border-orange-500'
                                }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.totalPages}
                        className='w-10 h-10 rounded-full border-2 border-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition disabled:opacity-30 disabled:cursor-not-allowed'
                    >
                        <FaChevronRight />
                    </button>
                </div>

            </div>


            <div className='m-10'>
                <p className='text-2xl font-semibold my-10'>
                    Some of Our Trusted Clients
                </p>

                <div className='flex items-center'>

                    <Swiper
                        modules={[Autoplay]}
                        spaceBetween={45}
                        slidesPerView={4}
                        loop={true}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        breakpoints={{
                            320: { slidesPerView: 2 },
                            640: { slidesPerView: 3 },
                            768: { slidesPerView: 4 },
                            1024: { slidesPerView: 5 },
                        }}
                    >
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SwiperSlide key={num}>
                                <img
                                    src={`/images/brand-${num}.png`}
                                    alt={`Brand ${num}`}
                                    className='w-full h-auto object-contain grayscale hover:grayscale-0 transition'
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                </div>

            </div>


        </div>
    )
}

export default TestimonialGrid

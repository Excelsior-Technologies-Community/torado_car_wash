import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { FaQuoteRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import axios from 'axios'

function TestimonialSwiper() {
    const [testimonials, setTestimonials] = useState([])

    useEffect(() => {
        axios.get('http://localhost:5000/api/testimonials/approved?limit=10')
            .then(res => setTestimonials(res.data.testimonials || res.data))
            .catch(err => console.error(err))
    }, [])

    return (
        <div className='bg-gray-50   '>
            <div className='max-w-7xl mx-auto p-4 m-8 '>
                <div className='flex justify-between items-center mb-12'>
                    <div>
                        <h3 className='text-orange-500 font-semibold mb-2'>Testimonials</h3>
                        <h2 className='text-4xl font-bold'>What People Say About Us</h2>
                    </div>
                    <div className='flex gap-3'>
                        <button className='testimonial-prev w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition'>
                            <FaChevronLeft />
                        </button>
                        <button className='testimonial-next w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition'>
                            <FaChevronRight />
                        </button>
                    </div>
                </div>

                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={3}
                    navigation={{
                        prevEl: '.testimonial-prev',
                        nextEl: '.testimonial-next',
                    }}
                    autoplay={{ delay: 5000 }}
                    breakpoints={{
                        320: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {testimonials.map((testimonial) => (
                        <SwiperSlide key={testimonial.id}>
                            <div className='bg-white rounded-lg p-8 shadow-sm hover:shadow-lg transition'>
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
                                    <p className='text-gray-600 mb-6 min-h-[80px]'>{testimonial.message}</p>
                                    <div className='w-12 h-1 bg-blue-600 mb-4'></div>
                                    <h4 className='font-bold text-lg'>{testimonial.name}</h4>
                                    <p className='text-gray-500 text-sm'>{testimonial.position}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    )
}

export default TestimonialSwiper

import React, { useEffect, useState } from 'react';
import { FaQuoteRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { testimonialsApi } from '../../api';

const SingleTestimonialSwiper = () => {
    const [testimonials, setTestimonials] = useState([]);

    useEffect(() => {
        testimonialsApi.getApproved({ limit: 10 })
            .then(res => setTestimonials(res.testimonials || []))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className='max-w-7xl mx-auto px-4 mb-16'>
            <div className='flex items-center justify-between mb-8'>
                <div>
                    <h3 className='text-orange-500 font-semibold mb-2'>Our Testimonials</h3>
                    <h2 className='text-4xl font-bold'>Review on Our Professional Car<br />Washing Service</h2>
                </div>
                <div className='flex gap-3'>
                    <button className='w-12 h-12 rounded-full border-2 border-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition'>
                        <FaChevronLeft />
                    </button>
                    <button className='w-12 h-12 rounded-full border-2 border-gray-800 flex items-center justify-center hover:bg-orange-500 hover:text-white hover:border-orange-500 transition'>
                        <FaChevronRight />
                    </button>
                </div>
            </div>

            <Swiper
                modules={[Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
            >
                {testimonials.map((testimonial) => (
                    <SwiperSlide key={testimonial.id}>
                        <div className='flex items-center gap-12'>
                            <div className='relative shrink-0 w-48 h-48'>
                                <img
                                    src={`http://localhost:5000/uploads/${testimonial.image}`}
                                    alt={testimonial.name}
                                    className='w-48 h-48 rounded-full object-cover border-4 border-blue-500 relative z-10 ml-5'
                                />
                                <div className='absolute bottom-8 left-0 text-orange-500 text-6xl opacity-100 z-50'>
                                    <FaQuoteRight className='rotate-180' />
                                </div>
                            </div>
                            <div className='flex-1'>
                                <p className='text-xl text-gray-700 leading-relaxed mb-6'>
                                    {testimonial.message}
                                </p>
                                <p className='text-gray-500 text-lg'>
                                    {testimonial.name}, {testimonial.position}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default SingleTestimonialSwiper;

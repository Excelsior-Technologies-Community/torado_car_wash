import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

function BrandSwiper() {
    return (
        <div className='max-w-7xl mx-auto py-7 px-4'>
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

export default BrandSwiper

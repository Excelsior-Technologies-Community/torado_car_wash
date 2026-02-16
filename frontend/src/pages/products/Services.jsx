import React from 'react'
import ServicesGrid from '../../components/services/ServicesGrid'
import Message from '../../components/Message'
import SingleTestimonialSwiper from '../../components/testimonials/SingleTestimonialSwiper'

function Services() {
    return (
        <>
            <div>

                <div className='text-center'>
                    <h6 className='text-orange-500'>
                        What We Do

                    </h6>
                    <h2 className='text-4xl font-semibold'>
                        We Are Offering Quality
                        <br />
                        Services to Our Customer
                    </h2>
                </div>

                <div className='px-15 py-6 my-15 '>

                    <ServicesGrid />

                </div>

                <div className='bg-[] px-25'>

                    <Message />

                </div>

                <div>
                    <SingleTestimonialSwiper />
                </div>











            </div>
        </>
    )
}

export default Services

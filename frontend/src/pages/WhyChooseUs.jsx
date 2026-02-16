import React from 'react'
import { FaPlusSquare, FaTools } from 'react-icons/fa'
import { LuBellRing } from 'react-icons/lu'
import ProgressStepper from '../components/ProgressStepper'
import BrandSwiper from '../components/BrandSwiper'
import { IoShieldCheckmark } from 'react-icons/io5'

function WhyChooseUs() {
    return (
        <>

            <div>

                {/* Best Features */}
                <div className='lg:max-w-6xl mx-auto bg-blue-100 rounded-2xl p-6 sm:p-8 lg:p-10 m-4 sm:m-6 lg:m-10'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-center'>
                        <div>
                            <h2 className='text-orange-500 font-semibold mb-2'>Best Features</h2>
                            <p className='text-3xl lg:text-4xl font-semibold leading-tight'>
                                Your Flexible Car Wash and Cleaning Service
                            </p>
                        </div>

                        <div className='group cursor-pointer'>
                            <div className='flex items-center gap-5'>
                                <div className='group-hover:animate-[bounce_2s_ease-in-out_infinite]'>
                                    <FaPlusSquare className='bg-blue-800 text-white rounded-full p-2 text-4xl' />
                                </div>
                                <div>
                                    <h4 className='font-semibold mb-1'>Experienced Team</h4>
                                    <p className='text-gray-500 text-sm'>
                                        Ask especially collecting terminated may son expression collecting lorem may son expression text.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='group cursor-pointer'>
                            <div className='flex items-center gap-5'>
                                <div className='group-hover:animate-[bounce_2s_ease-in-out_infinite]'>
                                    <LuBellRing className='bg-blue-800 text-white rounded-full p-2 text-4xl' />
                                </div>
                                <div>
                                    <h4 className='font-semibold mb-1'>Automatic Emergency</h4>
                                    <p className='text-gray-500 text-sm'>
                                        Ask especially collecting terminated may son expression collecting lorem may son expression text.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stepper */}
                <div className='bg-[#f5f3ee] p-6 sm:p-10 lg:p-12'>


                    <div className='text-center'>
                        <h6 className='text-orange-500'>
                            Easy Process
                        </h6>
                        <h2 className='font-semibold text-2xl sm:text-3xl lg:text-4xl'>
                            Get Our Premium Quality
                            <br /> Services Easy Steps to Follow

                        </h2>

                    </div>

                    <div>
                        <ProgressStepper />

                    </div>

                </div>

                {/* Why choose us */}
                <div className='py-10 sm:py-12 lg:py-16'>

                    <div className='flex flex-col lg:flex-row'>

                        <div className='flex-1 lg:ml-40 px-4 sm:px-6 lg:px-0'>

                            <h6 className='text-orange-500'>
                                Why Choose Us
                            </h6>

                            <h2 className='text-2xl sm:text-3xl lg:text-4xl font-semibold'>
                                We Are Professional Car Washing & Cleaning Company
                            </h2>

                            <p className='text-gray-500 my-5'>
                                Ask especially collecting terminated may son expression collecting lorem may son expression text. Ask especially collecting terminated may son expression collecti.
                            </p>

                            <div>

                                <div className='flex items-center gap-5 my-4'>

                                    <div>
                                        <IoShieldCheckmark className='text-4xl text-orange-500' />
                                    </div>

                                    <div >

                                        <h6 className='text-xl font-semibold'>
                                            Safety Materials
                                        </h6>

                                        <p className='text-gray-500'>
                                            Ask especially collecting terminated may son expression collecting lorem.
                                        </p>

                                    </div>

                                </div>

                                <div className='flex items-center gap-5'>

                                    <div>
                                        <FaTools className='text-4xl text-orange-500' />
                                    </div>

                                    <div>

                                        <h6 className='text-xl font-semibold'>
                                            Modern Equipment
                                        </h6>

                                        <p className='text-gray-500'>
                                            Ask especially collecting terminated may son expression collecting lorem.
                                        </p>

                                    </div>

                                </div>

                            </div>


                        </div>

                        <div className='flex-1 mt-6 lg:mt-0'>

                            <img src="/images/about-bg.jpg" alt="" className='w-full lg:h-full object-cover' />

                        </div>


                    </div>

                </div>

                <div>
                    <BrandSwiper />
                </div>


            </div>

        </>
    )
}

export default WhyChooseUs

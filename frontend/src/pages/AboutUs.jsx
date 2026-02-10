
import React from 'react'
import BrandSwiper from "../components/BrandSwiper"
import { FaCalendarDay, FaCheckCircle, FaPlusSquare } from 'react-icons/fa'
import { LuBellRing } from 'react-icons/lu'
import ProgressStepper from '../components/ProgressStepper'

function AboutUs() {
    return (
        <>
            <div>

                <div>
                    <BrandSwiper />

                </div>


                <div className=' flex mx-35 my-10'>

                    <div className='flex-1 relative'>

                        <img src="/images/home-banner-bg-03.jpg" alt=""
                            className='absolute top-10 left-15 opacity-75 '
                        />

                        <img src="/images/about-img1.png" alt=""
                            className='lg:w-[80%] h-auto ml-20'
                        />

                    </div>

                    <div className='flex-1'>
                        <h6 className='text-orange-500 text-lg'>
                            About Us

                        </h6>
                        <h2 className='text-4xl font-semibold'>
                            Mobile Car Wash & Detailing In
                            <br />
                            Los Angeles, California
                        </h2>
                        <p className='text-gray-500 my-5'>
                            Ask especially collecting terminated may son expression collecting lorem may son expression text. Ask especially collecting terminated may son expression collecti.
                        </p>

                        <div className='grid grid-cols-2 gap-4 my-5'>
                            <div className='flex items-center gap-2'><FaCheckCircle className='text-blue-500' /> Flexible and Cost-Effective</div>
                            <div className='flex items-center gap-2'><FaCheckCircle className='text-blue-500' /> 100% Satisfaction</div>
                            <div className='flex items-center gap-2'><FaCheckCircle className='text-blue-500' /> Its Convenient & Easy</div>
                            <div className='flex items-center gap-2'><FaCheckCircle className='text-blue-500' /> Sustainable & Digital</div>
                            <div className='flex items-center gap-2'><FaCheckCircle className='text-blue-500' /> Save money, Save Time</div>
                            <div className='flex items-center gap-2'><FaCheckCircle className='text-blue-500' /> Over 250,000 Cleans</div>
                        </div>

                    </div>
                </div>

                <div className='bg-[#f5f3ee] py-10 '>

                    <p className='text-4xl font-semibold w-[80%] mx-auto text-center  '>
                        Torado – Car Wash Is an Eco-friendly and Detailing Service. Our Company Was Founded Back in 2005 by a Team of Experts With More Then 10 Years of Professional Car Wash Experience.
                    </p>

                    <button className='text-white bg-orange-500 p-3 flex items-center gap-5 rounded-lg my-10  mx-auto '>
                        Book Appointment <FaCalendarDay />
                    </button>
                </div>



                {/* Best Features */}
                <div className='lg:max-w-6xl mx-auto bg-blue-100 rounded-2xl p-10 m-15'>
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

                <div className='bg-[#f5f3ee] p-15'>


                    <div className='text-center'>
                        <h6 className='text-orange-500'>
                            Easy Process
                        </h6>
                        <h2 className='font-semibold text-4xl'>
                            Get Our Premium Quality
                            <br /> Services Easy Steps to Follow

                        </h2>

                    </div>

                    <div>
                        <ProgressStepper />

                    </div>

                </div>







            </div>
        </>
    )
}

export default AboutUs

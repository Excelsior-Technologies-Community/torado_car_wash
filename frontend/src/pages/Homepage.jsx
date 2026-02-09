import React from 'react'
import { FaArrowRight, FaCalendarDay, FaHandshake, FaTools } from 'react-icons/fa'
import { FaPlusSquare } from "react-icons/fa";
import { LuBellRing } from "react-icons/lu";
import ProgressStepper from '../components/ProgressStepper';
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoShieldCheckmark } from "react-icons/io5";
import ServicesCard from '../components/services/ServicesGrid';
import PricingPlan from '../components/PricingPlan';
import TestimonialGrid from '../components/testimonials/TestimonialGrid';
import TestimonialSwiper from '../components/testimonials/TestimonialSwiper';




function Homepage() {
    return (
        <>

            <div className=' '>

                <div >

                    {/* Home Banner  */}
                    <div className='max-w-7xl mx-auto flex gap-10 relative my-20 items-center '>


                        <div className='absolute bg-linear-to-t from-orange-600 to-orange-200 
                        w-80 h-140 -skew-x-30 z-40 right-50 '>

                        </div>

                        <img src="/images/home-banner-bg-03.jpg" alt=""
                            className='absolute top-0 animate-bounce transition-all duration-[5s] ease-in-out z-50'
                        />

                        <img src="/images/home-banner-bg-04.jpg" alt=""
                            className='absolute bottom-0   z-50'
                        />

                        <img src="/images/home-banner-bg-05-rotating.jpg" alt=""
                            className='absolute bottom-0 left-100 animate-[spin_10s_linear_infinite] z-50 '
                        />

                        <div className='flex-1 z-60 '>

                            <h2 className='text-4xl my-5'>
                                Professional Washing and
                                <br />
                                Cleaning of Your Car
                            </h2>

                            <p className='my-5'>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsam ad molestiae nostrum exercitationem eveniet obcaecati saepe sapiente minima quas tenetur blanditiis incidunt voluptates explicabo quia cumque debitis, laboriosam quo! Ad et rem nostrum ullam cum laudantium dolorem sapiente soluta molestias eos quia a dolor, nemo dolorum vero sed quisquam cumque rerum magnam. Asperiores eveniet amet omnis officia animi ex harum ducimus ratione aliquid odit libero sapiente nobis possimus exercitationem iusto, cum nisi velit quis quam aut. Officiis id distinctio esse reiciendis voluptatem deleniti tempora perferendis!
                            </p>

                            <div className='flex gap-5'>
                                <button className='flex items-center gap-2 bg-orange-500 text-white p-3 rounded-lg'>
                                    Get Started <FaCalendarDay />
                                </button>

                                <button className='flex items-center gap-2 bg-blue-500 text-white p-3 rounded-lg'>
                                    Get Started <FaArrowRight />
                                </button>

                            </div>

                        </div>

                        <div className='flex-1 relative'>

                            <img src="/images/water.png" alt=""
                                className='absolute z-60'
                            />

                            <img src="/images/home-banner-bg-01.jpg" alt=""
                                className='absolute  -left-50 -rotate-10'
                            />

                            <img src="/images/home-banner-bg-02.jpg" alt=""
                                className='absolute -right-20 -bottom-10  z-10 '
                            />

                            <div className='flex gap-10'>

                                <img src="/images/home-banner-01.jpg" alt=""
                                    className='lg:w-78 h-auto rounded-4xl z-50'
                                />

                                <img src="/images/home-banner-02.jpg" alt=""
                                    className='lg:w-78 h-80 mt-auto rounded-4xl z-50'
                                />

                            </div>


                        </div>

                    </div>

                </div>

                {/* Best Features */}
                <div className='lg:max-w-6xl mx-auto bg-blue-100 rounded-2xl p-10 m-10'>
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

                {/* What We do || Services  */}
                <div className='lg:max-w-6xl mx-auto p-10 m-10'>
                    <div className='text-center mb-10'>
                        <h2 className='text-orange-500 font-semibold mb-2'>What We Do</h2>
                        <p className='text-3xl lg:text-4xl font-semibold'>Our Services</p>
                    </div>
                    <ServicesCard />
                </div>




                <div className='relative bg-[#d0d0d0]  mx-auto'>

                    <img src="/images/home-banner-bg-02.jpg" alt=""
                        className='absolute left-45 top-65 ' />




                    <div className='max-w-7xl mx-auto  h-124 p-4 '>



                        <div className='text-center  '>
                            <h2 className='text-orange-500 text-lg '
                            >Easy Process
                            </h2>

                            <p className=' text-3xl font-semibold '>
                                Get Our Premium Quality
                                <br />
                                Services Easy Steps to Follow
                            </p>
                        </div>

                        {/* Stepper */}
                        <div className=''>


                            <div>
                                <ProgressStepper />
                            </div>


                        </div>

                    </div>

                    {/* Case Study */}

                    <div className='max-w-6xl mx-auto absolute bg-white right-50 left-60  p-8 top-80  rounded-lg  shadow-lg'>


                        <div className='  '>


                            <div className='flex items-center gap-15'>

                                <div className='flex-1 mb-5'>
                                    <h6 className='text-orange-500 font-semibold'>
                                        Case Study
                                    </h6>

                                    <p className='text-4xl font-semibold'>
                                        Professional Car Washing And Cleaning
                                    </p>

                                    <div className='flex items-center gap-3 mt-5'>
                                        <IoMdCheckmarkCircle className=' text-blue-500 text-2xl rounded-full ' />
                                        <p className='text-lg'>
                                            Car Repair & Inspection
                                        </p>
                                    </div>

                                    <div className='flex items-center gap-3'>
                                        <IoMdCheckmarkCircle className=' text-blue-500 text-2xl rounded-full ' />
                                        <p className='text-lg'>
                                            Car Cleaning  & Washing
                                        </p>
                                    </div>

                                    <button className='flex items-center gap-2 rounded-sm  bg-orange-500 p-2 text-white mt-10   '>
                                        Learn More <FaCalendarDay />
                                    </button>


                                </div>

                                <div className='flex-2'>

                                    <img src="/images/case-study-img1.jpg" alt="" />

                                </div>

                                <div className='flex-1 flex flex-col gap-10'>

                                    <div className='flex items-center gap-5'>

                                        <div>
                                            <IoShieldCheckmark className='text-4xl' />
                                        </div>

                                        <div>

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
                                            <FaTools className='text-4xl' />
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


                                    <div className='flex items-center gap-5'>

                                        <div>
                                            <FaHandshake className='text-4xl' />
                                        </div>

                                        <div>

                                            <h6 className='text-xl font-semibold'>
                                                Caring Service
                                            </h6>

                                            <p className='text-gray-500'>
                                                Ask especially collecting terminated may son expression collecting lorem.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                    </div>



                </div>

                {/* Pricong Plan */}
                <div className='mt-90'>

                    <PricingPlan />

                </div>

                {/* Testimonials  */}
                <div className=''>

                    <TestimonialSwiper />

                </div>














            </div>
        </>
    )
}

export default Homepage

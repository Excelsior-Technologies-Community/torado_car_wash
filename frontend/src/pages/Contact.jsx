import React from 'react'
import { FaPhone } from 'react-icons/fa';
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import Message from '../components/Message';



function Contact() {
    return (
        <>
            <div>


                <div className='max-w-7xl mx-auto px-4 py-16'>
                    <div className='flex flex-col lg:flex-row gap-12 items-start'>

                        <div className='flex-1 space-y-8'>
                            <div>
                                <h2 className='text-orange-500 text-2xl sm:text-3xl lg:text-4xl font-bold mb-4'>
                                    Contact Information
                                </h2>
                                <p className='text-gray-500 text-lg'>
                                    Ask especially collecting terminated may son expression collecting lorem may son expression text.
                                </p>
                            </div>

                            <div className='flex items-start gap-6'>
                                <div className='bg-orange-500 p-4 rounded-full text-white text-xl shrink-0'>
                                    <FaLocationDot />
                                </div>
                                <div>
                                    <h3 className='text-xl font-semibold mb-2'>
                                        Our Location
                                    </h3>
                                    <p className='text-gray-500'>
                                        Level 13, 2 Elizabeth St,<br />
                                        Melbourne, Victoria 3000, Australia
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-6'>
                                <div className='bg-orange-500 p-4 rounded-full text-white text-xl shrink-0'>
                                    <FaPhone />
                                </div>
                                <div>
                                    <h3 className='text-xl font-semibold mb-2'>
                                        Contact Number
                                    </h3>
                                    <a href='tel:+20432456649035' className='text-gray-500 hover:text-orange-500 transition'>
                                        +20 432 456 649 035
                                    </a>
                                </div>
                            </div>

                            <div className='flex items-start gap-6'>
                                <div className='bg-orange-500 p-4 rounded-full text-white text-xl shrink-0'>
                                    <MdEmail />
                                </div>
                                <div>
                                    <h3 className='text-xl font-semibold mb-2'>
                                        Email
                                    </h3>
                                    <a href='mailto:hello@torado.com' className='text-gray-500 hover:text-orange-500 transition'>
                                        hello@torado.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className='flex-1 w-full h-full lg:min-h-96'>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345093703!2d144.9537353153167!3d-37.81720997975171!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4c2b349649%3A0xb6899234e561db11!2sEnvato!5e0!3m2!1sen!2sau!4v1234567890123!5m2!1sen!2sau"
                                width="100%"
                                height="420"
                                style={{ border: 0 , minHeight: "400px"}}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className='rounded-lg shadow-lg'
                            ></iframe>
                        </div>

                    </div>

                </div>

                <div>

                    <Message />
                    
                </div>






            </div>
        </>
    )
}

export default Contact

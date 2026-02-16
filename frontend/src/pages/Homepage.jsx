import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendarDay, FaHandshake, FaTools } from 'react-icons/fa';
import { FaPlusSquare } from 'react-icons/fa';
import { LuBellRing } from 'react-icons/lu';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { IoShieldCheckmark } from 'react-icons/io5';
import ProgressStepper from '../components/ProgressStepper';
import ServicesCard from '../components/services/ServicesGrid';
import PricingPlan from '../components/PricingPlan';
import TestimonialSwiper from '../components/testimonials/TestimonialSwiper';
import BlogSwiper from '../components/blog/BlogSwiper';
import BrandSwiper from '../components/BrandSwiper';

function Homepage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-[#f3f1ec] py-10 sm:py-14">
        <div className="hidden lg:block absolute right-100 inset-y-[-20%] w-40 bg-linear-to-t from-[#ff6a4d] to-[#ff6a4d]/70 -skew-x-30" />
        <div className="hidden lg:block absolute inset-y-0 right-[34%] w-24 bg-white/25 rounded-full blur-sm" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-8 lg:gap-12 items-center">
            <div className="relative z-10">
              <img
                src="/images/home-banner-bg-03.jpg"
                alt=""
                aria-hidden="true"
                className="hidden lg:block absolute -top-16 left-0 w-16 opacity-50 pointer-events-none "
              />
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-[1.12] text-black mb-5">
                Professional Washing and Cleaning of Your Car
              </h2>
              <p className="text-[#5c6e8a] text-lg leading-8 mb-8 max-w-2xl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis interdum rhoncus parturient
                molestie et malesuada sed. At enim varius potenti purus sed.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/book" className="inline-flex items-center gap-3 bg-[#ff5a32] text-white px-7 py-4 rounded-md text-2xl hover:bg-[#eb4e2a] transition">
                  Get Started <FaArrowRight />
                </Link>
                <Link to="/services" className="inline-flex items-center gap-3 bg-[#2b36bf] text-white px-7 py-4 rounded-md text-2xl hover:bg-[#1f2aa8] transition">
                  Learn More <FaCalendarDay />
                </Link>
              </div>
            </div>

            <div className="relative min-h-110 sm:min-h-130">
              <img
                src="/images/home-banner-bg-04.jpg"
                alt=""
                aria-hidden="true"
                className="hidden md:block absolute -bottom-10 -left-100 w-40 lg:w-[80%] opacity-70 pointer-events-none "
              />
              <div className="hidden lg:block absolute inset-y-12 left-10 w-32 rounded-[3rem] bg-[#d7d2c8]/45" />
              <img
                src="/images/home-banner-01.jpg"
                alt="Car wash"
                className="relative z-10 w-[60%] h-110 sm:h-130 object-cover rounded-[2.8rem] shadow-2xl"
              />

              <div className="absolute z-20 right-0 top-45 w-[60%] max-w-55 rounded-[2.4rem] overflow-hidden border border-white/50 shadow-xl bg-white">
                <img src="/images/home-banner-02.jpg" alt="Car wash staff" className="w-full h-90 object-cover" />
              </div>

              <img
                src="/images/home-banner-bg-02.jpg"
                alt=""
                aria-hidden="true"
                className="hidden md:block absolute -bottom-6 -right-5 w-24 opacity-95 pointer-events-none"
              />
             

            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mt-20 mx-auto bg-blue-100 rounded-2xl p-6 sm:p-8 lg:p-10 mx-4 sm:mx-6 lg:mx-auto">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div>
            <h2 className="text-orange-500 font-semibold mb-2">Best Features</h2>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight">
              Your Flexible Car Wash and Cleaning Service
            </p>
          </div>
          <div className="flex items-start gap-4">
            <FaPlusSquare className="bg-blue-800 text-white rounded-full p-2 text-4xl shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Experienced Team</h4>
              <p className="text-gray-500 text-sm">Ask especially collecting terminated may son expression collecting lorem.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <LuBellRing className="bg-blue-800 text-white rounded-full p-2 text-4xl shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">Automatic Emergency</h4>
              <p className="text-gray-500 text-sm">Ask especially collecting terminated may son expression collecting lorem.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-orange-500 font-semibold mb-2">What We Do</h2>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-semibold">Our Services</p>
        </div>
        <ServicesCard />
      </section>

      <section className="bg-[#f5f3ee] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-orange-500 text-lg">Easy Process</h2>
            <p className="text-2xl sm:text-3xl font-semibold">
              Get Our Premium Quality Services
              <br className="hidden sm:block" />
              Easy Steps to Follow
            </p>
          </div>
          <ProgressStepper />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white p-5 sm:p-8 rounded-lg shadow-lg">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div>
              <h6 className="text-orange-500 font-semibold">Case Study</h6>
              <p className="text-2xl sm:text-3xl font-semibold">Professional Car Washing And Cleaning</p>
              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-2"><IoMdCheckmarkCircle className="text-blue-500 text-2xl" /> Car Repair & Inspection</div>
                <div className="flex items-center gap-2"><IoMdCheckmarkCircle className="text-blue-500 text-2xl" /> Car Cleaning & Washing</div>
              </div>
              <Link to="/aboutus" className="inline-flex items-center gap-2 bg-orange-500 px-3 py-2 text-white rounded-md mt-6 hover:bg-orange-600 transition">
                Learn More <FaCalendarDay />
              </Link>
            </div>

            <div>
              <img src="/images/case-study-img1.jpg" alt="Case Study" className="w-full rounded-lg" />
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <IoShieldCheckmark className="text-4xl shrink-0" />
                <div>
                  <h6 className="text-xl font-semibold">Safety Materials</h6>
                  <p className="text-gray-500">Ask especially collecting terminated may son expression collecting lorem.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaTools className="text-4xl shrink-0" />
                <div>
                  <h6 className="text-xl font-semibold">Modern Equipment</h6>
                  <p className="text-gray-500">Ask especially collecting terminated may son expression collecting lorem.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <FaHandshake className="text-4xl shrink-0" />
                <div>
                  <h6 className="text-xl font-semibold">Caring Service</h6>
                  <p className="text-gray-500">Ask especially collecting terminated may son expression collecting lorem.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10">
        <PricingPlan />
      </section>

      <section>
        <TestimonialSwiper />
      </section>

      <section className="my-10">
        <div className="text-center px-4">
          <h6 className="text-orange-500">From Our Blogs</h6>
          <h2 className="font-semibold text-2xl sm:text-3xl lg:text-4xl">
            We are Connected to Help
            <br className="hidden sm:block" />
            You All the Time
          </h2>
        </div>
        <BlogSwiper />
      </section>

      <BrandSwiper />
    </div>
  );
}

export default Homepage;

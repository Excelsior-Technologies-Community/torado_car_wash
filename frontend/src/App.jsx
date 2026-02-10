import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from './common/Header'
import Homepage from './pages/Homepage'
import BlogPage from './pages/BlogPage'
import BlogDetails from './pages/BlogDetails'
import PricingPlan from './components/PricingPlan'
import TestimonialSwiper from './components/testimonials/TestimonialSwiper'
import TestimonialGrid from './components/testimonials/TestimonialGrid'
import AboutUs from './pages/AboutUs'


function App() {

  return (
    <>

      <BrowserRouter>
        <Header />

        <Routes>

        <Route element={<Homepage />} path='/'/>
        
        <Route element={<AboutUs />} path='/aboutus'/>

        <Route element={<BlogPage />} path='/blogs'/>
        <Route element={<BlogDetails />} path='/blog/:slug'/>

        <Route element={<PricingPlan />} path='/pricingplan'/>
        <Route element={<TestimonialSwiper />} path='/testimonialswiper'/>
        <Route element={<TestimonialGrid />} path='/testimonials'/>


        </Routes>


      </BrowserRouter>

    </>
  )
}

export default App

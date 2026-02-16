import { useState, Component } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Header from './common/Header'
import Footer from './common/Footer'
import Homepage from './pages/Homepage'
import BlogPage from './pages/BlogPage'
import BlogGrid from './pages/BlogGrid'
import BlogLeftSidebar from './pages/BlogLeftSidebar'
import BlogRightSidebar from './pages/BlogRightSidebar'
import BlogDetails from './pages/BlogDetails'
import PricingPlan from './components/PricingPlan'
import TestimonialSwiper from './components/testimonials/TestimonialSwiper'
import TestimonialGrid from './components/testimonials/TestimonialGrid'
import AboutUs from './pages/AboutUs'
import TeamPage from './pages/TeamPage'
import WhyChooseUs from './pages/WhyChooseUs'
import Book from './pages/Book'
import Portfolio from './pages/Portfolio'
import FAQPage from './pages/FAQPage'
import Register from './pages/auth/Register'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import TandC from './pages/TandC'
import PP from './pages/PP'
import Errror from './pages/Errror'
import Shop from './pages/products/Shop'
import ProductDetails from './pages/products/ProductDetails'
import Wishlist from './pages/products/Wishlist'
import Cart from './pages/products/Cart'
import Checkout from './pages/products/Checkout'
import Orders from './pages/products/Orders'
import Services from './pages/products/Services'
import ServiceDetails from './pages/ServiceDetails'
import Contact from './pages/Contact'
import MyBookings from './pages/MyBookings'
import Profile from './pages/Profile'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <button 
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}


function App() {

  return (
    <ErrorBoundary>
      <BrowserRouter>
      
        <Header />

        <Routes>

          <Route element={<Homepage />} path='/' />

          <Route element={<AboutUs />} path='/aboutus' />

          <Route element={<TeamPage />} path='/team' />

          <Route element={<Book />} path='/book' />

          <Route element={<WhyChooseUs />} path='/whychooseus' />

          <Route element={<Portfolio />} path='/portfolio' />

          <Route element={<FAQPage />} path='/faqs' />

          <Route element={<TandC />} path='/termsandconditions' />

          <Route element={<Errror />} path='/errorpage' />

          <Route element={<Services />} path='/services' />
          <Route element={<ServiceDetails />} path='/services/:id' />

          <Route element={<Contact />} path='/contactus' />

          <Route element={<Shop />} path='/shop' />
          <Route element={<ProductDetails />} path='/products/:id' />
          <Route element={<Wishlist />} path='/wishlist' />
          <Route element={<Cart />} path='/cart' />
          <Route element={<Checkout />} path='/checkout' />
          <Route element={<Orders />} path='/orders' />
          <Route element={<MyBookings />} path='/my-bookings' />

          <Route element={<PP />} path='/privacypolicy' />

          <Route element={<Register />} path='/register' />
          <Route element={<Login />} path='/login' />
          <Route element={<ForgotPassword />} path='/forgot-password' />
          <Route element={<ResetPassword />} path='/reset-password' />
          <Route element={<Profile />} path='/profile' />

          <Route element={<BlogPage />} path='/blogs' />
          <Route element={<BlogGrid />} path='/blogs/grid' />
          <Route element={<BlogLeftSidebar />} path='/blogs/left-sidebar' />
          <Route element={<BlogRightSidebar />} path='/blogs/right-sidebar' />
          <Route element={<BlogDetails />} path='/blog/:slug' />

          <Route element={<PricingPlan />} path='/pricingplan' />
          <Route element={<TestimonialSwiper />} path='/testimonialswiper' />
          <Route element={<TestimonialGrid />} path='/testimonials' />

        </Routes>

        <Footer />

      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App

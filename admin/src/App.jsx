import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Products from './pages/Products';
import ProductReviews from './pages/ProductReviews';
import ProductCategories from './pages/ProductCategories';
import Services from './pages/ServicesNew';
import ServicePricing from './pages/ServicePricing';
import Orders from './pages/Orders';
import WashPackages from './pages/WashPackages';
import WashPackageConnections from './pages/WashPackageConnections';
import WashTypes from './pages/WashTypes';
import VehicleCategories from './pages/VehicleCategories';
import Blogs from './pages/Blogs';
import BlogCategories from './pages/BlogCategories';
import Tags from './pages/Tags';
import Team from './pages/Team';
import FAQs from './pages/FAQs';
import FAQCategories from './pages/FAQCategories';
import Testimonials from './pages/Testimonials';
import Contacts from './pages/Contacts';
import Newsletter from './pages/Newsletter';
import Users from './pages/Users';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/*"
            element={
              <PrivateRoute roles={['admin', 'super_admin', 'manager']}>
                <AdminLayout />
              </PrivateRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="orders" element={<Orders />} />
            <Route path="products" element={<Products />} />
            <Route path="product-reviews" element={<ProductReviews />} />
            <Route path="product-categories" element={<ProductCategories />} />
            <Route path="services" element={<Services />} />
            <Route path="service-pricing" element={<ServicePricing />} />
            <Route path="wash-packages" element={<WashPackages />} />
            <Route path="wash-package-links" element={<WashPackageConnections />} />
            <Route path="wash-types" element={<WashTypes />} />
            <Route path="vehicle-categories" element={<VehicleCategories />} />
            <Route path="blogs" element={<Blogs />} />
            <Route path="blog-categories" element={<BlogCategories />} />
            <Route path="tags" element={<Tags />} />
            <Route path="team" element={<Team />} />
            <Route path="faqs" element={<FAQs />} />
            <Route path="faq-categories" element={<FAQCategories />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </AuthProvider>
  );
}

export default App;

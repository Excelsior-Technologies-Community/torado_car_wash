import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your pages
import Homepage from './pages/Homepage';
import BookingForm from './components/BookingForm';
import MyBookings from './pages/MyBookings';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000
    },
    mutations: {
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/book" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          {/* Add other routes */}
        </Routes>
      </Router>

      {/* Toast Container - Configured once globally */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
      />
    </QueryClientProvider>
  );
}

export default App;

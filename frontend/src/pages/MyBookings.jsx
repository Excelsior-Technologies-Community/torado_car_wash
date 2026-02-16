import { useState, useEffect } from 'react';
import { bookingsApi } from '../api';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyBookings = () => {
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setIsLoading(true)
      const response = await bookingsApi.getMyBookings()
      const data = Array.isArray(response) ? response : (response.data || [])
      setBookings(data)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError(err.response?.data?.message || 'Failed to load bookings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      await bookingsApi.cancel(bookingId)
      toast.success('Booking cancelled successfully')
      fetchBookings()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking')
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center py-8">Loading bookings...</div></div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-center py-8 text-red-500">{error}</div></div>;
  }

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">No bookings found</p>
            <button onClick={() => navigate('/book')} className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600">
              Book Now
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{booking.service_name || 'Car Wash Service'}</h3>
                    <p className="text-gray-600 mt-1">{booking.vehicle_category || 'Vehicle'}</p>
                    <div className="mt-3 space-y-1 text-sm">
                      <p><span className="font-medium">Date:</span> {new Date(booking.booking_date).toLocaleDateString()}</p>
                      <p><span className="font-medium">Time:</span> {booking.booking_time}</p>
                      <p><span className="font-medium">Status:</span> <span className={`font-semibold ${
                        booking.status === 'Completed' ? 'text-green-600' :
                        booking.status === 'Cancelled' ? 'text-red-600' :
                        booking.status === 'Confirmed' ? 'text-blue-600' :
                        'text-yellow-600'
                      }`}>{booking.status}</span></p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {booking.status === 'Pending' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default MyBookings;

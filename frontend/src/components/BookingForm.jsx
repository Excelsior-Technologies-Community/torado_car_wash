import { useState } from 'react';
import { useCreateBooking } from '../hooks/useBookings';
import { useNavigate } from 'react-router-dom';

const BookingForm = () => {
  const navigate = useNavigate();
  const { mutate: createBooking, isPending } = useCreateBooking();
  
  const [formData, setFormData] = useState({
    service_id: '',
    vehicle_category_id: '',
    booking_date: '',
    booking_time: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    createBooking(formData, {
      onSuccess: () => {
        navigate('/my-bookings');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Book a Service</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Service</label>
          <select
            name="service_id"
            value={formData.service_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Service</option>
            {/* Options populated from API */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Vehicle Type</label>
          <select
            name="vehicle_category_id"
            value={formData.vehicle_category_id}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="">Select Vehicle</option>
            {/* Options populated from API */}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <input
              type="time"
              name="booking_time"
              value={formData.booking_time}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
            placeholder="Enter your complete address"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Booking...' : 'Book Now'}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;

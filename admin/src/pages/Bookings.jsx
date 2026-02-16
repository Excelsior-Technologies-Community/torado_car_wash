import { useState, useEffect } from 'react';
import { bookingsAPI } from '../api';
import { toast } from 'react-toastify';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/modals/Modal';
import ConfirmDialog from '../components/modals/ConfirmDialog';
import FormInput from '../components/forms/FormInput';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingsAPI.getAll();
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setActionLoading(true);
    try {
      await bookingsAPI.updateStatus(id, status.charAt(0).toUpperCase() + status.slice(1));
      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleView = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCancel = (booking) => {
    setSelectedBooking(booking);
    setShowConfirm(true);
  };

  const confirmCancel = async () => {
    setActionLoading(true);
    try {
      await bookingsAPI.cancel(selectedBooking.id);
      toast.success('Booking cancelled');
      setShowConfirm(false);
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Customer', render: (row) => row.user_name || `User #${row.user_id}` },
    { label: 'Service', render: (row) => row.service_name || row.package_name || `Service #${row.service_id}` },
    { label: 'Date', render: (row) => new Date(row.booking_date).toLocaleDateString() },
    { label: 'Time', field: 'booking_time' },
    { 
      label: 'Status', 
      render: (row) => (
        <select
          value={row.status?.toLowerCase()}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="px-2 py-1 border rounded text-sm"
          disabled={actionLoading}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      )
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>
      </div>
      <DataTable
        columns={columns}
        data={bookings}
        loading={loading}
        onView={handleView}
        onDelete={handleCancel}
      />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Booking Details">
        {selectedBooking && (
          <div className="space-y-3">
            <p><strong>ID:</strong> {selectedBooking.id}</p>
            <p><strong>Customer:</strong> {selectedBooking.user_name}</p>
            <p><strong>Email:</strong> {selectedBooking.user_email}</p>
            <p><strong>Phone:</strong> {selectedBooking.user_phone}</p>
            <p><strong>Service:</strong> {selectedBooking.service_name || selectedBooking.package_name}</p>
            <p><strong>Date:</strong> {selectedBooking.booking_date}</p>
            <p><strong>Time:</strong> {selectedBooking.booking_time}</p>
            <p><strong>Status:</strong> <span className="capitalize">{selectedBooking.status}</span></p>
            <p><strong>Total Price:</strong> ${selectedBooking.total_price}</p>
          </div>
        )}
      </Modal>
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking?"
        loading={actionLoading}
      />
    </div>
  );
};

export default Bookings;

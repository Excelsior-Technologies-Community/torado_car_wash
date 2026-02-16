import { useState, useEffect } from 'react';
import { ordersAPI } from '../api';
import { toast } from 'react-toastify';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/modals/Modal';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await ordersAPI.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await ordersAPI.updateStatus(id, status);
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Customer', render: (row) => row.user_name || 'N/A' },
    { label: 'Total', render: (row) => `$${row.total_amount}` },
    { 
      label: 'Status', 
      render: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="px-2 py-1 border rounded text-sm"
        >
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      )
    },
    { label: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Orders</h1>
      <DataTable
        columns={columns}
        data={orders}
        loading={loading}
        onView={(order) => {
          setSelectedOrder(order);
          setShowModal(true);
        }}
      />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Order Details">
        {selectedOrder && (
          <div className="space-y-3">
            <p><strong>Order ID:</strong> {selectedOrder.id}</p>
            <p><strong>Customer:</strong> {selectedOrder.user_name}</p>
            <p><strong>Total:</strong> ${selectedOrder.total_amount}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <p><strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleString()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Orders;

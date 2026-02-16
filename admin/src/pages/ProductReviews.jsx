import { useEffect, useState } from 'react';
import { productsAPI } from '../api';
import { toast } from 'react-toastify';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/modals/Modal';

const ProductReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPendingReviews();
  }, []);

  const fetchPendingReviews = async () => {
    try {
      const { data } = await productsAPI.getPendingReviews();
      const list = data?.data || data || [];
      setReviews(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error('Failed to load pending reviews');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    setActionLoadingId(reviewId);
    try {
      await productsAPI.approveReview(reviewId);
      toast.success('Review approved');
      fetchPendingReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve review');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (reviewId) => {
    setActionLoadingId(reviewId);
    try {
      await productsAPI.rejectReview(reviewId);
      toast.success('Review rejected');
      fetchPendingReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject review');
    } finally {
      setActionLoadingId(null);
    }
  };

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Product', render: (row) => row.product_name || `#${row.product_id}` },
    { label: 'User', render: (row) => row.user_name || `User #${row.user_id}` },
    { label: 'Rating', render: (row) => `${row.rating}/5` },
    { label: 'Title', render: (row) => row.review_content || 'N/A' },
    { label: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
    {
      label: 'Moderation',
      render: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleApprove(row.id)}
            disabled={actionLoadingId === row.id}
            className="px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700 disabled:opacity-50"
          >
            {actionLoadingId === row.id ? '...' : 'Approve'}
          </button>
          <button
            onClick={() => handleReject(row.id)}
            disabled={actionLoadingId === row.id}
            className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-50"
          >
            {actionLoadingId === row.id ? '...' : 'Reject'}
          </button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Review Approval</h1>
        <button
          onClick={fetchPendingReviews}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      <DataTable
        columns={columns}
        data={reviews}
        loading={loading}
        onView={(review) => {
          setSelectedReview(review);
          setShowModal(true);
        }}
      />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Review Details">
        {selectedReview && (
          <div className="space-y-3 text-sm">
            <p><strong>Product:</strong> {selectedReview.product_name}</p>
            <p><strong>User:</strong> {selectedReview.user_name} ({selectedReview.user_email})</p>
            <p><strong>Rating:</strong> {selectedReview.rating}/5</p>
            <p><strong>Title:</strong> {selectedReview.review_content || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <div className="p-3 bg-gray-50 rounded">{selectedReview.review_message || 'N/A'}</div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProductReviews;

import { useState, useEffect } from 'react';
import { newsletterAPI } from '../api';
import { toast } from 'react-toastify';
import DataTable from '../components/tables/DataTable';

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data } = await newsletterAPI.getAll();
      const subscriberList = data?.data || data;
      setSubscribers(Array.isArray(subscriberList) ? subscriberList : []);
    } catch (error) {
      toast.error('Failed to load subscribers');
      setSubscribers([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Email', field: 'email' },
    { label: 'Status', render: (row) => row.is_active ? 'Active' : 'Inactive' },
    { label: 'Subscribed', render: (row) => new Date(row.subscribed_at || row.created_at).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Newsletter Subscribers</h1>
      <DataTable columns={columns} data={subscribers} loading={loading} actions={false} />
    </div>
  );
};

export default Newsletter;

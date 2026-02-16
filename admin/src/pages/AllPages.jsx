import { useState, useEffect } from 'react';
import { ordersAPI } from '../api';
import { toast } from 'react-toastify';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/modals/Modal';

export const Orders = () => {
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
      setOrders(data);
    } catch (error) {
      toast.error('Failed to load orders');
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
    { label: 'Status', render: (row) => (
      <select
        value={row.status}
        onChange={(e) => handleStatusChange(row.id, e.target.value)}
        className="px-2 py-1 border rounded text-sm"
      >
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>
    )},
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

import CRUDPage from '../components/common/CRUDPage';
import { washPackagesAPI, washTypesAPI, vehicleCategoriesAPI, blogsAPI, blogCategoriesAPI, tagsAPI, teamAPI, faqsAPI, faqCategoriesAPI, testimonialsAPI, contactAPI, newsletterAPI } from '../api';

export const WashPackages = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Title', field: 'title' },
    { label: 'Base Price', render: (row) => `$${row.base_price}` },
    { label: 'Duration', render: (row) => `${row.duration_minutes} min` },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'base_price', label: 'Base Price', type: 'number', required: true },
    { name: 'duration_minutes', label: 'Duration (minutes)', type: 'number', required: true },
    { name: 'display_order', label: 'Display Order', type: 'number' },
    { name: 'icon', label: 'Icon', type: 'file' },
    { name: 'image', label: 'Image', type: 'file' },
  ];

  const initialFormData = {
    name: '',
    title: '',
    description: '',
    base_price: '',
    duration_minutes: '',
    display_order: '',
    icon: null,
    image: null,
  };

  return <CRUDPage title="Wash Packages" api={washPackagesAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

// WashTypes.jsx
export const WashTypes = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Description', field: 'description' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
  ];

  const initialFormData = {
    name: '',
    description: '',
  };

  return <CRUDPage title="Wash Types" api={washTypesAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

// VehicleCategories.jsx
export const VehicleCategories = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Price Multiplier', field: 'price_multiplier' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'price_multiplier', label: 'Price Multiplier', type: 'number', required: true },
    { name: 'image', label: 'Image', type: 'file' },
  ];

  const initialFormData = {
    name: '',
    price_multiplier: '',
    image: null,
  };

  return <CRUDPage title="Vehicle Categories" api={vehicleCategoriesAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

// Blogs.jsx
export const Blogs = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Title', field: 'title' },
    { label: 'Author', field: 'author' },
    { label: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  const formFields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'content', label: 'Content', type: 'textarea', required: true, rows: 8 },
    { name: 'author', label: 'Author', type: 'text', required: true },
    { name: 'category_id', label: 'Category ID', type: 'number', required: true },
    { name: 'image', label: 'Image', type: 'file' },
  ];

  const initialFormData = {
    title: '',
    content: '',
    author: '',
    category_id: '',
    image: null,
  };

  return <CRUDPage title="Blogs" api={blogsAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

// BlogCategories.jsx
export const BlogCategories = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
  ];

  const initialFormData = {
    name: '',
  };

  return <CRUDPage title="Blog Categories" api={blogCategoriesAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

// Tags.jsx
export const Tags = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
  ];

  const initialFormData = {
    name: '',
  };

  return <CRUDPage title="Tags" api={tagsAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

// Team.jsx
export const Team = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Position', field: 'position' },
    { label: 'Email', field: 'email' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'position', label: 'Position', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'bio', label: 'Bio', type: 'textarea' },
    { name: 'image', label: 'Image', type: 'file' },
  ];

  const initialFormData = {
    name: '',
    position: '',
    email: '',
    phone: '',
    bio: '',
    image: null,
  };

  return <CRUDPage title="Team" api={teamAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

// FAQs.jsx
export const FAQs = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Question', field: 'question' },
    { label: 'Category', render: (row) => row.category_name || 'N/A' },
  ];

  const formFields = [
    { name: 'question', label: 'Question', type: 'text', required: true },
    { name: 'answer', label: 'Answer', type: 'textarea', required: true },
    { name: 'category_id', label: 'Category ID', type: 'number', required: true },
  ];

  const initialFormData = {
    question: '',
    answer: '',
    category_id: '',
  };

  return <CRUDPage title="FAQs" api={faqsAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

// FAQCategories.jsx
export const FAQCategories = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
  ];

  const initialFormData = {
    name: '',
  };

  return <CRUDPage title="FAQ Categories" api={faqCategoriesAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

// Testimonials.jsx
export const Testimonials = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Rating', field: 'rating' },
    { label: 'Status', render: (row) => row.is_approved ? 'Approved' : 'Pending' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'position', label: 'Position', type: 'text' },
    { name: 'content', label: 'Content', type: 'textarea', required: true },
    { name: 'rating', label: 'Rating', type: 'number', required: true },
    { name: 'image', label: 'Image', type: 'file' },
  ];

  const initialFormData = {
    name: '',
    position: '',
    content: '',
    rating: '',
    image: null,
  };

  return <CRUDPage title="Testimonials" api={testimonialsAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

// Contacts.jsx
export const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data } = await contactAPI.getAll();
      setContacts(data);
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactAPI.markAsRead(id);
      toast.success('Marked as read');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Email', field: 'email' },
    { label: 'Subject', field: 'subject' },
    { label: 'Status', render: (row) => row.is_read ? '✓ Read' : '✉ Unread' },
    { label: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Messages</h1>
      <DataTable
        columns={columns}
        data={contacts}
        loading={loading}
        onView={(contact) => {
          setSelectedContact(contact);
          setShowModal(true);
          if (!contact.is_read) handleMarkAsRead(contact.id);
        }}
      />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Contact Message">
        {selectedContact && (
          <div className="space-y-3">
            <p><strong>Name:</strong> {selectedContact.name}</p>
            <p><strong>Email:</strong> {selectedContact.email}</p>
            <p><strong>Phone:</strong> {selectedContact.phone}</p>
            <p><strong>Subject:</strong> {selectedContact.subject}</p>
            <p><strong>Message:</strong></p>
            <p className="bg-gray-50 p-3 rounded">{selectedContact.message}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

// Newsletter.jsx
export const Newsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data } = await newsletterAPI.getAll();
      setSubscribers(data);
    } catch (error) {
      toast.error('Failed to load subscribers');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Email', field: 'email' },
    { label: 'Status', render: (row) => row.is_active ? 'Active' : 'Inactive' },
    { label: 'Subscribed', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Newsletter Subscribers</h1>
      <DataTable columns={columns} data={subscribers} loading={loading} actions={false} />
    </div>
  );
};

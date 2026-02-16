import { useState, useEffect } from 'react';
import { contactAPI } from '../api';
import { toast } from 'react-toastify';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/modals/Modal';

const Contacts = () => {
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
      const contactList = data?.data || data;
      setContacts(Array.isArray(contactList) ? contactList : []);
    } catch (error) {
      toast.error('Failed to load contacts');
      setContacts([]);
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

export default Contacts;

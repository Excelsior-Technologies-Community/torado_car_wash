import { useState, useEffect } from 'react';
import { servicesAPI } from '../api';
import { toast } from 'react-toastify';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/modals/Modal';
import ConfirmDialog from '../components/modals/ConfirmDialog';
import FormInput from '../components/forms/FormInput';

const Services = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    problem_name: '',
    problem_description: '',
    image: null,
    icon: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [iconPreview, setIconPreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [existingIcon, setExistingIcon] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await servicesAPI.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load services');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files }));
      if (name === 'image') {
        setImagePreview(URL.createObjectURL(files[0]));
      } else if (name === 'icon') {
        setIconPreview(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('problem_name', formData.problem_name);
      submitData.append('problem_description', formData.problem_description);
      
      if (formData.image && formData.image[0]) {
        submitData.append('image', formData.image[0]);
      }
      if (formData.icon && formData.icon[0]) {
        submitData.append('icon', formData.icon[0]);
      }
      
      if (selectedItem) {
        await servicesAPI.update(selectedItem.id, submitData);
        toast.success('Service updated successfully');
      } else {
        await servicesAPI.create(submitData);
        toast.success('Service created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      problem_name: item.problem_name || '',
      problem_description: item.problem_description || '',
      image: null,
      icon: null,
    });
    setExistingImage(item.image);
    setExistingIcon(item.icon);
    setImagePreview(null);
    setIconPreview(null);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await servicesAPI.delete(selectedItem.id);
      toast.success('Service deleted successfully');
      setShowConfirm(false);
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      problem_name: '',
      problem_description: '',
      image: null,
      icon: null,
    });
    setSelectedItem(null);
    setImagePreview(null);
    setIconPreview(null);
    setExistingImage(null);
    setExistingIcon(null);
  };

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Description', field: 'description' },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Services</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Service
        </button>
      </div>
      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={selectedItem ? 'Edit Service' : 'Add Service'}
      >
        <form onSubmit={handleSubmit}>
          <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} required />
          <FormInput label="Description" name="description" type="textarea" value={formData.description} onChange={handleChange} required />
          <FormInput label="Problem Name" name="problem_name" value={formData.problem_name} onChange={handleChange} />
          <FormInput label="Problem Description" name="problem_description" type="textarea" value={formData.problem_description} onChange={handleChange} />
          
          {existingIcon && !iconPreview && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Icon</label>
              <div className="relative inline-block">
                <img src={`http://localhost:5000/uploads/${existingIcon}`} alt="Icon" className="w-20 h-20 object-cover rounded" />
                <button type="button" onClick={() => setExistingIcon(null)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">×</button>
              </div>
            </div>
          )}
          {iconPreview && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Icon Preview</label>
              <img src={iconPreview} alt="Preview" className="w-20 h-20 object-cover rounded" />
            </div>
          )}
          <FormInput label="Icon" name="icon" type="file" onChange={handleChange} />
          
          {existingImage && !imagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
              <div className="relative inline-block">
                <img src={`http://localhost:5000/uploads/${existingImage}`} alt="Image" className="w-32 h-32 object-cover rounded" />
                <button type="button" onClick={() => setExistingImage(null)} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">×</button>
              </div>
            </div>
          )}
          {imagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Image Preview</label>
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
          <FormInput label="Image" name="image" type="file" onChange={handleChange} />
          
          <div className="flex justify-end space-x-3 mt-6">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={actionLoading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">{actionLoading ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </Modal>
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        loading={actionLoading}
      />
    </div>
  );
};

export default Services;

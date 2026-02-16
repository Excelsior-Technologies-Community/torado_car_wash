import { useEffect, useState } from 'react';
import { productsAPI } from '../api';
import { toast } from 'react-toastify';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/modals/Modal';
import ConfirmDialog from '../components/modals/ConfirmDialog';
import FormInput from '../components/forms/FormInput';

const ProductCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    is_active: '1',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await productsAPI.getCategoriesAdmin();
      const list = data?.data || data || [];
      setCategories(Array.isArray(list) ? list : []);
    } catch (error) {
      toast.error('Failed to load product categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (selectedCategory) {
        await productsAPI.updateCategory(selectedCategory.id, {
          name: formData.name,
          slug: formData.slug,
          is_active: formData.is_active,
        });
        toast.success('Category updated successfully');
      } else {
        await productsAPI.createCategory({
          name: formData.name,
          slug: formData.slug,
        });
        toast.success('Category created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      await productsAPI.updateCategory(category.id, { is_active: category.is_active ? '0' : '1' });
      toast.success(`Category ${category.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      is_active: String(category.is_active ?? 1),
    });
    setShowModal(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await productsAPI.deleteCategory(selectedCategory.id);
      toast.success('Category deactivated successfully');
      setShowConfirm(false);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deactivate category');
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedCategory(null);
    setFormData({
      name: '',
      slug: '',
      is_active: '1',
    });
  };

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Slug', field: 'slug' },
    {
      label: 'Status',
      render: (row) => (
        <button
          type="button"
          onClick={() => handleToggleStatus(row)}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            Number(row.is_active) === 1
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {Number(row.is_active) === 1 ? 'Active' : 'Inactive'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Categories</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
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
        title={selectedCategory ? 'Edit Category' : 'Add Category'}
      >
        <form onSubmit={handleSubmit}>
          <FormInput label="Name" name="name" value={formData.name} onChange={handleChange} required />
          <FormInput label="Slug" name="slug" value={formData.slug} onChange={handleChange} required />
          {selectedCategory && (
            <FormInput
              label="Status"
              name="is_active"
              type="select"
              value={formData.is_active}
              onChange={handleChange}
              options={[
                { value: '1', label: 'Active' },
                { value: '0', label: 'Inactive' },
              ]}
            />
          )}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {actionLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Deactivate Category"
        message="Are you sure you want to deactivate this category?"
        loading={actionLoading}
      />
    </div>
  );
};

export default ProductCategories;

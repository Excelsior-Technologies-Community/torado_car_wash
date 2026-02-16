import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import DataTable from '../tables/DataTable';
import Modal from '../modals/Modal';
import ConfirmDialog from '../modals/ConfirmDialog';
import FormInput from '../forms/FormInput';

const CRUDPage = ({ title, api, columns, formFields, initialFormData, transformFormData }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await api.getAll();
      const items = data?.data || data;
      setItems(Array.isArray(items) ? items : []);
    } catch (error) {
      toast.error(`Failed to load ${title.toLowerCase()}`);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    const nextValue = files ? files[0] : value;
    setFormData((prev) => {
      const baseData = {
        ...prev,
        [name]: nextValue
      };

      if (typeof transformFormData === 'function') {
        return transformFormData({
          prevData: prev,
          nextData: baseData,
          name,
          value: nextValue,
          files
        });
      }

      return baseData;
    });
  };

  const handleRemoveImage = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: null,
      [`${fieldName}_preview`]: null,
      [`${fieldName}_removed`]: true
    }));
  };

  const getPreviewImageUrl = (imageValue) => {
    if (!imageValue) return '';
    if (typeof imageValue === 'string' && imageValue.startsWith('http')) {
      return imageValue;
    }
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const serverBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');
    return `${serverBaseUrl}/uploads/${imageValue}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (selectedItem) {
        await api.update(selectedItem.id, formData);
        toast.success(`${title} updated successfully`);
      } else {
        await api.create(formData);
        toast.success(`${title} created successfully`);
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
    const editData = {};
    formFields.forEach(field => {
      if (field.type === 'file') {
        editData[field.name] = null;
        const previewSourceField = field.previewSource || field.name;
        editData[`${field.name}_preview`] = item[previewSourceField];
      } else if (field.type === 'select') {
        editData[field.name] = item[field.name] !== undefined && item[field.name] !== null
          ? String(item[field.name])
          : '';
      } else {
        editData[field.name] = item[field.name] ?? '';
      }
    });
    setFormData(editData);
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setSelectedItem(item);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await api.delete(selectedItem.id);
      toast.success(`${title} deleted successfully`);
      setShowConfirm(false);
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete');
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setSelectedItem(null);
  };

  const resolvedColumns = columns.map((col) => {
    if (!col.render) return col;
    return {
      ...col,
      render: (row) =>
        col.render(row, {
          refresh: fetchItems,
          api,
        }),
    };
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add {title}
        </button>
      </div>
      <DataTable
        columns={resolvedColumns}
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
        title={selectedItem ? `Edit ${title}` : `Add ${title}`}
      >
        <form onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.name}>
              <FormInput
                label={field.label}
                name={field.name}
                type={field.type}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.required}
                options={field.options}
                rows={field.rows}
              />
              {(field.preview || field.type === 'file') && formData[`${field.name}_preview`] && !formData[`${field.name}_removed`] && (
                <div className="mt-2 relative inline-block">
                  <p className="text-sm text-gray-600 mb-1">Current Image:</p>
                  <div className="relative">
                    <img 
                      src={getPreviewImageUrl(formData[`${field.name}_preview`])}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded border"
                    />
                    {field.removable && (
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(field.name)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
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
        title={`Delete ${title}`}
        message={`Are you sure you want to delete this ${title.toLowerCase()}?`}
        loading={actionLoading}
      />
    </div>
  );
};

export default CRUDPage;

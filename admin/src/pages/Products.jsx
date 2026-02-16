import { useState, useEffect } from 'react';
import { productsAPI } from '../api';
import { toast } from 'react-toastify';
import DataTable from '../components/tables/DataTable';
import Modal from '../components/modals/Modal';
import ConfirmDialog from '../components/modals/ConfirmDialog';
import FormInput from '../components/forms/FormInput';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_id: '',
    category: '',
    brand: '',
    color: '',
    size: '',
    weight: '',
    dimensions: '',
    additional_info: '',
    is_active: '1',
    images: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await productsAPI.getAll();
      setProducts(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await productsAPI.getCategories();
      setCategories(Array.isArray(data?.data) ? data.data : []);
    } catch (error) {
      toast.error('Failed to load categories');
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files }));
      setImagePreview(URL.createObjectURL(files[0]));
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
      submitData.append('price', formData.price);
      submitData.append('stock_quantity', formData.stock_quantity);
      if (formData.category_id) {
        submitData.append('category_id', formData.category_id);
      }
      submitData.append('category', formData.category);
      submitData.append('brand', formData.brand);
      submitData.append('color', formData.color);
      submitData.append('size', formData.size);
      submitData.append('weight', formData.weight);
      submitData.append('dimensions', formData.dimensions);
      submitData.append('is_active', formData.is_active);

      if (formData.additional_info?.trim()) {
        try {
          JSON.parse(formData.additional_info);
        } catch (e) {
          toast.error('Additional info must be valid JSON');
          setActionLoading(false);
          return;
        }
        submitData.append('additional_info', formData.additional_info.trim());
      }
      
      if (formData.images && formData.images[0]) {
        for (let i = 0; i < formData.images.length; i++) {
          submitData.append('images', formData.images[i]);
        }
      }
      
      if (selectedProduct) {
        const response = await productsAPI.update(selectedProduct.id, submitData);
        toast.success('Product updated successfully');
      } else {
        await productsAPI.create(submitData);
        toast.success('Product created successfully');
      }
      setShowModal(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveImage = async (imageId) => {
    try {
      await productsAPI.deleteImage(imageId);
      toast.success('Image removed');
      setExistingImages([]);
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock_quantity: product.stock_quantity,
      category_id: product.category_id,
      category: product.category || '',
      brand: product.brand || '',
      color: product.color || '',
      size: product.size || '',
      weight: product.weight || '',
      dimensions: product.dimensions || '',
      additional_info: product.additional_info
        ? (typeof product.additional_info === 'string'
            ? product.additional_info
            : JSON.stringify(product.additional_info, null, 2))
        : '',
      is_active: String(product.is_active ?? 1),
      images: null,
    });
    const imgs = Array.isArray(product.images) ? product.images : (product.images ? product.images.split(',') : []);
    setExistingImages(imgs);
    setImagePreview(null);
    setShowModal(true);
  };

  const handleDelete = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  const handleStatusToggle = async (product) => {
    try {
      const submitData = new FormData();
      submitData.append('is_active', product.is_active ? '0' : '1');
      await productsAPI.update(product.id, submitData);
      toast.success(`Product ${product.is_active ? 'deactivated' : 'activated'} successfully`);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product status');
    }
  };

  const confirmDelete = async () => {
    setActionLoading(true);
    try {
      await productsAPI.delete(selectedProduct.id);
      toast.success('Product deleted successfully');
      setShowConfirm(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setActionLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      category_id: '',
      category: '',
      brand: '',
      color: '',
      size: '',
      weight: '',
      dimensions: '',
      additional_info: '',
      is_active: '1',
      images: null,
    });
    setSelectedProduct(null);
    setImagePreview(null);
    setExistingImages([]);
  };

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Price', render: (row) => `$${row.price}` },
    { label: 'Stock', field: 'stock_quantity' },
    { label: 'Category', render: (row) => row.category_name || 'N/A' },
    {
      label: 'Status',
      render: (row) => (
        <button
          type="button"
          onClick={() => handleStatusToggle(row)}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            Number(row.is_active) === 1
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {Number(row.is_active) === 1 ? 'Active' : 'Inactive'}
        </button>
      )
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add Product
        </button>
      </div>
      <DataTable
        columns={columns}
        data={products}
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
        title={selectedProduct ? 'Edit Product' : 'Add Product'}
      >
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Stock"
            name="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
          />
          <FormInput
            label="Category"
            name="category_id"
            type="select"
            value={formData.category_id}
            onChange={handleChange}
            options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
            required
          />
          <FormInput
            label="Category (Text)"
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Optional category label"
          />
          <FormInput
            label="Brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            placeholder="e.g. Meguiar's"
          />
          <FormInput
            label="Color"
            name="color"
            value={formData.color}
            onChange={handleChange}
            placeholder="e.g. Black"
          />
          <FormInput
            label="Size"
            name="size"
            value={formData.size}
            onChange={handleChange}
            placeholder="e.g. 500ml"
          />
          <FormInput
            label="Weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="e.g. 0.5kg"
          />
          <FormInput
            label="Dimensions"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            placeholder="e.g. 10x8x4 cm"
          />
          <FormInput
            label="Additional Info (JSON)"
            name="additional_info"
            type="textarea"
            value={formData.additional_info}
            onChange={handleChange}
            placeholder='{"material":"microfiber","origin":"US"}'
            rows={5}
          />
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
            required
          />
          {existingImages.length > 0 && !imagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
              <div className="relative inline-block">
                <img src={`http://localhost:5000/uploads/${existingImages[0]}`} alt="Current" className="w-32 h-32 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => setExistingImages([])}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {imagePreview && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Image Preview</label>
              <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded" />
            </div>
          )}
          <FormInput
            label="Images"
            name="images"
            type="file"
            onChange={handleChange}
          />
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
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        loading={actionLoading}
      />
    </div>
  );
};

export default Products;

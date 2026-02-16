import { useState, useEffect } from 'react';
import CRUDPage from '../components/common/CRUDPage';
import { blogsAPI, blogCategoriesAPI, usersAPI } from '../api';

const Blogs = () => {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchUsers();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await blogCategoriesAPI.getAll();
      const categoryList = data?.data || data;
      setCategories(Array.isArray(categoryList) ? categoryList : []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data } = await usersAPI.getAll();
      const userList = data?.data || data;
      setUsers(Array.isArray(userList) ? userList : []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    }
  };

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Title', field: 'title' },
    { label: 'Author', render: (row) => row.author_name || 'N/A' },
    { label: 'Category', render: (row) => row.category_name || 'N/A' },
    { label: 'Published', render: (row) => (row.is_published ? 'Yes' : 'No') },
    { label: 'Date', render: (row) => new Date(row.created_at).toLocaleDateString() },
  ];

  const formFields = [
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'content', label: 'Content', type: 'textarea', required: true, rows: 8 },
    { 
      name: 'author_id', 
      label: 'Author', 
      type: 'select', 
      required: true,
      options: users.map(user => ({ value: user.id, label: user.name }))
    },
    { 
      name: 'category_id', 
      label: 'Category', 
      type: 'select', 
      required: true,
      options: categories.map(cat => ({ value: cat.id, label: cat.name }))
    },
    { name: 'tags_input', label: 'Tag IDs (comma separated)', type: 'text', placeholder: '1,2,3' },
    {
      name: 'is_published',
      label: 'Publish Status',
      type: 'select',
      options: [
        { value: '1', label: 'Published' },
        { value: '0', label: 'Draft' },
      ],
    },
    { name: 'image', label: 'Featured Image', type: 'file', preview: true, removable: true, previewSource: 'featured_image' },
  ];

  const initialFormData = {
    title: '',
    content: '',
    author_id: '',
    category_id: '',
    tags_input: '',
    is_published: '0',
    image: null,
  };

  const parseTags = (value) => {
    if (!value) return [];
    return String(value)
      .split(',')
      .map((v) => Number(v.trim()))
      .filter((v) => Number.isInteger(v) && v > 0);
  };

  const adminBlogsAPI = {
    ...blogsAPI,
    getAll: async () => {
      const response = await blogsAPI.getAll({ admin: true });
      const payload = response?.data || response;
      const list = payload?.data || [];
      const mapped = Array.isArray(list)
        ? list.map((blog) => ({
            ...blog,
            tags_input: Array.isArray(blog.tags) ? blog.tags.map((t) => t.id).join(',') : '',
          }))
        : [];
      return {
        ...response,
        data: {
          ...payload,
          data: mapped,
        },
      };
    },
    create: (payload) => {
      const { tags_input, ...rest } = payload;
      const tags = parseTags(tags_input);
      return blogsAPI.create({
        ...rest,
        is_published: Number(rest.is_published || 0),
        tags: tags.length ? JSON.stringify(tags) : undefined,
      });
    },
    update: (id, payload) => {
      const { tags_input, ...rest } = payload;
      const tags = parseTags(tags_input);
      return blogsAPI.update(id, {
        ...rest,
        is_published: Number(rest.is_published || 0),
        tags: tags.length ? JSON.stringify(tags) : JSON.stringify([]),
      });
    },
  };

  return <CRUDPage title="Blogs" api={adminBlogsAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

export default Blogs;

import { useEffect, useState } from 'react';
import CRUDPage from '../components/common/CRUDPage';
import { faqsAPI, faqCategoriesAPI } from '../api';

const FAQs = () => {
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await faqCategoriesAPI.getAll();
        const categories = Array.isArray(data) ? data : [];
        setCategoryOptions(
          categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))
        );
      } catch (error) {
        setCategoryOptions([]);
      }
    };

    fetchCategories();
  }, []);

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Question', field: 'question' },
    { label: 'Category', render: (row) => row.category_name || 'N/A' },
    { label: 'Display Order', field: 'display_order' },
  ];

  const formFields = [
    { name: 'category_id', label: 'Category', type: 'select', required: true, options: categoryOptions },
    { name: 'question', label: 'Question', type: 'text', required: true },
    { name: 'answer', label: 'Answer', type: 'textarea', required: true },
    { name: 'display_order', label: 'Display Order', type: 'number' },
  ];

  const initialFormData = {
    category_id: '',
    question: '',
    answer: '',
    display_order: 0,
  };

  return <CRUDPage title="FAQs" api={faqsAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

export default FAQs;

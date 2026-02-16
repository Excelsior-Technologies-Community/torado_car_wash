import CRUDPage from '../components/common/CRUDPage';
import { faqCategoriesAPI } from '../api';

const FAQCategories = () => {
  const slugify = (value) =>
    (value || '')
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const transformFormData = ({ prevData, nextData, name, value }) => {
    if (name !== 'name') {
      return nextData;
    }

    const currentSlug = prevData.slug || '';
    const previousAutoSlug = slugify(prevData.name);
    const shouldAutoGenerate = !currentSlug || currentSlug === previousAutoSlug;

    if (!shouldAutoGenerate) {
      return nextData;
    }

    return {
      ...nextData,
      slug: slugify(value),
    };
  };

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Slug', field: 'slug' },
    { label: 'Display Order', field: 'display_order' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'slug', label: 'Slug', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'display_order', label: 'Display Order', type: 'number' },
  ];

  const initialFormData = {
    name: '',
    slug: '',
    description: '',
    display_order: 0,
  };

  return (
    <CRUDPage
      title="FAQ Categories"
      api={faqCategoriesAPI}
      columns={columns}
      formFields={formFields}
      initialFormData={initialFormData}
      transformFormData={transformFormData}
    />
  );
};

export default FAQCategories;

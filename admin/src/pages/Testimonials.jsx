import CRUDPage from '../components/common/CRUDPage';
import { testimonialsAPI } from '../api';

const Testimonials = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Rating', field: 'rating' },
    {
      label: 'Status',
      render: (row, ctx) => (
        <button
          type="button"
          onClick={async () => {
            await testimonialsAPI.update(row.id, { is_approved: row.is_approved ? 0 : 1 });
            await ctx.refresh();
          }}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.is_approved
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
          }`}
        >
          {row.is_approved ? 'Approved' : 'Pending'}
        </button>
      ),
    },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'position', label: 'Position', type: 'text' },
    { name: 'message', label: 'Message', type: 'textarea', required: true },
    { name: 'rating', label: 'Rating', type: 'number', required: true },
    {
      name: 'is_approved',
      label: 'Approval Status',
      type: 'select',
      options: [
        { value: '1', label: 'Approved' },
        { value: '0', label: 'Pending' },
      ],
    },
    { name: 'image', label: 'Image', type: 'file', preview: true, removable: true },
  ];

  const initialFormData = {
    name: '',
    position: '',
    message: '',
    rating: '',
    is_approved: '0',
    image: null,
  };

  return <CRUDPage title="Testimonials" api={testimonialsAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

export default Testimonials;

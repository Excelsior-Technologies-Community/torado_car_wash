import CRUDPage from '../components/common/CRUDPage';
import { teamAPI } from '../api';

const Team = () => {
  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Designation', field: 'designation' },
    { label: 'Display Order', field: 'display_order' },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'designation', label: 'Designation', type: 'text', required: true },
    { name: 'display_order', label: 'Display Order', type: 'number' },
    { name: 'facebook_url', label: 'Facebook URL', type: 'text' },
    { name: 'linkedin_url', label: 'LinkedIn URL', type: 'text' },
    { name: 'instagram_url', label: 'Instagram URL', type: 'text' },
    { name: 'twitter_url', label: 'Twitter URL', type: 'text' },
    { name: 'image', label: 'Image', type: 'file', preview: true, removable: true },
  ];

  const initialFormData = {
    name: '',
    designation: '',
    display_order: 0,
    facebook_url: '',
    linkedin_url: '',
    instagram_url: '',
    twitter_url: '',
    image: null,
  };

  return <CRUDPage title="Team" api={teamAPI} columns={columns} formFields={formFields} initialFormData={initialFormData} />;
};

export default Team;

import { useEffect, useState } from 'react';
import CRUDPage from '../components/common/CRUDPage';
import { usersAPI } from '../api';
import { toast } from 'react-toastify';

const Users = () => {
  const [roleOptions, setRoleOptions] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data } = await usersAPI.getRoles();
        const roles = data?.data || data;
        const options = Array.isArray(roles)
          ? roles.map((role) => ({
              value: String(role.id),
              label: role.name,
            }))
          : [];
        setRoleOptions(options);
      } catch (error) {
        setRoleOptions([]);
      }
    };

    fetchRoles();
  }, []);

  const transformFormData = ({ nextData }) => ({
    ...nextData,
    role_id: nextData.role_id ? Number(nextData.role_id) : nextData.role_id,
    is_active: nextData.is_active === 'false' ? false : true,
  });

  const columns = [
    { label: 'ID', field: 'id' },
    { label: 'Name', field: 'name' },
    { label: 'Email', field: 'email' },
    { label: 'Phone', field: 'phone' },
    { label: 'Role', field: 'role_name' },
    {
      label: 'Status',
      render: (row, ctx) => (
        <button
          type="button"
          onClick={async () => {
            try {
              await usersAPI.update(row.id, { is_active: !row.is_active });
              toast.success(`User ${!row.is_active ? 'activated' : 'deactivated'} successfully`);
              await ctx.refresh();
            } catch (error) {
              toast.error(error.response?.data?.message || 'Failed to update status');
            }
          }}
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            row.is_active
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {row.is_active ? 'Active' : 'Inactive'}
        </button>
      ),
    },
  ];

  const formFields = [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'role_id', label: 'Role', type: 'select', required: true, options: roleOptions },
    { name: 'password', label: 'Password (required for create)', type: 'password' },
    {
      name: 'is_active',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'true', label: 'Active' },
        { value: 'false', label: 'Inactive' },
      ],
    },
  ];

  const initialFormData = {
    name: '',
    email: '',
    phone: '',
    role_id: '',
    password: '',
    is_active: 'true',
  };

  return (
    <CRUDPage
      title="Users"
      api={usersAPI}
      columns={columns}
      formFields={formFields}
      initialFormData={initialFormData}
      transformFormData={transformFormData}
    />
  );
};

export default Users;

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { authAPI } from '../api/auth';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    profile_image: null,
  });
  const [preview, setPreview] = useState('');
  const [serverImage, setServerImage] = useState('');

  const profileImageUrl = useMemo(() => {
    const imageValue = preview || serverImage;
    if (!imageValue) return '';
    if (imageValue.startsWith('blob:') || imageValue.startsWith('http')) return imageValue;
    const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
    const serverBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');
    return `${serverBaseUrl}/uploads/${imageValue}`;
  }, [preview, serverImage]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await authAPI.getProfile();
        setFormData((prev) => ({
          ...prev,
          name: data?.name || '',
          email: data?.email || '',
          phone: data?.phone || '',
          password: '',
        }));
        setServerImage(data?.profile_image || '');
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setPreview(URL.createObjectURL(files[0]));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      if (formData.password) {
        submitData.append('password', formData.password);
      }
      if (formData.profile_image instanceof File) {
        submitData.append('profile_image', formData.profile_image);
      }

      await authAPI.updateProfile(submitData);
      toast.success('Profile updated successfully');

      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = {
        ...savedUser,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setFormData((prev) => ({ ...prev, password: '', profile_image: null }));
      if (preview) {
        setServerImage(preview);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-2">Profile Image</p>
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover border" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 border"></div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload New Profile Image</label>
              <input
                type="file"
                name="profile_image"
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;

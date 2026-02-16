import React, { useState, useEffect } from 'react';
import { profileApi } from '../api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    profile_image: ''
  });
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const data = await profileApi.getProfile();
      // console.log('Profile Data:', data);
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        password: '',
        profile_image: data.profile_image || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Profile fetch error:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('phone', formData.phone);
      if (formData.password) data.append('password', formData.password);
      if (imageFile) data.append('profile_image', imageFile);

      await profileApi.updateProfile(data);
      toast.success('Profile updated successfully');
      setFormData({ ...formData, password: '' });
      setImageFile(null);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-4 sm:p-6 md:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">My Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.profile_image && (
            <div className="flex justify-center">
              <img src={`http://localhost:5000/uploads/${formData.profile_image}`} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Profile Image</label>
            <input type="file" onChange={handleImageChange} accept="image/*" className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">New Password (leave blank to keep current)</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>

          <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition">
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;

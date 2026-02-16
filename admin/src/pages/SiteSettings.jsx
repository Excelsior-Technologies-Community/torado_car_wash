import { useEffect, useState } from 'react';
import { contentAPI } from '../api';
import { toast } from 'react-toastify';
import FormInput from '../components/forms/FormInput';

const SiteSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    email: '',
    social_links: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await contentAPI.getSiteSettings();
      const settings = data?.data || data || null;
      if (settings) {
        setFormData({
          address: settings.address || '',
          phone: settings.phone || '',
          email: settings.email || '',
          social_links: settings.social_links
            ? (typeof settings.social_links === 'string'
                ? settings.social_links
                : JSON.stringify(settings.social_links, null, 2))
            : '',
        });
      }
    } catch (error) {
      toast.error('Failed to load site settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (formData.social_links?.trim()) {
        JSON.parse(formData.social_links);
      }

      await contentAPI.saveSiteSettings({
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        social_links: formData.social_links?.trim() || null,
      });
      toast.success('Site settings saved successfully');
      fetchSettings();
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error('Social links must be valid JSON');
      } else {
        toast.error(error.response?.data?.message || 'Failed to save settings');
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="py-12 text-center">Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Site Settings</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <FormInput label="Address" name="address" type="textarea" value={formData.address} onChange={handleChange} />
        <FormInput label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
        <FormInput label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
        <FormInput
          label="Social Links (JSON)"
          name="social_links"
          type="textarea"
          value={formData.social_links}
          onChange={handleChange}
          rows={8}
          placeholder='{"facebook":"https://...","instagram":"https://..."}'
        />
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;

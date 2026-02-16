import { useState, useEffect } from 'react';
import {
  bookingsAPI,
  ordersAPI,
  productsAPI,
  servicesAPI,
  washPackagesAPI,
  washTypesAPI,
  vehicleCategoriesAPI,
  blogsAPI,
  teamAPI,
  faqsAPI,
  faqCategoriesAPI,
  testimonialsAPI,
  contactAPI,
  newsletterAPI,
  usersAPI,
} from '../api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const getTotalFromResponse = (response) => {
    const payload = response?.data;
    if (!payload) return 0;

    if (typeof payload?.pagination?.total === 'number') return payload.pagination.total;
    if (typeof payload?.pagination?.totalItems === 'number') return payload.pagination.totalItems;
    if (Array.isArray(payload)) return payload.length;
    if (Array.isArray(payload.data)) return payload.data.length;
    if (Array.isArray(payload.testimonials)) return payload.testimonials.length;

    return 0;
  };

  const fetchStats = async () => {
    try {
      const statsConfig = [
        { key: 'totalUsers', request: () => usersAPI.getAll() },
        { key: 'totalBookings', request: () => bookingsAPI.getAll() },
        { key: 'totalOrders', request: () => ordersAPI.getAll() },
        { key: 'totalProducts', request: () => productsAPI.getAll({ page: 1, limit: 1 }) },
        { key: 'totalServices', request: () => servicesAPI.getAll() },
        { key: 'totalWashPackages', request: () => washPackagesAPI.getAll() },
        { key: 'totalWashTypes', request: () => washTypesAPI.getAll() },
        { key: 'totalVehicleCategories', request: () => vehicleCategoriesAPI.getAll() },
        { key: 'totalBlogs', request: () => blogsAPI.getAll({ page: 1, limit: 1, admin: true }) },
        { key: 'totalTeamMembers', request: () => teamAPI.getAll({ page: 1, limit: 1 }) },
        { key: 'totalFaqs', request: () => faqsAPI.getAll() },
        { key: 'totalFaqCategories', request: () => faqCategoriesAPI.getAll() },
        { key: 'totalTestimonials', request: () => testimonialsAPI.getAll() },
        { key: 'totalContacts', request: () => contactAPI.getAll() },
        { key: 'totalSubscribers', request: () => newsletterAPI.getAll() },
      ];

      const responses = await Promise.all(
        statsConfig.map((item) => item.request().catch(() => null)),
      );

      const nextStats = {};
      statsConfig.forEach((item, index) => {
        nextStats[item.key] = getTotalFromResponse(responses[index]);
      });

      setStats(nextStats);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: 'Total Users', value: stats.totalUsers, accent: '#6366f1' },
    { title: 'Total Bookings', value: stats.totalBookings, accent: '#3b82f6' },
    { title: 'Total Orders', value: stats.totalOrders, accent: '#10b981' },
    { title: 'Total Products', value: stats.totalProducts, accent: '#8b5cf6' },
    { title: 'Total Services', value: stats.totalServices, accent: '#f97316' },
    { title: 'Total Wash Packages', value: stats.totalWashPackages, accent: '#06b6d4' },
    { title: 'Total Wash Types', value: stats.totalWashTypes, accent: '#0ea5e9' },
    { title: 'Total Vehicle Categories', value: stats.totalVehicleCategories, accent: '#14b8a6' },
    { title: 'Total Blogs', value: stats.totalBlogs, accent: '#ec4899' },
    { title: 'Total Team Members', value: stats.totalTeamMembers, accent: '#f59e0b' },
    { title: 'Total FAQs', value: stats.totalFaqs, accent: '#84cc16' },
    { title: 'Total FAQ Categories', value: stats.totalFaqCategories, accent: '#eab308' },
    { title: 'Total Testimonials', value: stats.totalTestimonials, accent: '#d946ef' },
    { title: 'Contact Messages', value: stats.totalContacts, accent: '#f43f5e' },
    { title: 'Newsletter Subscribers', value: stats.totalSubscribers, accent: '#ef4444' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-3xl font-bold text-gray-800">{card.value || 0}</p>
              </div>
              <div className="w-4 h-16 rounded-full" style={{ backgroundColor: card.accent }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;

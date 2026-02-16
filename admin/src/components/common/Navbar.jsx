import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { contactAPI, ordersAPI, productsAPI } from '../../api';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationItems, setNotificationItems] = useState([]);

  const canModerateReviews = ['admin', 'super_admin'].includes(user?.role);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [user?.role]);

  const fetchNotifications = async () => {
    try {
      const [pendingReviewsRes, contactsRes, ordersRes] = await Promise.all([
        canModerateReviews
          ? productsAPI.getPendingReviews().catch(() => ({ data: { data: [] } }))
          : Promise.resolve({ data: { data: [] } }),
        contactAPI.getAll().catch(() => ({ data: { data: [] } })),
        ordersAPI.getAll().catch(() => ({ data: [] })),
      ]);

      const pendingReviews = pendingReviewsRes?.data?.data || pendingReviewsRes?.data || [];
      const contacts = contactsRes?.data?.data || contactsRes?.data || [];
      const orders = ordersRes?.data || [];

      const unreadContactsCount = (Array.isArray(contacts) ? contacts : []).filter((c) => !c.is_read).length;
      const pendingOrdersCount = (Array.isArray(orders) ? orders : []).filter((o) => o.status === 'Pending').length;
      const pendingReviewsCount = Array.isArray(pendingReviews) ? pendingReviews.length : 0;

      const items = [
        {
          key: 'contacts',
          label: 'Unread contact messages',
          count: unreadContactsCount,
          path: '/contacts',
        },
        {
          key: 'orders',
          label: 'Pending orders',
          count: pendingOrdersCount,
          path: '/orders',
        },
      ];

      if (canModerateReviews) {
        items.unshift({
          key: 'reviews',
          label: 'Pending product reviews',
          count: pendingReviewsCount,
          path: '/product-reviews',
        });
      }

      setNotificationItems(items);
    } catch (error) {
      setNotificationItems([]);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalNotifications = useMemo(
    () => notificationItems.reduce((sum, item) => sum + (item.count || 0), 0),
    [notificationItems]
  );

  return (
    <nav className="bg-white shadow-md h-16 flex items-center justify-between px-3 sm:px-4 md:px-6">
      <button onClick={toggleSidebar} className="lg:hidden text-gray-600 mr-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex-1"></div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowDropdown(false);
              if (!showNotifications) fetchNotifications();
            }}
            className="relative p-2 rounded-full hover:bg-gray-100 text-gray-700"
            aria-label="Notifications"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405C18.21 15.21 18 14.702 18 14.172V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.172c0 .53-.21 1.038-.595 1.423L4 17h5m6 0a3 3 0 11-6 0m6 0H9" />
            </svg>
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] flex items-center justify-center">
                {totalNotifications > 99 ? '99+' : totalNotifications}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg border py-2 z-50">
              <div className="px-4 pb-2 border-b">
                <p className="text-sm font-semibold text-gray-700">Notifications</p>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notificationItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => {
                      navigate(item.path);
                      setShowNotifications(false);
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50"
                  >
                    <span className="text-gray-700">{item.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${item.count > 0 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                      {item.count}
                    </span>
                  </button>
                ))}
              </div>
              <div className="px-4 pt-2 border-t">
                <button
                  onClick={() => {
                    fetchNotifications();
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Refresh
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setShowDropdown(!showDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-2 sm:space-x-3 focus:outline-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm sm:text-base">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <button
                onClick={() => {
                  navigate('/profile');
                  setShowDropdown(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

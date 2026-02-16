import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { hasRole } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: 'DB', roles: ['admin', 'super_admin', 'manager'] },
    { path: '/bookings', label: 'Bookings', icon: 'BK', roles: ['admin', 'super_admin', 'manager'] },
    { path: '/orders', label: 'Orders', icon: 'OR', roles: ['admin', 'super_admin', 'manager'] },
    { path: '/products', label: 'Products', icon: 'PR', roles: ['admin', 'super_admin'] },
    { path: '/product-reviews', label: 'Product Reviews', icon: 'RV', roles: ['admin', 'super_admin'] },
    { path: '/product-categories', label: 'Product Categories', icon: 'PC', roles: ['admin', 'super_admin'] },
    { path: '/services', label: 'Services', icon: 'SV', roles: ['admin', 'super_admin'] },
    { path: '/service-pricing', label: 'Service Pricing', icon: 'SP', roles: ['admin', 'super_admin'] },
    { path: '/wash-packages', label: 'Wash Packages', icon: 'WP', roles: ['admin', 'super_admin'] },
    { path: '/wash-package-links', label: 'Package Links', icon: 'WL', roles: ['admin', 'super_admin'] },
    { path: '/wash-types', label: 'Wash Types', icon: 'WT', roles: ['admin', 'super_admin'] },
    { path: '/vehicle-categories', label: 'Vehicle Categories', icon: 'VC', roles: ['admin', 'super_admin'] },
    { path: '/blogs', label: 'Blogs', icon: 'BL', roles: ['admin', 'super_admin'] },
    { path: '/blog-categories', label: 'Blog Categories', icon: 'BC', roles: ['admin', 'super_admin'] },
    { path: '/tags', label: 'Tags', icon: 'TG', roles: ['admin', 'super_admin'] },
    { path: '/team', label: 'Team', icon: 'TM', roles: ['admin', 'super_admin'] },
    { path: '/faqs', label: 'FAQs', icon: 'FQ', roles: ['admin', 'super_admin'] },
    { path: '/faq-categories', label: 'FAQ Categories', icon: 'FC', roles: ['admin', 'super_admin'] },
    { path: '/testimonials', label: 'Testimonials', icon: 'TS', roles: ['admin', 'super_admin'] },
    { path: '/contacts', label: 'Contact Messages', icon: 'CT', roles: ['admin', 'super_admin', 'manager'] },
    { path: '/newsletter', label: 'Newsletter', icon: 'NL', roles: ['admin', 'super_admin'] },
    { path: '/users', label: 'Users', icon: 'US', roles: ['admin', 'super_admin'] },
    { path: '/profile', label: 'Profile', icon: 'PF', roles: ['admin', 'super_admin', 'manager'] },
  ];

  const filteredMenu = menuItems.filter((item) => hasRole(item.roles));

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={toggleSidebar}></div>
      )}
      <aside className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button onClick={toggleSidebar} className="lg:hidden text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="mt-6 px-4 overflow-y-auto sidebar-scrollbar" style={{ maxHeight: 'calc(100vh - 4rem)' }}>
          {filteredMenu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 mb-2 rounded-lg transition ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="mr-3 text-xs font-semibold w-6 text-center">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;

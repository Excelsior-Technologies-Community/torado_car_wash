import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaCalendarDay, FaPhoneAlt, FaShoppingCart, FaTimes, FaUserAlt } from 'react-icons/fa';

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const desktopNav = [
    { label: 'Home', to: '/' },
    {
      label: 'Pages',
      children: [
        { label: 'About Us', to: '/aboutus' },
        { label: 'Team', to: '/team' },
        { label: 'Testimonials', to: '/testimonials' },
        { label: 'Why Choose Us', to: '/whychooseus' },
        { label: 'Book Appointment', to: '/book' },
        { label: 'Portfolio', to: '/portfolio' },
        { label: 'FAQ', to: '/faqs' },
        { label: 'Terms & Conditions', to: '/termsandconditions' },
        { label: 'Privacy Policy', to: '/privacypolicy' },
        { label: 'Error Page', to: '/errorpage' },
      ],
    },
    {
      label: 'Shop',
      children: [
        { label: 'Shop', to: '/shop' },
        { label: 'Cart', to: '/cart' },
        { label: 'Wishlist', to: '/wishlist' },
        { label: 'Checkout', to: '/checkout' },
      ],
    },
    { label: 'Services', to: '/services' },
    {
      label: 'Blog',
      children: [
        { label: 'Blogs', to: '/blogs' },
        { label: 'Blog Grid', to: '/blogs/grid' },
        { label: 'Left Sidebar', to: '/blogs/left-sidebar' },
        { label: 'Right Sidebar', to: '/blogs/right-sidebar' },
      ],
    },
    { label: 'Contact', to: '/contactus' },
  ];

  const userLinks = [
    { label: 'My Profile', to: '/profile' },
    { label: 'My Bookings', to: '/my-bookings' },
    { label: 'My Orders', to: '/orders' },
    { label: 'Wishlist', to: '/wishlist' },
    { label: 'Cart', to: '/cart' },
    { label: 'Checkout', to: '/checkout' },
    { label: 'Login', to: '/login' },
    { label: 'Register', to: '/register' },
    { label: 'Forgot Password', to: '/forgot-password' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="h-16 lg:h-20 flex items-center justify-between gap-3">
            <Link to="/" className="shrink-0">
              <img src="/images/logo.svg" alt="Torado" className="h-9 sm:h-10 lg:h-12" />
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              {desktopNav.map((item) => (
                item.children ? (
                  <div key={item.label} className="relative group">
                    <span className="relative cursor-pointer text-gray-700 hover:text-orange-500 transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-200 group-hover:after:w-full">
                      {item.label}
                    </span>
                    <div className="absolute left-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="w-52 bg-white border rounded-md shadow-lg py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            className="block px-4 py-2 text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="relative text-gray-700 hover:text-orange-500 transition-colors duration-200 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-orange-500 after:transition-all after:duration-200 hover:after:w-full"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3 lg:gap-4">
              <div className="hidden xl:flex items-center gap-2 text-sm text-gray-700">
                <FaPhoneAlt className="text-orange-500" />
                <span>+91 000000000</span>
              </div>

              <div className="hidden lg:block relative group">
                <button className="text-gray-700 hover:text-orange-500 transition">
                  <FaUserAlt />
                </button>
                <div className="absolute right-0 top-full pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="w-48 bg-white border rounded-md shadow-lg py-2">
                    {userLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative lg:hidden">
                <button
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="text-gray-700 hover:text-orange-500 transition"
                >
                  <FaUserAlt />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-md shadow-lg py-2 z-50">
                    {userLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/cart" className="text-gray-700 hover:text-orange-500 transition">
                <FaShoppingCart />
              </Link>
              <Link
                to="/book"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-3 py-2 rounded-md hover:bg-orange-600 transition text-sm"
              >
                <span className="hidden xl:inline">Book Appointment</span>
                <FaCalendarDay />
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-10 h-10 rounded-md border border-gray-200 flex items-center justify-center text-gray-700"
              aria-label="Open menu"
            >
              <FaBars />
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-50" onClick={() => setMobileOpen(false)}></div>
          <aside className="fixed top-0 right-0 h-full w-[84%] max-w-sm bg-white z-50 shadow-xl flex flex-col">
            <div className="h-16 px-4 border-b flex items-center justify-between">
              <img src="/images/logo.svg" alt="Torado" className="h-9" />
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-md border border-gray-200 flex items-center justify-center text-gray-700"
                aria-label="Close menu"
              >
                <FaTimes />
              </button>
            </div>
            <div className="p-4 overflow-y-auto">
              <nav className="space-y-2">
                {desktopNav.map((item) => (
                  <div key={item.label}>
                    {item.to && (
                      <Link
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-orange-500 transition"
                      >
                        {item.label}
                      </Link>
                    )}
                    {item.children && (
                      <div className="ml-3 border-l pl-3 space-y-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-100 hover:text-orange-500 transition"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-2 text-sm">
                <Link to="/profile" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md bg-gray-100 text-center">
                  Profile
                </Link>
                <Link to="/cart" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md bg-gray-100 text-center">
                  Cart
                </Link>
                <Link to="/wishlist" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md bg-gray-100 text-center">
                  Wishlist
                </Link>
                <Link to="/my-bookings" onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md bg-gray-100 text-center">
                  Bookings
                </Link>
              </div>

              <div className="mt-6 pt-4 border-t">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Account</p>
                <div className="space-y-1">
                  {userLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-500 transition"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/book"
                onClick={() => setMobileOpen(false)}
                className="mt-4 inline-flex items-center justify-center gap-2 w-full bg-orange-500 text-white px-3 py-2 rounded-md hover:bg-orange-600 transition"
              >
                <span>Book Appointment</span>
                <FaCalendarDay />
              </Link>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

export default Header;

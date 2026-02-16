# Car Wash Admin Panel

Production-ready admin panel for managing the car wash system.

## Features

✅ Complete API Integration (All 20+ endpoints)
✅ JWT Authentication & Authorization
✅ Role-Based Access Control (RBAC)
✅ Full CRUD Operations for all entities
✅ Real-time Toast Notifications
✅ Responsive Design (Mobile-first)
✅ Loading & Error States
✅ Confirmation Dialogs
✅ File Upload Support
✅ Reusable Components
✅ Clean Architecture

## Tech Stack

- React 18
- React Router v6
- Tailwind CSS
- Axios
- React Toastify
- Vite

## Installation

```bash
cd admin
npm install
```

## Configuration

Create `.env` file:

```
VITE_API_URL=http://localhost:3000/api
```

## Run Development Server

```bash
npm run dev
```

Admin panel will run on: http://localhost:5174

## Build for Production

```bash
npm run build
```

## Project Structure

```
admin/
├── src/
│   ├── api/              # API services
│   │   ├── axios.js      # Axios instance with interceptors
│   │   ├── auth.js       # Auth API
│   │   └── index.js      # All API endpoints
│   ├── components/
│   │   ├── common/       # Reusable components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── CRUDPage.jsx
│   │   ├── forms/        # Form components
│   │   │   └── FormInput.jsx
│   │   ├── modals/       # Modal components
│   │   │   ├── Modal.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── tables/       # Table components
│   │   │   └── DataTable.jsx
│   │   └── PrivateRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── layouts/
│   │   └── AdminLayout.jsx
│   ├── pages/            # All page components
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Bookings.jsx
│   │   ├── Products.jsx
│   │   ├── Services.jsx
│   │   └── AllPages.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

## Integrated APIs

### Authentication
- POST /api/users/login
- POST /api/users/register
- GET /api/users/profile
- PUT /api/users/profile

### Bookings
- GET /api/bookings/admin/all
- GET /api/bookings/:id
- POST /api/bookings
- PATCH /api/bookings/:id/status
- PATCH /api/bookings/:id/cancel
- GET /api/bookings/vehicle-categories
- GET /api/bookings/available-slots
- GET /api/bookings/pricing

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PUT /api/products/:id
- DELETE /api/products/:id
- DELETE /api/products/images/:imageId
- GET /api/products/categories
- POST /api/products/categories

### Services
- GET /api/services
- GET /api/services/:id
- POST /api/services
- PUT /api/services/:id
- DELETE /api/services/:id

### Wash Packages
- GET /api/wash-packages
- GET /api/wash-packages/:id
- POST /api/wash-packages
- PUT /api/wash-packages/:id
- DELETE /api/wash-packages/:id
- GET /api/wash-packages/features/all
- POST /api/wash-packages/features
- PUT /api/wash-packages/features/:id
- DELETE /api/wash-packages/features/:id
- POST /api/wash-packages/features/assign
- DELETE /api/wash-packages/features/remove
- POST /api/wash-packages/pricing

### Wash Types
- GET /api/wash-types
- POST /api/wash-types
- PUT /api/wash-types/:id
- DELETE /api/wash-types/:id
- GET /api/wash-types/features
- POST /api/wash-types/features
- PUT /api/wash-types/features/:id
- DELETE /api/wash-types/features/:id
- POST /api/wash-types/features/assign
- DELETE /api/wash-types/features/remove

### Vehicle Categories
- GET /api/vehicle-categories
- POST /api/vehicle-categories
- PUT /api/vehicle-categories/:id
- DELETE /api/vehicle-categories/:id

### Orders
- GET /api/orders
- GET /api/orders/:id
- PUT /api/orders/:id/status
- PUT /api/orders/:id/cancel

### Blogs
- GET /api/blogs
- GET /api/blogs/:id
- POST /api/blogs
- PUT /api/blogs/:id
- DELETE /api/blogs/:id

### Blog Categories
- GET /api/blog-categories
- POST /api/blog-categories

### Tags
- GET /api/tags
- GET /api/tags/:id
- POST /api/tags
- PUT /api/tags/:id
- DELETE /api/tags/:id

### Team
- GET /api/team
- GET /api/team/:id
- POST /api/team
- PUT /api/team/:id
- DELETE /api/team/:id

### FAQs
- GET /api/faqs
- GET /api/faqs/:id
- GET /api/faqs/category/:categoryId
- POST /api/faqs
- PUT /api/faqs/:id
- DELETE /api/faqs/:id

### FAQ Categories
- GET /api/faq-categories
- GET /api/faq-categories/:id
- POST /api/faq-categories
- PUT /api/faq-categories/:id
- DELETE /api/faq-categories/:id

### Testimonials
- GET /api/testimonials
- GET /api/testimonials/:id
- GET /api/testimonials/approved
- POST /api/testimonials
- PUT /api/testimonials/:id
- DELETE /api/testimonials/:id

### Contact Messages
- GET /api/contact
- GET /api/contact/:id
- PATCH /api/contact/:id/read
- DELETE /api/contact/:id

### Newsletter
- GET /api/newsletter/subscribers
- POST /api/newsletter/subscribe
- GET /api/newsletter/unsubscribe/:token

### Cart (User Context)
- GET /api/cart
- POST /api/cart
- PUT /api/cart/:id
- DELETE /api/cart/:id
- DELETE /api/cart

### Wishlist (User Context)
- GET /api/wishlist
- POST /api/wishlist
- DELETE /api/wishlist/:id
- DELETE /api/wishlist

## User Roles

- **super_admin**: Full access to all features
- **admin**: Access to most features
- **manager**: Limited access (bookings, orders, contacts)
- **user**: No admin panel access

## Default Login

Use your existing backend user credentials with admin/super_admin role.

## Features Implemented

### Authentication & Authorization
- JWT token-based authentication
- Automatic token refresh
- Role-based route protection
- Secure logout

### Dashboard
- Statistics overview
- Total bookings, orders, products, services
- Real-time data

### CRUD Operations
- Create, Read, Update, Delete for all entities
- Form validation
- File upload support
- Confirmation dialogs
- Success/Error notifications

### UI/UX
- Responsive sidebar
- Collapsible navigation
- User profile dropdown
- Loading states
- Empty states
- Error handling
- Toast notifications

### Data Management
- Sortable tables
- Search functionality
- Pagination support
- Status updates
- Bulk operations

## Security Features

- XSS protection
- CSRF protection
- Input sanitization
- Secure token storage
- Role-based access control
- API error handling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary

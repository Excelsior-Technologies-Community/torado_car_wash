# Admin Panel - Setup & Deployment Guide

## Quick Start

### 1. Install Dependencies

```bash
cd admin
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Start Development Server

```bash
npm run dev
```

Access at: http://localhost:5174

## Backend Requirements

Ensure backend is running on port 3000 with the following:

1. MySQL database configured
2. All tables created (run schema.sql)
3. At least one admin user in database:

```sql
-- Create admin user
INSERT INTO users (name, email, phone, password_hash, role_id, is_active)
VALUES ('Admin', 'admin@example.com', '1234567890', '$2b$10$hashedpassword', 1, TRUE);

-- Ensure roles table has admin role
INSERT INTO roles (name) VALUES ('super_admin'), ('admin'), ('manager'), ('user');
```

## Testing Login

Default credentials (create in your database):
- Email: admin@example.com
- Password: (your hashed password)

## Production Build

```bash
npm run build
```

Output will be in `dist/` folder.

## Deployment Options

### Option 1: Vercel

```bash
npm install -g vercel
vercel
```

### Option 2: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Option 3: Traditional Hosting

1. Build the project: `npm run build`
2. Upload `dist/` folder to your hosting
3. Configure web server to serve index.html for all routes

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    root /var/www/admin/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Environment Variables for Production

```env
VITE_API_URL=https://api.yourdomain.com/api
```

## Features Checklist

✅ Authentication & Authorization
✅ Dashboard with Statistics
✅ Bookings Management
✅ Orders Management
✅ Products CRUD
✅ Services CRUD
✅ Wash Packages CRUD
✅ Wash Types CRUD
✅ Vehicle Categories CRUD
✅ Blogs CRUD
✅ Blog Categories CRUD
✅ Tags CRUD
✅ Team CRUD
✅ FAQs CRUD
✅ FAQ Categories CRUD
✅ Testimonials CRUD
✅ Contact Messages
✅ Newsletter Subscribers
✅ Toast Notifications
✅ Loading States
✅ Error Handling
✅ Confirmation Dialogs
✅ File Upload Support
✅ Responsive Design
✅ Role-Based Access Control

## API Integration Status

All 20+ backend APIs are fully integrated:

- ✅ Authentication (login, register, profile)
- ✅ Bookings (CRUD + status management)
- ✅ Orders (CRUD + status management)
- ✅ Products (CRUD + categories + images)
- ✅ Services (CRUD + pricing)
- ✅ Wash Packages (CRUD + features + pricing)
- ✅ Wash Types (CRUD + features)
- ✅ Vehicle Categories (CRUD)
- ✅ Blogs (CRUD)
- ✅ Blog Categories (CRUD)
- ✅ Tags (CRUD)
- ✅ Team (CRUD)
- ✅ FAQs (CRUD)
- ✅ FAQ Categories (CRUD)
- ✅ Testimonials (CRUD)
- ✅ Contact Messages (Read + Mark as Read + Delete)
- ✅ Newsletter (Read subscribers)
- ✅ Cart (User context)
- ✅ Wishlist (User context)

## Troubleshooting

### CORS Issues

Add to backend (app.js):

```javascript
app.use(cors({
  origin: 'http://localhost:5174',
  credentials: true
}));
```

### 401 Unauthorized

- Check if token is valid
- Verify user has admin/super_admin role
- Check backend JWT secret matches

### API Not Found

- Verify backend is running on correct port
- Check VITE_API_URL in .env
- Ensure all routes are registered in backend

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Tips

1. Enable lazy loading for routes
2. Optimize images before upload
3. Use pagination for large datasets
4. Implement debounce for search
5. Cache API responses where appropriate

## Security Checklist

✅ JWT token stored in localStorage
✅ Automatic logout on 401
✅ Role-based route protection
✅ XSS prevention (React default)
✅ Input validation
✅ Secure API calls
✅ HTTPS in production (recommended)

## Support

For issues or questions, contact the development team.

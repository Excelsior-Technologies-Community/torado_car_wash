# 📦 Models Directory

## Overview

This directory contains all database models for the Car Wash System. Each model represents a database table and provides methods to interact with it.

## Available Models

| Model | File | Purpose |
|-------|------|---------|
| BaseModel | `BaseModel.js` | Parent class with common CRUD operations |
| Booking | `Booking.js` | Manage bookings and appointments |
| Product | `Product.js` | Handle products and images |
| Order | `Order.js` | Process orders and order items |
| Cart | `Cart.js` | Shopping cart operations |
| User | `User.js` | User management |
| Service | `Service.js` | Car wash services |
| Blog | `Blog.js` | Blog posts and articles |

## Quick Start

### Import Models

```javascript
// Import single model
import { Booking } from './models/index.js';

// Import multiple models
import { Booking, Product, Order } from './models/index.js';
```

### Basic Usage

```javascript
// Find by ID
const booking = await Booking.findById(1);

// Find all with conditions
const activeProducts = await Product.findAll({ is_active: true });

// Create new record
const newUserId = await User.create({
  name: 'John Doe',
  email: 'john@example.com',
  password_hash: 'hashed_password',
  role_id: 2
});

// Update record
const updated = await Product.update(5, { price: 29.99 });

// Soft delete (set is_active = false)
await Product.softDelete(5);

// Hard delete (remove from database)
await Product.delete(5);
```

## BaseModel Methods

All models inherit these methods:

```javascript
// Find operations
await Model.findAll(conditions, limit, offset)
await Model.findById(id)

// Create
await Model.create(data)

// Update
await Model.update(id, data)

// Delete
await Model.delete(id)           // Hard delete
await Model.softDelete(id)       // Soft delete (is_active = false)

// Call stored procedure
await Model.callProcedure(procedureName, [param1, param2])
```

## Model-Specific Methods

### Booking Model

```javascript
// Stored procedure methods
await Booking.createBooking(userId, serviceId, vehicleId, date, time)
await Booking.getUserBookings(userId)
await Booking.updateStatus(bookingId, status, changedBy)
await Booking.getAvailableTimeSlots(date)

// Custom methods
await Booking.getBookingDetails(bookingId)
```

### Product Model

```javascript
await Product.getProductWithImages(productId)
await Product.getProducts(filters, limit, offset)
await Product.addImages(productId, imagePaths)
await Product.deleteImage(imageId)
```

### Order Model

```javascript
await Order.createOrder(userId, productIds, quantities)
await Order.getOrderWithItems(orderId)
await Order.getUserOrders(userId)
```

### Cart Model

```javascript
await Cart.addToCart(userId, productId, quantity)
await Cart.getUserCart(userId)
await Cart.updateQuantity(userId, productId, quantity)
await Cart.removeFromCart(userId, productId)
await Cart.clearCart(userId)
```

### User Model

```javascript
await User.findByEmail(email)
await User.getUserWithRole(userId)
await User.createUser(userData)
```

### Service Model

```javascript
await Service.getServicePricing(serviceId, vehicleCategoryId)
await Service.getServicesWithPricing()
await Service.getServicesByWashType(washTypeId)
```

### Blog Model

```javascript
await Blog.getBlogWithDetails(blogId)
await Blog.getPublishedBlogs(limit, offset)
await Blog.addTags(blogId, tagIds)
```

## Example Controller Using Models

```javascript
import { Booking, Service } from '../models/index.js';

// Get available services
export const getServices = async (req, res) => {
  try {
    const services = await Service.getServicesWithPricing();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create booking
export const createBooking = async (req, res) => {
  try {
    const { service_id, vehicle_category_id, booking_date, booking_time } = req.body;
    const user_id = req.user.id;

    const result = await Booking.createBooking(
      user_id,
      service_id,
      vehicle_category_id,
      booking_date,
      booking_time
    );

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user bookings
export const getMyBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const bookings = await Booking.getUserBookings(user_id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

## Benefits of Using Models

✅ **Cleaner Code**: Less SQL in controllers
✅ **Reusability**: Use same methods everywhere
✅ **Maintainability**: Change logic in one place
✅ **Type Safety**: Clear method signatures
✅ **Error Handling**: Centralized error management
✅ **Testing**: Easier to mock and test

## Migration from Direct SQL

### Before (Direct SQL)
```javascript
export const getProduct = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT p.*, pc.name as category_name,
     GROUP_CONCAT(pi.image_path) as images
     FROM products p
     LEFT JOIN product_categories pc ON p.category_id = pc.id
     LEFT JOIN product_images pi ON p.id = pi.product_id
     WHERE p.id = ?
     GROUP BY p.id`,
    [req.params.id]
  );
  res.json(rows[0]);
};
```

### After (Using Models)
```javascript
import { Product } from '../models/index.js';

export const getProduct = async (req, res) => {
  const product = await Product.getProductWithImages(req.params.id);
  res.json(product);
};
```

## Notes

- All models are singleton instances (exported as `export default new ModelName()`)
- Models automatically use the database connection pool from `config/db.js`
- Stored procedures are called through the `callProcedure` method
- Error handling should be done in controllers using try-catch

## Related Documentation

- `STORED_PROCEDURES_GUIDE.md` - General guide to stored procedures
- `PROJECT_STORED_PROCEDURES.md` - Project-specific stored procedures
- `stored_procedures.sql` - SQL file with all procedures

---

**Need help?** Check the documentation files or review the model source code for detailed method implementations.

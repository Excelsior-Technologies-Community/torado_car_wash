const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController.production');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validate = require('../middlewares/validator');
const bookingValidation = require('../validators/bookingValidator');

// User routes (protected)
router.post('/', authMiddleware, bookingValidation.create, validate, bookingController.createBooking);
router.get('/my-bookings', authMiddleware, bookingController.getUserBookings);
router.get('/:id', authMiddleware, bookingController.getBooking);
router.patch('/:id/cancel', authMiddleware, bookingController.cancelBooking);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, bookingController.getAllBookings);
router.patch('/:id/status', authMiddleware, adminMiddleware, bookingValidation.updateStatus, validate, bookingController.updateBookingStatus);

module.exports = router;

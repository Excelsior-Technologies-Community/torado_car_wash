const { body } = require('express-validator');

const bookingValidation = {
  create: [
    body('service_id').isInt().withMessage('Valid service ID is required'),
    body('vehicle_category_id').isInt().withMessage('Valid vehicle category ID is required'),
    body('booking_date').isDate().withMessage('Valid booking date is required'),
    body('booking_time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time format required (HH:MM)'),
    body('address').trim().notEmpty().withMessage('Address is required').isLength({ min: 10 }).withMessage('Address must be at least 10 characters')
  ],
  
  updateStatus: [
    body('status').isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status')
  ]
};

module.exports = bookingValidation;

const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const bookingService = require('../services/bookingService');

const bookingController = {
  // Create new booking
  createBooking: asyncHandler(async (req, res) => {
    const booking = await bookingService.createBooking(req.body, req.user.id);
    res.status(201).json(new ApiResponse(201, booking, 'Booking created successfully'));
  }),

  // Get user bookings
  getUserBookings: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    const result = await bookingService.getUserBookings(req.user.id, { 
      limit: parseInt(limit), 
      offset: parseInt(offset), 
      status 
    });
    
    res.status(200).json(new ApiResponse(200, result, 'Bookings retrieved successfully'));
  }),

  // Get single booking
  getBooking: asyncHandler(async (req, res) => {
    const booking = await bookingService.findById(req.params.id);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }
    if (booking.user_id !== req.user.id && req.user.role !== 'admin') {
      throw new ApiError(403, 'Access denied');
    }
    res.status(200).json(new ApiResponse(200, booking, 'Booking retrieved successfully'));
  }),

  // Cancel booking
  cancelBooking: asyncHandler(async (req, res) => {
    const booking = await bookingService.cancelBooking(req.params.id, req.user.id);
    res.status(200).json(new ApiResponse(200, booking, 'Booking cancelled successfully'));
  }),

  // Admin: Update booking status
  updateBookingStatus: asyncHandler(async (req, res) => {
    const { status } = req.body;
    const booking = await bookingService.update(req.params.id, { status });
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }
    res.status(200).json(new ApiResponse(200, booking, 'Booking status updated successfully'));
  }),

  // Admin: Get all bookings
  getAllBookings: asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    
    const conditions = status ? { status } : {};
    const bookings = await bookingService.findAll(conditions, { 
      limit: parseInt(limit), 
      offset: parseInt(offset) 
    });
    const total = await bookingService.count(conditions);
    
    res.status(200).json(new ApiResponse(200, {
      bookings,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    }, 'Bookings retrieved successfully'));
  })
};

module.exports = bookingController;

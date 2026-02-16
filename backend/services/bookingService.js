const BaseService = require('./BaseService');
const ApiError = require('../utils/ApiError');

class BookingService extends BaseService {
  constructor() {
    super('bookings');
  }

  async createBooking(bookingData, userId) {
    const { service_id, vehicle_category_id, booking_date, booking_time, address } = bookingData;

    // Validate service exists
    const [service] = await this.pool.query('SELECT id FROM services WHERE id = ? AND is_active = TRUE', [service_id]);
    if (service.length === 0) {
      throw new ApiError(404, 'Service not found or inactive');
    }

    // Check for duplicate booking
    const [existing] = await this.pool.query(
      'SELECT id FROM bookings WHERE user_id = ? AND booking_date = ? AND booking_time = ? AND status != "cancelled"',
      [userId, booking_date, booking_time]
    );
    if (existing.length > 0) {
      throw new ApiError(409, 'You already have a booking at this time');
    }

    return await this.create({
      user_id: userId,
      service_id,
      vehicle_category_id,
      booking_date,
      booking_time,
      address,
      status: 'pending'
    });
  }

  async getUserBookings(userId, options = {}) {
    const { limit = 10, offset = 0, status } = options;
    let query = `
      SELECT b.*, s.name as service_name, vc.name as vehicle_name
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      LEFT JOIN vehicle_categories vc ON b.vehicle_category_id = vc.id
      WHERE b.user_id = ?
    `;
    const params = [userId];

    if (status) {
      query += ' AND b.status = ?';
      params.push(status);
    }

    query += ' ORDER BY b.booking_date DESC, b.booking_time DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [bookings] = await this.pool.query(query, params);
    const [countResult] = await this.pool.query(
      'SELECT COUNT(*) as total FROM bookings WHERE user_id = ?' + (status ? ' AND status = ?' : ''),
      status ? [userId, status] : [userId]
    );

    return {
      bookings,
      total: countResult[0].total,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  async cancelBooking(bookingId, userId) {
    const booking = await this.findById(bookingId);
    if (!booking) {
      throw new ApiError(404, 'Booking not found');
    }
    if (booking.user_id !== userId) {
      throw new ApiError(403, 'You are not authorized to cancel this booking');
    }
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      throw new ApiError(400, `Cannot cancel ${booking.status} booking`);
    }

    return await this.update(bookingId, { status: 'cancelled' });
  }
}

module.exports = new BookingService();

import BaseModel from "./BaseModel.js";

class Booking extends BaseModel {
  constructor() {
    super("bookings");
  }

  async createBooking(userId, serviceId, vehicleCategoryId, bookingDate, bookingTime) {
    const [result] = await this.pool.query(
      `INSERT INTO bookings (user_id, service_id, vehicle_category_id, booking_date, booking_time, status) 
       VALUES (?, ?, ?, ?, ?, 'Pending')`,
      [userId, serviceId, vehicleCategoryId, bookingDate, bookingTime]
    );
    return { bookingId: result.insertId, message: 'Booking created successfully' };
  }

  async getUserBookings(userId) {
    const [rows] = await this.pool.query(
      `SELECT 
        b.id, 
        b.booking_date, 
        b.booking_time, 
        b.status,
        b.created_at,
        wp.name as service_name,
        vc.name as vehicle_category
      FROM bookings b
      LEFT JOIN wash_packages wp ON b.service_id = wp.id
      LEFT JOIN vehicle_categories vc ON b.vehicle_category_id = vc.id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC, b.booking_time DESC`,
      [userId]
    );
    return rows;
  }

  async updateStatus(bookingId, newStatus, changedBy) {
    await this.pool.query(
      `UPDATE bookings SET status = ? WHERE id = ?`,
      [newStatus, bookingId]
    );
    return { message: 'Booking status updated successfully' };
  }

  async getAvailableTimeSlots(date) {
    return await this.callProcedure("sp_get_available_time_slots", [date]);
  }

  async getBookingDetails(bookingId) {
    const [rows] = await this.pool.query(
      `SELECT b.*, u.name as user_name, u.email, u.phone,
       s.title as service_title, s.description as service_description,
       s.duration_minutes, vc.name as vehicle_category, 
       wt.name as wash_type, svp.final_price
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN services s ON b.service_id = s.id
       JOIN vehicle_categories vc ON b.vehicle_category_id = vc.id
       JOIN wash_types wt ON s.wash_type_id = wt.id
       LEFT JOIN service_vehicle_pricing svp ON s.id = svp.service_id AND vc.id = svp.vehicle_category_id
       WHERE b.id = ?`,
      [bookingId]
    );
    return rows[0];
  }
}

export default new Booking();

import BaseModel from "./BaseModel.js";

class Booking extends BaseModel {
  constructor() {
    super("bookings");
  }

  async createBooking(userId, serviceId, vehicleCategoryId, bookingDate, bookingTime) {
    return await this.callProcedure("sp_create_booking", [
      userId,
      serviceId,
      vehicleCategoryId,
      bookingDate,
      bookingTime,
    ]);
  }

  async getUserBookings(userId) {
    return await this.callProcedure("sp_get_user_bookings", [userId]);
  }

  async updateStatus(bookingId, newStatus, changedBy) {
    return await this.callProcedure("sp_update_booking_status", [
      bookingId,
      newStatus,
      changedBy,
    ]);
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

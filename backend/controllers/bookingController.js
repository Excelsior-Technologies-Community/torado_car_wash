import pool from "../config/db.js";

export const createBooking = async (req, res) => {
  try {
    const { service_id, vehicle_category_id, booking_date, booking_time } = req.body;
    const user_id = req.user.id;

    if (!service_id || !vehicle_category_id || !booking_date || !booking_time) {
      return res.status(400).json({ 
        message: "service_id, vehicle_category_id, booking_date, and booking_time are required" 
      });
    }

    // Validate service exists and is active
    const [services] = await pool.query(
      "SELECT id FROM services WHERE id = ? AND is_active = TRUE",
      [service_id]
    );
    if (services.length === 0) {
      return res.status(400).json({ message: "Invalid service" });
    }

    // Validate vehicle category exists and is active
    const [categories] = await pool.query(
      "SELECT id FROM vehicle_categories WHERE id = ? AND is_active = TRUE",
      [vehicle_category_id]
    );
    if (categories.length === 0) {
      return res.status(400).json({ message: "Invalid vehicle category" });
    }

    // Check if time slot is available
    const [existing] = await pool.query(
      "SELECT id FROM bookings WHERE booking_date = ? AND booking_time = ? AND status != 'Cancelled'",
      [booking_date, booking_time]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Time slot already booked" });
    }

    const [result] = await pool.query(
      "INSERT INTO bookings (user_id, service_id, vehicle_category_id, booking_date, booking_time) VALUES (?, ?, ?, ?, ?)",
      [user_id, service_id, vehicle_category_id, booking_date, booking_time]
    );

    res.status(201).json({
      id: result.insertId,
      message: "Booking created successfully"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    const [bookings] = await pool.query(`
      SELECT b.*, s.title as service_title, s.duration_minutes, 
             vc.name as vehicle_category, wt.name as wash_type,
             svp.final_price
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      JOIN vehicle_categories vc ON b.vehicle_category_id = vc.id
      JOIN wash_types wt ON s.wash_type_id = wt.id
      LEFT JOIN service_vehicle_pricing svp ON s.id = svp.service_id AND vc.id = svp.vehicle_category_id
      WHERE b.user_id = ?
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `, [user_id]);

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await pool.query(`
      SELECT b.*, u.name as user_name, u.email, u.phone,
             s.title as service_title, s.duration_minutes,
             vc.name as vehicle_category, wt.name as wash_type,
             svp.final_price
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      JOIN vehicle_categories vc ON b.vehicle_category_id = vc.id
      JOIN wash_types wt ON s.wash_type_id = wt.id
      LEFT JOIN service_vehicle_pricing svp ON s.id = svp.service_id AND vc.id = svp.vehicle_category_id
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `);

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const changed_by = req.user.id;

    if (!['Pending', 'Confirmed', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Get current booking
    const [currentBooking] = await pool.query(
      "SELECT status FROM bookings WHERE id = ?",
      [id]
    );
    
    if (currentBooking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const old_status = currentBooking[0].status;

    // Update booking status
    await pool.query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [status, id]
    );

    // Add to status history
    await pool.query(
      "INSERT INTO booking_status_history (booking_id, old_status, new_status, changed_by) VALUES (?, ?, ?, ?)",
      [id, old_status, status, changed_by]
    );

    res.json({ message: "Booking status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Get booked time slots for the date
    const [bookedSlots] = await pool.query(
      "SELECT booking_time FROM bookings WHERE booking_date = ? AND status != 'Cancelled'",
      [date]
    );

    // Generate available time slots (9 AM to 6 PM, 1-hour intervals)
    const allSlots = [];
    for (let hour = 9; hour <= 18; hour++) {
      allSlots.push(`${hour.toString().padStart(2, '0')}:00:00`);
    }

    const bookedTimes = bookedSlots.map(slot => slot.booking_time);
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    res.json({ availableSlots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch available time slots" });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [booking] = await pool.query(`
      SELECT b.*, u.name as user_name, u.email, u.phone,
             s.title as service_title, s.description as service_description,
             s.duration_minutes, vc.name as vehicle_category, 
             wt.name as wash_type, svp.final_price
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      JOIN vehicle_categories vc ON b.vehicle_category_id = vc.id
      JOIN wash_types wt ON s.wash_type_id = wt.id
      LEFT JOIN service_vehicle_pricing svp ON s.id = svp.service_id AND vc.id = svp.vehicle_category_id
      WHERE b.id = ?
    `, [id]);

    if (booking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Get status history
    const [history] = await pool.query(`
      SELECT bsh.*, u.name as changed_by_name
      FROM booking_status_history bsh
      LEFT JOIN users u ON bsh.changed_by = u.id
      WHERE bsh.booking_id = ?
      ORDER BY bsh.changed_at DESC
    `, [id]);

    res.json({
      booking: booking[0],
      statusHistory: history
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch booking details" });
  }
};

export const getVehicleCategories = async (req, res) => {
  try {
    const [categories] = await pool.query(
      "SELECT * FROM vehicle_categories WHERE is_active = TRUE ORDER BY name"
    );
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch vehicle categories" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Get current booking and verify ownership
    const [currentBooking] = await pool.query(
      "SELECT status, user_id FROM bookings WHERE id = ?",
      [id]
    );
    
    if (currentBooking.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (currentBooking[0].user_id !== user_id) {
      return res.status(403).json({ message: "Unauthorized to cancel this booking" });
    }

    if (currentBooking[0].status === 'Cancelled') {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    if (currentBooking[0].status === 'Completed') {
      return res.status(400).json({ message: "Cannot cancel completed booking" });
    }

    const old_status = currentBooking[0].status;

    // Update booking status to cancelled
    await pool.query(
      "UPDATE bookings SET status = 'Cancelled' WHERE id = ?",
      [id]
    );

    // Add to status history
    await pool.query(
      "INSERT INTO booking_status_history (booking_id, old_status, new_status, changed_by) VALUES (?, ?, 'Cancelled', ?)",
      [id, old_status, user_id]
    );

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};
export const getServicePricing = async (req, res) => {
  try {
    const { service_id, vehicle_category_id } = req.query;
    
    if (!service_id || !vehicle_category_id) {
      return res.status(400).json({ message: "service_id and vehicle_category_id are required" });
    }

    const [pricing] = await pool.query(
      "SELECT final_price FROM service_vehicle_pricing WHERE service_id = ? AND vehicle_category_id = ?",
      [service_id, vehicle_category_id]
    );

    if (pricing.length === 0) {
      return res.status(404).json({ message: "Pricing not found" });
    }

    res.json({ price: pricing[0].final_price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pricing" });
  }
};
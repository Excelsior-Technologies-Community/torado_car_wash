// ============================================
// EXAMPLE: Booking Controller Using Models
// ============================================
// This file shows how to refactor your existing
// bookingController.js to use the new models

import { Booking, Service } from "../models/index.js";

// ============================================
// 1. CREATE BOOKING (Using Stored Procedure)
// ============================================
export const createBooking = async (req, res) => {
  try {
    const { service_id, vehicle_category_id, booking_date, booking_time } = req.body;
    const user_id = req.user.id;

    // Validate required fields
    if (!service_id || !vehicle_category_id || !booking_date || !booking_time) {
      return res.status(400).json({
        message: "service_id, vehicle_category_id, booking_date, and booking_time are required",
      });
    }

    // Call stored procedure through model
    const result = await Booking.createBooking(
      user_id,
      service_id,
      vehicle_category_id,
      booking_date,
      booking_time
    );

    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    // Stored procedure errors come through here
    res.status(500).json({ message: error.message });
  }
};

// ============================================
// 2. GET USER BOOKINGS (Using Stored Procedure)
// ============================================
export const getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Call stored procedure through model
    const bookings = await Booking.getUserBookings(user_id);

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ============================================
// 3. GET ALL BOOKINGS (Using Base Model)
// ============================================
export const getAllBookings = async (req, res) => {
  try {
    // Using base model method
    const bookings = await Booking.findAll();

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ============================================
// 4. UPDATE BOOKING STATUS (Using Stored Procedure)
// ============================================
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const changed_by = req.user.id;

    // Validate status
    if (!["Pending", "Confirmed", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Call stored procedure through model
    const result = await Booking.updateStatus(id, status, changed_by);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update booking status" });
  }
};

// ============================================
// 5. GET AVAILABLE TIME SLOTS (Using Stored Procedure)
// ============================================
export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Call stored procedure through model
    const slots = await Booking.getAvailableTimeSlots(date);

    res.json({ availableSlots: slots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch available time slots" });
  }
};

// ============================================
// 6. GET BOOKING DETAILS (Using Custom Model Method)
// ============================================
export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Using custom model method
    const booking = await Booking.getBookingDetails(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ booking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch booking details" });
  }
};

// ============================================
// 7. CANCEL BOOKING (Using Base Model)
// ============================================
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    // Get current booking using base model
    const currentBooking = await Booking.findById(id);

    if (!currentBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Verify ownership
    if (currentBooking.user_id !== user_id) {
      return res.status(403).json({ message: "Unauthorized to cancel this booking" });
    }

    // Validate status
    if (currentBooking.status === "Cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    if (currentBooking.status === "Completed") {
      return res.status(400).json({ message: "Cannot cancel completed booking" });
    }

    // Update using stored procedure
    await Booking.updateStatus(id, "Cancelled", user_id);

    res.json({ message: "Booking cancelled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to cancel booking" });
  }
};

// ============================================
// 8. GET SERVICE PRICING (Using Stored Procedure)
// ============================================
export const getServicePricing = async (req, res) => {
  try {
    const { service_id, vehicle_category_id } = req.query;

    if (!service_id || !vehicle_category_id) {
      return res.status(400).json({
        message: "service_id and vehicle_category_id are required",
      });
    }

    // Call stored procedure through Service model
    const pricing = await Service.getServicePricing(service_id, vehicle_category_id);

    if (!pricing || pricing.length === 0) {
      return res.status(404).json({ message: "Pricing not found" });
    }

    res.json({ price: pricing[0].final_price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch pricing" });
  }
};

// ============================================
// COMPARISON: Before vs After
// ============================================

/*
BEFORE (Direct SQL):
-------------------
export const createBooking = async (req, res) => {
  const [services] = await pool.query(
    "SELECT id FROM services WHERE id = ? AND is_active = TRUE",
    [service_id]
  );
  
  const [categories] = await pool.query(
    "SELECT id FROM vehicle_categories WHERE id = ? AND is_active = TRUE",
    [vehicle_category_id]
  );
  
  const [existing] = await pool.query(
    "SELECT id FROM bookings WHERE booking_date = ? AND booking_time = ?",
    [booking_date, booking_time]
  );
  
  const [result] = await pool.query(
    "INSERT INTO bookings (...) VALUES (...)",
    [...]
  );
};

AFTER (Using Models):
--------------------
export const createBooking = async (req, res) => {
  const result = await Booking.createBooking(
    user_id,
    service_id,
    vehicle_category_id,
    booking_date,
    booking_time
  );
};

BENEFITS:
---------
✅ Less code (5 lines vs 20+ lines)
✅ All validation in stored procedure
✅ Easier to read and maintain
✅ Reusable across controllers
✅ Centralized error handling
*/

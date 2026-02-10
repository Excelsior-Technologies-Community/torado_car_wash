import { Booking, Service, VehicleCategory } from "../models/index.js";

export const createBooking = async (req, res) => {
  try {
    const { service_id, vehicle_category_id, booking_date, booking_time } = req.body;
    const user_id = req.user.id;

    if (!service_id || !vehicle_category_id || !booking_date || !booking_time) {
      return res.status(400).json({ 
        message: "service_id, vehicle_category_id, booking_date, and booking_time are required" 
      });
    }

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
    res.status(500).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;
    const bookings = await Booking.getUserBookings(user_id);
    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll();
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

    const result = await Booking.updateStatus(id, status, changed_by);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableTimeSlots = async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const slots = await Booking.getAvailableTimeSlots(date);
    res.json({ availableSlots: slots });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch available time slots" });
  }
};

export const getBookingDetails = async (req, res) => {
  try {
    const { id } = req.params;
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

export const getVehicleCategories = async (req, res) => {
  try {
    const categories = await VehicleCategory.getActiveCategories();
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

    const currentBooking = await Booking.findById(id);
    
    if (!currentBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (currentBooking.user_id !== user_id) {
      return res.status(403).json({ message: "Unauthorized to cancel this booking" });
    }

    if (currentBooking.status === 'Cancelled') {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    if (currentBooking.status === 'Completed') {
      return res.status(400).json({ message: "Cannot cancel completed booking" });
    }

    await Booking.updateStatus(id, 'Cancelled', user_id);
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
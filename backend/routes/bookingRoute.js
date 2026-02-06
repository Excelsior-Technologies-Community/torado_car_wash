import express from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  getAvailableTimeSlots,
  getBookingDetails,
  getVehicleCategories,
  getServicePricing,
  cancelBooking
} from "../controllers/bookingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Public routes
router.get("/vehicle-categories", getVehicleCategories);
router.get("/available-slots", getAvailableTimeSlots);
router.get("/pricing", getServicePricing);

// Protected routes (require authentication)
router.post("/", authMiddleware, createBooking);
router.get("/my-bookings", authMiddleware, getUserBookings);
router.patch("/:id/cancel", authMiddleware, cancelBooking);
router.get("/:id", authMiddleware, getBookingDetails);

// Admin routes
router.get("/admin/all", authMiddleware, adminMiddleware, getAllBookings);
router.patch("/:id/status", authMiddleware, adminMiddleware, updateBookingStatus);

export default router;
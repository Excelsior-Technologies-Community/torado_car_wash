import express from "express";
import {
  createServicePricing,
  getServicePricing,
  getAllServicePricing,
  updateServicePricing,
  deleteServicePricing
} from "../controllers/servicePricingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Public routes
router.get("/service/:service_id", getServicePricing);

// Admin routes
router.get("/", authMiddleware, adminMiddleware, getAllServicePricing);
router.post("/", authMiddleware, adminMiddleware, createServicePricing);
router.put("/:id", authMiddleware, adminMiddleware, updateServicePricing);
router.delete("/:id", authMiddleware, adminMiddleware, deleteServicePricing);

export default router;
import express from "express";
import { checkout, getOrders, getAllOrders, getOrderDetails, updateOrderStatus, cancelOrder } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// User routes
router.post("/checkout", authMiddleware, checkout);
router.get("/", authMiddleware, getOrders);
router.get("/:id", authMiddleware, getOrderDetails);
router.put("/:id/cancel", authMiddleware, cancelOrder);

// Admin routes
router.get("/admin/all", authMiddleware, adminMiddleware, getAllOrders);
router.put("/:id/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
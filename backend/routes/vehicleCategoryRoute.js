import express from "express";
import {
  createVehicleCategory,
  getAllVehicleCategories,
  updateVehicleCategory,
  deleteVehicleCategory
} from "../controllers/vehicleCategoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllVehicleCategories);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, upload.single('image'), createVehicleCategory);
router.put("/:id", authMiddleware, adminMiddleware, upload.single('image'), updateVehicleCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteVehicleCategory);

export default router;
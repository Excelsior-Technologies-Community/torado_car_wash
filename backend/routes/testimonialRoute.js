import express from "express";
import {
  createTestimonial,
  getAllTestimonials,
  getApprovedTestimonials,
  getSingleTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/approved", getApprovedTestimonials);
router.post("/", upload.single("image"), createTestimonial);

// Admin routes
router.get("/", getAllTestimonials);
router.get("/:id", getSingleTestimonial);
router.put("/:id", upload.single("image"), updateTestimonial);
router.delete("/:id", deleteTestimonial);

export default router;

import express from "express";
import {
  createFaq,
  getAllFaqs,
  getFaqsByCategory,
  getSingleFaq,
  updateFaq,
  deleteFaq,
} from "../controllers/faqController.js";

const router = express.Router();

// Public routes
router.get("/", getAllFaqs);
router.get("/category/:categoryId", getFaqsByCategory);
router.get("/:id", getSingleFaq);

// Admin routes
router.post("/", createFaq);
router.put("/:id", updateFaq);
router.delete("/:id", deleteFaq);

export default router;
import express from "express";
import {
  createFaqCategory,
  getAllFaqCategories,
  getSingleFaqCategory,
  updateFaqCategory,
  deleteFaqCategory,
} from "../controllers/faqCategoryController.js";

const router = express.Router();

// Public routes
router.get("/", getAllFaqCategories);
router.get("/:id", getSingleFaqCategory);

// Admin routes
router.post("/", createFaqCategory);
router.put("/:id", updateFaqCategory);
router.delete("/:id", deleteFaqCategory);

export default router;
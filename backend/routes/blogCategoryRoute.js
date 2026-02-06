import express from "express";
import { createCategory, getCategories } from "../controllers/blogCategoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();
router.get("/", getCategories);
router.post("/", authMiddleware, adminMiddleware, createCategory);

export default router;
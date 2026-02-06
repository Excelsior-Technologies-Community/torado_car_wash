import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { handleUploadError } from "../middlewares/uploadErrorMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  createCategory,
  getCategories
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/categories", getCategories);
router.get("/:id", getProduct);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, upload.array("images", 5), handleUploadError, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, upload.array("images", 5), handleUploadError, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);
router.delete("/images/:imageId", authMiddleware, adminMiddleware, deleteProductImage);
router.post("/categories", authMiddleware, adminMiddleware, createCategory);

export default router;
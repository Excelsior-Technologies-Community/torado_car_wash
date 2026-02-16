import express from "express";
import { upload } from "../middlewares/uploadMiddleware.js";
import { handleUploadError } from "../middlewares/uploadErrorMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import {
  createProduct,
  getProducts,
  getAdminProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getProductReviews,
  createProductReview,
  getPendingProductReviews,
  approveProductReview,
  rejectProductReview,
  createCategory,
  getCategories,
  getAllCategoriesAdmin,
  updateCategory,
  deleteCategory
} from "../controllers/productController.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/admin/all", authMiddleware, adminMiddleware, getAdminProducts);
router.get("/categories", getCategories);
router.get("/categories/admin/all", authMiddleware, adminMiddleware, getAllCategoriesAdmin);
router.put("/categories/:id", authMiddleware, adminMiddleware, updateCategory);
router.delete("/categories/:id", authMiddleware, adminMiddleware, deleteCategory);
router.get("/reviews/pending", authMiddleware, adminMiddleware, getPendingProductReviews);
router.patch("/reviews/:reviewId/approve", authMiddleware, adminMiddleware, approveProductReview);
router.delete("/reviews/:reviewId", authMiddleware, adminMiddleware, rejectProductReview);
router.get("/:id/reviews", getProductReviews);
router.get("/:id", getProduct);

// Admin routes
router.post("/", authMiddleware, adminMiddleware, upload.array("images", 5), handleUploadError, createProduct);
router.put("/:id", authMiddleware, adminMiddleware, upload.array("images", 5), handleUploadError, updateProduct);
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);
router.delete("/images/:imageId", authMiddleware, adminMiddleware, deleteProductImage);
router.post("/categories", authMiddleware, adminMiddleware, createCategory);
router.post("/:id/reviews", authMiddleware, createProductReview);

export default router;

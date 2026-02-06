import express from "express";
import * as blogController from "../controllers/blogController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

// Public
router.get("/", blogController.getBlogs);
router.get("/:id", blogController.getBlogById);

// Admin
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  blogController.createBlog,
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  blogController.updateBlog,
);

router.delete("/:id", authMiddleware, adminMiddleware, blogController.deleteBlog);

export default router;

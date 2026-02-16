import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";
import {
  getAllPages,
  createPage,
  updatePage,
  deletePage,
  getSiteSettings,
  upsertSiteSettings,
} from "../controllers/contentController.js";

const router = express.Router();

router.get("/pages", authMiddleware, adminMiddleware, getAllPages);
router.post("/pages", authMiddleware, adminMiddleware, createPage);
router.put("/pages/:id", authMiddleware, adminMiddleware, updatePage);
router.delete("/pages/:id", authMiddleware, adminMiddleware, deletePage);

router.get("/site-settings", authMiddleware, adminMiddleware, getSiteSettings);
router.post("/site-settings", authMiddleware, adminMiddleware, upsertSiteSettings);
router.put("/site-settings", authMiddleware, adminMiddleware, upsertSiteSettings);

export default router;

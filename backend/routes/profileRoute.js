import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, upload.single("profile_image"), updateProfile);

export default router;

import express from "express";
import {
  createTeamMember,
  getAllTeamMembers,
  getSingleTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controllers/teamController.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllTeamMembers);
router.get("/:id", getSingleTeamMember);

// Admin routes
router.post("/", upload.single("image"), createTeamMember);
router.put("/:id", upload.single("image"), updateTeamMember);
router.delete("/:id", deleteTeamMember);

export default router;
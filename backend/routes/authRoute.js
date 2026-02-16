import express from "express";
import {
  login,
  register,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";
import {
  getAllUsers,
  getRoles,
  createUserByAdmin,
  updateUserByAdmin,
  deactivateUserByAdmin,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import adminMiddleware from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

router.get("/roles", authMiddleware, adminMiddleware, getRoles);
router.get("/admin", authMiddleware, adminMiddleware, getAllUsers);
router.post("/admin", authMiddleware, adminMiddleware, createUserByAdmin);
router.put("/admin/:id", authMiddleware, adminMiddleware, updateUserByAdmin);
router.delete("/admin/:id", authMiddleware, adminMiddleware, deactivateUserByAdmin);

export default router;
    

import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist
} from "../controllers/wishlistController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", addToWishlist);
router.get("/", getWishlist);
router.delete("/:id", removeFromWishlist);
router.delete("/", clearWishlist);

export default router;
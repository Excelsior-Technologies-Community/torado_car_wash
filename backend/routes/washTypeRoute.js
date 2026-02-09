import express from "express";
import { 
  createWashType, 
  getAllWashTypes, 
  updateWashType, 
  deleteWashType,
  createFeature, 
  getAllFeatures,
  updateFeature,
  deleteFeature,
  addFeatureToWashType,
  removeFeatureFromWashType
} from "../controllers/washTypeController.js";

const router = express.Router();

// Wash Type routes
router.get("/", getAllWashTypes);
router.post("/", createWashType);
router.put("/:id", updateWashType);
router.delete("/:id", deleteWashType);

// Feature routes
router.get("/features", getAllFeatures);
router.post("/features", createFeature);
router.put("/features/:id", updateFeature);
router.delete("/features/:id", deleteFeature);

// Assign/Remove features
router.post("/features/assign", addFeatureToWashType);
router.delete("/features/remove", removeFeatureFromWashType);

export default router;
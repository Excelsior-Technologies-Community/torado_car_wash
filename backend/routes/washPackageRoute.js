import express from "express";
import {
  getAllWashPackages,
  getSingleWashPackage,
  createWashPackage,
  updateWashPackage,
  deleteWashPackage,
  getAllWashFeatures,
  createWashFeature,
  updateWashFeature,
  deleteWashFeature,
  addFeatureToPackage,
  removeFeatureFromPackage,
  setPackagePricing
} from "../controllers/washPackageController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { handleUploadError } from "../middlewares/uploadErrorMiddleware.js";

const router = express.Router();

// Wash Package routes
router.get("/", getAllWashPackages);
router.get("/:id", getSingleWashPackage);
router.post("/", upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }]), handleUploadError, createWashPackage);
router.put("/:id", upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'image', maxCount: 1 }]), handleUploadError, updateWashPackage);
router.delete("/:id", deleteWashPackage);

// Wash Feature routes
router.get("/features/all", getAllWashFeatures);
router.post("/features", createWashFeature);
router.put("/features/:id", updateWashFeature);
router.delete("/features/:id", deleteWashFeature);

// Assign/Remove features
router.post("/features/assign", addFeatureToPackage);
router.delete("/features/remove", removeFeatureFromPackage);

// Pricing
router.post("/pricing", setPackagePricing);

export default router;

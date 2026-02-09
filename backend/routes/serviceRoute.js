import express from "express";
import {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService
} from "../controllers/serviceController.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import { handleUploadError } from "../middlewares/uploadErrorMiddleware.js";

const router = express.Router();

router.get("/", getAllServices);
router.get("/:id", getSingleService);
router.post("/", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), handleUploadError, createService);
router.put("/:id", upload.fields([{ name: 'image', maxCount: 1 }, { name: 'icon', maxCount: 1 }]), handleUploadError, updateService);
router.delete("/:id", deleteService);

export default router;

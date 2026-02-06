import express from "express";
import { createWashType, getAllWashTypes } from "../controllers/washTypeController.js";

const router = express.Router();

router.get("/", getAllWashTypes);
router.post("/", createWashType);

export default router;
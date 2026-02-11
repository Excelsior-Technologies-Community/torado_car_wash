import express from 'express';
import { subscribe, unsubscribe, getAllSubscribers } from '../controllers/newsletterController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.get('/unsubscribe/:token', unsubscribe);
router.get('/subscribers', authMiddleware, adminMiddleware, getAllSubscribers);

export default router;

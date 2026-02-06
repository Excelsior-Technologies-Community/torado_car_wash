import express from 'express';
import { createContact, getAllContacts, getContact, markAsRead, deleteContact } from '../controllers/contactController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import adminMiddleware from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Public route - submit contact form
router.post('/', createContact);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllContacts);
router.get('/:id', authMiddleware, adminMiddleware, getContact);
router.patch('/:id/read', authMiddleware, adminMiddleware, markAsRead);
router.delete('/:id', authMiddleware, adminMiddleware, deleteContact);

export default router;
import express from 'express';
import { sendMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Chowkidar (Auth Protection): Sirf logged-in user hi chat access kar sake
router.use(protect);

// POST /api/chat
router.post('/', sendMessage);

export default router;


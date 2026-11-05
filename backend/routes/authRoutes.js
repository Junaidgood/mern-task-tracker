import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
} from '../controllers/authController.js';

const router = express.Router();

// 1. Register Route: POST /api/auth/register
router.post('/register', register);

// 2. Login Route: POST /api/auth/login
router.post('/login', login);

// 3. Logout Route: POST /api/auth/logout
router.post('/logout', logout);

// 4. Current User Route: GET /api/auth/me
router.get('/me', getMe);

export default router;

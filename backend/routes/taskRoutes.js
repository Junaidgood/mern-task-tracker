import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Chowkidar (Middleware): Is router ki saari routes ko protect kar do
router.use(protect);

// GET /api/tasks & POST /api/tasks
router.route('/')
  .get(getTasks)
  .post(createTask);

// PATCH /api/tasks/:id & DELETE /api/tasks/:id
router.route('/:id')
  .patch(updateTask)
  .delete(deleteTask);

export default router;

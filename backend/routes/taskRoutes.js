const express = require('express');
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

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

module.exports = router;

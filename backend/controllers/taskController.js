import {
  listTasks,
  createTask as createTaskService,
  updateTask as updateTaskService,
  deleteTask as deleteTaskService,
} from '../services/taskService.js';

// @desc    Get logged-in user's tasks with pagination
// @route   GET /api/tasks?page=1&limit=5
// @access  Private (Protected)
export const getTasks = async (req, res, next) => {
  try {
    const result = await listTasks(req.session.userId, {
      page: req.query.page,
      limit: req.query.limit,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task for logged-in user
// @route   POST /api/tasks
// @access  Private (Protected)
export const createTask = async (req, res, next) => {
  try {
    const newTask = await createTaskService(req.session.userId, req.body.title);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task (completion status or title)
// @route   PATCH /api/tasks/:id
// @access  Private (Protected)
export const updateTask = async (req, res, next) => {
  try {
    const updatedTask = await updateTaskService(
      req.session.userId,
      req.params.id,
      req.body
    );
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task (owner only)
// @route   DELETE /api/tasks/:id
// @access  Private (Protected)
export const deleteTask = async (req, res, next) => {
  try {
    await deleteTaskService(req.session.userId, req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

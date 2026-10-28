const Task = require('../models/taskModel');

// @desc    Get all tasks with pagination
// @route   GET /api/tasks?page=1&limit=5
// @access  Public
const getTasks = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 5);
    const skip = (page - 1) * limit;

    const totalTasks = await Task.countDocuments();
    const totalPages = Math.ceil(totalTasks / limit) || 1;

    // Latest tasks pehle dikhane ke liye sort({ createdAt: -1 })
    const tasks = await Task.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      tasks,
      page,
      limit,
      totalPages,
      totalTasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res, next) => {
  try {
    const { title } = req.body;

    // Blank title validation (reject blank / space-only titles)
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Task title cannot be blank' });
    }

    const newTask = await Task.create({
      title: title.trim(),
    });

    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update task completion status
// @route   PATCH /api/tasks/:id
// @access  Public
const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
      return res.status(400).json({ message: "'completed' field must be true or false" });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.completed = completed;
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();

    // 204 No Content: mentor contract requires 204 with no body
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};

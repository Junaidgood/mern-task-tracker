import Task from '../models/taskModel.js';

// @desc    Get logged-in user's tasks with pagination
// @route   GET /api/tasks?page=1&limit=5
// @access  Private (Protected)
export const getTasks = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 5);
    const skip = (page - 1) * limit;

    // Filter by logged-in user only
    const filter = { user: req.session.userId };

    const totalTasks = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalTasks / limit) || 1;

    // Latest tasks pehle dikhane ke liye sort({ createdAt: -1 })
    const tasks = await Task.find(filter)
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

// @desc    Create a new task for logged-in user
// @route   POST /api/tasks
// @access  Private (Protected)
export const createTask = async (req, res, next) => {
  try {
    const { title } = req.body;

    // Blank title validation (reject blank / space-only titles)
    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({ message: 'Task title cannot be blank' });
    }

    // Task ke sath user ki id save ki
    const newTask = await Task.create({
      title: title.trim(),
      user: req.session.userId,
    });

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
    const { id } = req.params;
    const { completed, title } = req.body;

    // Kuch bhi provide nahi kiya to reject karo
    if (completed === undefined && title === undefined) {
      return res.status(400).json({ message: 'Please provide title or completed status to update' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ownership check: sirf task ka owner hi update kar sakta hai
    if (task.user.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Not authorized to modify this task' });
    }

    // Title update validation
    if (title !== undefined) {
      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ message: 'Task title cannot be blank' });
      }
      task.title = title.trim();
    }

    // Completed status update validation
    if (completed !== undefined) {
      if (typeof completed !== 'boolean') {
        return res.status(400).json({ message: "'completed' field must be true or false" });
      }
      task.completed = completed;
    }

    const updatedTask = await task.save();

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
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Ownership check: sirf task ka owner hi delete kar sakta hai
    if (task.user.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await task.deleteOne();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

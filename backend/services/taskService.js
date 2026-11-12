import Task from '../models/taskModel.js';

const fail = (msg, code) => Object.assign(new Error(msg), { statusCode: code });

export const listTasks = async (userId, { page = 1, limit = 5 } = {}) => {
  const safePage = Math.max(1, parseInt(page, 10) || 1);
  const safeLimit = Math.max(1, parseInt(limit, 10) || 5);
  const filter = { user: userId };

  const totalTasks = await Task.countDocuments(filter);
  const totalPages = Math.ceil(totalTasks / safeLimit) || 1;
  const tasks = await Task.find(filter)
    .sort({ createdAt: -1 })
    .skip((safePage - 1) * safeLimit)
    .limit(safeLimit);

  return { tasks, page: safePage, limit: safeLimit, totalPages, totalTasks };
};

export const createTask = async (userId, title) => {
  if (!title?.trim()) throw fail('Task title cannot be blank', 400);
  return Task.create({ title: title.trim(), user: userId });
};

export const updateTask = async (userId, taskId, { completed, title }) => {
  if (completed === undefined && title === undefined) {
    throw fail('Please provide title or completed status to update', 400);
  }
  const task = await Task.findById(taskId);
  if (!task) throw fail('Task not found', 404);
  if (task.user.toString() !== userId.toString()) throw fail('Not authorized to modify this task', 403);

  if (title !== undefined) {
    if (!title?.trim()) throw fail('Task title cannot be blank', 400);
    task.title = title.trim();
  }
  if (completed !== undefined) {
    if (typeof completed !== 'boolean') throw fail("'completed' field must be true or false", 400);
    task.completed = completed;
  }
  return task.save();
};

export const deleteTask = async (userId, taskId) => {
  const task = await Task.findById(taskId);
  if (!task) throw fail('Task not found', 404);
  if (task.user.toString() !== userId.toString()) throw fail('Not authorized to delete this task', 403);
  await task.deleteOne();
  return { deletedId: taskId };
};

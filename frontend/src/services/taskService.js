import axiosClient from '../api/axiosClient';

// 1. Get logged-in user's tasks
export const getTasks = async (page = 1, limit = 5) => {
  const res = await axiosClient.get(`/tasks?page=${page}&limit=${limit}`);
  return res.data;
};

// 2. Create task
export const createTask = async (title) => {
  const res = await axiosClient.post('/tasks', { title });
  return res.data;
};

// 3. Update task (title and/or completed)
export const updateTask = async (id, updates) => {
  const res = await axiosClient.patch(`/tasks/${id}`, updates);
  return res.data;
};

// 4. Update task completion status (helper wrapper)
export const updateTaskStatus = async (id, completed) => {
  return updateTask(id, { completed });
};

// 5. Delete task
export const deleteTask = async (id) => {
  const res = await axiosClient.delete(`/tasks/${id}`);
  return res.data;
};

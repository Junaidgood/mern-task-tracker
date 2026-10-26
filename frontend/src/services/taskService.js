// Backend API ka Base URL
const API_URL = 'http://localhost:5000/api/tasks';

/**
 * 1. Tasks fetch karna (Pagination ke sath)
 * GET /api/tasks?page=1&limit=5
 */
export const getTasks = async (page = 1, limit = 5) => {
  const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch tasks');
  }

  return data; // { tasks, page, limit, totalPages, totalTasks }
};

/**
 * 2. Naya task create karna
 * POST /api/tasks { title }
 */
export const createTask = async (title) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to create task');
  }

  return data; // Saved task document
};

/**
 * 3. Task ka completed status toggle karna
 * PATCH /api/tasks/:id { completed: true/false }
 */
export const updateTaskStatus = async (id, completed) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update task');
  }

  return data; // Updated task document
};

/**
 * 4. Task delete karna
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok && response.status !== 204) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to delete task');
  }

  return true; // 204 No Content
};

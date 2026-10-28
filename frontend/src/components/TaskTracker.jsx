import { useState, useEffect } from 'react';
import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
} from '../services/taskService';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Pagination from './Pagination';

/**
 * TaskTracker Component
 * Main Feature Container: coordinates state, API calls, and sub-components
 */
function TaskTracker() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // Load tasks from backend
  const loadTasks = async (pageNumber = 1) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks(pageNumber, 5);
      setTasks(data.tasks);
      setPage(data.page);
      setTotalPages(data.totalPages);
      setTotalTasks(data.totalTasks);
    } catch (err) {
      setError(err.message || 'Server error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(page);
  }, [page]);

  // Handle adding a task
  const handleAddTask = async (title) => {
    try {
      setError(null);
      await createTask(title);
      // New task top par aayega, isliye page 1 load karo
      if (page === 1) {
        loadTasks(1);
      } else {
        setPage(1);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle toggling completion status
  const handleToggleComplete = async (id, currentStatus) => {
    try {
      setError(null);
      const updatedTask = await updateTaskStatus(id, !currentStatus);
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t._id === id ? updatedTask : t))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle deleting a task
  const handleDeleteTask = async (id) => {
    try {
      setError(null);
      await deleteTask(id);
      loadTasks(page);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <header className="header">
        <h1>MERN Task Tracker</h1>
        <p>Simple, efficient task management</p>
      </header>

      <TaskForm onAddTask={handleAddTask} />

      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onToggleComplete={handleToggleComplete}
        onDelete={handleDeleteTask}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        totalTasks={totalTasks}
        onPageChange={setPage}
      />
    </>
  );
}

export default TaskTracker;

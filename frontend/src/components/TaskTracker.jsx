import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTasks, createTask, updateTask, updateTaskStatus, deleteTask } from '../services/taskService';
import { useAuth } from '../context/AuthContext';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Pagination from './Pagination';
import '../styles/TaskTracker.css';

/**
 * -------------------------------------------------------------
 * TaskTracker.jsx (User Tasks Dashboard)
 * -------------------------------------------------------------
 * FLOW:
 * Step 1: User login hokar is screen par ata hai.
 * Step 2: `useQuery` automatically logged-in user ke tasks fetch karta hai.
 * Step 3: Naya task add hone par list refresh hoti hai aur page 1 par jata hai.
 * Step 4: Checkbox toggle hone par completed status update hota hai.
 * Step 5: Task title edit hone par updateTask API call hoti hai.
 * Step 6: Delete dabane par task delete ho jata hai.
 * Step 7: Logout dabane par session khatam ho jata hai.
 * -------------------------------------------------------------
 */
function TaskTracker() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { user, logout } = useAuth();

  // 1. Logged-in user ke tasks backend se mangwana
  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks', page],
    queryFn: () => getTasks(page, 5),
  });

  // 2. Naya task add karne ka mutation
  const addMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setPage(1);
    },
  });

  // 3. Task status toggle karne ka mutation
  const toggleMutation = useMutation({
    mutationFn: ({ id, completed }) => updateTaskStatus(id, completed),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // 4. Task title edit karne ka mutation
  const editMutation = useMutation({
    mutationFn: ({ id, title }) => updateTask(id, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // 5. Task delete karne ka mutation
  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const tasks = data?.tasks || [];
  const totalPages = data?.totalPages || 1;
  const totalTasks = data?.totalTasks || 0;

  // Stats calculation
  const completedCount = tasks.filter((t) => t.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <>
      {/* Header: Brand Logo, Username, and Logout button */}
      <header className="tracker-header">
        <div className="tracker-brand">
          <div className="tracker-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
          <div className="tracker-header-info">
            <h1 className="tracker-header-title">Task Tracker</h1>
            <p className="tracker-header-subtitle">
              <span className="user-online-dot"></span>
              Welcome back, <strong className="tracker-username">{user?.username}</strong>
            </p>
          </div>
        </div>

        <button type="button" onClick={logout} className="btn-logout" title="Sign out of your account">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </button>
      </header>

      {/* Colorful Quick Stats Bar */}
      <div className="tracker-stats-bar">
        <div className="stat-pill stat-total">
          <span className="stat-dot dot-blue"></span>
          <span>All Tasks: <strong>{totalTasks}</strong></span>
        </div>
        <div className="stat-pill stat-completed">
          <span className="stat-dot dot-green"></span>
          <span>Completed: <strong>{completedCount}</strong></span>
        </div>
        <div className="stat-pill stat-pending">
          <span className="stat-dot dot-amber"></span>
          <span>Pending: <strong>{pendingCount}</strong></span>
        </div>
      </div>

      {/* Task create form */}
      <TaskForm onAddTask={(title) => addMutation.mutate(title)} />

      {/* Tasks list with Toggle, Edit, and Delete */}
      <TaskList
        tasks={tasks}
        loading={isLoading}
        error={error?.response?.data?.message || error?.message}
        onToggleComplete={(id, currentStatus) =>
          toggleMutation.mutate({ id, completed: !currentStatus })
        }
        onEdit={(id, title) => editMutation.mutate({ id, title })}
        onDelete={(id) => deleteMutation.mutate(id)}
      />

      {/* Pagination controls */}
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

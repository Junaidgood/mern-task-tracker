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

  return (
    <>
      {/* Header: Username aur Logout button */}
      <header className="tracker-header">
        <div className="tracker-header-info">
          <h1 className="tracker-header-title">Task Tracker</h1>
          <p className="tracker-header-subtitle">
            Welcome, <strong className="tracker-username">{user?.username}</strong>
          </p>
        </div>
        <button type="button" onClick={logout} className="btn-logout">
          Logout
        </button>
      </header>

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

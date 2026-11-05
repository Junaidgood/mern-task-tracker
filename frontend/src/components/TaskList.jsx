import TaskItem from './TaskItem';
import '../styles/TaskList.css';

/**
 * -------------------------------------------------------------
 * TaskList.jsx (Tasks Ko Render Karne Wala Component)
 * -------------------------------------------------------------
 * FLOW:
 * 1. Loading State: Jab backend se tasks load ho rahe hon.
 * 2. Error State: Jab koi error aye.
 * 3. Empty State: Jab user ka koi task na ho.
 * 4. List State: Tasks ko <TaskItem /> me map karna aur onToggle, onEdit, onDelete pass karna.
 * -------------------------------------------------------------
 */
function TaskList({ tasks, loading, error, onToggleComplete, onEdit, onDelete }) {
  // 1. Loading
  if (loading) {
    return (
      <div className="state-box state-loading">
        <svg className="spinner-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeLinecap="round" />
        </svg>
        <span>Loading your tasks...</span>
      </div>
    );
  }

  // 2. Server Error
  if (error) {
    return (
      <div className="state-box state-error">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  // 3. Khali list (Empty State)
  if (!tasks || tasks.length === 0) {
    return (
      <div className="state-box state-empty">
        <div className="empty-icon">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>
        <h3 className="empty-title">No tasks found yet!</h3>
        <p className="empty-subtitle">Type your first task above and click <strong>Add Task</strong> to stay organized.</p>
      </div>
    );
  }

  // 4. Tasks list render
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;

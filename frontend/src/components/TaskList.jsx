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
    return <div className="state-box state-loading">Loading tasks...</div>;
  }

  // 2. Server Error
  if (error) {
    return <div className="state-box state-error">{error}</div>;
  }

  // 3. Khali list
  if (!tasks || tasks.length === 0) {
    return (
      <div className="state-box state-empty">
        No tasks found. Add your first task above!
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

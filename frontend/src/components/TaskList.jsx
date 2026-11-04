import TaskItem from './TaskItem';

/**
 * TaskList Component
 * Handles conditional UI states (loading, error, empty) and lists tasks
 */
function TaskList({ tasks, loading, error, onToggleComplete, onDelete }) {
  // 1. Loading State
  if (loading) {
    return <div className="state-box state-loading">⏳ Loading tasks...</div>;
  }

  // 2. Error State
  if (error) {
    return <div className="state-box state-error">❌ {error}</div>;
  }

  // 3. Empty State
  if (!tasks || tasks.length === 0) {
    return (
      <div className="state-box state-empty">
        📭 No tasks found. Add your first task above!
      </div>
    );
  }

  // 4. Success State (Tasks List)
  return (
    <ul className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;

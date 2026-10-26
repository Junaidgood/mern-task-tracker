/**
 * TaskItem Component
 * Single task row with checkbox, title, and delete button
 */
function TaskItem({ task, onToggleComplete, onDelete }) {
  return (
    <li className="task-item">
      <div className="task-content">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task._id, task.completed)}
        />
        <span className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.title}
        </span>
      </div>
      <button
        type="button"
        className="btn-delete"
        title="Delete task"
        onClick={() => onDelete(task._id)}
      >
        ✕
      </button>
    </li>
  );
}

export default TaskItem;

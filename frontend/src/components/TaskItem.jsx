import { useState } from 'react';

/**
 * -------------------------------------------------------------
 * TaskItem.jsx (Single Task Row with Edit & Delete)
 * -------------------------------------------------------------
 * FLOW:
 * Step 1: Normal mode me task ka title, checkbox, Edit button, aur Delete button dikhte hain.
 * Step 2: "Edit" button dabane par `isEditing = true` ho jata hai aur text input ban jata hai.
 * Step 3: User naya title likh kar "Save" dabata hai ya Enter press karta hai:
 *         - Blank validation check hoti hai.
 *         - `onEdit(task._id, editTitle.trim())` call hota hai.
 *         - Edit mode band ho jata hai.
 * Step 4: "Cancel" dabane par bina change kiye edit mode band ho jata hai.
 * Step 5: Checkbox dabane par `onToggleComplete`, Delete dabane par `onDelete` call hota hai.
 * -------------------------------------------------------------
 */
function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  // Edit save karne ka handler
  const handleSave = (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    onEdit(task._id, editTitle.trim());
    setIsEditing(false);
  };

  // Edit cancel karne ka handler
  const handleCancel = () => {
    setEditTitle(task.title);
    setIsEditing(false);
  };

  // --- EDITING MODE UI ---
  if (isEditing) {
    return (
      <li className="task-item">
        <form className="task-edit-form" onSubmit={handleSave}>
          <input
            type="text"
            className="task-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-save">
            Save
          </button>
          <button type="button" className="btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </li>
    );
  }

  // --- NORMAL VIEW UI ---
  return (
    <li className="task-item">
      <div className="task-content">
        {/* Checkbox */}
        <input
          type="checkbox"
          className="task-checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task._id, task.completed)}
        />

        {/* Task Title */}
        <span className={`task-title ${task.completed ? 'completed' : ''}`}>
          {task.title}
        </span>
      </div>

      {/* Action Buttons: Edit & Delete */}
      <div className="task-actions">
        <button
          type="button"
          className="btn-edit"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </button>
        <button
          type="button"
          className="btn-delete"
          title="Delete task"
          onClick={() => onDelete(task._id)}
        >
          ✕
        </button>
      </div>
    </li>
  );
}

export default TaskItem;

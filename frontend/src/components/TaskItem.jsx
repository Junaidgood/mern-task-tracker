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
      <li className="task-item task-item-editing">
        <form className="task-edit-form" onSubmit={handleSave}>
          <input
            type="text"
            className="task-edit-input"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn-save" title="Save changes">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Save</span>
          </button>
          <button type="button" className="btn-cancel" onClick={handleCancel} title="Cancel editing">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
            <span>Cancel</span>
          </button>
        </form>
      </li>
    );
  }

  // --- NORMAL VIEW UI ---
  return (
    <li className={`task-item ${task.completed ? 'completed-item' : ''}`}>
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
          title="Edit task"
          onClick={() => setIsEditing(true)}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
          <span>Edit</span>
        </button>
        <button
          type="button"
          className="btn-delete"
          title="Delete task"
          onClick={() => onDelete(task._id)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </li>
  );
}

export default TaskItem;

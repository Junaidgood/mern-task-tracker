import { useState } from 'react';

/**
 * TaskForm Component
 * Props:
 * - onAddTask: parent function jo naya task add karega
 */
function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Client-side blank check
    if (!title.trim()) {
      setFormError('Task title cannot be blank');
      return;
    }

    setFormError('');
    onAddTask(title.trim());
    setTitle(''); // Input field reset
  };

  return (
    <div>
      <form className="task-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="task-input"
          placeholder="What needs to be done?"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (formError) setFormError('');
          }}
        />
        <button type="submit" className="btn-add">
          Add Task
        </button>
      </form>
      {formError && <div className="state-box state-error">{formError}</div>}
    </div>
  );
}

export default TaskForm;

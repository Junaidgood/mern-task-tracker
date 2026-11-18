import { useState } from 'react';
import '../styles/TaskForm.css';

/**
 * -------------------------------------------------------------
 * TaskForm.jsx (Naya Task Add Karne Ka Form)
 * -------------------------------------------------------------
 * FLOW:
 * Step 1: User input box me task ka naam type karta hai.
 * Step 2: "Add Task" button dabata hai.
 * Step 3: Agar input khali ho to warning message show hoti hai.
 * Step 4: Input valid ho to task add ho jata hai aur input box reset ho jata hai.
 * -------------------------------------------------------------
 */
function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Blank title check
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    setError('');
    onAddTask(title.trim());
    setTitle(''); // Input box empty kar diya
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
            if (error) setError('');
          }}
        />
        <button type="submit" className="btn-add">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Task
        </button>
      </form>

      {/* Validation Error Message */}
      {error && (
        <div className="state-box state-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}

export default TaskForm;

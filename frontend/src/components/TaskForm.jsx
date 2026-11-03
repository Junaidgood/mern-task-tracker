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
          Add Task
        </button>
      </form>

      {/* Validation Error Message */}
      {error && <div className="state-box state-error">{error}</div>}
    </div>
  );
}

export default TaskForm;

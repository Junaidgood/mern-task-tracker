import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import TaskTracker from './components/TaskTracker';
import AiChat from './components/AiChat';
import './styles/App.css'; // Global & Layout Styles

/**
 * -------------------------------------------------------------
 * App.jsx (Root Component)
 * -------------------------------------------------------------
 * FLOW:
 * 1. App open hone par `useAuth` backend se check karta hai ke session hai ya nahi.
 * 2. Agar loading ho rahi ho to "Loading..." dikhata hai.
 * 3. Agar user login NAHI hai to <AuthForm /> (Login/Register) dikhata hai.
 * 4. Agar user login HAI to Tasks aur AI Chat ke tabs dikhata hai.
 * -------------------------------------------------------------
 */
function App() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'chat'

  // 1. Session check hone tak loading screen
  if (isLoading) {
    return (
      <main className="app-container app-loading-container">
        <div className="state-box state-loading">
          <svg className="spinner-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeLinecap="round" />
          </svg>
          <span>Checking user session...</span>
        </div>
      </main>
    );
  }

  // 2. Agar login nahi hai to AuthForm screen
  if (!user) {
    return <AuthForm />;
  }

  // 3. Agar login hai to Dashboard with Tabs
  return (
    <main className="app-container">
      {/* Navigation Switcher: Tasks vs AI Chat */}
      <div className="app-nav-tabs">
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <span>📋 My Tasks</span>
        </button>
        <button
          type="button"
          className={`nav-tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <span>✨ AI Chat</span>
        </button>
      </div>

      {activeTab === 'tasks' ? <TaskTracker /> : <AiChat />}
    </main>
  );
}

export default App;

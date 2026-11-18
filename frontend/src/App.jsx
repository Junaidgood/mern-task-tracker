import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import TaskTracker from './components/TaskTracker';
import AiChat from './components/AiChat';
import './styles/App.css'; // Global & Layout Styles

/**
 * Dashboard (Logged-in view holding shared tab, chat, and celebration state)
 */
function Dashboard() {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'chat'
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [taskCelebration, setTaskCelebration] = useState(null);

  // Auto-hide timer sirf tab chalta hai jab user My Tasks tab par ho
  useEffect(() => {
    if (!taskCelebration || activeTab !== 'tasks') return;
    const timer = setTimeout(() => {
      setTaskCelebration(null);
    }, 3200);
    return () => clearTimeout(timer);
  }, [taskCelebration, activeTab]);

  const triggerCelebration = (payload) => {
    if (typeof payload === 'string') {
      setTaskCelebration({ id: Date.now(), action: 'Success!', tasks: [payload] });
    } else {
      setTaskCelebration({
        id: Date.now(),
        action: payload?.action || 'Task Updated',
        tasks: payload?.tasks || [],
        showConfetti: payload?.showConfetti !== false,
      });
    }
  };

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

      {activeTab === 'tasks' ? (
        <TaskTracker
          celebration={taskCelebration}
          onClearCelebration={() => setTaskCelebration(null)}
          onTaskSuccess={triggerCelebration}
        />
      ) : (
        <AiChat
          messages={chatMessages}
          setMessages={setChatMessages}
          input={chatInput}
          setInput={setChatInput}
          onTaskSuccess={triggerCelebration}
        />
      )}
    </main>
  );
}

/**
 * -------------------------------------------------------------
 * App.jsx (Root Component)
 * -------------------------------------------------------------
 */
function App() {
  const { user, isLoading } = useAuth();

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

  // 3. Agar login hai to Dashboard (unmounts automatically on logout)
  return <Dashboard key={user._id || user.username} />;
}

export default App;

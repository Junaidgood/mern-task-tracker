import { useAuth } from './context/AuthContext';
import AuthForm from './components/AuthForm';
import TaskTracker from './components/TaskTracker';
import './styles/App.css'; // Global & Layout Styles

/**
 * -------------------------------------------------------------
 * App.jsx (Root Component)
 * -------------------------------------------------------------
 * FLOW:
 * 1. App open hone par `useAuth` backend se check karta hai ke session hai ya nahi.
 * 2. Agar loading ho rahi ho to "Loading..." dikhata hai.
 * 3. Agar user login NAHI hai to <AuthForm /> (Login/Register) dikhata hai.
 * 4. Agar user login HAI to <TaskTracker /> (Dashboard) dikhata hai.
 * -------------------------------------------------------------
 */
function App() {
  const { user, isLoading } = useAuth();

  // 1. Session check hone tak loading screen
  if (isLoading) {
    return (
      <main className="app-container" style={{ textAlign: 'center', padding: '40px' }}>
        <div className="state-box state-loading">Checking user session...</div>
      </main>
    );
  }

  // 2. Agar login nahi hai to AuthForm screen
  if (!user) {
    return <AuthForm />;
  }

  // 3. Agar login hai to TaskTracker Dashboard
  return (
    <main className="app-container">
      <TaskTracker />
    </main>
  );
}

export default App;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthForm.css';

/**
 * -------------------------------------------------------------
 * AuthForm.jsx (Login & Register Component)
 * -------------------------------------------------------------
 * FLOW:
 * Step 1: User screen par ata hai (Default: Login view).
 * Step 2: "Register here" par click karne se form Register mode me badal jata hai.
 * Step 3: User Username aur Password type karta hai (state update hoti hai).
 * Step 4: Submit dabane par blank validation hoti hai.
 * Step 5: Mode ke hisab se `login()` ya `register()` call hota hai.
 * Step 6: Success par user automatic login ho kar TaskTracker par chala jata hai.
 * -------------------------------------------------------------
 */
function AuthForm() {
  // Mode switch: false = Login, true = Register
  const [isRegister, setIsRegister] = useState(false);

  // Form inputs ki states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');

  // Context se auth functions aur backend error
  const { login, register, authError } = useAuth();

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation: Dono fields bhari honi chahiye
    if (!username.trim() || !password.trim()) {
      setFormError('Username and password are required');
      return;
    }

    setFormError(''); // Error clear

    // 2. API Call (Register ya Login)
    try {
      if (isRegister) {
        await register({ username, password });
      } else {
        await login({ username, password });
      }
    } catch {
      // Backend error Context ke authError me handle ho jata hai
    }
  };

  // Local ya server error jo bhi ho display hoga
  const displayError = formError || authError;

  return (
    <div className="app-container">
      {/* 1. Header: Login ya Register ke mutabiq heading & badge */}
      <header className="header">
        <div className="header-icon-badge">
          {isRegister ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
        </div>
        <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
        <p>
          {isRegister
            ? 'Enter your details below to create your account'
            : 'Login with your credentials to access your tasks'}
        </p>
      </header>

      {/* 2. Error Message agar koi ho */}
      {displayError && (
        <div className="state-box state-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{displayError}</span>
        </div>
      )}

      {/* 3. Form Inputs */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Username
          </label>
          <input
            type="text"
            className="auth-input"
            placeholder="e.g. junaid"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="auth-form-group">
          <label>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Password
          </label>
          <input
            type="password"
            className="auth-input"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Submit button with icon */}
        <button type="submit" className="auth-btn-submit">
          {isRegister ? (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="8.5" cy="7" r="4" />
                <polyline points="17 11 19 13 23 9" />
              </svg>
              <span>Register Now</span>
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Login to Account</span>
            </>
          )}
        </button>
      </form>

      {/* 4. Switcher: Login <-> Register */}
      <div className="auth-toggle-container">
        {isRegister ? 'Already have an account? ' : "Don't have an account? "}
        <button
          type="button"
          className="auth-toggle-btn"
          onClick={() => {
            setIsRegister(!isRegister);
            setFormError('');
          }}
        >
          {isRegister ? 'Login here' : 'Register here'}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;

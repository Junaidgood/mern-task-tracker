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
      {/* 1. Header: Login ya Register ke mutabiq heading */}
      <header className="header">
        <h1>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
        <p>
          {isRegister
            ? 'Enter details to create your account'
            : 'Login with your username and password'}
        </p>
      </header>

      {/* 2. Error Message agar koi ho */}
      {displayError && <div className="state-box state-error">{displayError}</div>}

      {/* 3. Form Inputs */}
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-form-group">
          <label>Username</label>
          <input
            type="text"
            className="auth-input"
            placeholder="e.g. junaid"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="auth-form-group">
          <label>Password</label>
          <input
            type="password"
            className="auth-input"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="auth-btn-submit">
          {isRegister ? 'Register' : 'Login'}
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

import React, { useState, useEffect } from 'react';
import Login from './Login';
import './theme.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return (
    <div className="App">
      <div className="theme-toggle">
        <label>
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </label>
      </div>
      {loggedIn ? (
        <Dashboard onLogout={() => setLoggedIn(false)} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

function Dashboard({ onLogout }) {
  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Welcome to the Dashboard!</h1>
        <button onClick={onLogout} style={{
          backgroundColor: 'crimson',
          color: 'white',
          padding: '0.5rem 1rem',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer'
        }}>Logout</button>
      </div>
      <div className="sections">
        <button>Show Keys</button>
        <button>Manage Admins</button>
        <button>Add Event</button>
        <button>Live Room Status</button>
      </div>
    </div>
  );
}

export default App;

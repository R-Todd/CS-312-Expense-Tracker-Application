// client/src/App.js
import React from 'react';
import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import './App.css'; // Make sure this is imported

// =========== Import Components ===========
import Login from './components/login';
import Register from './components/register';
import Dashboard from './components/dashboard';
// =========================================

function App() {
  const navigate = useNavigate();
  
  // Check if a token exists in local storage (user is logged in)
  const token = localStorage.getItem('token');

  // --- Logout function ---
  const logout = () => {
    localStorage.removeItem('token'); // Remove the token
    navigate('/login'); // Redirect to login page
    window.location.reload(); // Refresh the app to clear its state
  };

  return (
    <div className="App">
      <nav className="App-nav">
        {token ? (
          // If user IS logged in, show Dashboard and Logout
          <>
            <Link to="/dashboard" className="App-nav-link">Dashboard</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          // If user is NOT logged in, show Login and Register
          <>
            <Link to="/login" className="App-nav-link">Login</Link>
            <Link to="/register" className="App-nav-link">Register</Link>
          </>
        )}
      </nav>

      <header className="App-header">
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />

          {/* PRIVATE ROUTE */}
          <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />

          {/* DEFAULT ROUTE */}
          <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
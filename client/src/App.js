import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [dbStatus, setDbStatus] = useState('Checking connection...');

  useEffect(() => {
    // This fetch request is sent to http://localhost:5000/test-db
    // because of the "proxy" you added in package.json
    fetch('/test-db')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setDbStatus(`Connection successful! DB time: ${data.time.now}`);
        } else {
          setDbStatus('Connection failed. Check server console.');
        }
      })
      .catch((err) => {
        console.error(err);
        setDbStatus('Connection failed. Is the server running?');
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to the Expense Tracker</h1>
        <p>
          <strong>Backend Status:</strong> {dbStatus}
        </p>
      </header>
    </div>
  );
}

export default App;
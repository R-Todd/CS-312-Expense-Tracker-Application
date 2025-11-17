// client/components/login.js

// =========== IMPORTS ===========
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// ===============================

const Login = () => {
    // useState hooks to manage form data
    // sets blank initial values
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // useState for error messages
    const [error, setError] = useState('');

    // After successful login, navigate to dashboard
    const navigate = useNavigate();

    // send properties from formData to local variables
    const { username, password } = formData;

    
    // ---- Event handlers ----

    // onChange: using formData
    const onChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    // onSubmit: handle form submission
    const onSubmit = async (event) => {
        event.preventDefault(); // Prevent default HTML form
        // clear error message
        setError('');

        // try block
        try {
            // -- API Call --
            const response = await fetch('api/auth/login', {
                method: 'POST', // sending data
                headers: {
                    'Content-Type': 'application/json' // as JSON data
                },
                body: JSON.stringify(formData) // converts formData to string
            });

            // wait for response from sever (server responds with token or error)
            const data = await response.json();

            if (response.ok && data.token) {
                // --- Successful login ---
                // store token and redirect to dashboard
                localStorage.setItem('token', data.token);
                // redirect to dashboard
                navigate('/dashboard');

                // force reload
                window.location.reload();
            }
            else {
                // --- Unsuccessful login ---
                setError(data.error || 'Login failed');
            }
        } 
        catch (err) {
            setError('Server error. Please try again.');
        }
    };

    // ---- JSX Return ----
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={onSubmit}>

                <div>
                    <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
                </div>

                <div>
                    <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
                </div>

                <button type="submit">Login</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <p> Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
};

// export to app.js
export default Login;

      
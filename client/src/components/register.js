// client/components/register.js

// =========== IMPORTS ===========
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// usNavigate to redirect after registration
// Link to navigate to login page
// ===============================

// =========== REGISTER COMPONENT ===========
const Register = () => {
    // useState hooks to manage form data
    // sets blank initial values
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: ''
    });

    // useState for error messages
    const [error, setError] = useState('');

    // After successful registration, navigate to login
    const navigate = useNavigate();

    // Unpack properties from formData, moves objects to local variables 
    // This is done to write "value{username}" instead of caling the full object
    const { username, email, password, full_name } = formData;

    // ---- Event handlers ----

    // onChange: using formData
    // target.name = input field that changed
    // target.value = new value of that field
    const onChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        // ... to only update changed field
    };

    // onSubmit: handle form submission
    const onSubmit = async (event) => {
        event.preventDefault(); // Prevent default HTML form
        // clear error message
        setError('');

        // try block 
        try {

            // -- API Call --
            // usus await to wait for response from fetch to be received
            const response = await fetch('api/auth/register', {
                method: 'POST', // sending data
                headers: {
                    'Content-Type': 'application/json' // as JSON data
                },
                body: JSON.stringify(formData) // converts formData to string
            });

            // wait for response from sever (server responds with token or error)
            const data = await response.json();

            // if registration is successful (success response from server)
            if (response.ok && data.token) {

                // saves token to local storage
                localStorage.setItem('token', data.token);

                // redirect to dashboard
                navigate('/dashboard');

                // force reload
                window.location.reload();
            } else {
                // if registration fails, display error message
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            // catch network or other errors
            setError('Server error. Please try again.');
        }
    // end of onSubmit
    };

    // ---- JSX Return ----
    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={onSubmit}>

                <div>
                    <input type="text" name="username" value={username} onChange={onChange} placeholder="Username" required />
                </div>

                <div>
                    <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
                </div>

                <div>
                    <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
                </div>
                
                <div>
                    <input type="text" name="full_name" value={full_name} onChange={onChange} placeholder="Full Name" required />
                </div>

                <button type="submit">Register</button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <p>Already have an account? <Link to ="/login">Login here</Link></p>
        </div>
    );
// end of Register component
};

// Export to App.js
export default Register;

            







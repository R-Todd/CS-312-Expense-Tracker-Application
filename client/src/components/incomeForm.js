// =========== IMPORTS ===========
import React, { useState } from 'react';
// NEW: Import the DatePicker library and CSS
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
// styling
import '../App.css';
// ===============================

// IncomeForm component for adding new income
const IncomeForm = ({ onIncomeAdded }) => {

    // ==== State Variables ====

    // empty form data state to store inputs
    const [formData, setFormData] = useState({
        amount: '',
        source: '', 
        //date stores a Date object
        date: new Date(), 
        description: ''
    });

    // store error messages
    const [error, setError] = useState('');

    // break down formData for easier access
    const { amount, source, date, description } = formData;
    // =========================

    // ---- event handlers ----

    // onChange, called every time a user types in a input feild
    const onChange = (event) => {
        // similar to login.js and register.js
        //event.target.name' is the 'name' from input
        // event.target.value' is the value user typed in
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    
    
    const handleDateChange = (newDate) => {
        setFormData({ ...formData, date: newDate });
    };


    // onSubmit, called when user submits the form
    const onSubmit = async (event) => {
        // prevent HTML submissionas
        event.preventDefault();

        // clear prev errors
        setError('');

        // Basic validation for amount
        if (parseFloat(amount) <= 0) {
            setError('Amount must be positive');
            return;
        }

        // try block
        try {
            // get token from local storage
            const token = localStorage.getItem('token');

            // check if token is found from above
            if (!token) {
                setError('No token found, please log in');
                return;
            }

            // --- api call ---
            // send form data to /api/income 
            const response = await fetch('/api/income', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // x-auth-token header (from authMiddleware.js)
                    'x-auth-token': token
                },
                // convert js object to JSON string
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    source,
                    date: date.toISOString().split('T')[0], 
                    description
                })
            });
            // check for server error
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to add income');
            }

            // --- success ---
            // 1) CLEAR form data
            setFormData({
                amount: '',
                source: '',
                // Reset to today's date (as a Date object)
                date: new Date(),
                description: ''
            });

            // 2) call onIncomeAdded to update income list in dashboard
            // re fetch to add new list item
            if (onIncomeAdded) {
                onIncomeAdded();
            }
        } catch (err) {
            // set error message
            setError(err.message);
        }
    };
    // ========================

    // ---- JSX Return ----
    return (
        // attach onSubmit
        <form className="expense-form" onSubmit={onSubmit} style={{ backgroundColor: '#394A59' }}>
            <h3 style={{ color: '#A0D2EB' }}>Add New Income</h3>

            {error && <div className="error-message">{error}</div>}

            <div className = "form-group">
                <input
                    type="number" // Must match the key in formData state
                    name="amount"
                    value= {amount} // from state
                    onChange={onChange} // attach onChange handler
                    placeholder="Amount (ex: 1000.00)"
                    required
                />
                <input
                    type="text"
                    name="source"
                    value={source}
                    onChange={onChange}
                    placeholder="Source (ex: Salary, Freelance)"
                    required
                />
            </div>

            <div className = "form-group">
                <DatePicker
                    selected={date} // The DatePicker component requires a Date object
                    onChange={handleDateChange} // Use the custom date handler
                    dateFormat="yyyy/MM/dd"
                    placeholderText="Date"
                    required
                    // Custom styling to make it look like the other inputs
                    className="custom-date-picker" 
                    id="income-date"
                />
                <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={onChange}
                    placeholder="Description (ex: Monthly Paycheck) etc.)"
                />
            </div>

            <button type="submit" style={{ background: '#A0D2EB' }}>Add Income</button>
        </form>
    );
    // ====================
};

export default IncomeForm;
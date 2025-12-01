// r-todd/cs-312-expense-tracker-application/CS-312-Expense-Tracker-Application-Phase-2-with-Trend-Detection/client/src/components/EditIncomeForm.js

// =========== IMPORTS ===========
import React, { useState } from 'react';
// NEW: Import the DatePicker library and CSS
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
// styling
import '../App.css';
// ===============================

// EditIncomeForm component for updating an existing income entry
const EditIncomeForm = ({ incomeEntry, onUpdate, onCancel }) => {

    // ==== State Variables ====

    // Initialize form data with the existing income details
    const [formData, setFormData] = useState({
        amount: incomeEntry.amount,
        source: incomeEntry.source,
        // MODIFIED: Initialize date state with a Date object based on the income date string
        date: new Date(incomeEntry.date), 
        description: incomeEntry.description || '' // Handle null description
    });

    // store error messages
    const [error, setError] = useState('');

    // break down formData for easier access
    const { amount, source, date, description } = formData;
    // =========================

    // ---- event handlers ----

    // onChange, called every time a user types in an input field
    const onChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    
    // NEW: Custom handler for the date picker component
    const handleDateChange = (newDate) => {
        setFormData({ ...formData, date: newDate });
    };

    // onSubmit, called when user submits the form
    const onSubmit = async (event) => {
        // prevent HTML submission
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

            // --- api call (PUT request) ---
            // Send form data to "/api/income/:id" endpoint
            const response = await fetch(`/api/income/${incomeEntry.income_id}`, {
                method: 'PUT', // Use PUT method for updating
                headers: {
                    'Content-Type': 'application/json',
                    // x-auth-token header (from authMiddleware.js)
                    'x-auth-token': token
                },
                // convert js object to JSON string
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    source,
                    // MODIFIED: Convert Date object to ISO string for the backend
                    date: date.toISOString().split('T')[0],
                    description
                })
            });
            
            // check for server error
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to update income');
            }

            // --- success ---
            // 1) Call onUpdate to refresh the list in the dashboard
            if (onUpdate) {
                onUpdate();
            }

            // 2) Close the edit form
            if (onCancel) {
                onCancel();
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
        <form className="expense-form" onSubmit={onSubmit} style={{ backgroundColor: '#2E4057', border: '2px solid #A0D2EB' }}>
            <h3 style={{ color: '#A0D2EB' }}>Edit Income ID: {incomeEntry.income_id}</h3>

            {error && <div className="error-message">{error}</div>}

            <div className = "form-group">
                <input
                    type="number" 
                    name="amount"
                    value= {amount} // Pre-populated from state
                    onChange={onChange}
                    placeholder="Amount (ex: 1000.00)"
                    required
                />
                <input
                    type="text"
                    name="source"
                    value={source} // Pre-populated from state
                    onChange={onChange}
                    placeholder="Source (ex: Salary, Freelance)"
                    required
                />
            </div>

            <div className = "form-group">
                {/* MODIFIED: Replaced input type="date" with DatePicker component */}
                <DatePicker
                    selected={date} 
                    onChange={handleDateChange} 
                    dateFormat="yyyy/MM/dd"
                    placeholderText="Date"
                    required
                    className="custom-date-picker" 
                    id={`edit-income-date-${incomeEntry.income_id}`}
                />
                <input
                    type="text"
                    name="description"
                    value={description} // Pre-populated from state
                    onChange={onChange}
                    placeholder="Description (ex: Monthly Paycheck) etc.)"
                />
            </div>
            
            <div className="form-group" style={{ gap: '10px' }}>
                <button type="submit" style={{ flex: 2, background: '#A0D2EB' }}>Save Changes</button>
                <button 
                    type="button" 
                    onClick={onCancel} 
                    style={{ flex: 1, background: '#FF6384' }}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
    // ====================
};

export default EditIncomeForm;
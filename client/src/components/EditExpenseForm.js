// r-todd/cs-312-expense-tracker-application/CS-312-Expense-Tracker-Application-Phase-2-with-Trend-Detection/client/src/components/EditExpenseForm.js

// =========== IMPORTS ===========
import React, { useState } from 'react';
// NEW: Import the DatePicker library and CSS
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
// styling
import '../App.css';
// ===============================

// EditExpenseForm component for updating an existing expense
// It receives the current expense data, a function to refresh the list, and a function to cancel the edit.
const EditExpenseForm = ({ expense, onUpdate, onCancel }) => {

    // ==== State Variables ====

    // Initialize form data with the existing expense details
    const [formData, setFormData] = useState({
        amount: expense.amount,
        category: expense.category,
        // MODIFIED: Initialize date state with a Date object based on the expense date string
        date: new Date(expense.date), 
        description: expense.description || '' // Handle null description
    });

    // store error messages
    const [error, setError] = useState('');

    // break down formData for easier access
    const { amount, category, date, description } = formData;
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
            // Send form data to "/api/expenses/:id" endpoint
            const response = await fetch(`/api/expenses/${expense.expense_id}`, {
                method: 'PUT', // Use PUT method for updating
                headers: {
                    'Content-Type': 'application/json',
                    // x-auth-token header (from authMiddleware.js)
                    'x-auth-token': token
                },
                // convert js object to JSON string
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    category,
                    // MODIFIED: Convert Date object to ISO string for the backend
                    date: date.toISOString().split('T')[0],
                    description
                })
            });
            
            // check for server error
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to update expense');
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
        <form className="expense-form" onSubmit={onSubmit} style={{ backgroundColor: '#584C3C', border: '2px solid #FFCE56' }}>
            <h3 style={{ color: '#FFCE56' }}>Edit Expense ID: {expense.expense_id}</h3>

            {error && <div className="error-message">{error}</div>}

            <div className = "form-group">
                <input
                    type="number" 
                    name="amount"
                    value= {amount} // Pre-populated from state
                    onChange={onChange}
                    placeholder="Amount (ex: 12.34)"
                    required
                />
                <input
                    type="text"
                    name="category"
                    value={category} // Pre-populated from state
                    onChange={onChange}
                    placeholder="Category (ex: Food, Transport)"
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
                    id={`edit-expense-date-${expense.expense_id}`}
                />
                <input
                    type="text"
                    name="description"
                    value={description} // Pre-populated from state
                    onChange={onChange}
                    placeholder="Description (ex: Lunch, Taxi) etc.)"
                />
            </div>
            
            <div className="form-group" style={{ gap: '10px' }}>
                <button type="submit" style={{ flex: 2, background: '#FFCE56' }}>Save Changes</button>
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

export default EditExpenseForm;
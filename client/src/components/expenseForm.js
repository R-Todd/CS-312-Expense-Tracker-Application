
// =========== IMPORTS ===========
import React, { useState } from 'react';
// NEW: Import the DatePicker library and CSS
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
// styling
import '../App.css';
// ===============================

// ExpenseForm component for adding new expenses
const ExpenseForm = ({ onExpenseAdded }) => {

    // ==== State Variables ====

    // empty form data state to store inputs
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        // MODIFIED: date state now stores a Date object, not an ISO string
        date: new Date(), 
        description: ''
    });

    // store error messages
    const [error, setError] = useState('');

    // break down formData for easier access
    // MODIFIED: date is now an object
    const { amount, category, date, description } = formData;
    // =========================

    // ---- event handlers ----

    // onChange, called every time a user types in a input feild
    const onChange = (event) => {
        // similar to login.js and register.js
        //event.target.name' is the 'name' from input
        // event.target.value' is the value user typed in
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    
    // NEW: Custom handler for the date picker component
    const handleDateChange = (newDate) => {
        setFormData({ ...formData, date: newDate });
    };

    // onSubmit, called when user submits the form
    const onSubmit = async (event) => {
        // prevent HTML submissionas
        event.preventDefault();

        // clear prev errors
        setError('');

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
            // send form data to "/api/expenses" endpoint
            const response = await fetch('/api/expenses', {
                method: 'POST',
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
                throw new Error(errData.error || 'Failed to add expense');
            }

            // --- success ---
            // 1) CLEAR form data
            setFormData({
                amount: '',
                category: '',
                // Reset to today's date (as a Date object)
                date: new Date(), 
                description: ''
            });

            // 2) call onExpenseAdded to update expense list in dashboard
            // re fetch to add new list item
            if (onExpenseAdded) {
                onExpenseAdded();
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
        <form className="expense-form" onSubmit={onSubmit}>
            <h3>Add New Expense</h3>

            {error && <div className="error-message">{error}</div>}

            <div className = "form-group">
                <input
                    type="number" // Must match the key in formData state
                    name="amount"
                    value= {amount} // from state
                    onChange={onChange} // attach onChange handler
                    placeholder="Amount (ex: 12.34)"
                    required
                />
                <input
                    type="text"
                    name="category"
                    value={category}
                    onChange={onChange}
                    placeholder="Category (ex: Food, Transport)"
                    required
                />
            </div>

            <div className = "form-group">
                {/* MODIFIED: Replaced input type="date" with DatePicker component */}
                <DatePicker
                    // The DatePicker component requires a Date object for its value
                    selected={date} 
                    onChange={handleDateChange} // Use the custom date handler
                    dateFormat="yyyy/MM/dd" // Display format for the user
                    placeholderText="Date"
                    required
                    // Custom styling to make it look like the other inputs
                    className="custom-date-picker" 
                    id="expense-date"
                />
                <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={onChange}
                    placeholder="Description (ex: Lunch, Taxi) etc.)"
                />
            </div>

            <button type="submit">Add Expense</button>
        </form>
    );
    // ====================
};

export default ExpenseForm;
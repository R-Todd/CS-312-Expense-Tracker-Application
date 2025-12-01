// client/src/components/incomeForm.js

// =========== IMPORTS ===========
import React, { useState } from 'react';
// styling
import '../App.css';
// ===============================

// IncomeForm component for adding new income entries
const IncomeForm = ({ onIncomeAdded }) => {

    // ==== State Variables ====

    // empty form data state to store inputs
    const [formData, setFormData] = useState({
        amount: '',
        source: '', // Maps to 'source' column in DB
        // default to today's date
        date: new Date().toISOString().split('T')[0],
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
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    // onSubmit, called when user submits the form
    const onSubmit = async (event) => {
        // prevent HTML submission
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
            // send form data to "/api/income" endpoint
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
                    date,
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
                date: new Date().toISOString().split('T')[0],
                description: ''
            });

            // 2) call onIncomeAdded to update transaction list in dashboard
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
        // Use the new class 'income-form' for custom styling
        <form className="expense-form income-form" onSubmit={onSubmit}>
            <h3 className="income-title">Add New Income</h3> 

            {error && <div className="error-message">{error}</div>}

            <div className = "form-group">
                <input
                    type="number" 
                    name="amount"
                    value={amount} 
                    onChange={onChange} 
                    placeholder="Amount (ex: 1500.00)"
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
                <input
                    type="date"
                    name="date"
                    value={date}
                    onChange={onChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={onChange}
                    placeholder="Description (e.g. Monthly Paycheck)"
                />
            </div>

            {/* Use the new class 'income-button' */}
            <button type="submit" className="income-button">Add Income</button>
        </form>
    );
    // ====================
};

export default IncomeForm;
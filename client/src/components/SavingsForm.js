// client/src/components/SavingsForm.js

// =========== IMPORTS ===========
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; 
// styling
import '../App.css';
// ===============================

// SavingsForm component for adding new savings entries
const SavingsForm = ({ onSavingsAdded }) => {

    // ==== State Variables ====
    const [formData, setFormData] = useState({
        amount: '',
        goal: '', 
        date: new Date(), 
        description: ''
    });
    const [error, setError] = useState('');
    const { amount, goal, date, description } = formData;
    // =========================

    // ---- event handlers ----
    const onChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    
    const handleDateChange = (newDate) => {
        setFormData({ ...formData, date: newDate });
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (parseFloat(amount) <= 0) {
            setError('Amount must be positive');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found, please log in');
                return;
            }

            // --- api call ---
            const response = await fetch('/api/savings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    goal, // Sending 'goal' instead of 'source'
                    date: date.toISOString().split('T')[0], 
                    description
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || 'Failed to add savings entry');
            }

            // --- success ---
            setFormData({
                amount: '',
                goal: '',
                date: new Date(),
                description: ''
            });

            if (onSavingsAdded) {
                onSavingsAdded();
            }
        } catch (err) {
            setError(err.message);
        }
    };
    // ========================

    // ---- JSX Return ----
    return (
        // Added distinct color for Savings entries
        <form className="expense-form" onSubmit={onSubmit} style={{ backgroundColor: '#3C4D58', border: '1px solid #4BC0C0' }}>
            <h3 style={{ color: '#4BC0C0' }}>Add New Savings</h3>

            {error && <div className="error-message">{error}</div>}

            <div className = "form-group">
                <input
                    type="number"
                    name="amount"
                    value= {amount}
                    onChange={onChange}
                    placeholder="Amount (ex: 250.00)"
                    required
                />
                <input
                    type="text"
                    name="goal" // Use 'goal' field for savings category
                    value={goal}
                    onChange={onChange}
                    placeholder="Goal (ex: Vacation, Emergency)"
                    required
                />
            </div>

            <div className = "form-group">
                <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    dateFormat="yyyy/MM/dd"
                    placeholderText="Date"
                    required
                    className="custom-date-picker" 
                    id="savings-date"
                />
                <input
                    type="text"
                    name="description"
                    value={description}
                    onChange={onChange}
                    placeholder="Description (ex: Transfer to HYSA)"
                />
            </div>

            <button type="submit" style={{ background: '#4BC0C0' }}>Add Savings</button>
        </form>
    );
    // ====================
};

export default SavingsForm;
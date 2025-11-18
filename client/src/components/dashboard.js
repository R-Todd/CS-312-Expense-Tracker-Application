// client/components/dashboard.js

// =========== IMPORTS ===========
import React, { useState, useEffect } from 'react';
//import { useNavigate, Link } from 'react-router-dom';
// ===============================

const Dashboard = () => {

    // ======= Constants =======
    // store list of expenses
    const [expenses, setExpenses] = useState([]);

    // store loading errors
    const [error, setError] = useState('');

    // store to show loading message
    const [isLoading, setIsLoading] = useState(true);
    // =========================

    // ---- Fetch Expenses from API ----
    useEffect(() => {
        const fetchExpenses = async () => {
            // try block
            try {
                // get token from local storage
                const token = localStorage.getItem('token');

                // check if token is found from above
                if (!token) {
                    setError('No token found, please log in');
                    setIsLoading(false);
                    return;
                }

                // PRIVATE route
                // fetch expenses from API
                const response = await fetch('/api/expenses', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // x-auth-token header (from authMiddleware.js)
                        'x-auth-token': token
                    }
                });

                // check for server error
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Failed to fetch expenses');
                }

                // parse JSON response
                const data = await response.json();

                // updatde expense state
                setExpenses(data);

            } catch (err) {
                // set error message
                setError(err.message);
            } finally {
                // stop loading
                setIsLoading(false);
            }
        };

        // call the fetch function
        fetchExpenses();
    // [] empty array - only run once on mount
    }, []); // end of useEffect

    // === render logic ===
    if (isLoading) {
        return <div>Loading your expenses...</div>;
    }
    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    // ===== JSX RETURN =======
    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard!</p>

            {/* (TODO----)Add Expense Form */}

            <hr />

            {/* --- display expenses --- */}
            <h3>Your Expenses</h3>

            {expenses.length === 0 ? (
                <p>No expenses found.</p>
            ) : (
                // use "expense-list" class
                <ul className="expense-list">
                    {expenses.map((expense) => (
                        <li key={expense.expense_id} className="expense-item">
                            <div><strong>Category:</strong> {expense.category}</div>
                            <div><strong>Amount:</strong> ${expense.amount}</div>
                            <div><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</div>
                            {expense.description && <div><strong>Description:</strong> {expense.description}</div>}
                            {/* TODO: Add Update and Delete buttons here */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;

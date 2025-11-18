// client/components/dashboard.js

// =========== IMPORTS ===========
import React, { useState, useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
import ExpenseForm from './expenseForm.js'; 
import '../App.css'; 
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

    // function for fetching expenses from server
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

            // --- api call ---
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

            // set expenses state with fetched data
            setExpenses(data);

            // catch error
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // === fetch expense from API
    useEffect(() => {
        fetchExpenses();
    }, []);
    // ========================

    // === render logic ===
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }
    // ====================
        

    // ===== JSX RETURN =======
    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard!</p>

            {/* pass fetchExpenses to refresh list one a new expense is added */}
            <ExpenseForm onExpenseAdded={fetchExpenses} />

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

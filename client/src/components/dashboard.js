// client/components/dashboard.js

// =========== IMPORTS ===========
import React, { useState, useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
// import expense form
import ExpenseForm from './expenseForm.js'; 
// import pi chart
import ExpensePieChart from './expensePieChart.js';
// expense summary 
import ExpenseSummary from './expenseSummary.js';
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

    // Pi chart to filter by category
    const [selectedCategory, setSelectedCategory] = useState(null);
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

    // ==== create filtered list
    const filteredExpenses = selectedCategory
        ? expenses.filter(expense => expense.category === selectedCategory)
        : expenses; // if no category selected, show all
    // ========================
        

    // ===== JSX RETURN =======
    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard!</p>
            {/* --- expense summary --- */}
            <ExpenseSummary expenses={filteredExpenses} />
            {/* fetchExpenses to refresh list one a new expense is added */}
            <ExpenseForm onExpenseAdded={fetchExpenses} />

            <hr />

            {/* --- Pi Chart --- */}
            <ExpensePieChart
                expenses={expenses}
                onCategorySelect={setSelectedCategory}
            />

            {/* --- clear filter button --- */}
            {selectedCategory && (

                <button
                    className="form-button" // Re-using your form button style
                    style={{width: 'auto', backgroundColor: '#ff6b6b', marginTop: '10px'}} 
                    onClick={() => setSelectedCategory(null)} // Set filter back to null
                >
                    Clear Filter (Showing: {selectedCategory})
                </button>

            )}


            {/* --- display expenses --- */}
            <h3>Your Expenses</h3>

            
            {/* dynamic text based on the filter */}
            {filteredExpenses.length === 0 ? (
                <p>No expenses found{selectedCategory ? ` for ${selectedCategory}` : ''}.</p>
            ) : (

                <ul className="expense-list">
                    {/* using 'filteredExpenses' here instead of 'expenses' */}
                    {filteredExpenses.map((expense) => (
                        <li key={expense.expense_id} className="expense-item">

                            <div><strong>Category:</strong> {expense.category}</div>
                            <div><strong>Amount:</strong> ${expense.amount}</div>
                            <div><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</div>
                            {expense.description && <div><strong>Description:</strong> {expense.description}</div>}

                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};


export default Dashboard;
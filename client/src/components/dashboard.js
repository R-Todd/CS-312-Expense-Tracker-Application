// client/src/components/dashboard.js

// =========== IMPORTS ===========
import React, { useState, useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
// import expense form
import ExpenseForm from './expenseForm.js'; 
// import pi chart
import ExpensePieChart from './expensePieChart.js';
// expense summary 
import ExpenseSummary from './expenseSummary.js';
// NEW: Import Predictions component
import Predictions from './predictions.js';

import '../App.css'; 
// ===============================
const Dashboard = () => {

    // ======= Constants =======
    // store list of expenses
    const [expenses, setExpenses] = useState([]);
    // NEW: store predictions
    const [predictions, setPredictions] = useState([]);

    // store loading errors
    const [error, setError] = useState('');

    // store to show loading message
    const [isLoading, setIsLoading] = useState(true);

    // Pi chart to filter by category
    const [selectedCategory, setSelectedCategory] = useState(null);

    // -- Month filter ---
    const [selectedMonth, setSelectedMonth] = useState('all');
    // =========================

    // function for fetching data (expenses + predictions) from server
    const fetchAllData = async () => {
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

            const headers = {
                'Content-Type': 'application/json',
                // x-auth-token header (from authMiddleware.js)
                'x-auth-token': token
            };

            // --- 1. api call for expenses ---
            const response = await fetch('/api/expenses', {
                method: 'GET',
                headers: headers
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

            // --- 2. api call for predictions (New) ---
            const predResponse = await fetch('/api/expenses/predictions', {
                method: 'GET',
                headers: headers
            });

            if (predResponse.ok) {
                const predData = await predResponse.json();
                setPredictions(predData);
            }

            // catch error
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // === fetch data from API
    useEffect(() => {
        fetchAllData();
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

    // ======= Handle Month Filter Change =======
    // uses array for month dropdown
    const monthOptions = [
        { label: 'All Months', value: 'all' },
        { label: 'January', value: '0' },
        { label: 'February', value: '1' },
        { label: 'March', value: '2' },
        { label: 'April', value: '3' },
        { label: 'May', value: '4' },
        { label: 'June', value: '5' },
        { label: 'July', value: '6' },
        { label: 'August', value: '7' },
        { label: 'September', value: '8' },
        { label: 'October', value: '9' },
        { label: 'November', value: '10' },
        { label: 'December', value: '11' }
    ];
    // ========================

    // ==== create filtered list with month filter ====
    const filteredExpenses = expenses.filter(expense => {
        // filter by category if selected
        const categoryMatch = !selectedCategory || expense.category === selectedCategory;

        // check if month == 'all'
        const monthMatch = selectedMonth === 'all' || new Date(expense.date).getMonth() == selectedMonth;

        return categoryMatch && monthMatch;
    });
    // ===============================================


    // ===== JSX RETURN =======
    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard!</p>
            {/* --- expense summary --- */}
            <ExpenseSummary expenses={filteredExpenses} />

            {/* NEW: Predictions Component */}
            <Predictions predictions={predictions} />

            {/* fetchAllData to refresh list when a new expense is added */}
            <ExpenseForm onExpenseAdded={fetchAllData} />

            <hr />

            {/* --- Pi Chart --- */}
            <ExpensePieChart
                expenses={expenses}
                onCategorySelect={setSelectedCategory}
            />

            {/* --- display expenses --- */}
            <h3>Your Expenses</h3>

            {/* --- Month filter container --- */}
            <div className="filter-controls">
                
                {/* Month Dropdown */}
                <div> {/* Added a div for layout */}
                    <label htmlFor="month-filter" style={{marginRight: '10px'}}>Filter by Month:</label>
                    <select
                        id="month-filter"
                        className = "month-filter"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {monthOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* --- clear filter button --- */}
                {/* inside the filter-controls div */}
                {selectedCategory && (
                    <button
                        className="form-button" // Re-using your form button style
                        // MODIFIED: Changed margin-top to margin: 0
                        style={{width: 'auto', backgroundColor: '#ff6b6b', margin: 0}} 
                        onClick={() => setSelectedCategory(null)} // Set filter back to null
                    >
                        Clear Filter (Showing: {selectedCategory})
                    </button>
                )}
            </div>


            {/* dynamic text based on the filter */}
            {filteredExpenses.length === 0 ? (
                <p>No expenses found{selectedCategory ? ` for ${selectedCategory}` : ''}{selectedMonth !== 'all' ? ` in ${monthOptions.find(m => m.value === selectedMonth).label}` : ''}.</p>
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
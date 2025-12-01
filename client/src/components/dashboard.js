// client/components/dashboard.js

// =========== IMPORTS ===========
import React, { useState, useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
// import expense form
import ExpenseForm from './expenseForm.js'; 
// NEW: import income form
import IncomeForm from './incomeForm.js';
// import pi chart (Only used for expense categorization visualization)
import ExpensePieChart from './expensePieChart.js';
// expense summary (Now displays Net Total)
import ExpenseSummary from './expenseSummary.js';
import '../App.css'; 
// ===============================

// Define a common fetch function for both expenses and income (DRY principle)
const fetchTransactions = async (endpoint, token) => {
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
        }
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Failed to fetch from ${endpoint}`);
    }

    return await response.json();
};


const Dashboard = () => {

    // ======= Constants =======
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]); // NEW: state for income

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState('all');
    // =========================

    // NEW: Unified fetch function for all data
    const fetchAllData = async () => {
        setIsLoading(true);
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found, please log in');
                setIsLoading(false);
                return;
            }

            // Fetch expenses
            const expensesData = await fetchTransactions('/api/expenses', token);
            setExpenses(expensesData);

            // NEW: Fetch incomes
            const incomesData = await fetchTransactions('/api/income', token);
            setIncomes(incomesData);

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // NEW: Handle delete (for expenses or income) (Phase 2 Delete Task)
    const handleDelete = async (id, type) => {
        // Determine the correct API endpoint
        const endpoint = type === 'expense' ? `/api/expenses/${id}` : `/api/income/${id}`;
        
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(endpoint, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `Failed to delete ${type}`);
            }

            // Refresh all data after successful deletion
            fetchAllData();

        } catch (err) {
            setError(err.message);
        }
    };


    // === fetch all data from API
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

    // ======= Month Filter Options (Existing) =======
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

    // ==== NEW: Combine and Filter Transactions for the list display ====
    const allTransactions = [
        // Map expenses: standard structure
        ...expenses.map(e => ({...e, type: 'expense', transaction_id: e.expense_id, category: e.category})),
        // Map incomes: use source as the category field for easier filtering; assign type and id.
        ...incomes.map(i => ({...i, type: 'income', transaction_id: i.income_id, category: i.source, source: i.source})) 
    ].sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date DESC

    const filteredTransactions = allTransactions.filter(transaction => {
        const isExpense = transaction.type === 'expense';
        
        // Category Match: Only filter expenses by the selected category. Income is always shown regardless of category filter.
        const categoryMatch = !selectedCategory || (isExpense && transaction.category === selectedCategory);

        // Month Match (using the original logic fix ==)
        const monthMatch = selectedMonth === 'all' || new Date(transaction.date).getMonth() == selectedMonth;

        return categoryMatch && monthMatch;
    });
    // ===================================================================
        

    // ===== JSX RETURN =======
    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard!</p>
            
            {/* --- expense summary (Pass both arrays) --- */}
            <ExpenseSummary expenses={expenses} incomes={incomes} />

            {/* NEW: Container to show both forms side-by-side */}
            <h3 className="dashboard-section-title">Add New Transaction</h3>
            {/* Use the new class 'transaction-forms-container' */}
            <div className="transaction-forms-container">
                <ExpenseForm onExpenseAdded={fetchAllData} /> {/* Existing */}
                <IncomeForm onIncomeAdded={fetchAllData} />   {/* NEW */}
            </div>

            <hr />

            {/* --- Pi Chart (still only uses expenses for categorization) --- */}
            <h3>Your Expenses Breakdown</h3>
            <ExpensePieChart
                expenses={expenses} 
                onCategorySelect={setSelectedCategory}
            />

            <h3>Your Transactions</h3>

            {/* --- Filter controls (Existing) --- */}
            <div className="filter-controls">
                
                {/* Month Dropdown */}
                <div> 
                    <label htmlFor="month-filter" className="filter-label">Filter by Month:</label>
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
                {selectedCategory && (
                    <button
                        className="clear-filter-button" 
                        onClick={() => setSelectedCategory(null)} 
                    >
                        Clear Category Filter (Showing: {selectedCategory})
                    </button>
                )}
            </div>


            {/* dynamic text based on the filter */}
            {filteredTransactions.length === 0 ? (
                <p>No transactions found{selectedCategory ? ` for expenses in ${selectedCategory}` : ''}{selectedMonth !== 'all' ? ` in ${monthOptions.find(m => m.value === selectedMonth).label}` : ''}.</p>
            ) : (

                <ul className="expense-list">
                    {/* Iterate over combined, filtered list */}
                    {filteredTransactions.map((transaction) => (
                        <li 
                            key={transaction.transaction_id} 
                            // Dynamically apply border color class for income/expense distinction
                            className={`expense-item ${transaction.type === 'income' ? 'is-income' : 'is-expense'}`}
                        >
                            <div>
                                <strong>Type:</strong> 
                                {/* Dynamically apply text color class */}
                                <span className={transaction.type === 'income' ? 'income-type-label' : 'expense-type-label'}>
                                    {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                </span>
                            </div>
                            <div>
                                <strong>{transaction.type === 'expense' ? 'Category' : 'Source'}:</strong> {transaction.category}
                            </div>
                            <div>
                                <strong>Amount:</strong> ${transaction.amount}
                            </div>
                            <div><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</div>
                            {transaction.description && <div><strong>Description:</strong> {transaction.description}</div>}

                            {/* NEW: Delete Button (Phase 2 requirement) */}
                            <button 
                                onClick={() => handleDelete(transaction.transaction_id, transaction.type)}
                                className="delete-button"
                            >
                                Delete
                            </button>

                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
};


export default Dashboard;s
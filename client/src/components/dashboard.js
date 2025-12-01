// client/src/components/dashboard.js

// =========== IMPORTS ===========
import React, { useState, useEffect } from 'react'; 
import { useNavigate, Link } from 'react-router-dom';
// import expense form
import ExpenseForm from './expenseForm.js'; 
// import edit expense form
import EditExpenseForm from './EditExpenseForm.js'; 
// import edit income form
import EditIncomeForm from './EditIncomeForm.js';
// import income form
import IncomeForm from './incomeForm.js'; 
// NEW: Import savings forms
import SavingsForm from './SavingsForm.js';
import EditSavingsForm from './EditSavingsForm.js';
// import pi chart
import ExpensePieChart from './expensePieChart.js';
// NEW: import bar chart
import ExpenseBarChart from './ExpenseBarChart.js';
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
    // store list of income
    const [income, setIncome] = useState([]);
    // NEW: store list of savings
    const [savings, setSavings] = useState([]);
    // store predictions
    const [predictions, setPredictions] = useState([]);

    // State to track which entry is currently being edited
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [editingIncomeId, setEditingIncomeId] = useState(null);
    // NEW: State to track which savings entry is currently being edited
    const [editingSavingsId, setEditingSavingsId] = useState(null);

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
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No token found, please log in');
                setIsLoading(false);
                return;
            }

            const headers = {
                'Content-Type': 'application/json',
                'x-auth-token': token
            };

            // --- 1. Expenses ---
            const expenseResponse = await fetch('/api/expenses', { method: 'GET', headers: headers });
            if (!expenseResponse.ok) throw new Error('Failed to fetch expenses');
            setExpenses(await expenseResponse.json());

            // --- 2. Income ---
            const incomeResponse = await fetch('/api/income', { method: 'GET', headers: headers });
            if (incomeResponse.ok) setIncome(await incomeResponse.json());

            // --- 3. Savings (NEW) ---
            const savingsResponse = await fetch('/api/savings', { method: 'GET', headers: headers });
            if (savingsResponse.ok) setSavings(await savingsResponse.json());

            // --- 4. Predictions ---
            const predResponse = await fetch('/api/expenses/predictions', { method: 'GET', headers: headers });
            if (predResponse.ok) setPredictions(await predResponse.json());

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    // NEW: Generic Delete Handler (Handles Expense, Income, and Savings)
    const handleDelete = async (type, id) => {
        if (!window.confirm(`Are you sure you want to delete this ${type} entry (ID: ${id})?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/${type}s/${id}`, { // Builds the URL: /api/expenses/id, /api/income/id, or /api/savings/id
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.error || `Failed to delete ${type}`);
            }

            // Success: Fetch all data again to update the lists and summaries
            fetchAllData();

        } catch (err) {
            setError(`Deletion Error: ${err.message}`);
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

    // ======= Month Filter Configuration (Remains the same) =======
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

    // ==== Filtered Lists (Remains the same) ====
    const filteredExpenses = expenses.filter(expense => {
        const categoryMatch = !selectedCategory || expense.category === selectedCategory;
        const monthMatch = selectedMonth === 'all' || new Date(expense.date).getMonth() == selectedMonth; 
        return categoryMatch && monthMatch;
    });
    
    const filteredIncome = income.filter(item => {
        const monthMatch = selectedMonth === 'all' || new Date(item.date).getMonth() == selectedMonth;
        return monthMatch;
    });

    const filteredSavings = savings.filter(item => {
        const monthMatch = selectedMonth === 'all' || new Date(item.date).getMonth() == selectedMonth;
        return monthMatch;
    });
    // ===============================================


    // ===== JSX RETURN =======
    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome to your dashboard!</p>
            {/* --- expense summary --- */}
            <ExpenseSummary expenses={filteredExpenses} income={filteredIncome} savings={filteredSavings} />

            {/* Predictions Component */}
            <Predictions predictions={predictions} />

            {/* Forms Container - Allows the three forms to sit side-by-side */}
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', maxWidth: '1000px', width: '90%', margin: '0 auto 20px' }}>
                
                {/* Expense Form */}
                <div style={{ flex: 1 }}>
                    <ExpenseForm onExpenseAdded={fetchAllData} />
                </div>
                
                {/* Income Form */}
                <div style={{ flex: 1 }}>
                    <IncomeForm onIncomeAdded={fetchAllData} />
                </div>

                {/* Savings Form */}
                <div style={{ flex: 1 }}>
                    <SavingsForm onSavingsAdded={fetchAllData} />
                </div>
            </div>

            <hr />

            {/* --- Pi Chart --- */}
            <ExpensePieChart
                expenses={expenses}
                onCategorySelect={setSelectedCategory}
            />
            
            {/* NEW: Bar Chart for Monthly Trends */}
            <ExpenseBarChart
                expenses={expenses}
            />


            {/* --- Filter controls are placed above the list containers --- */}
            <h3 style={{ marginBottom: '10px', marginTop: '30px' }}>Recent Transactions</h3>
            <div className="filter-controls" style={{ margin: '0 auto 10px auto' }}> {/* Centering the filter controls */}
                
                {/* Month Dropdown */}
                <div> 
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
                {selectedCategory && (
                    <button
                        className="form-button" 
                        style={{width: 'auto', backgroundColor: '#ff6b6b', margin: 0}} 
                        onClick={() => setSelectedCategory(null)} 
                    >
                        Clear Filter (Showing: {selectedCategory})
                    </button>
                )}
            </div>

            {/* --- NEW: Transaction Lists Container (3 Columns) --- */}
            <div className="recent-transactions-container">
                
                {/* EXPENSES COLUMN */}
                <div className="transaction-list-column">
                    <h3 style={{ color: '#FF6384' }}>Expenses</h3>
                    {filteredExpenses.length === 0 ? (
                        <p style={{ color: '#aaa' }}>No expenses found.</p>
                    ) : (
                        <ul className="expense-list">
                            {filteredExpenses.map((expense) => (
                                <li key={expense.expense_id} className="expense-item">
                                    {editingExpenseId === expense.expense_id ? (
                                        <EditExpenseForm 
                                            expense={expense}
                                            onUpdate={fetchAllData} 
                                            onCancel={() => setEditingExpenseId(null)} 
                                        />
                                    ) : (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div><strong>Category:</strong> {expense.category}</div>
                                                    <div><strong>Amount:</strong> ${expense.amount}</div>
                                                    <div><strong>Date:</strong> {new Date(expense.date).toLocaleDateString()}</div>
                                                    {expense.description && <div><strong>Description:</strong> {expense.description}</div>}
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button 
                                                        onClick={() => setEditingExpenseId(expense.expense_id)}
                                                        style={{ background: '#4BC0C0', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', height: '40px'}}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete('expense', expense.expense_id)}
                                                        style={{ background: '#FF6384', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', height: '40px'}}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* INCOME COLUMN */}
                <div className="transaction-list-column">
                    <h3 style={{ color: '#A0D2EB' }}>Income</h3>
                    {filteredIncome.length === 0 ? (
                        <p style={{ color: '#aaa' }}>No income entries found.</p>
                    ) : (
                        <ul className="expense-list"> 
                            {filteredIncome.map((item) => (
                                <li key={item.income_id} className="expense-item" style={{borderLeft: '5px solid #A0D2EB'}}>
                                    {editingIncomeId === item.income_id ? (
                                        <EditIncomeForm
                                            incomeEntry={item}
                                            onUpdate={fetchAllData} 
                                            onCancel={() => setEditingIncomeId(null)} 
                                        />
                                    ) : (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div><strong>Source:</strong> {item.source}</div>
                                                    <div><strong>Amount:</strong> ${item.amount}</div>
                                                    <div><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</div>
                                                    {item.description && <div><strong>Description:</strong> {item.description}</div>}
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button 
                                                        onClick={() => setEditingIncomeId(item.income_id)}
                                                        style={{ background: '#A0D2EB', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', height: '40px'}}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete('income', item.income_id)}
                                                        style={{ background: '#FF6384', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', height: '40px'}}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* SAVINGS COLUMN */}
                <div className="transaction-list-column">
                    <h3 style={{ color: '#FFCE56' }}>Savings</h3>
                    {filteredSavings.length === 0 ? (
                        <p style={{ color: '#aaa' }}>No savings entries found.</p>
                    ) : (
                        <ul className="expense-list">
                            {filteredSavings.map((item) => (
                                <li key={item.savings_id} className="expense-item" style={{borderLeft: '5px solid #FFCE56'}}>
                                    {editingSavingsId === item.savings_id ? (
                                        <EditSavingsForm
                                            savingsEntry={item}
                                            onUpdate={fetchAllData} 
                                            onCancel={() => setEditingSavingsId(null)} 
                                        />
                                    ) : (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div>
                                                    <div><strong>Goal:</strong> {item.goal}</div>
                                                    <div><strong>Amount:</strong> ${item.amount}</div>
                                                    <div><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</div>
                                                    {item.description && <div><strong>Description:</strong> {item.description}</div>}
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button 
                                                        onClick={() => setEditingSavingsId(item.savings_id)}
                                                        style={{ background: '#FFCE56', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', height: '40px'}}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete('saving', item.savings_id)}
                                                        style={{ background: '#FF6384', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer', height: '40px'}}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div> {/* End of recent-transactions-container */}


        </div>
    );
};


export default Dashboard;
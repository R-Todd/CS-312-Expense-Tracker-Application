// client/src/components/expenseSummary.js

// =========== IMPORTS ===========
import React from 'react';
import '../App.css'; // Import styles
// ===============================

// ExpenseSummary component - now receives both expenses and incomes
const ExpenseSummary = ({ expenses, incomes }) => { // <-- ACCEPT NEW PROP

    // --- 1. Calculate Totals ---
    // Calculate total spending from expenses (Existing logic)
    const totalExpenses = expenses.reduce((accumulator, currentExpense) => {
        // Add the $ of current expense to the accumulator
        return accumulator + parseFloat(currentExpense.amount);
    }, 0); // accumulator starts at 0

    // Calculate total income (NEW for Phase 2)
    const totalIncome = incomes.reduce((accumulator, currentIncome) => {
        // Assuming income objects have an 'amount' field
        return accumulator + parseFloat(currentIncome.amount);
    }, 0);

    // Calculate Net Total (Income - Expenses) (NEW for Phase 2)
    const netTotal = totalIncome - totalExpenses;

    // Get the total number of expense items
    const totalItems = expenses.length;

    // --- 2. JSX Return ---
    return (
        <div className="summary-container">
            
            {/* TOTAL INCOME (NEW for Phase 2) */}
            <div className="summary-card">
                <div className="summary-card-title">Total Income</div>
                {/* Use a green color for income */}
                <div className="summary-card-value" style={{color: 'lightgreen'}}>${totalIncome.toFixed(2)}</div> 
            </div>
            
            {/* TOTAL EXPENSES (Phase 1 logic, kept for comparison) */}
            <div className="summary-card">
                <div className="summary-card-title">Total Expenses</div>
                {/* Format to 2 decimal places */}
                <div className="summary-card-value">${totalExpenses.toFixed(2)}</div>
            </div>

            {/* NET TOTAL (NEW for Phase 2) */}
            <div className="summary-card">
                <div className="summary-card-title">Net Total</div>
                {/* Color changes based on net value (positive = green, negative = red) */}
                <div className="summary-card-value" style={{color: netTotal >= 0 ? 'lightgreen' : '#FF6384'}}>
                    ${netTotal.toFixed(2)}
                </div>
            </div>
        </div>
    );
};

export default ExpenseSummary;
// client/src/components/expenseSummary.js

// =========== IMPORTS ===========
import React from 'react';
import '../App.css'; // Import styles
// ===============================

//  ExpenseSummary component - receives expense AND income data and displays it.
//  MODIFIED: Now accepts 'income' array as a prop.
const ExpenseSummary = ({ expenses, income }) => { //

    // --- 1. Calculate Totals ---
    // Use the .reduce() to calculate the total spending.
    // accumulator = running total
    const totalSpending = expenses.reduce((accumulator, currentExpense) => {
        // Add the $ of current expense to the accumulator
        return accumulator + parseFloat(currentExpense.amount);
    }, 0); // accumulator starts at 0

    // NEW: Calculate Total Income
    const totalIncome = income.reduce((accumulator, currentIncome) => {
        // Add the $ of current income to the accumulator
        return accumulator + parseFloat(currentIncome.amount);
    }, 0); // accumulator starts at 0

    // NEW: Calculate Net (Income - Spending)
    const netSavings = totalIncome - totalSpending;

    // Determine the color for the Net Savings card
    const netColor = netSavings >= 0 ? '#4BC0C0' : '#FF6384'; // Green for positive/zero, Red for negative

    // --- 2. JSX Return ---
    return (
        <div className="summary-container">
            {/* TOTAL INCOME (NEW CARD) */}
            <div className="summary-card">
                <div className="summary-card-title">Total Income</div>
                {/* Format to 2 decimal places */}
                <div className="summary-card-value" style={{ color: '#A0D2EB' }}>${totalIncome.toFixed(2)}</div>
            </div>
            
            {/* TOTAL SPENDING (EXISTING CARD) */}
            <div className="summary-card">
                <div className="summary-card-title">Total Spending</div>
                {/* Format to 2 decimal places */}
                <div className="summary-card-value">${totalSpending.toFixed(2)}</div>
            </div>
            
            {/* NET SAVINGS (NEW CARD) */}
            <div className="summary-card">
                <div className="summary-card-title">Net (Income - Expense)</div>
                {/* Format to 2 decimal places and use dynamic color */}
                <div className="summary-card-value" style={{ color: netColor }}>${netSavings.toFixed(2)}</div>
            </div>

            {/* The original Total Expenses card has been removed to make space for the new Net calculation. */}
        </div>
    );
};

export default ExpenseSummary;
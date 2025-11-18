// client/src/components/expenseSummary.js

// =========== IMPORTS ===========
import React from 'react';
import '../App.css'; // Import styles
// ===============================

//  ExpenseSummary component - just receives data and displays it.
const ExpenseSummary = ({ expenses }) => {

    // --- 1. Calculate Totals ---
    // Use the .reduce() to calculate the total spending.
    // accumulator = running total
    const totalSpending = expenses.reduce((accumulator, currentExpense) => {
        // Add the $ of current expense to the accumulator
        return accumulator + parseFloat(currentExpense.amount);
    }, 0); // accumulator starts at 0

    // Get the total number of expense items
    const totalItems = expenses.length;

    // --- 2. JSX Return ---
    return (
        <div className="summary-container">
            {/* TOTAL SPENDING */}
            <div className="summary-card">
                <div className="summary-card-title">Total Spending</div>
                {/* Format to 2 decimal places */}
                <div className="summary-card-value">${totalSpending.toFixed(2)}</div>
            </div>

            {/* TOTAL ITEMS */}
            <div className="summary-card">
                <div className="summary-card-title">Total Expenses</div>
                <div className="summary-card-value">{totalItems}</div>
            </div>

            {/* TODO: You can add an "Income" card here later */}
            {/*
            <div className="summary-card">
                <div className="summary-card-title">Total Income</div>
                <div className="summary-card-value">$0.00</div>
            </div>
            */}
        </div>
    );
};

export default ExpenseSummary;
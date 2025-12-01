// client/src/components/expenseSummary.js

// =========== IMPORTS ===========
import React from 'react';
import '../App.css'; // Import styles
// ===============================

//  ExpenseSummary component - receives expense AND income data and displays it.
//  MODIFIED: Now calculates and displays Average Daily Expenditure.
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

    // --- NEW: Calculate Average Daily Expenditure ---
    let averageDailyExpenditure = 0;
    
    if (expenses.length > 0) {
        // Find the earliest and latest dates in the filtered expense list
        const dates = expenses.map(expense => new Date(expense.date));
        
        // Use Math.min and Math.max with Date objects to find the range
        const earliestDate = new Date(Math.min(...dates));
        const latestDate = new Date(Math.max(...dates));
        
        // Calculate the difference in time (milliseconds)
        const timeDifference = latestDate.getTime() - earliestDate.getTime();
        
        // Convert milliseconds to days and add 1 day to include the start day.
        // Math.max(1, ...) ensures division by at least 1, even if all expenses are on the same day.
        const days = Math.max(1, Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1);

        // Calculate the average daily spending
        averageDailyExpenditure = totalSpending / days;
    }


    // --- 2. JSX Return (Added a new summary card) ---
    return (
        <div className="summary-container">
            {/* TOTAL INCOME (EXISTING CARD) */}
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

            {/* NEW CARD: AVERAGE DAILY EXPENDITURE */}
            <div className="summary-card">
                <div className="summary-card-title">Avg Daily Expense</div>
                {/* Format to 2 decimal places, using a distinct color */}
                <div className="summary-card-value" style={{ color: '#FFCE56' }}>${averageDailyExpenditure.toFixed(2)}</div>
            </div>
            
            {/* NET SAVINGS (EXISTING CARD) */}
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
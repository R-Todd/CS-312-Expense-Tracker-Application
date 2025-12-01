// client/src/components/expenseSummary.js

// =========== IMPORTS ===========
import React from 'react';
import '../App.css'; // Import styles
// ===============================

//  ExpenseSummary component - MODIFIED to accept 'savings'
const ExpenseSummary = ({ expenses, income, savings }) => { 

    // --- 1. Calculate Totals ---
    // Total Spending
    const totalSpending = expenses.reduce((accumulator, currentExpense) => {
        return accumulator + parseFloat(currentExpense.amount);
    }, 0); 

    // Total Income
    const totalIncome = income.reduce((accumulator, currentIncome) => {
        return accumulator + parseFloat(currentIncome.amount);
    }, 0); 
    
    // NEW: Calculate Total Savings Contributions
    const totalSavings = savings.reduce((accumulator, currentSavings) => {
        return accumulator + parseFloat(currentSavings.amount);
    }, 0); 

    // Calculate Net (Income - Spending)
    const netSavings = totalIncome - totalSpending;

    // Determine the color for the Net Savings card
    const netColor = netSavings >= 0 ? '#4BC0C0' : '#FF6384'; // Green for positive/zero, Red for negative

    // --- Calculate Average Daily Expenditure ---
    let averageDailyExpenditure = 0;
    
    if (expenses.length > 0) {
        const dates = expenses.map(expense => new Date(expense.date));
        const earliestDate = new Date(Math.min(...dates));
        const latestDate = new Date(Math.max(...dates));
        const timeDifference = latestDate.getTime() - earliestDate.getTime();
        const days = Math.max(1, Math.ceil(timeDifference / (1000 * 60 * 60 * 24)) + 1);
        averageDailyExpenditure = totalSpending / days;
    }


    // --- 2. JSX Return (Now includes Total Savings) ---
    return (
        // Increased max-width to accommodate 5 metrics
        <div className="summary-container" style={{ maxWidth: '1000px', margin: '20px auto', flexWrap: 'wrap' }}>
            
            {/* TOTAL INCOME */}
            <div className="summary-card" style={{ flexBasis: '200px' }}>
                <div className="summary-card-title">Total Income</div>
                <div className="summary-card-value" style={{ color: '#A0D2EB' }}>${totalIncome.toFixed(2)}</div>
            </div>
            
            {/* TOTAL SPENDING */}
            <div className="summary-card" style={{ flexBasis: '200px' }}>
                <div className="summary-card-title">Total Spending</div>
                <div className="summary-card-value">${totalSpending.toFixed(2)}</div>
            </div>

            {/* NEW CARD: TOTAL SAVINGS CONTRIBUTED */}
            <div className="summary-card" style={{ flexBasis: '200px' }}>
                <div className="summary-card-title">Total Savings</div>
                <div className="summary-card-value" style={{ color: '#FFCE56' }}>${totalSavings.toFixed(2)}</div>
            </div>
            
            {/* NET (INCOME - EXPENSE) */}
            <div className="summary-card" style={{ flexBasis: '200px' }}>
                <div className="summary-card-title">Net (Income - Expense)</div>
                <div className="summary-card-value" style={{ color: netColor }}>${netSavings.toFixed(2)}</div>
            </div>

            {/* AVERAGE DAILY EXPENDITURE */}
            <div className="summary-card" style={{ flexBasis: '200px' }}>
                <div className="summary-card-title">Avg Daily Expense</div>
                <div className="summary-card-value" style={{ color: '#4BC0C0' }}>${averageDailyExpenditure.toFixed(2)}</div>
            </div>
            
        </div>
    );
};

export default ExpenseSummary;
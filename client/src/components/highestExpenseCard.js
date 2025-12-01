// client/src/components/highestExpenseCard.js

// =========== IMPORTS ===========
import React from 'react';
import '../App.css'; // Import styles
// ===============================

// HighestExpenseCard component receives the list of expenses
// This component performs the "Trend Detection" required by Task 6
const HighestExpenseCard = ({ expenses }) => {

    // --- 1. Aggregate expenses by category ---
    const categoryTotals = expenses.reduce((acc, expense) => {
        // Use 'Uncategorized' as a fallback if the category field is somehow empty
        const category = expense.category || 'Uncategorized';
        // Ensure amount is treated as a number
        const amount = parseFloat(expense.amount);
        
        // Accumulate total for each category
        acc[category] = (acc[category] || 0) + amount;
        
        return acc;
    }, {}); // Start with an empty object

    // --- 2. Find the highest spending category ---
    let highestCategory = 'N/A';
    let highestAmount = 0;

    // Iterate through the aggregated totals
    for (const category in categoryTotals) {
        if (categoryTotals[category] > highestAmount) {
            highestAmount = categoryTotals[category];
            highestCategory = category;
        }
    }
    
    // Check if there are any expenses at all
    const hasExpenses = expenses.length > 0;

    // --- 3. JSX Return (using custom classes for styling) ---
    return (
        // Reusing .summary-card style, adding .highest-expense-card for specific sizing/colors
        <div className="summary-card highest-expense-card">
            <div className="summary-card-title">Highest Spending Trend</div>
            
            {hasExpenses ? (
                <>
                    {/* The category that represents the trend */}
                    <div className="highest-category-label">{highestCategory}</div>
                    
                    {/* The dollar amount, styled with the expense-trend-value class */}
                    <div className="summary-card-value expense-trend-value">
                        ${highestAmount.toFixed(2)}
                    </div>
                </>
            ) : (
                <div className="highest-category-label no-data-message">No Expense Data Yet</div>
            )}
        </div>
    );
};

export default HighestExpenseCard;
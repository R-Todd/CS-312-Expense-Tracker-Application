// client/src/components/ExpenseBarChart.js

import React from 'react';
// Import the 'Bar' chart type and other necessities from the libraries
import { Bar } from 'react-chartjs-2';
import { 
    Chart as ChartJS, 
    CategoryScale, // X axis
    LinearScale,   // Y axis
    BarElement,    // Bar element
    Title, 
    Tooltip, 
    Legend 
} from 'chart.js';

// NEW: Import the centralized color map
import { CATEGORY_COLORS } from '../utils/colorPalette';

// Register the components Chart.js needs
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

// Array of month names for labeling the chart
const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// ExpenseBarChart component receives the full list of expenses
const ExpenseBarChart = ({ expenses }) => {
    
    // 1. Identify all unique categories
    const allCategories = [...new Set(expenses.map(exp => exp.category))].sort();

    // 2. Aggregate total spending per category per month
    const monthlyCategoryTotals = expenses.reduce((acc, expense) => {
        const date = new Date(expense.date);
        const monthIndex = date.getMonth(); 
        const year = date.getFullYear();
        const monthYearKey = `${monthNames[monthIndex]} ${year}`; 
        const amount = parseFloat(expense.amount);
        const category = expense.category;
        
        if (!acc[monthYearKey]) {
            acc[monthYearKey] = {};
        }
        // Sum the amount for the specific category within this month
        acc[monthYearKey][category] = (acc[monthYearKey][category] || 0) + amount;
        
        return acc;
    }, {}); 

    // 3. Extract and sort unique month/year labels (X-axis)
    const labels = Object.keys(monthlyCategoryTotals).sort((a, b) => {
        // Sort by parsing the Month Year string back to Date
        const dateA = new Date(a.replace(' ', ' 1, '));
        const dateB = new Date(b.replace(' ', ' 1, '));
        return dateA - dateB;
    });

    // 4. Create datasets: one for each category
    const datasets = allCategories.map(category => {
        // MODIFIED: Use the imported CATEGORY_COLORS map with a fallback
        const color = CATEGORY_COLORS[category] || CATEGORY_COLORS['Default']; 
        
        return {
            label: category,
            // Get data for this category across all months, filling in 0 for missing months
            data: labels.map(monthYear => monthlyCategoryTotals[monthYear][category] || 0),
            backgroundColor: color, 
        };
    });


    // --- 5. Format data for Chart.js ---
    const chartData = {
        labels: labels,
        datasets: datasets,
    };

    // --- 6. Chart.js options (Including Axis Titles and Formatting) ---
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white'
                }
            },
            title: {
                display: true,
                text: 'Monthly Spending Breakdown by Category',
                color: 'white'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            // Format the tooltip label as currency
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true, // Stack the bars
                title: { // NEW: X-Axis Title
                    display: true,
                    text: 'Month / Year',
                    color: 'white'
                },
                ticks: {
                    color: 'white'
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            },
            y: {
                stacked: true, // Stack the bars
                title: { // NEW: Y-Axis Title
                    display: true,
                    text: 'Total Expenditure ($)',
                    color: 'white'
                },
                ticks: { 
                    color: 'white',
                    callback: function(value, index, ticks) {
                        // Format the tick value as currency, rounded to whole dollars for clean axis labels
                        return new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0 
                        }).format(value);
                    }
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        }
    };
    
    return (
        <div className="chart-container" style={{ maxWidth: '800px', margin: '40px auto 20px auto' }}>
            <Bar 
                data={chartData} 
                options={chartOptions} 
            />
        </div>
    );
};

export default ExpenseBarChart;
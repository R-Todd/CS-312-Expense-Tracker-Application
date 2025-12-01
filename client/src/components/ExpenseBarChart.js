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
    
    // --- 1. Aggregate expenses by Month/Year ---
    const monthlyTotals = expenses.reduce((acc, expense) => {
        const date = new Date(expense.date);
        const monthIndex = date.getMonth(); // 0-11
        const year = date.getFullYear();
        const key = `${monthNames[monthIndex]} ${year}`; // e.g., 'Nov 2025'
        
        const amount = parseFloat(expense.amount);
        
        if (!acc[key]) {
            acc[key] = 0;
        }
        acc[key] += amount;
        
        return acc;
    }, {}); // Start with an empty object

    // Convert the map into sorted arrays for labels and data
    const labels = Object.keys(monthlyTotals).sort((a, b) => {
        // Simple sort logic based on parsing the Month Year string back to Date
        const dateA = new Date(a.replace(' ', ' 1, '));
        const dateB = new Date(b.replace(' ', ' 1, '));
        return dateA - dateB;
    });

    const dataValues = labels.map(label => monthlyTotals[label]);

    // --- 2. Format data for Chart.js ---
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'Monthly Spending Total',
                data: dataValues,
                backgroundColor: '#FF6384', // Pink/Red for Expenses
                borderColor: '#FF6384',
                borderWidth: 1,
                hoverBackgroundColor: '#FF9F40',
            },
        ],
    };

    // Chart.js options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: 'white' // Make legend text white
                }
            },
            title: {
                display: true,
                text: 'Expense Trends Over Time (All Months)',
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
                ticks: {
                    color: 'white' // X-axis label color
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)' // Light grid lines
                }
            },
            y: {
                ticks: {
                    color: 'white' // Y-axis label color
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        }
    };
    
    return (
        // Added inline style to increase max width for the bar chart
        <div className="chart-container" style={{ maxWidth: '800px', margin: '40px auto 20px auto' }}>
            <Bar 
                data={chartData} 
                options={chartOptions} 
            />
        </div>
    );
};

export default ExpenseBarChart;
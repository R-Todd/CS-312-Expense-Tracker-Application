// client/src/components/expensePieChart.js

import React, { useRef } from 'react';
// Import the 'Pie' chart type and other necessities from the libraries
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getElementAtEvent } from 'react-chartjs-2';

// Register the components Chart.js needs
ChartJS.register(ArcElement, Tooltip, Legend);

// receives the list of expenses and the 'onCategorySelect' function
const ExpensePieChart = ({ expenses, onCategorySelect }) => {
    
    // --- 1. Process the expenses data ---
    // filter expenses by category and sum amounts
    const categoryTotals = expenses.reduce((acc, expense) => {
        const { category, amount } = expense;
        // Convert amount from string to number
        const numAmount = parseFloat(amount); 
        
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += numAmount;
        
        return acc;
    }, {}); // Start with an empty object

    // --- 2. Format data for Chart.js ---
    const chartData = {
        // The labels for the chart (e.g., [Food, Transport, Coffee])
        labels: Object.keys(categoryTotals),
        datasets: [
            {
                label: 'Expenses by Category',
                // The values for the chart 
                data: Object.values(categoryTotals),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                hoverBackgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                borderColor: '#282c34',
                borderWidth: 2,
            },
        ],
    };

    // Chart.js options
    const chartOptions = {
        plugins: {
            legend: {
                labels: {
                    color: 'white' // Make legend text white
                }
            }
        }
    };
    
    // useRef to get access to the chart instance
    const chartRef = useRef(null);

    // --- 3. Handle Clicks on the Chart ---
    const onClick = (event) => {
        const chart = chartRef.current;
        if (!chart) {
            return;
        }

        // getElementAtEvent -- finds which slice of the pie was clicked
        const element = getElementAtEvent(chart, event);

        if (element.length > 0) {
            // Get the index of the clicked slice
            const dataIndex = element[0].index;
            // Get the label (Category) for that slice
            const category = chartData.labels[dataIndex];
            
            // Call the function passed from dashboard.js with the selected category
            onCategorySelect(category);
        }
    };

    return (
        <div className="chart-container">
            <Pie 
                ref={chartRef}
                data={chartData} 
                options={chartOptions}
                onClick={onClick} 
            />
        </div>
    );
};

export default ExpensePieChart;
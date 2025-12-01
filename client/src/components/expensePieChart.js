// client/src/components/expensePieChart.js

import React, { useRef } from 'react';
// Import the 'Pie' chart type and other necessities from the libraries
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getElementAtEvent } from 'react-chartjs-2';

// MODIFIED: Import BOTH the map and the array (the map is used for strict color matching)
import { CATEGORY_COLORS, BACKGROUND_COLOR_ARRAY } from '../utils/colorPalette';

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

    // --- 2. Format data for Chart.js (FIXED FOR COLOR CONSISTENCY) ---
    // FIX: Generate arrays for labels, data, and colors in a synchronized way 
    // using the CATEGORY_COLORS map to ensure consistent color assignment regardless of iteration order.
    
    // Sort keys to maintain a consistent rendering order, although direct color mapping is the main fix.
    const categories = Object.keys(categoryTotals).sort(); 
    
    const labels = [];
    const data = [];
    const backgroundColors = [];

    categories.forEach(category => {
        // Skip the 'Default' key if it somehow ends up in the totals object
        if (category === 'Default') return;

        labels.push(category);
        data.push(categoryTotals[category]);
        
        // CRITICAL FIX: Use the CATEGORY_COLORS map to get the exact color for the category, 
        // ensuring consistency with the Bar Chart and avoiding array index mismatch.
        backgroundColors.push(CATEGORY_COLORS[category] || CATEGORY_COLORS['Default']);
    });

    const chartData = {
        // Use the consistently ordered labels array
        labels: labels,
        datasets: [
            {
                label: 'Expenses by Category',
                // Use the consistently ordered data array
                data: data,
                // Use the explicitly mapped background colors array
                backgroundColor: backgroundColors,
                hoverBackgroundColor: backgroundColors,
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
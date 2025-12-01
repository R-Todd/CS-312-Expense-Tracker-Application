// client/src/utils/colorPalette.js


const CATEGORY_COLORS = {
    // Primary Colors (used in bar chart datasets)
    'Rent': '#36A2EB',      // Blue
    'Food': '#FF6384',      // Pink/Red 
    'Bills': '#FFCE56',     // Yellow 
    'Transport': '#4BC0C0', // Cyan 
    'Entertainment': '#9966FF', // Purple 
    'Coffee': '#FF9F40',    // Orange
    
    // Fallback colors 
    'Clothing': '#90EE90',  // Light Green
    'Health': '#FFDAB9',    // Peach
    'Default': '#AAAAAA'    // Grey default
};

// Array of background colors
const BACKGROUND_COLOR_ARRAY = [
    CATEGORY_COLORS['Rent'],
    CATEGORY_COLORS['Food'],
    CATEGORY_COLORS['Bills'],
    CATEGORY_COLORS['Transport'],
    CATEGORY_COLORS['Entertainment'],
    CATEGORY_COLORS['Coffee'],
    CATEGORY_COLORS['Clothing'],
    CATEGORY_COLORS['Health'],
    CATEGORY_COLORS['Default'],
];

export { CATEGORY_COLORS, BACKGROUND_COLOR_ARRAY };
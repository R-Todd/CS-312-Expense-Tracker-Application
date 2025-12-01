// client/src/utils/colorPalette.js

// Define primary colors for consistency. Use descriptive names for keys.
const CATEGORY_COLORS = {
    // Primary Colors (used in bar chart datasets)
    'Rent': '#FF6384',      // Pink/Red (Consistent with the requested color for Rent in the bar chart)
    'Food': '#36A2EB',      // Blue (Consistent with the requested color for Food in the bar chart)
    'Bills': '#FFCE56',     // Yellow (Consistent with the requested color for Bills in the bar chart)
    'Transport': '#4BC0C0', // Cyan (Consistent with the requested color for Transport in the bar chart)
    'Entertainment': '#9966FF', // Purple (Consistent with the requested color for Entertainment in the bar chart)
    'Coffee': '#FF9F40',    // Orange
    
    // Fallback/Secondary colors (for user-added categories)
    'Clothing': '#90EE90',  // Light Green
    'Health': '#FFDAB9',    // Peach
    'Default': '#AAAAAA'    // Grey fallback for unknown categories
};

// Array of background colors for sequential use in the Pie Chart datasets
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
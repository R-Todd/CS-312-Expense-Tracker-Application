// --------------------- Server Dependencies --------------------- //
// express : Web framework for building API endpoints
// cors    : Enables Cross-Origin Resource Sharing (allows client to connect)
// dotenv  : Loads environment variables from a .env file into process.env
// --------------------- --------------------- --------------------- //

const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: '../.env' });


// --------------------- Express App Setup --------------------- //
const app = express();
const PORT = process.env.SERVER_PORT || 5000;
// ------------------------------------------------------------- //


// --------------------- Middleware Setup ---------------------- //
app.use(cors()); //  Allows requests from your React frontend
app.use(express.json()); // Parses incoming JSON requests
// ------------------------------------------------------------ //


// --------------------- API Endpoints ------------------------- //


// --- Server Run  Endpoint --- //
app.get('/', (req, res) => {
    res.send('Expense Tracker API is running');
});


// --- Expenses Endpoint --- //
app.get('/api/expenses', (req, res) => {
    res.json([
        {
        id: 1,
        amount: 25.5,
        category: "Food",
        date: "2025-01-01",
        description: "Example placeholder expense for Phase 1"
        }
    ]);
});


// --------------------- Start Server ------------------------- //
app.listen(PORT, () => {
    console.log(` ||| ---- Server is running on port ${PORT} ---- |||`);
    console.log(` ||| ----     http://localhost:${PORT}     ---- |||`);
});
// ------------------------------------------------------------ //
// server/server.js

// ================== IMPORTS ==================

// Load environment variables from .env file
// Load Dotenv configuration
require("dotenv").config();

// Import required dependencies
const express = require("express");
const cors = require("cors");
const pool = require("./database/database"); // Database connection pool

// Initialize Express application
const app = express();


// Enable Cross-Origin Resource Sharing (CORS) to allow requests from the client
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());


// ================== ROUTES ==================

// Root route - Returns a simple message to confirm API is running
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running");
});

// Database connection test route - Queries current timestamp from PostgreSQL
app.get("/test-db", async (req, res) => {
  try {
    // Execute a simple query to test database connection
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    // Return error if database connection fails
    res.status(500).json({ success: false, error: err.message });
  }
});

// ===== SERVER STARTUP =====

// Set port from environment variable or default to 5000
const PORT = process.env.SERVER_PORT || 5000;

// Start the Express server and listen on the specified port
app.listen(PORT, () => {
  console.log("||| ---- Server is running on port " + PORT + " ---- |||");
  console.log("||| ----     http://localhost:" + PORT + "     ---- |||");
});

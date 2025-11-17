// server/server.js

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./database/database"); // Correct path inside /server

const app = express();
app.use(cors());
app.use(express.json());

// Example root route
app.get("/", (req, res) => {
  res.send("Expense Tracker API is running");
});

// Example test DB route
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, time: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
const PORT = process.env.SERVER_PORT || 5000;
app.listen(PORT, () => {
  console.log("||| ---- Server is running on port " + PORT + " ---- |||");
  console.log("||| ----     http://localhost:" + PORT + "     ---- |||");
});

// server/database/database.js

// Import PostgreSQL connection pool from the 'pg' library
const { Pool } = require("pg");

// Create a new connection pool using environment variables
// These values come from your .env file or Docker environment
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",   // Database host (Docker uses "db")
  user: process.env.DB_USER,                 // PostgreSQL username
  password: process.env.DB_PASSWORD,         // PostgreSQL password
  database: process.env.DB_NAME,             // PostgreSQL database name
  port: process.env.DB_PORT || 5432,         // Default Postgres port
});

// -----------------------------------------------
// Retry Logic for Dockerized PostgreSQL
// -----------------------------------------------
// connectWithRetry():
//      - attempts to connect up to 10 times.
//      When Docker Compose starts, 
//      - the Node server usually boots faster than the Postgres container. 
//      To resolve this error
//      - we wait for the DB to be ready.
// -----------------------------------------------

async function connectWithRetry() {
  const maxRetries = 10;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Try to connect to the database
      const client = await pool.connect();
      console.log("||| ----     PostgreSQL is ready        ---- |||");
      console.log("||| ----     Connected to PostgreSQL    ---- |||");
      console.log("||| ---- http://localhost:5000/test-db  ---- |||");

      // Release the connection back to the pool
      client.release();

      return; // Exit the retry loop once successful
    } catch (err) {
      // If connection fails, wait 1 second and retry
      console.log(
        `Postgres not ready (attempt ${attempt}/${maxRetries}) – retrying in 1s`
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  // After all retries fail, log a fatal error to help with debugging
  console.error("Failed to connect to PostgreSQL after multiple attempts");
}

// Start attempting to connect immediately when the module loads
connectWithRetry();

// Export the pool so the rest of the server can run queries
module.exports = pool;

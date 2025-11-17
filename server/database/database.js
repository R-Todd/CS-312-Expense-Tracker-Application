// server/database/database.js

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

// Retry logic for Docker
async function connectWithRetry() {
  const maxRetries = 10;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const client = await pool.connect();
      console.log("Connected to PostgreSQL");
      client.release();
      return;
    } catch (err) {
      console.log(
        `Postgres not ready (attempt ${attempt}/${maxRetries}) – retrying in 1s`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.error("Failed to connect to PostgreSQL after multiple attempts");
}

connectWithRetry();

module.exports = pool;

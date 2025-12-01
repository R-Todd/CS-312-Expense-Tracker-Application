// server/seed.js

// This script populates the database with sample data for testing.

const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: '../.env' }); // Adjust path to root .env file

// --- Configuration ---
// Note: This needs to match the setup in server/database/database.js and docker-compose.yml
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 5432,
});

async function seedDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log("Starting database seeding...");

    // 1. CLEANUP: Drop tables in correct order to avoid foreign key errors
    console.log("1. Dropping existing tables (if they exist)...");
    await client.query("DROP TABLE IF EXISTS incomes;");
    await client.query("DROP TABLE IF EXISTS expenses;");
    await client.query("DROP TABLE IF EXISTS users;");

    // 2. RECREATE: Create the users table (Phase 1 structure)
    console.log("2. Creating users table...");
    await client.query(`
      CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 3. RECREATE: Create the expenses table (Phase 1 structure)
    console.log("3. Creating expenses table...");
    await client.query(`
      CREATE TABLE expenses (
        expense_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        amount NUMERIC(15, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        description VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 4. RECREATE: Create the incomes table (Phase 2 structure)
    console.log("4. Creating incomes table...");
    await client.query(`
      CREATE TABLE incomes (
        income_id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
        amount NUMERIC(15, 2) NOT NULL,
        source VARCHAR(100) NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        description VARCHAR(255),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 5. INSERT: Create test user
    console.log("5. Inserting test user: 'testuser'...");
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);
    const userResult = await client.query(
      `INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING user_id`,
      ['testuser', 'test@example.com', passwordHash, 'Test User']
    );
    const userId = userResult.rows[0].user_id;

    // 6. INSERT: Sample Expenses (for Pie Chart, Filter, and Trend Analysis)
    console.log("6. Inserting sample expenses...");
    const expenses = [
      // High spending category (Food) - Should be detected as highest trend
      { amount: 55.00, category: 'Food', date: '2025-11-28', description: 'Grocery run' },
      { amount: 15.00, category: 'Food', date: '2025-11-29', description: 'Lunch out' },
      { amount: 45.00, category: 'Food', date: '2025-12-01', description: 'Dinner supplies' },
      // Medium spending category (Housing)
      { amount: 1200.00, category: 'Rent', date: '2025-12-01', description: 'Monthly rent payment' },
      // Low spending category
      { amount: 10.00, category: 'Transport', date: '2025-12-01', description: 'Bus fare' },
      { amount: 25.00, category: 'Transport', date: '2025-11-25', description: 'Uber' },
    ];

    for (const exp of expenses) {
      await client.query(
        'INSERT INTO expenses (user_id, amount, category, date, description) VALUES ($1, $2, $3, $4, $5)',
        [userId, exp.amount, exp.category, exp.date, exp.description]
      );
    }

    // 7. INSERT: Sample Incomes (for Net Total calculation)
    console.log("7. Inserting sample incomes...");
    const incomes = [
      { amount: 3500.00, source: 'Salary', date: '2025-12-01', description: 'Monthly Paycheck' },
      { amount: 200.00, source: 'Freelance', date: '2025-11-15', description: 'Project payment' },
    ];

    for (const inc of incomes) {
      await client.query(
        'INSERT INTO incomes (user_id, amount, source, date, description) VALUES ($1, $2, $3, $4, $5)',
        [userId, inc.amount, inc.source, inc.date, inc.description]
      );
    }

    console.log("Database seeding completed successfully! Test user: 'testuser' / 'password123'");
  } catch (error) {
    console.error("Database seeding failed:", error.message);
  } finally {
    if (client) {
      client.release();
    }
    pool.end();
  }
}

seedDatabase();
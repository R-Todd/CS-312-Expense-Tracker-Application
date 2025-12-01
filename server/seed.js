// server/seed.js

// ================== IMPORTS ==================

// Load environment variables from .env file
require("dotenv").config({ path: '../.env' }); 

const pool = require('./database/database'); // Database connection pool
const bcrypt = require('bcryptjs'); // For password hashing

// ================== TEST DATA ==================

const TEST_PASSWORD = 'password123';
const TEST_USERNAME = 'testuser';
const TEST_EMAIL = 'test@example.com';
const TEST_FULL_NAME = 'Test User';

// ================== SEED FUNCTION ==================

async function seedDatabase() {
    console.log('--- Starting Database Seeding ---');

    try {
        // --- 1. Clear existing data ---
        console.log('Clearing existing income and expense data...');
        // Order matters: must delete from child tables (expenses, income) before parent (users)
        await pool.query('DELETE FROM income'); 
        await pool.query('DELETE FROM expenses'); 
        await pool.query('DELETE FROM users');
        console.log('Tables cleared successfully.');

        
        // --- 2. Insert Test User ---
        console.log(`Inserting test user: ${TEST_USERNAME}`);
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(TEST_PASSWORD, salt);

        const newUser = await pool.query(
            "INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING user_id",
            [TEST_USERNAME, TEST_EMAIL, passwordHash, TEST_FULL_NAME]
        );
        const userId = newUser.rows[0].user_id;
        console.log(`Test User ID: ${userId}. Password is '${TEST_PASSWORD}'`);


        // --- 3. Insert Test Expenses (for prediction and trends) ---
        console.log('Inserting sample expense data...');
        const expenses = [
            // Food (Recent for predictions)
            [userId, 25.50, 'Food', '2025-11-28', 'Dinner at Restaurant'],
            [userId, 15.00, 'Food', '2025-11-29', 'Lunch Takeout'],
            [userId, 18.25, 'Food', '2025-11-30', 'Groceries for the week'],
            // Bills
            [userId, 150.00, 'Bills', '2025-10-05', 'Electricity Bill'],
            [userId, 60.00, 'Bills', '2025-11-05', 'Internet'],
            // Travel
            [userId, 45.00, 'Travel', '2025-11-15', 'Gas refill'],
        ];

        for (const exp of expenses) {
            await pool.query(
                'INSERT INTO expenses (user_id, amount, category, date, description) VALUES ($1, $2, $3, $4, $5)',
                exp
            );
        }

        
        // --- 4. Insert Test Income ---
        console.log('Inserting sample income data...');
        const income = [
            [userId, 3500.00, 'Salary', '2025-11-01', 'Monthly Paycheck'],
            [userId, 500.00, 'Freelance', '2025-11-15', 'Project payment'],
        ];

        for (const inc of income) {
            await pool.query(
                'INSERT INTO income (user_id, amount, source, date, description) VALUES ($1, $2, $3, $4, $5)',
                inc
            );
        }

        console.log('--- Database Seeding Complete ---');

    } catch (err) {
        console.error('SEEDING FAILED:', err.message);
        process.exit(1); // Exit with failure code
    } finally {
        // Always close the database connection pool
        // This is important for the script to exit cleanly
        pool.end(); 
    }
}

seedDatabase();
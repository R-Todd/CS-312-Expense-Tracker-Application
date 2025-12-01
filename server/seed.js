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
        console.log('Clearing existing savings, income, and expense data...');
        // Order matters: must delete from child tables before parent (users)
        await pool.query('DELETE FROM savings'); 
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


        // --- 3. Insert Test Expenses (July 2025 - Dec 2025) ---
        console.log('Inserting 6 months of sample expense data...');
        const expenses = [
            // July 2025
            [userId, 1200.00, 'Rent', '2025-07-01', 'Monthly Rent Payment'],
            [userId, 300.00, 'Bills', '2025-07-15', 'Electric/Internet'],
            [userId, 150.00, 'Transport', '2025-07-30', 'Gas/Tolls'],
            // August 2025
            [userId, 1200.00, 'Rent', '2025-08-01', 'Monthly Rent Payment'],
            [userId, 450.00, 'Food', '2025-08-10', 'Groceries'],
            [userId, 80.00, 'Entertainment', '2025-08-25', 'Concert Tickets'],
            // September 2025
            [userId, 1200.00, 'Rent', '2025-09-01', 'Monthly Rent Payment'],
            [userId, 320.00, 'Bills', '2025-09-12', 'Electric/Internet'],
            [userId, 100.00, 'Food', '2025-09-28', 'Restaurant Dinner'],
            // October 2025
            [userId, 1200.00, 'Rent', '2025-10-01', 'Monthly Rent Payment'],
            [userId, 150.00, 'Entertainment', '2025-10-18', 'Video Game Purchase'],
            [userId, 75.00, 'Food', '2025-10-31', 'Halloween Snacks'],
            // November 2025
            [userId, 1200.00, 'Rent', '2025-11-01', 'Monthly Rent Payment'],
            [userId, 350.00, 'Food', '2025-11-05', 'Large Grocery Trip'],
            [userId, 120.00, 'Transport', '2025-11-20', 'Car Maintenance'],
            // December 2025 (Recent for predictions)
            [userId, 1200.00, 'Rent', '2025-12-01', 'Monthly Rent Payment'],
            [userId, 30.00, 'Food', '2025-12-08', 'Quick Lunch'],
            [userId, 60.00, 'Food', '2025-12-15', 'Weekly Coffee Runs'],
            [userId, 250.00, 'Bills', '2025-12-25', 'Phone Bill'],
        ];

        for (const exp of expenses) {
            await pool.query(
                'INSERT INTO expenses (user_id, amount, category, date, description) VALUES ($1, $2, $3, $4, $5)',
                exp
            );
        }

        
        // --- 4. Insert Test Income (July 2025 - Dec 2025) ---
        console.log('Inserting 6 months of sample income data...');
        const income = [
            [userId, 4000.00, 'Salary', '2025-07-26', 'Monthly Paycheck'],
            [userId, 4000.00, 'Salary', '2025-08-26', 'Monthly Paycheck'],
            [userId, 4000.00, 'Salary', '2025-09-26', 'Monthly Paycheck'],
            [userId, 4000.00, 'Salary', '2025-10-26', 'Monthly Paycheck'],
            [userId, 4200.00, 'Salary', '2025-11-26', 'Monthly Paycheck + Raise'],
            [userId, 4200.00, 'Salary', '2025-12-26', 'Monthly Paycheck'],
            [userId, 500.00, 'Bonus', '2025-12-10', 'Year-end Bonus'],
        ];

        for (const inc of income) {
            await pool.query(
                'INSERT INTO income (user_id, amount, source, date, description) VALUES ($1, $2, $3, $4, $5)',
                inc
            );
        }

        
        // --- 5. Insert Test Savings (July 2025 - Dec 2025) ---
        console.log('Inserting 6 months of sample savings data...');
        const savings = [
            [userId, 500.00, 'Emergency Fund', '2025-07-05', 'Automatic Monthly Transfer'],
            [userId, 500.00, 'Emergency Fund', '2025-08-05', 'Automatic Monthly Transfer'],
            [userId, 500.00, 'Emergency Fund', '2025-09-05', 'Automatic Monthly Transfer'],
            [userId, 500.00, 'Emergency Fund', '2025-10-05', 'Automatic Monthly Transfer'],
            [userId, 600.00, 'Vacation Fund', '2025-11-05', 'Vacation Goal Contribution'],
            [userId, 600.00, 'Vacation Fund', '2025-12-05', 'Vacation Goal Contribution'],
        ];

        for (const save of savings) {
            await pool.query(
                'INSERT INTO savings (user_id, amount, goal, date, description) VALUES ($1, $2, $3, $4, $5)',
                save
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
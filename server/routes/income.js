// server/routes/income.js

const express = require('express');
const router = express.Router();
const pool = require('../database/database');
const authMiddleware = require('../middleware/authMiddleware');

// | -------- Create New Income Entry (POST) -------- |
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Get data from request body and user ID from token
        const { amount, source, date, description } = req.body;
        const userId = req.user.id;

        // Insert new income record into the database
        const newIncome = await pool.query(
            'INSERT INTO income (user_id, amount, source, date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, amount, source, date, description]
        );
        res.json(newIncome.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error adding income' });
    }
});

// | -------- Get All Income Entries for User (GET) -------- |
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch all income entries, ordered by date descending
        const income = await pool.query(
            'SELECT * FROM income WHERE user_id = $1 ORDER BY date DESC',
            [userId]
        );
        res.json(income.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error fetching income' });
    }
});

// | -------- Future: Update Income Entry (PUT route) -------- |
// Included for completeness, similar to expenses.
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { amount, source, date, description } = req.body;
        const { id } = req.params;
        const userId = req.user.id;
        const updateIncome = await pool.query(
            "UPDATE income SET amount = $1, source = $2, date = $3, description = $4 WHERE income_id = $5 AND user_id = $6 RETURNING *",
            [amount, source, date, description, id, userId]
        );
        if (updateIncome.rows.length === 0) {
            return res.status(404).json({ error: 'Income entry not found' });
        }
        res.json(updateIncome.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error updating income' });
    }
});

// | -------- Future: Delete Income Entry (DELETE route) -------- |
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const deleteIncome = await pool.query(
            "DELETE FROM income WHERE income_id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        );
        if (deleteIncome.rows.length === 0) {
            return res.status(404).json({ error: 'Income entry not found' });
        }
        res.json({ message: 'Income entry deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error deleting income' });
    }
});

module.exports = router;
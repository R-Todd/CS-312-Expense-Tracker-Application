// server/routes/savings.js

const express = require('express');
const router = express.Router();
const pool = require('../database/database');
const authMiddleware = require('../middleware/authMiddleware');

// | -------- Create New Savings Entry (POST) -------- |
router.post('/', authMiddleware, async (req, res) => {
    try {
        // Get data from request body and user ID from token
        const { amount, goal, date, description } = req.body;
        const userId = req.user.id;

        // Insert new savings record into the database
        const newSavings = await pool.query(
            'INSERT INTO savings (user_id, amount, goal, date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, amount, goal, date, description]
        );
        res.json(newSavings.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error adding savings entry' });
    }
});

// | -------- Get All Savings Entries for User (GET) -------- |
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        // Fetch all savings entries, ordered by date descending
        const savings = await pool.query(
            'SELECT * FROM savings WHERE user_id = $1 ORDER BY date DESC',
            [userId]
        );
        res.json(savings.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error fetching savings entries' });
    }
});

// | -------- Update Savings Entry (PUT) -------- |
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { amount, goal, date, description } = req.body;
        const { id } = req.params;
        const userId = req.user.id;
        const updateSavings = await pool.query(
            "UPDATE savings SET amount = $1, goal = $2, date = $3, description = $4 WHERE savings_id = $5 AND user_id = $6 RETURNING *",
            [amount, goal, date, description, id, userId]
        );
        if (updateSavings.rows.length === 0) {
            return res.status(404).json({ error: 'Savings entry not found' });
        }
        res.json(updateSavings.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error updating savings entry' });
    }
});

// | -------- Delete Savings Entry (DELETE) -------- |
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const deleteSavings = await pool.query(
            "DELETE FROM savings WHERE savings_id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        );
        if (deleteSavings.rows.length === 0) {
            return res.status(404).json({ error: 'Savings entry not found' });
        }
        res.json({ message: 'Savings entry deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error deleting savings entry' });
    }
});

module.exports = router;
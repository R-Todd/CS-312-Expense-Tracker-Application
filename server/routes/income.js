// root/server/routes/income.js

// ======= IMPORTS =======
const express = require('express');
const router = express.Router(); // express router for defining routes
const pool = require('../database/database'); // Database connection pool
// authentication middleware
const authMiddleware = require('../middleware/authMiddleware');
// =====================

// Routes pre-set with /api/income from server.js

// -------- Add Income Entry --------

router.post('/', authMiddleware, async (req, res) => {
    try {
        // get income data from request body
        // Note: 'source' is used instead of 'category' for clarity
        const { amount, source, date, description } = req.body;

        // get user id (from authMiddleware.js)
        const userId = req.user.id;

        // insert new income into database
        const newIncome = await pool.query(
            'INSERT INTO incomes (user_id, amount, source, date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, amount, source, date, description]
        );

        // send obj back to client
        res.json(newIncome.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// | -------- Get All Income Entries -------- |
router.get('/', authMiddleware, async (req, res) => {
    try {
        // get user id
        const userId = req.user.id;

        // select all incomes for this user, ordered by date
        const incomes = await pool.query(
            'SELECT * FROM incomes WHERE user_id = $1 ORDER BY date DESC',
            [userId]
        );

        // send incomes into array and back to client
        res.json(incomes.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// | -------- Delete Income Entry -------- |
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // get "income id" from url params
        const { id } = req.params;
        // get user id
        const userId = req.user.id;

        // delete from database -- must check BOTH income id and user id
        const deleteIncome = await pool.query(
            "DELETE FROM incomes WHERE income_id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        );

        // if no rows were deleted (not found or not authorized)
        if (deleteIncome.rows.length === 0) {
            return res.status(404).json({ error: 'Income not found for user / not authorized' });
        }

        // send success message back to client
        res.json({ message: 'Income deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});


// Export the router to be used in server.js
module.exports = router;
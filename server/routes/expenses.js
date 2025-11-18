// server/middleware/authMiddleware.js

// ======= IMPORTS =======
const express = require('express');
const router = express.Router();
// pool for db access
const pool = require('../database/database');
// authentication middleware
const authMiddleware = require('../middleware/authMiddleware');
// =====================

// routes pre-set with /api/expenses from server.js

router.post('/', authMiddleware, async (req, res) => {
    try {
        // get expense data from request body
        const { amount, category, date, description } = req.body;

        // get user id (from /routes/authMiddleware.js)
        const userId = req.user.id;

        // insert new expense into database
        const newExpense = await pool.query(
            'INSERT INTO expenses (user_id, amount, category, date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, amount, category, date, description]
        );

        // send obj back to client
        res.json(newExpense.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET all expenses for logged-in user
router.get('/', authMiddleware, async (req, res) => {
    try {
        // get user id - same as above
        const userId = req.user.id;

        // select all expenses for this user - when user_id matches
        const expenses = await pool.query(
            'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
            [userId]
        );

        // send expenses into array and back to client
        res.json(expenses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============Update 1 of the usere's expenses=============
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        // data from req body
        const { amount, category, date, description } = req.body;

        // get "expense id" from url params
        const { id } = req.params;

        // get user id - same as above
        const userId = req.user.id;

        // update database -- !! only if user_id and expense id match
        const updateExpense = await pool.query(
            "UPDATE expenses SET amount = $1, category = $2, date = $3, description = $4 WHERE expense_id = $5 AND user_id = $6 RETURNING *",
            [amount, category, date, description, id, userId]
        );

        // if no rows were updates
        //      - either expense id is wrong or it doesn't belong to this user
        if (updateExpense.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found for user / not authorized' });
        }

        // send updated expense back to client
        res.json(updateExpense.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// ============Delete 1 of the user's expenses=============
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // get "expense id" from url params
        const { id } = req.params;

        // get user id - same as above
        const userId = req.user.id;

        // delete from database -- must check BOTH expense id and user id
        const deleteExpense = await pool.query(
            "DELETE FROM expenses WHERE expense_id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        );

        // if no rows were deleted
        //      - either expense id is wrong or it doesn't belong to this user
        if (deleteExpense.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found for user / not authorized' });
        }

        // send success message back to client
        res.json({ message: 'Expense deleted successfully' });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});


// export the router to be used in server.js
module.exports = router;
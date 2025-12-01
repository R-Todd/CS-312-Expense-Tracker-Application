// server/routes/expenses.js

const express = require('express');
const router = express.Router();
const pool = require('../database/database');
const authMiddleware = require('../middleware/authMiddleware');

// | -------- Spending Predictions -------- |
// Must be placed BEFORE any /:id routes
router.get('/predictions', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;


        const predictionQuery = `
            WITH RankedExpenses AS (
                SELECT 
                    category,
                    amount,
                    ROW_NUMBER() OVER (PARTITION BY category ORDER BY date DESC) as rn
                FROM expenses
                WHERE user_id = $1
            )
            SELECT 
                category, 
                ROUND(AVG(amount), 2) as predicted_amount
            FROM RankedExpenses
            WHERE rn <= 3
            GROUP BY category
            HAVING COUNT(*) >= 3; -- Only predict if we have 3 or more entries
        `;

        const result = await pool.query(predictionQuery, [userId]);
        res.json(result.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error fetching predictions' });
    }
});

// | -------- Create New Expense Entry (POST) -------- |

router.post('/', authMiddleware, async (req, res) => {
    try {
        const { amount, category, date, description } = req.body;
        const userId = req.user.id;
        const newExpense = await pool.query(
            'INSERT INTO expenses (user_id, amount, category, date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, amount, category, date, description]
        );
        res.json(newExpense.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// | -------- Get All Expense Entries for User (GET) -------- |

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const expenses = await pool.query(
            'SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC',
            [userId]
        );
        res.json(expenses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// | -------- Update Expense Entry (PUT route) -------- |

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { amount, category, date, description } = req.body;
        const { id } = req.params;
        const userId = req.user.id;
        const updateExpense = await pool.query(
            "UPDATE expenses SET amount = $1, category = $2, date = $3, description = $4 WHERE expense_id = $5 AND user_id = $6 RETURNING *",
            [amount, category, date, description, id, userId]
        );
        if (updateExpense.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json(updateExpense.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// | -------- Delete Expense Entry (DELETE) -------- |

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const deleteExpense = await pool.query(
            "DELETE FROM expenses WHERE expense_id = $1 AND user_id = $2 RETURNING *",
            [id, userId]
        );
        if (deleteExpense.rows.length === 0) {
            return res.status(404).json({ error: 'Expense not found' });
        }
        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});



module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all transactions with optional filters
router.get('/', async (req, res) => {
  try {
    const { type, category, month } = req.query;
    let query = 'SELECT * FROM transactions WHERE 1=1';
    let params = [];
    let paramIndex = 1;

    if (type) {
      query += ` AND type = $${paramIndex}`;
      params.push(type);
      paramIndex++;
    }
    if (category) {
      query += ` AND category = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    if (month) {
      // Expecting month in YYYY-MM format
      query += ` AND TO_CHAR(date, 'YYYY-MM') = $${paramIndex}`;
      params.push(month);
      paramIndex++;
    }

    query += ' ORDER BY date DESC, created_at DESC';

    const { rows } = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get transactions summary
router.get('/summary', async (req, res) => {
  try {
    const incomeQuery = "SELECT SUM(amount) as total_income FROM transactions WHERE type = 'income'";
    const expenseQuery = "SELECT SUM(amount) as total_expense FROM transactions WHERE type = 'expense'";
    const categoryQuery = "SELECT category, SUM(amount) as total FROM transactions WHERE type = 'expense' GROUP BY category ORDER BY total DESC";

    const [incomeResult, expenseResult, categoryResult] = await Promise.all([
      db.query(incomeQuery),
      db.query(expenseQuery),
      db.query(categoryQuery)
    ]);

    const totalIncome = incomeResult.rows[0].total_income || 0;
    const totalExpense = expenseResult.rows[0].total_expense || 0;
    const balance = totalIncome - totalExpense;

    res.json({
      totalIncome: parseFloat(totalIncome),
      totalExpense: parseFloat(totalExpense),
      balance: parseFloat(balance),
      expenseByCategory: categoryResult.rows.map(row => ({
        category: row.category,
        total: parseFloat(row.total)
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a transaction
router.post('/', async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;
    const query = `
      INSERT INTO transactions (type, amount, category, description, date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await db.query(query, [type, amount, category, description, date]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a transaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { type, amount, category, description, date } = req.body;
    const query = `
      UPDATE transactions
      SET type = $1, amount = $2, category = $3, description = $4, date = $5
      WHERE id = $6
      RETURNING *
    `;
    const { rows } = await db.query(query, [type, amount, category, description, date, id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM transactions WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

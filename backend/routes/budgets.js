const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all budgets with spent amount
router.get('/', async (req, res) => {
  try {
    // Left join with transactions to get current spent amount for the current month
    const query = `
      SELECT 
        b.id, b.category, b.monthly_limit,
        COALESCE(SUM(t.amount), 0) as spent
      FROM budgets b
      LEFT JOIN transactions t ON b.category = t.category 
        AND t.type = 'expense' 
        AND TO_CHAR(t.date, 'YYYY-MM') = TO_CHAR(CURRENT_DATE, 'YYYY-MM')
      GROUP BY b.id, b.category, b.monthly_limit
      ORDER BY b.category
    `;
    const { rows } = await db.query(query);
    
    // Format output
    const budgets = rows.map(row => ({
      id: row.id,
      category: row.category,
      monthlyLimit: parseFloat(row.monthly_limit),
      spent: parseFloat(row.spent)
    }));
    
    res.json(budgets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a budget
router.post('/', async (req, res) => {
  try {
    const { category, monthly_limit } = req.body;
    const query = `
      INSERT INTO budgets (category, monthly_limit)
      VALUES ($1, $2)
      ON CONFLICT (category) 
      DO UPDATE SET monthly_limit = EXCLUDED.monthly_limit
      RETURNING *
    `;
    const { rows } = await db.query(query, [category, monthly_limit]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a budget
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM budgets WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');

// Get all savings goals
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM savings_goals WHERE user_id = $1 ORDER BY target_date ASC', [req.user.id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a savings goal
router.post('/', auth, async (req, res) => {
  try {
    const { name, target_amount, current_amount, target_date } = req.body;
    const query = `
      INSERT INTO savings_goals (user_id, name, target_amount, current_amount, target_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const { rows } = await db.query(query, [req.user.id, name, target_amount, current_amount || 0, target_date]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update savings goal contribution
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { current_amount } = req.body;
    
    const query = `
      UPDATE savings_goals
      SET current_amount = $1
      WHERE id = $2 AND user_id = $3
      RETURNING *
    `;
    const { rows } = await db.query(query, [current_amount, id, req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a savings goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM savings_goals WHERE id = $1 AND user_id = $2 RETURNING *';
    const { rows } = await db.query(query, [id, req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

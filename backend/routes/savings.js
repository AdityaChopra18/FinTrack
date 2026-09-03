const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all savings goals
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM savings_goals ORDER BY target_date ASC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a savings goal
router.post('/', async (req, res) => {
  try {
    const { name, target_amount, current_amount, target_date } = req.body;
    const query = `
      INSERT INTO savings_goals (name, target_amount, current_amount, target_date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await db.query(query, [name, target_amount, current_amount || 0, target_date]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update savings goal contribution
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { current_amount } = req.body;
    
    // We expect the new absolute current_amount, or we could expect an increment. 
    // Assuming absolute current_amount for simplicity.
    const query = `
      UPDATE savings_goals
      SET current_amount = $1
      WHERE id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [current_amount, id]);
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
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM savings_goals WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
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

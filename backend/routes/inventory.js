const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, quantity, unit, max_quantity } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO inventory (name, quantity, unit, max_quantity) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, quantity, unit, max_quantity]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/adjust', async (req, res) => {
  const { amount, action } = req.body;
  const operator = action === 'add' ? '+' : '-';
  try {
    const result = await pool.query(
      `UPDATE inventory SET quantity = GREATEST(0, quantity ${operator} $1), updated_at = NOW() WHERE id = $2 RETURNING *`,
      [amount, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
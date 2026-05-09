const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM menu_items WHERE available = true ORDER BY category, id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name, price, category, emoji } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO menu_items (name, price, category, emoji) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, price, category, emoji]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/price', async (req, res) => {
  const { price } = req.body;
  try {
    const result = await pool.query(
      'UPDATE menu_items SET price = $1 WHERE id = $2 RETURNING *',
      [price, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
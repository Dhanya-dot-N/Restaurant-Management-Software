const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const orders = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    for (let order of orders.rows) {
      const items = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
      order.items = items.rows;
    }
    res.json(orders.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { table_name, items } = req.body;
  try {
    const orderResult = await pool.query(
      'INSERT INTO orders (table_name) VALUES ($1) RETURNING *',
      [table_name]
    );
    const order = orderResult.rows[0];
    for (let item of items) {
      await pool.query(
        'INSERT INTO order_items (order_id, item_name, item_price, quantity, notes) VALUES ($1, $2, $3, $4, $5)',
        [order.id, item.name, item.price, item.qty, item.note || '']
      );
    }
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
    order.items = itemsResult.rows;
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: 'http://localhost:5173' }
});

app.use(cors());
app.use(express.json());
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Routes
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/inventory', require('./routes/inventory'));

// Socket.io — real-time KDS updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('new_order', (order) => {
    io.emit('order_update', order); // broadcast to all screens
  });

  socket.on('status_change', (data) => {
    io.emit('order_status_update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
app.get('/api/analytics/summary', async (req, res) => {
  try {
    const revenue = await pool.query(
      `SELECT COALESCE(SUM(item_price * quantity), 0) as revenue FROM order_items`
    );
    const orders = await pool.query(
      `SELECT COUNT(*) as orders FROM orders`
    );
    const topDishes = await pool.query(
      `SELECT item_name, SUM(quantity) as total FROM order_items GROUP BY item_name ORDER BY total DESC LIMIT 5`
    );
    res.json({
      revenue: parseInt(revenue.rows[0].revenue),
      orders: parseInt(orders.rows[0].orders),
      topDishes: topDishes.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

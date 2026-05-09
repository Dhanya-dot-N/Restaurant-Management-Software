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
server.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));

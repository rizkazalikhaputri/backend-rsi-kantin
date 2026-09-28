const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { poolPromise } = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const stallRoutes = require('./routes/stallRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const likeRoutes = require('./routes/likeRoutes');
const flagRoutes = require('./routes/flagRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main Root Endpoint
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'API Kantin RSI Ready!' });
});

// Register Endpoints
app.use('/api/users', userRoutes);
app.use('/api/stalls', stallRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/flags', flagRoutes);
app.use('/api/audit-logs', auditLogRoutes);

// Run Server
poolPromise.then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed, server not started:', err);
});
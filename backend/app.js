const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 💡 Initialize the express app FIRST
const app = express();

// 💡 Middleware
app.use(cors());
app.use(express.json());

// 💡 Route Imports
const authRoutes = require('./routes/authRoutes');
const helpRoutes = require('./routes/helpRoutes');

// 💡 Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/help', helpRoutes);

// 💡 Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

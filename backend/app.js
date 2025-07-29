const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');

const app = express();

app.use(cors({
  origin: '*',   // For now, allow all. We'll fix later.
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// 👇 Export app for Vercel
module.exports = app;

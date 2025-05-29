const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // 👈 your Vite frontend port
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(5000, () => console.log('Server running on port 5000')))
  .catch(err => console.log(err));

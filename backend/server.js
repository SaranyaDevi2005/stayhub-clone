const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // use your frontend URL if deployed
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);

// ✅ Only connect DB and listen when running locally
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => console.log(err));
}

// ✅ Export app so Vercel can use it without starting the server again
module.exports = app;

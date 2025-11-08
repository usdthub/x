const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('frontend'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/telegram_mining', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.use('/api/telegram', require('./routes/telegram'));
app.use('/api/wallet', require('./routes/wallet'));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

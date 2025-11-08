const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: {
    type: String,
    required: true,
    unique: true
  },
  username: String,
  firstName: String,
  lastName: String,
  wlfiBalance: {
    type: Number,
    default: 250.00
  },
  usdtBalance: {
    type: Number,
    default: 0
  },
  miningSpeed: {
    type: Number,
    default: 1.5
  },
  level: {
    type: Number,
    default: 0
  },
  invitedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  lastClaim: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);

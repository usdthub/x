const express = require('express');
const axios = require('axios');
const router = express.Router();
const User = require('../models/User');

const BOT_TOKEN = '8544123644:AAHjoBy7D_0oVbuug747v2HqIKxYtT76FBQ';

// Get user info from Telegram
router.post('/user-info', async (req, res) => {
  try {
    const { initData } = req.body;
    
    // Verify Telegram data (simplified - in production use proper verification)
    const userData = parseTelegramData(initData);
    
    let user = await User.findOne({ telegramId: userData.id });
    
    if (!user) {
      user = new User({
        telegramId: userData.id,
        username: userData.username,
        firstName: userData.first_name,
        lastName: userData.last_name,
        wlfiBalance: 250.00,
        miningSpeed: 1.5,
        level: 0,
        invitedUsers: []
      });
      await user.save();
    }
    
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send message to user
router.post('/send-message', async (req, res) => {
  try {
    const { chatId, message } = req.body;
    
    const response = await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'HTML'
    });
    
    res.json({ success: true, response: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Notify withdrawal
router.post('/notify-withdrawal', async (req, res) => {
  try {
    const { userId, amount, address } = req.body;
    
    const user = await User.findById(userId);
    const message = `🚀 Withdrawal Successful!\n\nAmount: ${amount} USDT\nAddress: ${address}\nStatus: Completed`;
    
    await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: user.telegramId,
      text: message,
      parse_mode: 'HTML'
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function parseTelegramData(initData) {
  // Simplified parsing - in production use proper Telegram WebApp data verification
  const urlParams = new URLSearchParams(initData);
  return {
    id: urlParams.get('id'),
    first_name: urlParams.get('first_name'),
    last_name: urlParams.get('last_name'),
    username: urlParams.get('username'),
    photo_url: urlParams.get('photo_url')
  };
}

module.exports = router;

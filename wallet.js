const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Get user wallet balance
router.get('/balance/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.json({
      wlfi: user.wlfiBalance,
      usdt: user.usdtBalance || 0,
      miningSpeed: user.miningSpeed
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Withdraw funds
router.post('/withdraw', async (req, res) => {
  try {
    const { userId, amount, currency, address } = req.body;
    
    const user = await User.findById(userId);
    
    if (currency === 'USDT' && user.usdtBalance >= amount) {
      user.usdtBalance -= amount;
      
      const transaction = new Transaction({
        userId,
        type: 'withdrawal',
        currency,
        amount,
        address,
        status: 'completed'
      });
      
      await user.save();
      await transaction.save();
      
      // Notify user via Telegram
      req.app.get('telegramBot').sendWithdrawalNotification(user.telegramId, amount, address);
      
      res.json({ success: true, transaction });
    } else {
      res.status(400).json({ success: false, error: 'Insufficient balance' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Swap WLFI to USDT
router.post('/swap', async (req, res) => {
  try {
    const { userId, wlfiAmount } = req.body;
    const exchangeRate = 0.001; // 1 WLFI = 0.001 USDT
    
    const user = await User.findById(userId);
    
    if (user.wlfiBalance >= wlfiAmount) {
      const usdtAmount = wlfiAmount * exchangeRate;
      
      user.wlfiBalance -= wlfiAmount;
      user.usdtBalance += usdtAmount;
      
      const transaction = new Transaction({
        userId,
        type: 'swap',
        fromCurrency: 'WLFI',
        toCurrency: 'USDT',
        fromAmount: wlfiAmount,
        toAmount: usdtAmount
      });
      
      await user.save();
      await transaction.save();
      
      res.json({ success: true, usdtAmount });
    } else {
      res.status(400).json({ success: false, error: 'Insufficient WLFI balance' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Claim mining rewards
router.post('/claim', async (req, res) => {
  try {
    const { userId } = req.body;
    
    const user = await User.findById(userId);
    const hoursSinceLastClaim = 24; // Calculate based on last claim time
    const reward = user.miningSpeed * hoursSinceLastClaim;
    
    user.wlfiBalance += reward;
    user.lastClaim = new Date();
    
    await user.save();
    
    res.json({ success: true, reward });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

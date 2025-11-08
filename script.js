// JavaScript File - script.js

// DOM Elements
const balanceElement = document.getElementById('balance');
const miningStatusElement = document.getElementById('mining-status');
const miningTimeElement = document.getElementById('mining-time');
const startMiningButton = document.getElementById('start-mining');
const stopMiningButton = document.getElementById('stop-mining');
const withdrawButton = document.getElementById('withdraw');
const miningTextElement = document.getElementById('mining-text');
const userListElement = document.getElementById('user-list');
const totalUsersElement = document.getElementById('total-users');
const notificationElement = document.getElementById('notification');
const progressBarElement = document.getElementById('progress-bar');
const rewardTimerElement = document.getElementById('reward-timer');
const connectTelegramButton = document.getElementById('connect-telegram');

// Mining state
let mining = false;
let miningStartTime = null;
let miningInterval = null;
let rewardInterval = null;
let balance = 0;
let miningTime = 0;
let rewardCountdown = 7200; // 2 hours in seconds

// Sample users data
const sampleUsers = [
    { name: 'John Doe', balance: 12.50 },
    { name: 'Alice Smith', balance: 8.75 },
    { name: 'Bob Johnson', balance: 15.20 },
    { name: 'Emma Wilson', balance: 6.40 },
    { name: 'Mike Brown', balance: 10.80 },
    { name: 'Sarah Davis', balance: 9.60 },
    { name: 'Tom Clark', balance: 14.30 },
    { name: 'Lisa Garcia', balance: 7.90 }
];

// Initialize the page
function init() {
    console.log('🚀 Initializing Crypto Miner Pro...');
    loadBalance();
    updateUserList();
    updateButtons();
    startRewardCountdown();
    checkPreviousSession();
    
    // Add some random user activity simulation
    simulateUserActivity();
    
    console.log('✅ Crypto Miner Pro initialized successfully!');
}

// Load balance from localStorage
function loadBalance() {
    const savedBalance = localStorage.getItem('miningBalance');
    if (savedBalance) {
        balance = parseFloat(savedBalance);
        updateBalanceDisplay();
        console.log(`💰 Loaded balance: ${balance} USDT`);
    } else {
        console.log('💳 No previous balance found, starting fresh');
    }
}

// Save balance to localStorage
function saveBalance() {
    localStorage.setItem('miningBalance', balance.toString());
    console.log(`💾 Balance saved: ${balance} USDT`);
}

// Update balance display
function updateBalanceDisplay() {
    balanceElement.textContent = `${balance.toFixed(2)} USDT`;
}

// Update user list
function updateUserList() {
    userListElement.innerHTML = '';
    sampleUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-avatar">${user.name.charAt(0)}</div>
            <div class="user-name">${user.name}</div>
            <div class="user-balance">${user.balance.toFixed(2)} USDT</div>
        `;
        userListElement.appendChild(userCard);
    });
    totalUsersElement.textContent = sampleUsers.length;
    console.log(`👥 Updated user list with ${sampleUsers.length} users`);
}

// Update button states
function updateButtons() {
    startMiningButton.disabled = mining;
    stopMiningButton.disabled = !mining;
    withdrawButton.disabled = balance <= 0;
    
    // Update button text based on state
    if (mining) {
        startMiningButton.innerHTML = '<i class="fas fa-sync-alt"></i> Mining...';
    } else {
        startMiningButton.innerHTML = '<i class="fas fa-play"></i> Start Mining';
    }
}

// Format time (seconds to HH:MM:SS)
function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Show notification
function showNotification(message, type = 'success') {
    console.log(`🔔 Notification: ${message} (${type})`);
    
    notificationElement.textContent = message;
    notificationElement.className = 'notification';
    
    if (type === 'error') {
        notificationElement.classList.add('error');
        notificationElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${message}</span>`;
    } else if (type === 'warning') {
        notificationElement.classList.add('warning');
        notificationElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>${message}</span>`;
    } else {
        notificationElement.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
    }
    
    notificationElement.classList.add('show');
    setTimeout(() => {
        notificationElement.classList.remove('show');
    }, 3000);
}

// Start reward countdown
function startRewardCountdown() {
    console.log('⏰ Starting reward countdown timer...');
    setInterval(() => {
        if (mining) {
            rewardCountdown--;
            if (rewardCountdown <= 0) {
                rewardCountdown = 7200; // Reset to 2 hours
                console.log('🔄 Reward countdown reset');
            }
            rewardTimerElement.textContent = formatTime(rewardCountdown);
            
            // Update progress bar
            const progress = ((7200 - rewardCountdown) / 7200) * 100;
            progressBarElement.style.width = `${progress}%`;
        }
    }, 1000);
}

// Check for previous mining session
function checkPreviousSession() {
    const miningSession = localStorage.getItem('miningSession');
    if (miningSession === 'active') {
        console.log('🔍 Found active mining session from previous visit');
        showNotification('Previous mining session detected!', 'warning');
        
        // Ask user if they want to resume
        setTimeout(() => {
            if (confirm('We detected an active mining session from your last visit. Would you like to resume mining?')) {
                startMining();
            } else {
                localStorage.setItem('miningSession', 'stopped');
            }
        }, 1000);
    }
}

// Start mining
function startMining() {
    console.log('⛏️ Starting mining process...');
    
    if (mining) {
        showNotification('Mining is already active!', 'warning');
        return;
    }
    
    mining = true;
    miningStartTime = new Date();
    miningStatusElement.textContent = 'Active';
    miningStatusElement.style.color = 'var(--success)';
    miningTextElement.textContent = 'Mining in progress...';
    miningTextElement.style.color = 'var(--success)';
    
    // Save session state
    localStorage.setItem('miningSession', 'active');
    
    updateButtons();
    
    // Update mining time every second
    miningInterval = setInterval(() => {
        miningTime++;
        miningTimeElement.textContent = formatTime(miningTime);
        
        // Update mining stats in localStorage
        localStorage.setItem('miningTime', miningTime.toString());
    }, 1000);
    
    // Add reward every 2 hours (for demo, using 30 seconds)
    rewardInterval = setInterval(() => {
        balance += 2;
        updateBalanceDisplay();
        saveBalance();
        showNotification('🎉 Reward added: 2 USDT!');
        updateButtons();
        rewardCountdown = 7200; // Reset countdown
        
        console.log(`💰 New balance after reward: ${balance} USDT`);
        
        // Simulate network activity
        simulateNetworkActivity();
    }, 30000); // 30 seconds for demo, change to 7200000 for 2 hours
    
    showNotification('Mining started successfully!', 'success');
    console.log('✅ Mining started successfully');
}

// Stop mining
function stopMining() {
    console.log('🛑 Stopping mining process...');
    
    if (!mining) {
        showNotification('Mining is not active!', 'warning');
        return;
    }
    
    mining = false;
    miningStatusElement.textContent = 'Stopped';
    miningStatusElement.style.color = 'var(--warning)';
    miningTextElement.textContent = 'Mining is stopped';
    miningTextElement.style.color = 'var(--light)';
    
    // Save session state
    localStorage.setItem('miningSession', 'stopped');
    
    updateButtons();
    
    clearInterval(miningInterval);
    clearInterval(rewardInterval);
    
    showNotification('Mining stopped successfully!', 'warning');
    console.log('✅ Mining stopped successfully');
}

// Withdraw funds
function withdraw() {
    console.log(`💸 Withdrawing ${balance} USDT...`);
    
    if (balance <= 0) {
        showNotification('No funds available for withdrawal!', 'error');
        return;
    }
    
    // Simulate withdrawal processing
    showNotification(`Processing withdrawal of ${balance.toFixed(2)} USDT...`, 'warning');
    
    setTimeout(() => {
        showNotification(`✅ Successfully withdrawn: ${balance.toFixed(2)} USDT!`);
        console.log(`✅ Withdrawn: ${balance} USDT`);
        
        balance = 0;
        updateBalanceDisplay();
        saveBalance();
        updateButtons();
    }, 2000);
}

// Connect Telegram
function connectTelegram() {
    console.log('🔗 Connecting Telegram API...');
    
    showNotification('Connecting to Telegram...', 'warning');
    
    // Simulate Telegram API connection
    setTimeout(() => {
        showNotification('Telegram connected successfully! Notifications enabled.');
        console.log('✅ Telegram connected successfully');
        
        // Enable Telegram features
        enableTelegramFeatures();
    }, 1500);
}

// Enable Telegram features
function enableTelegramFeatures() {
    console.log('🔧 Enabling Telegram features...');
    
    // Add Telegram notification badge
    const telegramBtn = document.getElementById('connect-telegram');
    telegramBtn.innerHTML = '<i class="fab fa-telegram"></i> Connected';
    telegramBtn.style.background = 'var(--success)';
    telegramBtn.disabled = true;
    
    // Simulate receiving Telegram notifications
    setInterval(() => {
        if (mining) {
            const messages = [
                '📱 Telegram: Mining is running smoothly!',
                '📱 Telegram: Your balance is growing!',
                '📱 Telegram: New reward added to your account!'
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            console.log(randomMessage);
        }
    }, 60000); // Every minute
}

// Simulate user activity
function simulateUserActivity() {
    console.log('👥 Simulating user activity...');
    
    setInterval(() => {
        // Randomly update user balances
        sampleUsers.forEach(user => {
            if (Math.random() > 0.7) { // 30% chance
                const change = (Math.random() * 0.5) - 0.1; // -0.1 to +0.4
                user.balance = Math.max(0, user.balance + change);
            }
        });
        
        // Occasionally add new users
        if (Math.random() > 0.9) { // 10% chance
            const newUser = {
                name: `User${Math.floor(Math.random() * 1000)}`,
                balance: Math.random() * 5
            };
            sampleUsers.push(newUser);
            console.log(`👤 New user joined: ${newUser.name}`);
        }
        
        updateUserList();
    }, 10000); // Every 10 seconds
}

// Simulate network activity
function simulateNetworkActivity() {
    const activities = [
        '🌐 Processing blockchain transaction...',
        '🔗 Verifying network consensus...',
        '📊 Updating mining statistics...',
        '⚡ Optimizing mining performance...'
    ];
    
    const randomActivity = activities[Math.floor(Math.random() * activities.length)];
    console.log(randomActivity);
}

// Error handling
function handleErrors() {
    window.addEventListener('error', (event) => {
        console.error('❌ Error occurred:', event.error);
        showNotification('A system error occurred. Please refresh the page.', 'error');
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('❌ Unhandled promise rejection:', event.reason);
        showNotification('A network error occurred. Please check your connection.', 'error');
    });
}

// Performance monitoring
function monitorPerformance() {
    // Log page load time
    window.addEventListener('load', () => {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ Page loaded in ${loadTime}ms`);
    });
    
    // Monitor mining performance
    setInterval(() => {
        if (mining) {
            const now = new Date();
            const miningDuration = Math.floor((now - miningStartTime) / 1000);
            console.log(`⏱️ Mining duration: ${formatTime(miningDuration)}`);
        }
    }, 60000); // Log every minute
}

// Event listeners
function setupEventListeners() {
    console.log('🔧 Setting up event listeners...');
    
    startMiningButton.addEventListener('click', startMining);
    stopMiningButton.addEventListener('click', stopMining);
    withdrawButton.addEventListener('click', withdraw);
    connectTelegramButton.addEventListener('click', connectTelegram);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case 'm':
                    event.preventDefault();
                    if (mining) {
                        stopMining();
                    } else {
                        startMining();
                    }
                    break;
                case 'w':
                    event.preventDefault();
                    withdraw();
                    break;
                case 't':
                    event.preventDefault();
                    connectTelegram();
                    break;
            }
        }
    });
    
    // Prevent leaving page during active mining
    window.addEventListener('beforeunload', (event) => {
        if (mining) {
            event.preventDefault();
            event.returnValue = 'You have an active mining session. Are you sure you want to leave?';
            return event.returnValue;
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM fully loaded, initializing application...');
    
    setupEventListeners();
    handleErrors();
    monitorPerformance();
    init();
    
    // Show welcome message
    setTimeout(() => {
        showNotification('Welcome to Crypto Miner Pro! 🚀');
    }, 1000);
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        startMining,
        stopMining,
        withdraw,
        connectTelegram,
        formatTime,
        showNotification
    };
}

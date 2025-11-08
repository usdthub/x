// === JAVASCRIPT CODE ===

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const startMiningBtn = document.getElementById('startMiningBtn');
const warningModal = document.getElementById('warningModal');
const closeModal = document.getElementById('closeModal');
const miningCircle = document.querySelector('.mining-circle');
const miningCore = document.querySelector('.mining-core');
const miningStatusText = document.querySelector('.mining-status-text');
const miningParticles = document.querySelectorAll('.mining-particle');

// Mining state
let isMining = false;
let miningInterval;
let minedAmount = 0;

// Show warning modal on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        warningModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }, 1000);
    
    // Initialize animations
    initAnimations();
});

// Close modal function
closeModal.addEventListener('click', function() {
    warningModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Start background animations after modal close
    startBackgroundAnimations();
});

// Navigation functionality
navItems.forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from all items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Add ripple effect
        createRippleEffect(this);
        
        // Show educational alert
        showEducationalAlert(this.getAttribute('data-tab'));
    });
});

// Start Mining Button functionality
startMiningBtn.addEventListener('click', function() {
    if (!isMining) {
        startMining();
    } else {
        stopMining();
    }
    
    // Add button click effect
    createButtonEffect(this);
});

// Mining functions
function startMining() {
    isMining = true;
    
    // Update UI
    startMiningBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Mining';
    startMiningBtn.classList.add('active');
    miningCircle.classList.add('active');
    miningCore.classList.add('active');
    miningStatusText.textContent = 'Mining Active';
    miningStatusText.classList.add('active');
    
    // Start mining animation
    startMiningAnimation();
    
    // Simulate mining process
    miningInterval = setInterval(() => {
        minedAmount += 0.0001;
        updateBalance();
        
        // Occasionally create mining effect
        if (Math.random() > 0.7) {
            createMiningEffect();
        }
    }, 1000);
    
    showEducationalAlert('mining_start');
}

function stopMining() {
    isMining = false;
    
    // Update UI
    startMiningBtn.innerHTML = '<i class="fas fa-play"></i> Start Mining';
    startMiningBtn.classList.remove('active');
    miningCircle.classList.remove('active');
    miningCore.classList.remove('active');
    miningStatusText.textContent = 'Mining Inactive';
    miningStatusText.classList.remove('active');
    
    // Stop mining interval
    clearInterval(miningInterval);
    
    // Show mining results
    showMiningResults();
}

function startMiningAnimation() {
    // Add random particle effects
    miningParticles.forEach(particle => {
        particle.style.animationDelay = `${Math.random() * 2}s`;
    });
}

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
        effect.remove();
    }, 1000);
}

// Add mining effect keyframes dynamically
const style = document.createElement('style');
style.textContent = `
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
document.head.appendChild(style);

function updateBalance() {
    const balanceElement = document.querySelector('.balance-amount');
    balanceElement.textContent = minedAmount.toFixed(4) + ' BNB';
    
    // Add balance update animation
    balanceElement.style.animation = 'none';
    setTimeout(() => {
        balanceElement.style.animation = 'balanceUpdate 0.5s ease';
    }, 10);
}

// Add balance update animation
const balanceStyle = document.createElement('style');
balanceStyle.textContent = `
    @keyframes balanceUpdate {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(balanceStyle);

function showMiningResults() {
    if (minedAmount > 0) {
        // Create result notification
        const notification = document.createElement('div');
        notification.className = 'mining-notification';
        notification.innerHTML = `
            <div style="background: var(--success-color); color: white; padding: 15px; border-radius: 10px; margin: 10px 0; text-align: center;">
                <i class="fas fa-coins"></i> Mined ${minedAmount.toFixed(4)} BNB!
            </div>
        `;
        
        const miningCard = document.querySelector('.mining-card');
        miningCard.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Function to show educational alerts
function showEducationalAlert(context) {
    const messages = {
        mine: "Mining simulation - Real cloud mining platforms often promise unrealistic returns",
        leaderboard: "Leaderboards create false social proof to encourage investment",
        upgrade: "Upgrade prompts pressure users to 'invest' more for higher returns",
        team: "Team features indicate pyramid scheme structure - illegal in most countries",
        me: "User profiles collect personal data for targeted scams",
        mining: "⚠️ EDUCATIONAL DEMO ONLY\nThis is not real cryptocurrency mining.",
        mining_start: "⛏️ Mining Simulation Started\nThis is just a visual demonstration. Real BNB mining doesn't work like this."
    };
    
    // Create custom alert with better styling
    showCustomAlert(messages[context] || "This is an educational demonstration of scam platform techniques");
}

function showCustomAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background: var(--card-bg);
        color: var(--text-color);
        padding: 20px;
        border-radius: 15px;
        border: 2px solid var(--primary-color);
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        z-index: 3000;
        max-width: 300px;
        text-align: center;
        animation: alertSlideIn 0.5s ease;
    `;
    
    alertBox.innerHTML = `
        <div style="margin-bottom: 15px;">
            <i class="fas fa-info-circle" style="color: var(--primary-color); font-size: 24px;"></i>
        </div>
        <div style="font-size: 14px; line-height: 1.4;">${message}</div>
        <button onclick="this.parentElement.remove()" style="background: var(--primary-color); color: var(--secondary-color); border: none; padding: 8px 20px; border-radius: 8px; margin-top: 15px; cursor: pointer; font-weight: bold;">
            OK
        </button>
    `;
    
    document.body.appendChild(alertBox);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertBox.parentElement) {
            alertBox.remove();
        }
    }, 5000);
}

// Add alert animation
const alertStyle = document.createElement('style');
alertStyle.textContent = `
    @keyframes alertSlideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
`;
document.head.appendChild(alertStyle);

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

// Initialize animations
function initAnimations() {
    // Add hover effects to all cards
    const cards = document.querySelectorAll('.card, .header, .balance-card, .mining-animation-container');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Initialize countdown timer
    startCountdownTimer();
}

function startCountdownTimer() {
    const countdownValues = document.querySelectorAll('.countdown-value');
    
    setInterval(() => {
        countdownValues.forEach((element, index) => {
            const currentValue = parseInt(element.textContent);
            let newValue;
            
            if (index === 0) { // Days
                newValue = currentValue < 30 ? currentValue + 1 : 0;
            } else if (index === 1) { // Hours
                newValue = currentValue < 23 ? currentValue + 1 : 0;
            } else { // Minutes
                newValue = currentValue < 59 ? currentValue + 1 : 0;
            }
            
            element.textContent = newValue.toString().padStart(2, '0');
            
            // Add update animation
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'countdownPulse 0.5s ease';
            }, 10);
        });
    }, 1000); // Update every second
}

function startBackgroundAnimations() {
    // Create occasional floating coins
    setInterval(() => {
        if (Math.random() > 0.7) {
            createFloatingCoin();
        }
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

// Add ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Prevent any accidental form submissions or redirects
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'BUTTON' && !e.target.classList.contains('close-modal')) {
        e.preventDefault();
        
        // Special handling for specific buttons
        if (e.target.classList.contains('checkin-btn') || 
            e.target.classList.contains('upgrade-btn') ||
            e.target.classList.contains('invite-btn')) {
            showEducationalAlert('action_blocked');
        }
    }
});

// Console warning
console.log('%c⚠️ SECURITY WARNING ⚠️', 'color: red; font-size: 24px; font-weight: bold;');
console.log('%cThis is an educational demonstration of cryptocurrency scam techniques. Do not use this code for real financial applications.', 'color: orange; font-size: 14px;');
console.log('%cReal platforms with similar structures are often scams that steal your money through fake mining operations and pyramid schemes.', 'color: #F0B90B; font-size: 12px;');

// Add service worker-like functionality for demo purposes
if ('serviceWorker' in navigator) {
    console.log('Service Worker would be registered here in a real app');
}

// Handle page visibility changes for mining simulation
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isMining) {
        console.log('Page hidden - mining would pause in real application');
    }
});

// Export functions for global access (for demo purposes)
window.startMining = startMining;
window.stopMining = stopMining;
window.showEducationalAlert = showEducationalAlert;

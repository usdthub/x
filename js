class TelegramApp {
    constructor() {
        this.tg = window.Telegram.WebApp;
        this.user = null;
        this.init();
    }

    init() {
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        this.getUserData();
    }

    async getUserData() {
        try {
            const response = await fetch('/api/telegram/user-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    initData: this.tg.initData
                })
            });
            
            const data = await response.json();
            if (data.success) {
                this.user = data.user;
                this.updateUI();
            }
        } catch (error) {
            console.error('Error getting user data:', error);
        }
    }

    updateUI() {
        if (this.user) {
            document.getElementById('userName').textContent = this.user.firstName || 'User';
            document.getElementById('wlfiBalance').textContent = this.user.wlfiBalance.toFixed(2);
            document.getElementById('miningSpeed').textContent = `${this.user.miningSpeed} WLFI/H`;
        }
    }

    shareInvite() {
        const inviteLink = `https://t.me/your_bot_username?start=${this.user.telegramId}`;
        this.tg.showPopup({
            title: 'Invite Friends',
            message: `Share this link to invite friends: ${inviteLink}`,
            buttons: [{ type: 'ok' }]
        });
    }
}

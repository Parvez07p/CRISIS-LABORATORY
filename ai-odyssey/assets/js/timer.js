/* ============================================
   AI ODYSSEY - Timer Manager
   ============================================ */

const TimerManager = {
    init() {
        this.totalSeconds = 90 * 60; // 90 minutes
        this.remaining = this.totalSeconds;
        this.isRunning = false;
        this.interval = null;
        this.display = document.querySelector('.timer-display');
        
        this.loadState();
        this.bindEvents();
        this.updateDisplay();
    },

    bindEvents() {
        // Listen for timer control events
        document.addEventListener('timer:start', () => this.start());
        document.addEventListener('timer:stop', () => this.stop());
        document.addEventListener('timer:reset', () => this.reset());
        document.addEventListener('timer:set', (e) => {
            this.totalSeconds = e.detail * 60;
            this.remaining = this.totalSeconds;
            this.updateDisplay();
        });
    },

    loadState() {
        const saved = localStorage.getItem('ai-odyssey-timer');
        if (saved) {
            const state = JSON.parse(saved);
            this.totalSeconds = state.total || 5400;
            this.remaining = state.remaining || this.totalSeconds;
            this.isRunning = state.running || false;
            
            if (this.isRunning) {
                this.start();
            }
        }
    },

    saveState() {
        localStorage.setItem('ai-odyssey-timer', JSON.stringify({
            total: this.totalSeconds,
            remaining: this.remaining,
            running: this.isRunning
        }));
    },

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        
        this.interval = setInterval(() => {
            this.remaining--;
            this.updateDisplay();
            this.saveState();
            
            if (this.remaining <= 0) {
                this.stop();
                this.onTimeUp();
            }
        }, 1000);
    },

    stop() {
        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.saveState();
    },

    reset() {
        this.stop();
        this.remaining = this.totalSeconds;
        this.updateDisplay();
        this.saveState();
    },

    getFormattedTime() {
        const minutes = Math.floor(this.remaining / 60);
        const seconds = this.remaining % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    },

    getRemainingMinutes() {
        return Math.floor(this.remaining / 60);
    },

    updateDisplay() {
        if (!this.display) return;
        
        const formatted = this.getFormattedTime();
        this.display.textContent = `⏱ ${formatted}`;
        
        // Update styles based on remaining time
        this.display.classList.remove('warning', 'danger');
        
        if (this.remaining <= 300) { // 5 minutes
            this.display.classList.add('danger');
        } else if (this.remaining <= 900) { // 15 minutes
            this.display.classList.add('warning');
        }
    },

    onTimeUp() {
        AnimationManager.showToast('Time is up! Your answers will be auto-submitted.', 'warning');
        
        // Trigger auto-submit event
        document.dispatchEvent(new CustomEvent('timer:timeup'));
        
        // Redirect to scoreboard after short delay
        setTimeout(() => {
            window.location.href = 'scoreboard.html';
        }, 3000);
    }
};

// Initialize timer on page load
document.addEventListener('DOMContentLoaded', () => TimerManager.init());


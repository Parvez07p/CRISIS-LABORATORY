/* ============================================
   AI ODYSSEY - Theme Manager
   ============================================ */

const ThemeManager = {
    init() {
        this.themeToggle = document.getElementById('themeToggle');
        this.savedTheme = localStorage.getItem('ai-odyssey-theme') || 'dark';
        this.setTheme(this.savedTheme);
        this.bindEvents();
    },

    bindEvents() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                const current = document.documentElement.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                this.setTheme(next);
                this.updateToggleIcon(next);
            });
        }
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('ai-odyssey-theme', theme);
        this.updateToggleIcon(theme);
    },

    updateToggleIcon(theme) {
        if (this.themeToggle) {
            this.themeToggle.querySelector('.toggle-icon').textContent = 
                theme === 'dark' ? '🌙' : '☀️';
        }
    },

    getTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }
};

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', () => ThemeManager.init());


/* ============================================
   AI ODYSSEY - Animation Manager
   ============================================ */

const AnimationManager = {
    init() {
        this.initCounters();
        this.initRevealAnimations();
        this.initTerminalAnimation();
        this.initCodeRain();
    },

    // Animated counters
    initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.dataset.target);
                    this.animateCounter(counter, target);
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => observer.observe(counter));
    },

    animateCounter(element, target) {
        let current = 0;
        const increment = target / 60;
        const duration = 2000;
        const stepTime = duration / 60;

        const update = () => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                return;
            }
            element.textContent = Math.floor(current);
            setTimeout(update, stepTime);
        };

        update();
    },

    // Scroll reveal animations
    initRevealAnimations() {
        const reveals = document.querySelectorAll('[data-aos]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.dataset.delay) || 0;
                    
                    setTimeout(() => {
                        el.classList.add('visible');
                        el.style.opacity = '1';
                    }, delay);
                    
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        reveals.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    },

    // Terminal typing animation
    initTerminalAnimation() {
        const terminalLines = document.querySelectorAll('.terminal-line');
        
        terminalLines.forEach(line => {
            const delay = parseInt(line.dataset.delay) || 0;
            line.style.animationDelay = `${delay}ms`;
        });
    },

    // Matrix-style code rain
    initCodeRain() {
        const container = document.getElementById('codeRain');
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.className = 'code-rain-canvas';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width, height, columns, drops;

        const resize = () => {
            width = canvas.width = container.offsetWidth;
            height = canvas.height = container.offsetHeight;
            columns = Math.floor(width / 20);
            drops = Array(columns).fill(1);
        };

        resize();
        window.addEventListener('resize', resize);

        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

        const draw = () => {
            ctx.fillStyle = 'rgba(10, 10, 26, 0.05)';
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = '#00f0ff';
            ctx.font = '14px monospace';

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * 20, drops[i] * 20);

                if (drops[i] * 20 > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };

        setInterval(draw, 50);
    },

    // Confetti effect
    createConfetti(count = 50) {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffd700'];
        
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 8 + 4 + 'px';
            confetti.style.height = Math.random() * 8 + 4 + 'px';
            confetti.style.animationDuration = Math.random() * 2 + 2 + 's';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }
    },

    // Toast notification
    showToast(message, type = 'info', duration = 3000) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// Initialize animations on page load
document.addEventListener('DOMContentLoaded', () => AnimationManager.init());


/* ============================================
   AI ODYSSEY - Particle System
   ============================================ */

const ParticleSystem = {
    init() {
        this.container = document.getElementById('particles');
        if (!this.container) return;
        
        this.particleCount = 50;
        this.particles = [];
        this.createParticles();
        this.animate();
    },

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
            particle.style.animationDelay = `${Math.random() * 2}s`;
            
            const colors = ['#00f0ff', '#7b2ff7', '#ff2d95', '#00ff88'];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            this.container.appendChild(particle);
            this.particles.push(particle);
        }
    },

    animate() {
        this.particles.forEach((particle, index) => {
            const x = parseFloat(particle.style.left) || 0;
            const y = parseFloat(particle.style.top) || 0;
            
            // Subtle movement
            const dx = Math.sin(Date.now() / 1000 + index) * 0.5;
            const dy = Math.cos(Date.now() / 1000 + index) * 0.5;
            
            particle.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
};

// Initialize particles on page load
document.addEventListener('DOMContentLoaded', () => ParticleSystem.init());


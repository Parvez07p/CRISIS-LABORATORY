/* ============================================
   AI ODYSSEY - Navigation Manager
   ============================================ */

const Navigation = {
    init() {
        this.navbar = document.getElementById('navbar');
        this.menuToggle = document.getElementById('menuToggle');
        this.navLinks = document.getElementById('navLinks');
        
        this.bindEvents();
        this.setActiveLink();
        this.handleScroll();
    },

    bindEvents() {
        // Mobile menu toggle
        if (this.menuToggle && this.navLinks) {
            this.menuToggle.addEventListener('click', () => {
                this.menuToggle.classList.toggle('active');
                this.navLinks.classList.toggle('active');
            });

            // Close menu on link click
            this.navLinks.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    this.menuToggle.classList.remove('active');
                    this.navLinks.classList.remove('active');
                });
            });
        }

        // Scroll handler
        window.addEventListener('scroll', () => this.handleScroll());
    },

    handleScroll() {
        if (this.navbar) {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        }
    },

    setActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        this.navLinks?.querySelectorAll('.nav-link').forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === currentPath);
        });
    }
};

// Initialize navigation on page load
document.addEventListener('DOMContentLoaded', () => Navigation.init());


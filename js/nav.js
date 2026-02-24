// Smart Nav Scroll Behavior and Global Toasts
document.addEventListener('DOMContentLoaded', () => {
    let lastScrollY = 0;
    const nav = document.getElementById('navbar');

    if (nav) {
        // Add global nav height for anchor offsets
        document.documentElement.style.setProperty('--nav-height', `${nav.offsetHeight}px`);

        window.addEventListener('scroll', () => {
            const current = window.scrollY;
            nav.classList.toggle('nav--hidden', current > lastScrollY && current > 80);
            nav.classList.toggle('nav--scrolled', current > 20);
            lastScrollY = current;
        }, { passive: true });
    }

    // Hamburger Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('overlay');

    if (hamburger && drawer && overlay) {
        hamburger.addEventListener('click', () => {
            drawer.classList.toggle('open');
            overlay.classList.toggle('open');
            document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
        });

        overlay.addEventListener('click', () => {
            drawer.classList.remove('open');
            overlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    // Animation Observer
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
});

// Global Toast System
function showToast(message, type = 'success', duration = 3000) {
    let container = document.getElementById('toasts');

    // Create container if it doesn't exist
    if (!container) {
        container = document.createElement('div');
        container.id = 'toasts';
        container.className = 'toasts';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'error') icon = '❌';
    if (type === 'warning') icon = '⚠️';

    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => toast.classList.add('toast--visible'));

    // Remove
    setTimeout(() => {
        toast.classList.remove('toast--visible');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

window.showToast = showToast;

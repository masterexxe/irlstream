/* =============================================
   IRL Streaming - Main JavaScript (Optimized)
   ============================================= */

// =============================================
// DOM Elements
// =============================================
const filterTabs = document.querySelectorAll('.filter-tab');
const clipCards = document.querySelectorAll('.clip-card');
const modal = document.getElementById('videoModal');

// =============================================
// Lazy Loading for Videos
// =============================================
// Videos only load when they enter the viewport
const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const video = entry.target;
            const src = video.dataset.src;
            if (src && !video.src) {
                video.src = src;
                video.load();
            }
            // Keep observing for play/pause on scroll
        }
    });
}, {
    rootMargin: '100px', // Load slightly before entering viewport
    threshold: 0
});

// Apply lazy loading to all clip videos
document.querySelectorAll('.clip-video[data-src]').forEach(video => {
    videoObserver.observe(video);
});

// =============================================
// Filter Functionality
// =============================================
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        clipCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
                const video = card.querySelector('.clip-video');
                if (video) video.pause();
            }
        });
    });
});

// =============================================
// Hover to Play Videos
// =============================================
clipCards.forEach(card => {
    const video = card.querySelector('.clip-video');
    
    card.addEventListener('mouseenter', () => {
        if (video) {
            // Ensure video source is loaded on hover
            if (video.dataset.src && !video.src) {
                video.src = video.dataset.src;
                video.load();
            }
            video.play().catch(() => {});
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    });
    
    // Touch support for mobile
    card.addEventListener('touchstart', () => {
        if (video) {
            if (video.dataset.src && !video.src) {
                video.src = video.dataset.src;
                video.load();
            }
            if (video.paused) {
                video.play().catch(() => {});
            } else {
                video.pause();
            }
        }
    }, { passive: true });
});

// =============================================
// Modal Functionality
// =============================================
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    document.getElementById('videoContainer').innerHTML = '';
}

function openModal(videoSrc) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const container = document.getElementById('videoContainer');
    container.innerHTML = `
        <video controls autoplay style="width: 100%; height: 100%;">
            <source src="${videoSrc}" type="video/webm">
        </video>
    `;
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// =============================================
// Smooth Scroll Navigation
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// =============================================
// Intersection Observer for Animations
// =============================================
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.clip-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    animationObserver.observe(el);
});

// =============================================
// Cookie Banner Logic
// =============================================
function handleCookies(acceptAll) {
    const consent = {
        necessary: true,
        analytics: acceptAll,
        marketing: acceptAll,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    document.getElementById('cookie-banner').classList.remove('show');
}

document.addEventListener('DOMContentLoaded', function() {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
        setTimeout(() => {
            document.getElementById('cookie-banner').classList.add('show');
        }, 1000);
    }
});

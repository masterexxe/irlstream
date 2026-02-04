/* =============================================
   IRL Streaming - Main JavaScript
   ============================================= */

// =============================================
// DOM Elements
// =============================================
const filterTabs = document.querySelectorAll('.filter-tab');
const clipCards = document.querySelectorAll('.clip-card');
const modal = document.getElementById('videoModal');

// =============================================
// Filter Functionality
// =============================================
filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Update active tab
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Filter clips
        const filter = tab.dataset.filter;
        clipCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.style.display = 'block';
                card.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                card.style.display = 'none';
                // Pause hidden videos
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
            video.play().catch(() => {});
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    });
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
            <source src="${videoSrc}" type="video/mp4">
        </video>
    `;
}

// Close modal on background click
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// =============================================
// Form Handling
// =============================================
function handleSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('.submit-btn');
    btn.textContent = 'Gesendet ✓';
    btn.style.background = '#22c55e';
    
    setTimeout(() => {
        btn.textContent = 'Anfrage senden';
        btn.style.background = '';
        e.target.reset();
    }, 3000);
}

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
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply observer to animated elements
document.querySelectorAll('.clip-card, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
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

// Show cookie banner if no consent given
document.addEventListener('DOMContentLoaded', function() {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
        setTimeout(() => {
            document.getElementById('cookie-banner').classList.add('show');
        }, 1000);
    }
});

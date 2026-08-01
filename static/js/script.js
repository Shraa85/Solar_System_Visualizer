// ==================== NAVIGATION ==================== 

// Smooth scrolling for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ==================== BUTTON REDIRECTS ====================

function redirectToLogin() {
    window.location.href = '/login';
}

function redirectToRegister() {
    window.location.href = '/register';
}

function redirectToStartExplore() {
    // Visualizer is FREE for all users - no login required!
    window.location.href = '/visualizer';
}

// ==================== DEMO - SCROLL TO QUIZZES ====================

function showDemo() {
    // Scroll to quizzes section instead of showing modal
    const quizzesSection = document.querySelector('.quizzes-preview');
    if (quizzesSection) {
        quizzesSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function closeDemo() {
    // Not needed anymore
}

// ==================== CONTACT FORM ====================

function handleContactForm(event) {
    event.preventDefault();
    
    const form = event.target;
    const name = form.children[0].value;
    const email = form.children[1].value;
    const message = form.children[2].value;
    
    // Simple validation
    if (!name || !email || !message) {
        alert('Please fill out all fields');
        return;
    }
    
    // In production, you would send this to a backend endpoint
    console.log('Contact form submitted:', { name, email, message });
    
    // Show success message
    alert('Thank you for your message! We will get back to you soon.');
    form.reset();
}

// ==================== STAR ANIMATION ====================

function createStars() {
    const starsContainer = document.querySelector('.stars');
    if (!starsContainer) return;
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.width = '2px';
        star.style.height = '2px';
        star.style.background = 'white';
        star.style.borderRadius = '50%';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.opacity = Math.random();
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite`;
        starsContainer.appendChild(star);
    }
}

// Initialize stars on page load
document.addEventListener('DOMContentLoaded', createStars);

// ==================== SCROLL ANIMATIONS ====================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards and other elements
document.querySelectorAll('.feature-card, .stat, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ==================== RESPONSIVE HAMBURGER MENU ====================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });
}

// ==================== NAVBAR BACKGROUND ON SCROLL ====================

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.borderBottomColor = 'rgba(26, 31, 58, 0.8)';
    } else {
        navbar.style.borderBottomColor = 'rgba(26, 31, 58, 0.5)';
    }
});

// ==================== BUTTON RIPPLE EFFECT ====================

document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');

        // Add ripple styling if not already in CSS
        if (!document.querySelector('style[data-ripple]')) {
            const style = document.createElement('style');
            style.setAttribute('data-ripple', 'true');
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        this.appendChild(ripple);
    });
});

// ==================== UTILITY FUNCTIONS ====================

// Check if user is authenticated
function isUserLoggedIn() {
    return fetch('/api/user/profile')
        .then(response => response.ok)
        .catch(() => false);
}

// Get current user info
function getCurrentUser() {
    return fetch('/api/user/profile')
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Not authenticated');
        })
        .catch(() => null);
}

// ==================== PAGE ANIMATIONS ====================

// Add fade-in animation to page on load
window.addEventListener('load', function() {
    document.body.style.opacity = '1';
});

// Initialize page with proper opacity
document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease-out';
setTimeout(() => {
    document.body.style.opacity = '1';
}, 100);

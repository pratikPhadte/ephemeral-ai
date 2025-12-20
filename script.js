// ===== Navbar Scroll Effect =====
const navbar = document.querySelector('.navbar');

const handleScroll = () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
};

window.addEventListener('scroll', handleScroll);

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// ===== Scroll Animation Observer =====
const scrollObserverOptions = {
    root: null,
    rootMargin: '-50px',
    threshold: 0.15
};

const scrollAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            scrollAnimationObserver.unobserve(entry.target);
        }
    });
}, scrollObserverOptions);

// Observe all animate-on-scroll elements
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    scrollAnimationObserver.observe(el);
});

// ===== Legacy Fade In Animation (for backward compatibility) =====
const fadeObserverOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeInObserver.unobserve(entry.target);
        }
    });
}, fadeObserverOptions);

// Add fade-in class to legacy elements
const animateElements = document.querySelectorAll(
    '.service-card:not(.animate-on-scroll), .solution-item:not(.animate-on-scroll), .process-step:not(.animate-on-scroll), .tech-item'
);

animateElements.forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${index * 0.08}s`;
    fadeInObserver.observe(el);
});

// ===== Contact Form - Saves to Google Sheet & Opens Email Client =====
const sendEmailBtn = document.getElementById('sendEmailBtn');
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycby9z-ZNF_LDdjuUa9GK2ZYEgE-sDwq0tuQxJGBsyXsnU6ZVXG5gDfQQGwBsjCMLc0oklg/exec';

if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const company = document.getElementById('company').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        const contactHint = document.getElementById('contactHint');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const formSuccess = document.getElementById('formSuccess');

        // Reset error states
        contactHint.classList.remove('error');
        emailInput.classList.remove('error');
        phoneInput.classList.remove('error');

        // Validate: at least email or phone required
        if (!email && !phone) {
            contactHint.classList.add('error');
            emailInput.classList.add('error');
            phoneInput.classList.add('error');
            contactHint.textContent = 'Please provide at least an email or phone number';
            return;
        }

        // Save to Google Sheet using URL parameters (works with CORS)
        const params = new URLSearchParams({
            name: name || 'Not provided',
            company: company || 'Not provided',
            email: email || 'Not provided',
            phone: phone || 'Not provided',
            message: message || 'No message'
        });

        // Use an image beacon to ensure the request completes before redirect
        const img = new Image();
        img.src = `${GOOGLE_SHEET_URL}?${params.toString()}`;

        // Small delay to ensure request is sent
        await new Promise(resolve => setTimeout(resolve, 500));

        // Show success message
        formSuccess.classList.add('show');

        // Reset form
        document.getElementById('name').value = '';
        document.getElementById('company').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
        document.getElementById('message').value = '';

        // Hide success message after 10 seconds
        setTimeout(() => {
            formSuccess.classList.remove('show');
        }, 10000);
    });
}

// ===== Mailto Button - Opens Email Client =====
const mailtoBtn = document.getElementById('mailtoBtn');

if (mailtoBtn) {
    mailtoBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const company = document.getElementById('company').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();

        const subject = encodeURIComponent('Ephemeral.ai - Project Inquiry');

        let body = '';
        if (name) body += `Name: ${name}\n`;
        if (company) body += `Company: ${company}\n`;
        if (email) body += `Email: ${email}\n`;
        if (phone) body += `Phone: ${phone}\n`;
        if (name || company || email || phone) body += '\n';
        body += message || 'I would like to discuss a project with you.';

        const encodedBody = encodeURIComponent(body);
        const mailtoLink = `mailto:ephemeralai5@gmail.com?subject=${subject}&body=${encodedBody}`;

        window.location.href = mailtoLink;
    });
}

// ===== Parallax Effect for Artifacts =====
const artifacts = document.querySelectorAll('.artifact');
let rafId = null;
let mouseX = 0.5;
let mouseY = 0.5;

const updateArtifacts = () => {
    artifacts.forEach((artifact, index) => {
        const speed = (index + 1) * 0.015;
        const x = (mouseX - 0.5) * speed * 80;
        const y = (mouseY - 0.5) * speed * 80;
        artifact.style.transform = `translate(${x}px, ${y}px)`;
    });
    rafId = null;
};

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;

    if (!rafId) {
        rafId = requestAnimationFrame(updateArtifacts);
    }
});

// ===== Counter Animation for Stats =====
const animateCounter = (element, target, suffix = '', duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    const startTime = performance.now();

    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function (ease-out cubic)
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easedProgress);

        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + suffix;
        }
    };

    requestAnimationFrame(updateCounter);
};

// Observe stats section
const statsSection = document.querySelector('.hero-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    if (text.includes('+')) {
                        const num = parseInt(text);
                        stat.textContent = '0+';
                        animateCounter(stat, num, '+', 1800);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// ===== Active Navigation Link Highlighting =====
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

const highlightNav = () => {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
};

window.addEventListener('scroll', highlightNav);

// ===== Preloader =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger initial animations after load
    setTimeout(() => {
        document.querySelectorAll('.hero .animate-on-scroll').forEach(el => {
            el.classList.add('visible');
        });
    }, 100);
});

// ===== Service Card Hover Effect =====
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ===== Keyboard Navigation Support =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        if (navLinks?.classList.contains('active')) {
            mobileMenuBtn?.click();
        }
    }
});

// ===== Smooth reveal for hero elements =====
const heroContent = document.querySelector('.hero-content');
const heroVisual = document.querySelector('.hero-visual');

if (heroContent && heroVisual) {
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 200);

    setTimeout(() => {
        heroVisual.style.opacity = '1';
        heroVisual.style.transform = 'translateY(0)';
    }, 400);
}

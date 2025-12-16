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

// ===== Fade In Animation on Scroll =====
const observerOptions = {
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
}, observerOptions);

// Add fade-in class to elements
const animateElements = document.querySelectorAll(
    '.service-card, .solution-item, .process-step, .tech-item'
);

animateElements.forEach((el, index) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${index * 0.1}s`;
    fadeInObserver.observe(el);
});

// ===== Contact Form - Saves to Google Sheet & Opens Email Client =====
const sendEmailBtn = document.getElementById('sendEmailBtn');
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbwtuk7HnOBAnEBj10aAHFsC7neuFKDgyExzjdO-fsX3pVdpPXOioVkLu_djHY6YE7aOkg/exec';

if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const company = document.getElementById('company').value.trim();
        const message = document.getElementById('message').value.trim();

        // Save to Google Sheet (don't wait for response)
        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name || 'Not provided',
                company: company || 'Not provided',
                message: message || 'No message'
            })
        }).catch(() => {}); // Silently fail if sheet save fails

        // Open email client
        const subject = encodeURIComponent('Ephemeral.ai - Project Inquiry');

        let body = '';
        if (name) body += `Name: ${name}\n`;
        if (company) body += `Company: ${company}\n`;
        if (name || company) body += '\n';
        body += message || 'I would like to discuss a project with you.';

        const encodedBody = encodeURIComponent(body);
        const mailtoLink = `mailto:pratikphadte1910@gmail.com?subject=${subject}&body=${encodedBody}`;

        window.location.href = mailtoLink;
    });
}

// ===== Parallax Effect for Artifacts =====
const artifacts = document.querySelectorAll('.artifact');

window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    artifacts.forEach((artifact, index) => {
        const speed = (index + 1) * 0.02;
        const x = (mouseX - 0.5) * speed * 100;
        const y = (mouseY - 0.5) * speed * 100;

        artifact.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ===== Typing Effect for Hero (Optional Enhancement) =====
const heroTitle = document.querySelector('.hero h1');
const originalText = heroTitle?.textContent || '';

// ===== Counter Animation for Stats =====
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
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
                        animateCounter(stat, num, 1500);
                        setTimeout(() => stat.textContent = num + '+', 1600);
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

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
});

// ===== Preloader (Optional) =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
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

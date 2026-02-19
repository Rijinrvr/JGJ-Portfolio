/* =============================================
   SCRIPT.JS — Jestin G Johnson Portfolio
   Graphic Designer Edition
   ============================================= */

// ─── INTRO ANIMATION ───────────────────────────────────────────
(function runIntro() {
    const intro = document.querySelector('.intro');
    const logoSpans = document.querySelectorAll('.intro-logo');
    const introSub = document.querySelector('.intro-subtitle');

    if (!intro) return;

    window.addEventListener('DOMContentLoaded', () => {
        // Animate letters in
        logoSpans.forEach((span, idx) => {
            setTimeout(() => {
                span.classList.add('active');
            }, 150 + idx * 120);
        });

        // Show subtitle
        setTimeout(() => {
            if (introSub) introSub.classList.add('show');
        }, 900);

        // Fade letters out
        setTimeout(() => {
            logoSpans.forEach((span, idx) => {
                setTimeout(() => {
                    span.classList.remove('active');
                    span.classList.add('fade');
                }, idx * 50);
            });
        }, 2000);

        // Slide intro away
        setTimeout(() => {
            intro.classList.add('intro-exit');
        }, 2400);
    });
})();


// ─── SCROLL TO TOP ON RELOAD ──────────────────────────────────
window.addEventListener('load', () => {
    window.scrollTo(0, 0);
});


// ─── HAMBURGER MENU ───────────────────────────────────────────
function togglemenu() {
    const menu = document.querySelector('.menu-links');
    const icon = document.querySelector('.hamburger-icon');

    const isOpen = menu.classList.toggle('open');
    icon.classList.toggle('open');

    if (isOpen) {
        document.addEventListener('click', closeMenuOutside);
    } else {
        document.removeEventListener('click', closeMenuOutside);
    }
}

function closeMenuOutside(e) {
    const menu = document.querySelector('.menu-links');
    const icon = document.querySelector('.hamburger-icon');

    if (!menu.contains(e.target) && !icon.contains(e.target)) {
        menu.classList.remove('open');
        icon.classList.remove('open');
        document.removeEventListener('click', closeMenuOutside);
    }
}


// ─── SCROLL REVEAL ─────────────────────────────────────────────
// Only animate sections that start BELOW the initial viewport.
// Sections already in view (#profile, #stats) are never hidden.
function setupScrollReveal() {
    const allSections = document.querySelectorAll('section');
    // Never hide these — they are always above the fold
    const neverHide = new Set(['profile', 'stats']);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target); // animate once
            }
        });
    }, {
        threshold: 0.08,   // trigger when 8% of section is visible
        rootMargin: '0px 0px -40px 0px'
    });

    allSections.forEach(sec => {
        if (neverHide.has(sec.id)) return; // skip always-visible sections
        sec.classList.add('animate-section'); // mark for animation
        observer.observe(sec);
    });
}

// Run after the intro finishes sliding away (2.6s) so sections are
// observed correctly, not blocked by the intro overlay's z-index.
setTimeout(setupScrollReveal, 600);


// ─── ACTIVE NAV LINK (SCROLLSPY) ──────────────────────────────
function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active-nav');
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });


// ─── WORK PORTFOLIO FILTER ────────────────────────────────────
(function setupFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workItems = document.querySelectorAll('.work-item');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            workItems.forEach(item => {
                if (filter === 'all' || item.dataset.cat === filter) {
                    item.classList.remove('hidden');
                    // Trigger re-entrance animation
                    item.style.animation = 'none';
                    void item.offsetWidth; // reflow
                    item.style.animation = '';
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
})();


// ─── STATS COUNTER ANIMATION ──────────────────────────────────
function animateCounters() {
    const statNums = document.querySelectorAll('.stat-number');

    statNums.forEach(el => {
        if (el.dataset.counted) return;

        const raw = el.textContent.trim();
        const plus = raw.includes('+');
        const num = parseInt(raw.replace('+', ''), 10);

        if (isNaN(num)) return;

        el.dataset.counted = 'true';

        let start = 0;
        const duration = 1500;
        const step = Math.ceil(num / (duration / 30));
        const suffix = plus ? '+' : '';

        const timer = setInterval(() => {
            start += step;
            if (start >= num) {
                start = num;
                clearInterval(timer);
            }
            el.textContent = start + suffix;
        }, 30);
    });
}

// Trigger counter when stats section is visible
const statsSection = document.querySelector('#stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    statsObserver.observe(statsSection);
}


// ─── NAV ACTIVE STYLE IN CSS (inject via JS) ─────────────────
const navStyle = document.createElement('style');
navStyle.textContent = `
    .nav-links a.active-nav {
        color: var(--accent-light) !important;
    }
    .nav-links a.active-nav::after {
        width: 100% !important;
    }
    .work-item {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }
    .work-item.hidden {
        display: none;
    }
`;
document.head.appendChild(navStyle);

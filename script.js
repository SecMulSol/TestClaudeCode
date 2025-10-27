// Surveillance Mobile Landing Page - JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // ======================
    // Mobile Menu Toggle
    // ======================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('show');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('show');
            });
        });
    }

    // ======================
    // Navbar Scroll Effect
    // ======================
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }

        lastScroll = currentScroll;
    });

    // ======================
    // Smooth Scroll for Navigation Links
    // ======================
    const navLinks = document.querySelectorAll('.nav-link, a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const navbarHeight = navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ======================
    // Scroll to Top Button
    // ======================
    const scrollTopBtn = document.getElementById('scroll-top');

    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ======================
    // Counter Animation
    // ======================
    const counters = document.querySelectorAll('.counter');
    let counterAnimated = false;

    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;

            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    }

    function checkCounters() {
        if (counterAnimated) return;

        counters.forEach(counter => {
            const rect = counter.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

            if (isVisible) {
                animateCounter(counter);
                counterAnimated = true;
            }
        });
    }

    window.addEventListener('scroll', checkCounters);
    checkCounters(); // Check on load

    // ======================
    // Intersection Observer for Scroll Animations
    // ======================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-left, .slide-right').forEach(el => {
        observer.observe(el);
    });

    // ======================
    // Form Handling
    // ======================
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form button
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Show loading state
            submitBtn.classList.add('btn-loading');
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                // Reset button
                submitBtn.classList.remove('btn-loading');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Show success message
                formMessage.classList.remove('hidden', 'form-error');
                formMessage.classList.add('form-success');
                formMessage.textContent = 'Merci ! Votre demande a été envoyée avec succès. Nous vous recontacterons dans les plus brefs délais.';

                // Reset form
                contactForm.reset();

                // Hide message after 5 seconds
                setTimeout(() => {
                    formMessage.classList.add('hidden');
                }, 5000);

                // In production, you would send the form data to your server:
                /*
                const formData = new FormData(contactForm);

                fetch('/api/contact', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    // Handle success
                    submitBtn.classList.remove('btn-loading');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;

                    formMessage.classList.remove('hidden', 'form-error');
                    formMessage.classList.add('form-success');
                    formMessage.textContent = 'Merci ! Votre demande a été envoyée avec succès.';

                    contactForm.reset();
                })
                .catch(error => {
                    // Handle error
                    submitBtn.classList.remove('btn-loading');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;

                    formMessage.classList.remove('hidden', 'form-success');
                    formMessage.classList.add('form-error');
                    formMessage.textContent = 'Une erreur est survenue. Veuillez réessayer.';
                });
                */

            }, 2000);
        });
    }

    // ======================
    // Service Cards Hover Effect
    // ======================
    const serviceCards = document.querySelectorAll('.service-card, .card-hover');

    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // ======================
    // Application Cards Click Handler
    // ======================
    const appCards = document.querySelectorAll('#applications .group');

    appCards.forEach(card => {
        card.addEventListener('click', function() {
            // Add a subtle bounce animation
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'pulse 0.5s ease';
            }, 10);

            // Scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = contactSection.offsetTop - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ======================
    // Parallax Effect for Hero Section
    // ======================
    const hero = document.querySelector('.hero-pattern');

    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            hero.style.transform = `translate3d(0, ${rate}px, 0)`;
        });
    }

    // ======================
    // Phone Number Formatting
    // ======================
    const phoneInput = contactForm?.querySelector('input[type="tel"]');

    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');

            // Format as +33 X XX XX XX XX
            if (value.startsWith('33')) {
                value = value.substring(2);
            } else if (value.startsWith('0')) {
                value = value.substring(1);
            }

            if (value.length > 0) {
                let formatted = '+33 ';
                for (let i = 0; i < value.length && i < 9; i++) {
                    if (i > 0 && i % 2 === 1) formatted += ' ';
                    formatted += value[i];
                }
                e.target.value = formatted;
            }
        });
    }

    // ======================
    // Stats Section Animation on Hover
    // ======================
    const statItems = document.querySelectorAll('#stats .counter').forEach(item => {
        const parent = item.parentElement.parentElement;

        parent.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });

        parent.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // ======================
    // Keyboard Navigation Enhancement
    // ======================
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('show');
        }
    });

    // ======================
    // Form Validation Enhancement
    // ======================
    if (contactForm) {
        const inputs = contactForm.querySelectorAll('input, textarea, select');

        inputs.forEach(input => {
            // Show validation on blur
            input.addEventListener('blur', function() {
                if (this.hasAttribute('required') && !this.value.trim()) {
                    this.classList.add('border-red-500');
                } else {
                    this.classList.remove('border-red-500');
                }
            });

            // Remove error styling on input
            input.addEventListener('input', function() {
                this.classList.remove('border-red-500');
            });
        });
    }

    // ======================
    // Lazy Loading for Images (if any are added)
    // ======================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ======================
    // Performance: Debounce Scroll Events
    // ======================
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll-heavy functions if needed
    const debouncedScroll = debounce(() => {
        // Additional scroll handlers can go here
    }, 100);

    window.addEventListener('scroll', debouncedScroll);

    // ======================
    // Console Welcome Message
    // ======================
    console.log('%c🎥 Surveillance Mobile', 'font-size: 20px; font-weight: bold; color: #1e40af;');
    console.log('%cSolutions professionnelles de surveillance mobile', 'font-size: 14px; color: #6b7280;');

    // ======================
    // Page Load Animation
    // ======================
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ======================
// Service Worker Registration (Optional - for PWA)
// ======================
/*
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}
*/

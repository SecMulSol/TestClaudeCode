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

            // Validation côté client
            const nom = contactForm.querySelector('input[name="nom"]').value.trim();
            const email = contactForm.querySelector('input[name="email"]').value.trim();
            const telephone = contactForm.querySelector('input[name="telephone"]').value.trim();
            const type_projet = contactForm.querySelector('select[name="type_projet"]').value;
            const message = contactForm.querySelector('textarea[name="message"]').value.trim();

            // Vérifications basiques
            if (!nom || nom.length < 2) {
                showFormMessage('Veuillez entrer un nom valide (minimum 2 caractères)', false);
                return;
            }

            if (!email || !isValidEmail(email)) {
                showFormMessage('Veuillez entrer un email valide', false);
                return;
            }

            if (!telephone || telephone.length < 10) {
                showFormMessage('Veuillez entrer un numéro de téléphone valide', false);
                return;
            }

            if (!type_projet) {
                showFormMessage('Veuillez sélectionner un type de projet', false);
                return;
            }

            if (!message || message.length < 10) {
                showFormMessage('Veuillez entrer un message (minimum 10 caractères)', false);
                return;
            }

            // Show loading state
            submitBtn.classList.add('btn-loading');
            submitBtn.textContent = 'Envoi en cours...';
            submitBtn.disabled = true;

            // Préparer les données du formulaire
            const formData = new FormData(contactForm);

            // Envoyer au serveur PHP
            fetch('contact.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur réseau: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Reset button
                submitBtn.classList.remove('btn-loading');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                if (data.success) {
                    // Show success message
                    showFormMessage(data.message, true);

                    // Reset form
                    contactForm.reset();

                    // Scroll to message
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    // Show error message from server
                    showFormMessage(data.message || 'Une erreur est survenue lors de l\'envoi.', false);
                }
            })
            .catch(error => {
                // Handle error
                console.error('Erreur lors de l\'envoi:', error);

                submitBtn.classList.remove('btn-loading');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                showFormMessage(
                    'Une erreur est survenue lors de l\'envoi. Veuillez vérifier votre connexion et réessayer.',
                    false
                );
            });
        });
    }

    // Fonction pour afficher les messages du formulaire
    function showFormMessage(message, isSuccess) {
        formMessage.classList.remove('hidden');

        if (isSuccess) {
            formMessage.classList.remove('form-error');
            formMessage.classList.add('form-success');
        } else {
            formMessage.classList.remove('form-success');
            formMessage.classList.add('form-error');
        }

        formMessage.textContent = message;

        // Hide message after 8 seconds
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 8000);
    }

    // Fonction de validation d'email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

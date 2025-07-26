// Main JavaScript File for Aw Tech Static Website

document.addEventListener('DOMContentLoaded', () => {
    console.log('Aw Tech Static Site Initialized');

    // --- Header / Navigation Script ---
    const header = document.getElementById('main-header');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav-menu');
    const navLinks = document.querySelectorAll('.desktop-nav a[href^="index.html#"], .mobile-nav a[href^="index.html#"]');

    // Mobile Menu Toggle
    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('open');
            const isExpanded = mobileNav.classList.contains('open');
            mobileMenuToggle.setAttribute('aria-expanded', isExpanded.toString());
            // Optional: Change hamburger icon to close icon
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                if (isExpanded) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // Close mobile menu when a link is clicked
    if (mobileNav) {
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNav.classList.contains('open')) {
                    mobileNav.classList.remove('open');
                    mobileMenuToggle.setAttribute('aria-expanded', 'false');
                    const icon = mobileMenuToggle.querySelector('i');
                     if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
    }
    

    // Smooth Scrolling for on-page anchor links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Check if it's an on-page link for index.html
            if (href.startsWith('index.html#')) {
                e.preventDefault();
                const targetId = href.substring(href.indexOf('#') + 1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    // Calculate position, considering the fixed header height
                    const headerOffset = header ? header.offsetHeight : 80; // Default offset if header not found
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // For links to other pages (like portfolio.html), default behavior is fine.
        });
    });

    // Add 'scrolled' class to header on scroll
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) { // Add 'scrolled' class after 50px of scroll
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Click outside to close mobile menu
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = mobileNav ? mobileNav.contains(event.target) : false;
        const isClickOnToggleButton = mobileMenuToggle ? mobileMenuToggle.contains(event.target) : false;

        if (mobileNav && mobileNav.classList.contains('open') && !isClickInsideMenu && !isClickOnToggleButton) {
            mobileNav.classList.remove('open');
            if (mobileMenuToggle) {
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileMenuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        }
    });

    // --- Project Filtering (Featured Projects on Landing Page) ---
    const featuredProjectsGrid = document.querySelector('.featured-projects-grid');
    if (featuredProjectsGrid) { // Only run if on a page with this grid
        const filterButtons = document.querySelectorAll('#projects .filter-btn');
        const projectCards = featuredProjectsGrid.querySelectorAll('.project-card');
        const maxFeaturedProjects = 3;

        const filterProjects = (filter) => {
            let count = 0;
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const shouldShow = (filter === 'all' || category === filter);
                
                if (shouldShow && count < maxFeaturedProjects) {
                    card.classList.remove('hidden');
                    count++;
                } else if (filter === 'all' && !shouldShow && count < maxFeaturedProjects) {
                    // If filter is 'all', we still want to show up to maxFeaturedProjects
                    // This case is mostly for when 'all' is selected, ensure only first N are shown
                    // and others hidden.
                    // This specific logic might be complex if we always want to show first N *matching* items.
                    // For landing page 'all', it's simpler to just show the first N cards by default in HTML
                    // and then filter *from those N* if other categories are selected.
                    // Let's simplify: 'all' shows first N, specific filters show first N *of that category*.
                     card.classList.remove('hidden'); // Show all initially for "all" then JS will hide if needed
                }
                 else {
                    card.classList.add('hidden');
                }
            });

            // If filter is 'all', ensure only maxFeaturedProjects are visible from the start
            if (filter === 'all') {
                projectCards.forEach((card, index) => {
                    if (index < maxFeaturedProjects) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            }
        };

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentActive = document.querySelector('#projects .filter-btn.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }
                button.classList.add('active');
                const filterValue = button.getAttribute('data-filter');
                filterProjects(filterValue);
            });
        });

        // Initial filter display (show 'all' - first 3 projects)
        filterProjects('all');
    }


    // --- Project Filtering (Full Portfolio Page) ---
    const portfolioPageGrid = document.querySelector('.portfolio-projects-grid');
    if (portfolioPageGrid) { // Only run if on a page with this grid
        const filterButtonsPortfolio = document.querySelectorAll('#portfolio-gallery .filter-btn');
        const projectCardsPortfolio = portfolioPageGrid.querySelectorAll('.project-card');
        const noProjectsMessage = document.querySelector('#portfolio-gallery .no-projects-message');

        const filterPortfolioProjects = (filter) => {
            let visibleCount = 0;
            projectCardsPortfolio.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    visibleCount++;
                } else {
                    card.classList.add('hidden');
                }
            });

            if (noProjectsMessage) {
                if (visibleCount === 0) {
                    noProjectsMessage.style.display = 'block';
                } else {
                    noProjectsMessage.style.display = 'none';
                }
            }
        };

        filterButtonsPortfolio.forEach(button => {
            button.addEventListener('click', () => {
                document.querySelector('#portfolio-gallery .filter-btn.active').classList.remove('active');
                button.classList.add('active');
                const filterValue = button.getAttribute('data-filter');
                filterPortfolioProjects(filterValue);
            });
        });

        // Initial filter display (show 'all')
        filterPortfolioProjects('all');
    }


    // --- Footer Script ---
    // Dynamically set copyright year
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear().toString();
    }

    // Placeholder for any other interactive elements
});


// --- Hero Section Scripts ---
            // Initialize Particles.js
            if (typeof particlesJS === 'function') {
                particlesJS("particles-js", {
                    "particles": {
                        "number": {
                            "value": 80,
                            "density": {
                                "enable": true,
                                "value_area": 800
                            }
                        },
                        "color": {
                            "value": "#4f6df5"
                        },
                        "shape": {
                            "type": "circle",
                            "stroke": {
                                "width": 0,
                                "color": "#000000"
                            }
                        },
                        "opacity": {
                            "value": 0.5,
                            "random": true,
                            "anim": {
                                "enable": true,
                                "speed": 1,
                                "opacity_min": 0.1,
                                "sync": false
                            }
                        },
                        "size": {
                            "value": 3,
                            "random": true,
                            "anim": {
                                "enable": true,
                                "speed": 2,
                                "size_min": 0.1,
                                "sync": false
                            }
                        },
                        "line_linked": {
                            "enable": true,
                            "distance": 150,
                            "color": "#4f6df5",
                            "opacity": 0.2,
                            "width": 1
                        },
                        "move": {
                            "enable": true,
                            "speed": 1,
                            "direction": "none",
                            "random": true,
                            "straight": false,
                            "out_mode": "out",
                            "bounce": false,
                            "attract": {
                                "enable": false,
                                "rotateX": 600,
                                "rotateY": 1200
                            }
                        }
                    },
                    "interactivity": {
                        "detect_on": "canvas",
                        "events": {
                            "onhover": {
                                "enable": true,
                                "mode": "grab"
                            },
                            "onclick": {
                                "enable": true,
                                "mode": "push"
                            },
                            "resize": true
                        },
                        "modes": {
                            "grab": {
                                "distance": 140,
                                "line_linked": {
                                    "opacity": 0.5
                                }
                            },
                            "push": {
                                "particles_nb": 4
                            }
                        }
                    },
                    "retina_detect": true
                });
            }

            // Create tech grid cells
            const techGrid = document.querySelector('.tech-grid');
            if (techGrid) {
                for (let i = 0; i < 100; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    techGrid.appendChild(cell);
                }
            }

            // Stats counter animation
            const statCounters = document.querySelectorAll('.stat-number');
            const options = {
                threshold: 0.5
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const target = entry.target;
                        const countTo = parseInt(target.getAttribute('data-count'));
                        const duration = 2000;
                        const frameDuration = 1000 / 60;
                        const totalFrames = Math.round(duration / frameDuration);
                        let frame = 0;
                        
                        const counter = setInterval(() => {
                            frame++;
                            const progress = frame / totalFrames;
                            const currentCount = Math.round(countTo * progress);
                            
                            if (parseInt(target.textContent) !== currentCount) {
                                target.textContent = currentCount;
                            }
                            
                            if (frame === totalFrames) {
                                clearInterval(counter);
                            }
                        }, frameDuration);
                        
                        observer.unobserve(target);
                    }
                });
            }, options);
            
            statCounters.forEach(counter => {
                observer.observe(counter);
            });

            // Parallax effect
        document.addEventListener('mousemove', (e) => {
            const heroText = document.querySelector('.hero-text');
            const heroVisuals = document.querySelector('.hero-visuals');
            
            if (heroText && heroVisuals) {
                const x = (window.innerWidth - e.pageX * 2) / 50;
                const y = (window.innerHeight - e.pageY * 2) / 50;
                
                heroText.style.transform = `translate(${x/5}px, ${y/5}px)`;
                heroVisuals.style.transform = `translate(${x/3}px, ${y/3}px)`;
            }
        });




        document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitBtn = contactForm.querySelector('.btn-submit-form');
    const originalBtnText = submitBtn.innerHTML;
    const formGrid = contactForm.querySelector('.form-grid');
    
    // Enhanced form validation
    function validateForm() {
        let isValid = true;
        
        // Validate name (minimum 2 characters, no numbers)
        const nameField = contactForm.querySelector('#name');
        if (!/^[a-zA-Z\s]{2,}$/.test(nameField.value.trim())) {
            showError(nameField, 'Please enter a valid name (minimum 2 letters)');
            isValid = false;
        } else {
            clearError(nameField);
        }
        
        // Validate email
        const emailField = contactForm.querySelector('#email');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value.trim())) {
            showError(emailField, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(emailField);
        }
        
        // Validate service selection
        const serviceField = contactForm.querySelector('#service');
        if (!serviceField.value) {
            showError(serviceField, 'Please select a service');
            isValid = false;
        } else {
            clearError(serviceField);
        }
        
        // Validate message (minimum 10 characters)
        const messageField = contactForm.querySelector('#message');
        if (messageField.value.trim().length < 10) {
            showError(messageField, 'Message should be at least 10 characters');
            isValid = false;
        } else {
            clearError(messageField);
        }
        
        return isValid;
    }
    
    function showError(field, message) {
        const formGroup = field.closest('.form-group');
        if (!formGroup.querySelector('.error-message')) {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            formGroup.appendChild(errorElement);
        }
        field.setAttribute('aria-invalid', 'true');
    }
    
    function clearError(field) {
        const formGroup = field.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            formGroup.removeChild(errorElement);
        }
        field.removeAttribute('aria-invalid');
    }
    
    // Real-time validation for fields
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim() !== '') {
                validateForm();
            }
        });
    });
    
    // Form submission handler
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Change button state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Sending...
        `;
        
        try {
            const formData = new FormData(contactForm);
            
            // Add honeypot field
            formData.append('_gotcha', '');
            
            // Add timestamp
            formData.append('_timestamp', Date.now());
            
            // Add page URL
            formData.append('_page_url', window.location.href);
            
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Success state
                contactForm.innerHTML = `
                    <div class="alert alert-success" role="alert">
                        <i class="fas fa-check-circle"></i>
                        <h3>Thank you for your message!</h3>
                        <p>We've received your inquiry and will get back to you within 24 hours.</p>
                        <button class="btn btn-secondary" onclick="window.location.reload()">Send another message</button>
                    </div>
                `;
                
                // Track conversion if needed
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'conversion', {'send_to': 'AW-123456789/AbC-D_efG-h12'});
                }
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            
            // Error state
            const errorAlert = document.createElement('div');
            errorAlert.className = 'alert alert-danger';
            errorAlert.innerHTML = `
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Oops! Something went wrong</h3>
                <p>We couldn't send your message. Please try again later or contact us via social media.</p>
            `;
            contactForm.insertBefore(errorAlert, contactForm.firstChild);
            
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        }
    });
    
    // Add subtle animation to form elements
    let delay = 0;
    contactForm.querySelectorAll('.form-group').forEach(group => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(20px)';
        group.style.transition = `all 0.5s ease ${delay}s`;
        group.style.willChange = 'opacity, transform';
        delay += 0.1;
        
        // Trigger animation
        setTimeout(() => {
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, 100);
    });
});

// Add CSS for error states and animations
const style = document.createElement('style');
style.textContent = `
    .error-message {
        color: #dc3545;
        font-size: 0.85rem;
        margin-top: 0.25rem;
        animation: fadeIn 0.3s ease;
    }
    
    [aria-invalid="true"] {
        border-color: #dc3545 !important;
    }
    
    .alert {
        padding: 1.5rem;
        border-radius: 8px;
        margin-bottom: 2rem;
        text-align: center;
        animation: fadeIn 0.5s ease;
    }
    
    .alert i {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        display: block;
    }
    
    .alert h3 {
        margin-bottom: 0.5rem;
    }
    
    .spinner-border {
        vertical-align: middle;
        margin-right: 0.5rem;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
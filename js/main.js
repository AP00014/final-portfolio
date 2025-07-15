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
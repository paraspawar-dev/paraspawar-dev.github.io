document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopButton = document.querySelector('.back-to-top');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const formMessage = document.getElementById('form-message'); // Get message container

    // Function to display messages
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message show ${type}`;

        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000); // Message disappears after 5 seconds
    }
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const heroContent = document.querySelector('.hero-content');

    // Initialize EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.init("H7sGal-pxNT9TGaXT");
        console.log('EmailJS initialized successfully');
    } else {
        console.error('EmailJS library not loaded');
    }

    // Animate Hero Content on Load
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 100); // Small delay to ensure transition is applied
    }

    // Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            this.classList.toggle('active');
        });
    }

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
        });
    });

    // Scroll animations and navbar effects
    const handleScroll = () => {
        // Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button
        if (window.scrollY > 500) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }

        // Animate elements on scroll
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            if (elementPosition < windowHeight - 50) {
                element.classList.add('show');
            }
        });

        // Active nav link
        let current = '';
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Project filtering (removed as per previous professionalization)

    // GA4 Event: Project Clicks
    const projectLinks = document.querySelectorAll('.project-links a');
    projectLinks.forEach(link => {
        link.addEventListener('click', function() {
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard ? projectCard.querySelector('.project-title').textContent : 'Unknown Project';
            const linkType = this.textContent.trim(); // e.g., 'Live Demo', 'Source Code'

            if (typeof gtag === 'function') {
                gtag('event', 'project_click', {
                    'event_category': 'engagement',
                    'event_label': `${projectTitle} - ${linkType}`,
                    'project_name': projectTitle,
                    'link_type': linkType
                });
            }
        });
    });

    // GA4 Event: Social Media Clicks
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const platform = this.getAttribute('aria-label') || 'Unknown';
            const url = this.getAttribute('href') || 'Unknown';

            if (typeof gtag === 'function') {
                gtag('event', 'social_media_click', {
                    'event_category': 'engagement',
                    'event_label': `Social Click: ${platform}`,
                    'social_platform': platform,
                    'social_url': url
                });
            }
        });
    });

    // GA4 Event: CV Download Click
    const cvDownloadButton = document.querySelector('a[href="#"].btn-primary'); // Assuming this is your CV download button
    if (cvDownloadButton) {
        cvDownloadButton.addEventListener('click', function() {
            if (typeof gtag === 'function') {
                gtag('event', 'cv_download', {
                    'event_category': 'engagement',
                    'event_label': 'CV Downloaded'
                });
            }
        });
    }

    // GA4 Event: Scroll Depth Tracking
    let scrollDepthsTracked = {};
    window.addEventListener('scroll', function() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = window.scrollY;
        const scrollPercentage = (scrolled / scrollHeight) * 100;

        const thresholds = [25, 50, 75, 100];

        thresholds.forEach(threshold => {
            if (scrollPercentage >= threshold && !scrollDepthsTracked[threshold]) {
                if (typeof gtag === 'function') {
                    gtag('event', 'scroll_depth', {
                        'event_category': 'engagement',
                        'event_label': `Scrolled ${threshold}%`,
                        'scroll_percentage': threshold
                    });
                }
                scrollDepthsTracked[threshold] = true;
            }
        });
    });

    // GA4 Event: Section Visibility Tracking
    const sections = document.querySelectorAll('section');
    const observedSections = new Set();

    const observerOptions = {
        root: null, // relative to the viewport
        rootMargin: '0px',
        threshold: 0.5 // 50% of the section must be visible
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                if (sectionId && !observedSections.has(sectionId)) {
                    if (typeof gtag === 'function') {
                        gtag('event', 'section_view', {
                            'event_category': 'engagement',
                            'event_label': `Viewed Section: ${sectionId}`,
                            'section_id': sectionId
                        });
                    }
                    observedSections.add(sectionId);
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Contact Form
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value; // Get subject value
            const message = document.getElementById('message').value;
            
            // Validate email before proceeding
            if (!emailInput.validity.valid) {
                emailInput.focus(); // Focus on the invalid field
                emailInput.dispatchEvent(new Event('input')); // Trigger validation message
                showMessage('Please ensure all fields are filled correctly, especially the email address.', 'error');
                return;
            }

            if (name && email && subject && message) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                const templateParams = {
                    name: name,
                    email: email,
                    subject: subject, // Use the subject from the form
                    message: message,
                    reply_to: email
                };
                
                if (typeof emailjs === 'undefined') {
                    showMessage('Sorry, the email service is not available. Please try again later or contact directly at paraspawar.dev@outlook.com', 'error');
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    return;
                }

                emailjs.send('service_42d4u9c', 'template_7x7zhsh', templateParams)
                    .then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                        showMessage('Thank you for your message! I will get back to you soon.', 'success');
                        contactForm.reset();
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                        // GA4 Event: Contact Form Submission
                        if (typeof gtag === 'function') {
                            gtag('event', 'contact_form_submit', {
                                'event_category': 'engagement',
                                'event_label': 'Contact Form Sent',
                                'form_name': 'main_contact_form'
                            });
                        }
                    }, function(error) {
                        console.log('FAILED...', error);
                        showMessage('Sorry, there was an error sending your message. Please try again later. Error: ' + (error.text || 'Unknown error'), 'error');
                        submitBtn.textContent = originalBtnText;
                        submitBtn.disabled = false;
                    });
            } else {
                showMessage('Please fill in all fields.', 'error');
            }
        });
    }

    // Animate progress bars on load
    function animateProgressBars() {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    }

    // Initial animations on page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            animateProgressBars();
            handleScroll(); // Run once on load
        }, 300);
    });

});

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error caught:', message, 'at', source, lineno, colno, error);
    return false;
};

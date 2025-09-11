document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopButton = document.querySelector('.back-to-top');
    const contactForm = document.getElementById('contactForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('email-error');
    const formMessage = document.getElementById('form-message');
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    const heroContent = document.querySelector('.hero-content');
    const skillBars = document.querySelectorAll('.skill-progress');

    // Function to display messages
    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message show ${type}`;

        setTimeout(() => {
            formMessage.classList.remove('show');
        }, 5000);
    }

    // Initialize EmailJS
    // TODO: Replace 'YOUR_USER_ID' with your actual EmailJS User ID
    if (typeof emailjs !== 'undefined') {
        emailjs.init("wcAWKaRBSSE3kb2g8"); // Replace with your EmailJS User ID
        console.log('EmailJS initialized successfully');
    } else {
        console.error('EmailJS library not loaded');
    }

    // Animate Hero Content on Load with staggered delay
    if (heroContent) {
        const heroElements = heroContent.children;
        for (let i = 0; i < heroElements.length; i++) {
            setTimeout(() => {
                heroElements[i].style.animationDelay = '0s';
            }, i * 150);
        }
    }

    // Animate skill bars when they come into view
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
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

        // Animate elements on scroll with better performance
        const windowHeight = window.innerHeight;
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            if (elementPosition < windowHeight - 50) {
                element.classList.add('show');
            }
        });

        // Animate skill bars when skills section is in view
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const skillsPosition = skillsSection.getBoundingClientRect().top;
            if (skillsPosition < windowHeight - 100) {
                animateSkillBars();
            }
        }

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

    // Smooth scrolling with better performance
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // GA4 Event: Project Clicks
    const projectLinks = document.querySelectorAll('.project-links a');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard ? projectCard.querySelector('.project-title').textContent : 'Unknown Project';
            const linkType = this.textContent.trim();

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
        icon.addEventListener('click', function(e) {
            e.preventDefault();
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

            // Open in new tab after tracking
            window.open(url, '_blank');
        });
    });

    // GA4 Event: CV Download Click
    const cvDownloadButton = document.querySelector('a[download]');
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
        root: null,
        rootMargin: '0px',
        threshold: 0.5
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
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Validate email before proceeding
            if (!emailInput.validity.valid) {
                emailInput.focus();
                emailInput.dispatchEvent(new Event('input'));
                showMessage('Please ensure all fields are filled correctly, especially the email address.', 'error');
                return;
            }

            if (name && email && subject && message) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span>Sending...</span>';
                submitBtn.disabled = true;
                
                const templateParams = {
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    reply_to: email
                };
                
                if (typeof emailjs === 'undefined') {
                    showMessage('Sorry, the email service is not available. Please try again later or contact directly at paraspawar.dev@gmail.com', 'error');
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    return;
                }

                // TODO: Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS Service ID and Template ID
                emailjs.send('service_i50t8es', 'template_krgorh5', templateParams)
                    .then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                        showMessage('Thank you for your message! I will get back to you soon.', 'success');
                        contactForm.reset();
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
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
                        submitBtn.innerHTML = originalBtnText;
                        submitBtn.disabled = false;
                    });
            } else {
                showMessage('Please fill in all fields.', 'error');
            }
        });
    }

    // Initial animations on page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            handleScroll();
        }, 100);
    });

    // Trigger skill bars on load if already in view
    window.addEventListener('load', () => {
        setTimeout(() => {
            const skillsSection = document.getElementById('skills');
            if (skillsSection) {
                const skillsPosition = skillsSection.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                if (skillsPosition < windowHeight - 100) {
                    animateSkillBars();
                }
            }
        }, 500);
    });

    // Back to top button functionality
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error caught:', message, 'at', source, lineno, colno, error);
    return false;
};

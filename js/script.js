document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopButton = document.querySelector('.back-to-top');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const contactForm = document.getElementById('contactForm');
    const progressBars = document.querySelectorAll('.progress-bar');
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
            this.classList.toggle('active');

            const hamburger = this.querySelector('.hamburger');
            if (hamburger.classList.contains('active')) {
                hamburger.classList.remove('active');
            } else {
                hamburger.classList.add('active');
            }
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            document.body.classList.remove('no-scroll');
            menuToggle.classList.remove('active');
            menuToggle.querySelector('.hamburger').classList.remove('active');
        });
    });

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }

        animateOnScroll();
    });

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

    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
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
    });

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                projectCards.forEach(card => {
                    if (filterValue === 'all') {
                        card.style.display = 'block';
                    } else if (card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                    
                    setTimeout(() => {
                        card.classList.add('show');
                    }, 100);
                });
            });
        });
    }

    function loadEmailJSScript() {
        return new Promise((resolve, reject) => {
            if (typeof emailjs !== 'undefined') {
                console.log('EmailJS already loaded');
                resolve();
                return;
            }
            
            console.log('Dynamically loading EmailJS script');
            const script = document.createElement('script');
            script.src = 'https://cdn.emailjs.com/sdk/2.6.4/email.min.js';
            script.onload = () => {
                console.log('EmailJS script loaded successfully');
                resolve();
            };
            script.onerror = (error) => {
                console.error('Failed to load EmailJS script:', error);
                reject(error);
            };
            document.head.appendChild(script);
        });
    }
    
    let emailJSInitialized = false;
    
    function initializeEmailJS() {
        return loadEmailJSScript()
            .then(() => {
                if (typeof emailjs !== 'undefined') {
                    try {
                        emailjs.init("H7sGal-pxNT9TGaXT");
                        console.log('EmailJS initialized successfully');
                        emailJSInitialized = true;
                        return true;
                    } catch (error) {
                        console.error('EmailJS initialization failed:', error);
                        return false;
                    }
                } else {
                    console.error('EmailJS library is still not available after loading');
                    return false;
                }
            })
            .catch(error => {
                console.error('Error during EmailJS initialization:', error);
                return false;
            });
    }
    
    document.addEventListener('DOMContentLoaded', function() {
        initializeEmailJS();
    });

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            if (name && email && subject && message) {
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.textContent;
                submitBtn.classList.add('sending');
                submitBtn.disabled = true;
                
                const templateParams = {
                    name: name,
                    email: email,
                    message: message,
                    subject: subject,
                    to_email: 'paraspawar.dev@outlook.com'
                };
                
                console.log('Attempting to send email with params:', templateParams);
                console.log('Using service_id:', 'service_42d4u9c');
                console.log('Using template_id:', 'template_ccklg0u');
                
                const sendEmail = () => {
                    try {
                        console.log('About to call emailjs.send with:', {
                            service_id: 'service_42d4u9c',
                            template_id: 'template_ccklg0u',
                            template_params: templateParams
                        });
                        
                        emailjs.send('service_42d4u9c', 'template_ccklg0u', templateParams)
                            .then(function(response) {
                                console.log('Email sent successfully:', response);
                                alert('Thank you for your message! I will get back to you soon.');
                                contactForm.reset();
                                submitBtn.classList.remove('sending');
                                submitBtn.disabled = false;
                            })
                            .catch(function(error) {
                                console.error('Email sending failed:', error);
                                alert('Sorry, there was an error sending your message. Please try again later. Error: ' + (error.text || 'Unknown error'));
                                submitBtn.classList.remove('sending');
                                submitBtn.disabled = false;
                            });
                    } catch (e) {
                        console.error('Exception when trying to send email:', e);
                        alert('Sorry, there was an error sending your message. Please try again later.');
                        submitBtn.classList.remove('sending');
                        submitBtn.disabled = false;
                    }
                };
                
                if (typeof emailjs === 'undefined' || !emailJSInitialized) {
                    console.log('EmailJS not initialized yet, attempting to initialize...');
                    initializeEmailJS()
                        .then(success => {
                            if (success) {
                                console.log('EmailJS initialized successfully, now sending email');
                                sendEmail();
                            } else {
                                console.error('Failed to initialize EmailJS');
                                alert('Sorry, the email service is not available. Please try again later or contact directly at paraspawar.dev@outlook.com');
                                submitBtn.classList.remove('sending');
                                submitBtn.disabled = false;
                            }
                        })
                        .catch(error => {
                            console.error('Error initializing EmailJS:', error);
                            alert('Sorry, the email service is not available. Please try again later or contact directly at paraspawar.dev@outlook.com');
                            submitBtn.classList.remove('sending');
                            submitBtn.disabled = false;
                        });
                } else {
                    console.log('EmailJS already initialized, sending email directly');
                    sendEmail();
                }
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    function animateProgressBars() {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    }

    function animateOnScroll() {
        requestAnimationFrame(() => {
            animateElements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementPosition < windowHeight - 50) {
                    element.classList.add('show');
                }
            });
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            animateProgressBars();
            animateOnScroll();
        }, 300);
    });

    function debounce(func, wait = 10, immediate = true) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    window.addEventListener('scroll', debounce(function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }

        animateOnScroll();
    }));

    const typingElement = document.querySelector('.hero-content h1 span');
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        
        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
            }
        }, 100);
    }
});
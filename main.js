// main.js
document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Solution tabs
    const tabs = document.querySelectorAll('.tab');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const target = this.dataset.tab;
            
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding pane
            this.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
    
    // Testimonial slider
    const sliderControls = document.querySelectorAll('.control');
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    sliderControls.forEach(control => {
        control.addEventListener('click', function() {
            const slideIndex = this.dataset.slide;
            
            // Remove active class from all controls and testimonials
            sliderControls.forEach(c => c.classList.remove('active'));
            testimonials.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked control and corresponding testimonial
            this.classList.add('active');
            testimonials[slideIndex].classList.add('active');
        });
    });
    
    // Auto-rotate testimonials
    let currentSlide = 0;
    const totalSlides = testimonials.length;
    
    function rotateTestimonials() {
        // Remove active class from all controls and testimonials
        sliderControls.forEach(c => c.classList.remove('active'));
        testimonials.forEach(t => t.classList.remove('active'));
        
        // Increment slide index and wrap around if needed
        currentSlide = (currentSlide + 1) % totalSlides;
        
        // Add active class to current control and testimonial
        sliderControls[currentSlide].classList.add('active');
        testimonials[currentSlide].classList.add('active');
    }
    
    let testimonialInterval = setInterval(rotateTestimonials, 6000);
    
    // Pause auto-rotation when user interacts with slider
    sliderControls.forEach(control => {
        control.addEventListener('click', function() {
            clearInterval(testimonialInterval);
            currentSlide = parseInt(this.dataset.slide);
            
            // Resume auto-rotation after a pause
            setTimeout(() => {
                testimonialInterval = setInterval(rotateTestimonials, 6000);
            }, 10000);
        });
    });
    
    // Stats counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / duration * 10;
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 10);
    }
    
    // Intersection Observer to trigger counter animation when in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
    
    // Smooth scrolling for navigation links
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handler
    const demoForm = document.querySelector('.demo-form');
    
    if (demoForm) {
        demoForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Here you would typically send the data to a server
            // For demo purposes, we'll just show a success message
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.innerHTML = 'Processing...';
            
            setTimeout(() => {
                this.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i><h3>Thank You!</h3><p>Your demo request has been received. Our team will contact you shortly.</p></div>';
            }, 1500);
        });
    }
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    const dataPoints = document.querySelectorAll('.data-point');
    
    window.addEventListener('scroll', function() {
        const scrollValue = window.scrollY;
        
        if (scrollValue < 600) {
            heroSection.style.transform = `translateY(${scrollValue * 0.2}px)`;
            
            dataPoints.forEach((point, index) => {
                const factor = 0.1 + (index * 0.05);
                point.style.transform = `translate(${scrollValue * factor}px, ${scrollValue * factor * 0.5}px)`;
            });
        }
    });
});

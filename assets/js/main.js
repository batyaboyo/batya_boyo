/**
 * Pura Organic Agro Tech Ltd - Main JavaScript File
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        });
        
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Sticky Navigation
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 100) {
                navbar.classList.add('navbar-scrolled');
            } else {
                navbar.classList.remove('navbar-scrolled');
            }
        });
    }
    
    // Mobile Navigation Toggle
    const navbarToggler = document.querySelector('.navbar-toggler');
    
    if (navbarToggler) {
        navbarToggler.addEventListener('click', function() {
            document.body.classList.toggle('mobile-nav-active');
        });
    }
    
    // Newsletter Form Submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (isValidEmail(email)) {
                // Here you would typically send the form data to a server
                alert('Thank you for subscribing to our newsletter!');
                emailInput.value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }
    
    // Contact Form Validation
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            
            if (nameInput.value.trim() === '') {
                showError(nameInput, 'Name is required');
                isValid = false;
            } else {
                clearError(nameInput);
            }
            
            if (emailInput.value.trim() === '') {
                showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(emailInput.value.trim())) {
                showError(emailInput, 'Please enter a valid email');
                isValid = false;
            } else {
                clearError(emailInput);
            }
            
            if (messageInput.value.trim() === '') {
                showError(messageInput, 'Message is required');
                isValid = false;
            } else {
                clearError(messageInput);
            }
            
            if (isValid) {
                // Here you would typically send the form data to a server
                alert('Your message has been sent. Thank you!');
                contactForm.reset();
            }
        });
    }
    
    // Gallery Filter (for gallery.html)
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (filterButtons.length > 0 && galleryItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                
                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-filter') === filterValue) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Product Search (for products.html)
    const searchBox = document.querySelector('.search-box input');
    const productCards = document.querySelectorAll('.product-card');
    
    if (searchBox && productCards.length > 0) {
        searchBox.addEventListener('keyup', function() {
            const searchTerm = this.value.toLowerCase();
            
            productCards.forEach(card => {
                const productName = card.querySelector('h4').textContent.toLowerCase();
                const productDescription = card.querySelector('p').textContent.toLowerCase();
                
                if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
                    card.closest('.col-md-4').style.display = 'block';
                } else {
                    card.closest('.col-md-4').style.display = 'none';
                }
            });
        });
    }
    
    // Initialize LightGallery if available
    if (typeof lightGallery === 'function' && document.getElementById('lightgallery')) {
        lightGallery(document.getElementById('lightgallery'), {
            selector: '.gallery-link',
            download: false
        });
    }
    
    // Helper Functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showError(input, message) {
        const formGroup = input.parentElement;
        formGroup.classList.add('has-error');
        
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message text-danger mt-1';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }
    
    function clearError(input) {
        const formGroup = input.parentElement;
        formGroup.classList.remove('has-error');
        
        const errorElement = formGroup.querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }
    
    // Video Placeholder Click (for gallery.html)
    const videoPlaceholder = document.querySelector('.video-placeholder');
    
    if (videoPlaceholder) {
        videoPlaceholder.addEventListener('click', function() {
            // Here you would typically replace the placeholder with an actual video embed
            alert('Video would play here in the actual implementation.');
        });
    }
});

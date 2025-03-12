/**
 * Pura Organic Agro Tech Ltd - Slider JavaScript File
 * Version: 1.0
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Testimonial Slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    
    if (testimonialSlider) {
        const testimonialItems = testimonialSlider.querySelectorAll('.testimonial-item');
        const prevButton = document.getElementById('prev-testimonial');
        const nextButton = document.getElementById('next-testimonial');
        
        let currentIndex = 0;
        
        // Initialize the slider
        initSlider();
        
        function initSlider() {
            // Hide all testimonials except the first one
            testimonialItems.forEach((item, index) => {
                if (index !== 0) {
                    item.style.display = 'none';
                }
            });
            
            // Add event listeners to buttons
            if (prevButton && nextButton) {
                prevButton.addEventListener('click', prevTestimonial);
                nextButton.addEventListener('click', nextTestimonial);
            }
        }
        
        function prevTestimonial() {
            testimonialItems[currentIndex].style.display = 'none';
            currentIndex = (currentIndex - 1 + testimonialItems.length) % testimonialItems.length;
            testimonialItems[currentIndex].style.display = 'block';
        }
        
        function nextTestimonial() {
            testimonialItems[currentIndex].style.display = 'none';
            currentIndex = (currentIndex + 1) % testimonialItems.length;
            testimonialItems[currentIndex].style.display = 'block';
        }
        
        // Auto slide every 5 seconds
        setInterval(nextTestimonial, 5000);
    }
    
    // Hero Image Slider (if needed in the future)
    const heroSlider = document.querySelector('.hero-slider');
    
    if (heroSlider) {
        const heroSlides = heroSlider.querySelectorAll('.hero-slide');
        const heroDots = heroSlider.querySelectorAll('.hero-dot');
        
        let currentHeroIndex = 0;
        
        // Initialize the hero slider
        initHeroSlider();
        
        function initHeroSlider() {
            // Hide all slides except the first one
            heroSlides.forEach((slide, index) => {
                if (index !== 0) {
                    slide.style.display = 'none';
                }
            });
            
            // Mark the first dot as active
            if (heroDots.length > 0) {
                heroDots[0].classList.add('active');
                
                // Add event listeners to dots
                heroDots.forEach((dot, index) => {
                    dot.addEventListener('click', function() {
                        goToHeroSlide(index);
                    });
                });
            }
        }
        
        function goToHeroSlide(index) {
            heroSlides[currentHeroIndex].style.display = 'none';
            heroDots[currentHeroIndex].classList.remove('active');
            
            currentHeroIndex = index;
            
            heroSlides[currentHeroIndex].style.display = 'block';
            heroDots[currentHeroIndex].classList.add('active');
        }
        
        function nextHeroSlide() {
            goToHeroSlide((currentHeroIndex + 1) % heroSlides.length);
        }
        
        // Auto slide every 5 seconds
        setInterval(nextHeroSlide, 5000);
    }
    
    // Product Gallery Slider (for individual product pages if needed in the future)
    const productGallery = document.querySelector('.product-gallery');
    
    if (productGallery) {
        const mainImage = productGallery.querySelector('.main-image img');
        const thumbnails = productGallery.querySelectorAll('.thumbnail');
        
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Update main image
                mainImage.src = this.src;
                
                // Update active state
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
});

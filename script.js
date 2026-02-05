document.addEventListener('DOMContentLoaded', () => {

    /* 
    =============================
       MOBILE MENU TOGGLE
    ============================= 
    */
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    /* 
    =============================
    SCROLL LOGIC (Progress bar & Nav highlight)
    ============================= 
    */
    const scrollProgress = document.getElementById('scrollProgress');
    const navItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // 1. Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (scrollProgress) scrollProgress.style.width = scrolled + "%";

        // 2. Nav Highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(li => {
            li.classList.remove('active');
            li.style.color = ''; // reset inline style
            if (li.getAttribute('href') === `#${current}`) {
                li.classList.add('active');
                if (!li.classList.contains('btn-small')) {
                    li.style.color = 'var(--accent-primary)';
                }
            }
        });
    });

    /* 
    =============================
       SCROLL ANIMATIONS (Intersection Observer)
    ============================= 
    */
    // Initial state setup for sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.6s ease-out';
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    /* 
    =============================
       FORM VALIDATION
    ============================= 
    */
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Get inputs
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');

            // Simple validation helper
            const validateField = (input) => {
                const formGroup = input.parentElement;
                if (input.value.trim() === '') {
                    formGroup.classList.add('error');
                    return false;
                } else {
                    formGroup.classList.remove('error');
                    return true;
                }
            };

            // Validate specific fields
            if (!validateField(nameInput)) isValid = false;

            // Email regEx for basic validataion
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailInput.value.trim())) {
                emailInput.parentElement.classList.add('error');
                isValid = false;
            } else {
                emailInput.parentElement.classList.remove('error');
            }

            if (!validateField(messageInput)) isValid = false;

            if (isValid) {
                // Simulate form submission
                const btn = contactForm.querySelector('button');
                const originalText = btn.innerText;

                btn.innerText = 'Message Sent!';
                btn.style.backgroundColor = 'var(--accent-secondary)';
                btn.style.color = '#fff';

                contactForm.reset();

                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                }, 3000);
            }
        });
    }

    /* 
    =============================
       NAV HIGHLIGHT ON SCROLL (Handled in scroll logic above)
    ============================= 
    */

    /* 
    =============================
       TYPEWRITER EFFECT
    ============================= 
    */
    const typeWriterElement = document.querySelector('.typewriter');
    if (typeWriterElement) {
        const textToType = typeWriterElement.getAttribute('data-text');
        let index = 0;

        function type() {
            if (index < textToType.length) {
                typeWriterElement.textContent += textToType.charAt(index);
                index++;
                setTimeout(type, 50); // Typing speed
            }
        }

        // Start typing after a small delay
        setTimeout(type, 1000);
    }

    /* 
    =============================
       PROJECT FILTERING
    ============================= 
    */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex'; // Restore display
                    // Optional: Add fade-in animation
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* 
    =============================
       BACK TO TOP BUTTON
    ============================= 
    */
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* 
    =============================
       THEME TOGGLE
    ============================= 
    */
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Check for saved user preference, if any, on load of the website
    const savedTheme = localStorage.getItem('theme');

    // If there is a saved theme, apply it
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        // If no saved theme, check system preference
        const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        if (systemPrefersLight) {
            htmlElement.setAttribute('data-theme', 'light');
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    /* 
    =============================
       INTERACTIVE TERMINAL
    ============================= 
    */
    const terminalInput = document.getElementById('terminalInput');
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalBody = document.querySelector('.terminal-body');

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim().toLowerCase();
                const originalInput = terminalInput.value; // Keep case for display

                // create line for user command
                const cmdLine = document.createElement('div');
                cmdLine.className = 'terminal-line';
                cmdLine.innerHTML = `<span class="prompt">guest@batya:~$</span> <span class="cmd">${originalInput}</span>`;
                terminalOutput.appendChild(cmdLine);

                // Process command
                let response = '';
                switch (command) {
                    case 'help':
                        response = 'Available commands: <span class="highlight">whoami</span>, <span class="highlight">ls</span>, <span class="highlight">projects</span>, <span class="highlight">skills</span>, <span class="highlight">contact</span>, <span class="highlight">socials</span>, <span class="highlight">clear</span>';
                        break;
                    case 'whoami':
                        response = 'Batya Boyo - Cybersecurity Analyst & Full-Stack Developer on a mission to secure AI.';
                        break;
                    case 'ls':
                        response = 'alx-low_level_programming  alx-system_engineering-devops  alx-higher_level_programming  network-ids.py';
                        break;
                    case 'projects':
                        response = 'Featured: 1. SentinAL (LLM Firewall)  2. RustyC2  3. NIDS  4. SecureVault. Type names for info? (Not yet implemented)';
                        break;
                    case 'skills':
                        response = 'Defensive: Splunk, ELK, DFIR | Offensive: Metasploit, Rust, Python | Web: Django, JS, PostgreSQL.';
                        break;
                    case 'contact':
                        response = 'Email: batztonnie@gmail.com | Use the form below!';
                        break;
                    case 'socials':
                        response = 'GitHub: @batyaboyo | LinkedIn: /in/batyaboyo | X: @batyaboyo';
                        break;
                    case 'clear':
                        terminalOutput.innerHTML = '';
                        break;
                    case '':
                        break;
                    default:
                        response = `Command not found: ${command}. Type 'help' for list.`;
                }

                if (response && command !== 'clear') {
                    const respLine = document.createElement('div');
                    respLine.className = 'terminal-line';
                    respLine.innerHTML = response;
                    terminalOutput.appendChild(respLine);
                }

                // Clear input and scroll to bottom
                terminalInput.value = '';
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        });

        // Focus input when clicking anywhere in terminal
        document.querySelector('.terminal-window').addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    /* 
    =============================
       GLITCH TEXT EFFECT
    ============================= 
    */
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?";
    const headers = document.querySelectorAll('.section-title');

    headers.forEach(header => {
        header.addEventListener('mouseover', event => {
            let iteration = 0;
            const originalText = event.target.dataset.value;

            if (!originalText) return; // Skip if no data-value

            clearInterval(event.target.interval);

            event.target.interval = setInterval(() => {
                event.target.textContent = originalText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return letters[Math.floor(Math.random() * letters.length)];
                    })
                    .join("");

                if (iteration >= originalText.length) {
                    clearInterval(event.target.interval);
                }

                iteration += 1 / 3;
            }, 30);
        });
    });

});

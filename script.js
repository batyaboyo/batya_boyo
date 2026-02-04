// ===== Terminal Loader Engine =====
const BOOT_LOGS = [
    { text: "[ OK ] Initializing Portfolio Kernel v1.0.4...", type: "success" },
    { text: "[ OK ] Loading Security Modules...", type: "success" },
    { text: "[ INFO ] Establishing secure connection to batyaboyo.dev...", type: "info" },
    { text: "[ OK ] Network encryption active (AES-256-GCM)", type: "success" },
    { text: "[ INFO ] Scanning environment for vulnerabilities...", type: "info" },
    { text: "[ OK ] System clean. Identity verified.", type: "success" },
    { text: "--------------------------------------------------", type: "info" },
    { text: "WELCOME TO BBOYO TERMINAL OS (v1.0)", type: "success" },
    { text: "--------------------------------------------------", type: "info" },
    { text: "User profile unknown. Are you tech-savvy? (Y/N)", type: "warning" }
];

let terminalState = 'PROFILING'; // PROFILING, COMMAND
let terminalMode = null; // techy, standard
const commandHistory = [];
let historyIndex = -1;

const TECHY_COMMANDS = {
    'help': () => `Available commands:<br> - [whoami]: Identity summary<br> - [ls]: List sections<br> - [nmap]: Scan network<br> - [netstat]: Network stats<br> - [ssh]: Remote access<br> - [grep]: Search files<br> - [top]: Process monitor<br> - [ping]: Network check<br> - [history]: Command log<br> - [date/pwd/uname]: System info<br> - [sudo access]: Enter portfolio<br> - [clear]: Reset terminal`,
    'whoami': () => `Batya Boyo — Cybersecurity Specialist & Full-Stack Developer.<br>Focus: SOC Operations, Pentesting, and Django Security.`,
    'ls': (args) => {
        if (args.includes('-la')) {
            return `<span class="info">drwxr-xr-x&nbsp;&nbsp;2&nbsp;guest&nbsp;guest&nbsp;&nbsp;4096&nbsp;Feb&nbsp;4&nbsp;15:20&nbsp;.</span><br>
                    <span class="info">drwxr-xr-x&nbsp;&nbsp;4&nbsp;root&nbsp;&nbsp;root&nbsp;&nbsp;&nbsp;4096&nbsp;Feb&nbsp;4&nbsp;12:00&nbsp;..</span><br>
                    <span class="info">-rw-r--r--&nbsp;&nbsp;1&nbsp;guest&nbsp;guest&nbsp;&nbsp;&nbsp;220&nbsp;Feb&nbsp;4&nbsp;15:21&nbsp;.bashrc</span><br>
                    <span class="info">-rw-r--r--&nbsp;&nbsp;1&nbsp;guest&nbsp;guest&nbsp;&nbsp;&nbsp;807&nbsp;Feb&nbsp;4&nbsp;15:22&nbsp;.profile</span><br>
                    <span class="info">drwxr-xr-x&nbsp;&nbsp;2&nbsp;guest&nbsp;guest&nbsp;&nbsp;4096&nbsp;Feb&nbsp;4&nbsp;15:25&nbsp;about</span><br>
                    <span class="info">drwxr-xr-x&nbsp;&nbsp;2&nbsp;guest&nbsp;guest&nbsp;&nbsp;4096&nbsp;Feb&nbsp;4&nbsp;15:26&nbsp;skills</span><br>
                    <span class="info">drwxr-xr-x&nbsp;&nbsp;2&nbsp;guest&nbsp;guest&nbsp;&nbsp;4096&nbsp;Feb&nbsp;4&nbsp;15:27&nbsp;projects</span><br>
                    <span class="info">drwxr-xr-x&nbsp;&nbsp;2&nbsp;guest&nbsp;guest&nbsp;&nbsp;4096&nbsp;Feb&nbsp;4&nbsp;15:28&nbsp;contact</span>`;
        }
        return `<span class="info">about</span>&nbsp;&nbsp;&nbsp;<span class="info">skills</span>&nbsp;&nbsp;&nbsp;<span class="info">projects</span>&nbsp;&nbsp;&nbsp;<span class="info">journey</span>&nbsp;&nbsp;&nbsp;<span class="info">contact</span>`;
    },
    'date': () => new Date().toString(),
    'pwd': () => `/home/guest/portfolio_v1`,
    'uname': (args) => args.includes('-a') ? `Linux BBOYO-OS 5.15.0-generic #54-Ubuntu SMP x86_64 GNU/Linux` : `Linux`,
    'history': () => commandHistory.join('<br>'),
    'ping': (args) => {
        const target = args[0] || 'batyaboyo.dev';
        return `PING ${target} (1.1.1.1): 56 data bytes<br>64 bytes from 1.1.1.1: icmp_seq=0 ttl=57 time=12.4 ms<br>64 bytes from 1.1.1.1: icmp_seq=1 ttl=57 time=13.1 ms<br>--- ${target} ping statistics ---<br>2 packets transmitted, 2 packets received, 0.0% packet loss`;
    },
    'top': () => `tasks: 1 total, 1 running, 0 sleeping<br>%Cpu(s): 0.3 us, 0.1 sy, 0.0 ni, 99.6 id<br><br>PID&nbsp;&nbsp;USER&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;PR&nbsp;&nbsp;NI&nbsp;&nbsp;&nbsp;&nbsp;VIRT&nbsp;&nbsp;&nbsp;&nbsp;RES&nbsp;&nbsp;&nbsp;&nbsp;SHR&nbsp;S&nbsp;&nbsp;%CPU&nbsp;&nbsp;%MEM&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;TIME+&nbsp;COMMAND<br>124&nbsp;&nbsp;guest&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;20&nbsp;&nbsp;&nbsp;0&nbsp;&nbsp;&nbsp;12.4g&nbsp;&nbsp;1.2g&nbsp;&nbsp;42.1m&nbsp;R&nbsp;&nbsp;&nbsp;0.7&nbsp;&nbsp;&nbsp;4.2&nbsp;&nbsp;&nbsp;0:12.45&nbsp;portfolio_os`,
    'nmap': () => `<span class="info">Scanning targets...</span><br>PORT&nbsp;&nbsp;&nbsp;&nbsp;STATE&nbsp;&nbsp;SERVICE<br>22/tcp&nbsp;&nbsp;open&nbsp;&nbsp;&nbsp;ssh<br>80/tcp&nbsp;&nbsp;open&nbsp;&nbsp;&nbsp;http<br>443/tcp&nbsp;open&nbsp;&nbsp;&nbsp;https<br>Nmap done: 1 IP address scanned.`,
    'netstat': () => `Active Internet connections (w/o servers)<br>Proto Recv-Q Send-Q Local Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Foreign Address&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;State<br>tcp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0 192.168.1.15:443&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;batyaboyo.dev:5432&nbsp;&nbsp;&nbsp;&nbsp;ESTABLISHED`,
    'ssh': () => `<span class="warning">Authentication successful. Welcome to the secure shell.</span>`,
    'grep': () => `Usage: grep [PATTERN] [FILE]...<br>Try: grep "secret" config.sys`,
    'status': () => `<span class="success">Firewall: ACTIVE</span><br><span class="success">Uptime: 99.9%</span><br><span class="info">Intrusion Detection: STANDBY</span>`,
    'sudo access': () => {
        printLine({ text: "Access granted. De-obfuscating portfolio structure...", type: "success" });
        setTimeout(revealSite, 1000);
        return "";
    },
    'access': () => `<span class="error">Permission denied: user 'guest' lacks elevated privileges. Try 'sudo access'.</span>`,
    'clear': () => {
        const body = document.getElementById('terminalBody');
        if (body) body.innerHTML = "";
        return "";
    }
};

const STANDARD_COMMANDS = {
    'help': () => `Welcome! Try these simple commands:<br> - [about]: Learn about me<br> - [projects]: See my work<br> - [contact]: How to reach me<br> - [enter]: Start the site<br> - [clear]: Reset screen`,
    'about': () => `I'm Batya Boyo, a web developer and cybersecurity enthusiast. I build secure and beautiful websites.`,
    'projects': () => `I have 15 projects in my portfolio, focusing on Django, security tools, and IT systems.`,
    'contact': () => `Email: batztonnie@gmail.com<br>X (Twitter): @batyaboyo`,
    'enter': () => {
        printLine({ text: "Loading portfolio... Welcome!", type: "success" });
        setTimeout(revealSite, 1000);
        return "";
    },
    'clear': () => {
        const body = document.getElementById('terminalBody');
        if (body) body.innerHTML = "";
        return "";
    }
};

async function runBootSequence() {
    const terminalBody = document.getElementById('terminalBody');
    const terminalInput = document.getElementById('terminalInput');

    if (!terminalBody || !terminalInput) {
        console.error("Terminal elements not found. Revealing site.");
        revealSite();
        return;
    }

    for (const log of BOOT_LOGS) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 150 + 50));
        printLine(log);
    }
    terminalInput.focus();
}

function printLine({ text, type }) {
    const terminalBody = document.getElementById('terminalBody');
    if (!terminalBody) return;

    const line = document.createElement('div');
    line.className = `terminal-line ${type}`;
    line.innerHTML = text;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
}

// Global scope helpers
function revealSite() {
    const loader = document.getElementById('loader');
    if (!loader) return;

    loader.classList.add('hidden');
    document.body.style.overflow = '';

    // Start site animations
    if (typeof animateCounters === 'function') animateCounters();
    if (typeof startTypingAnimation === 'function') startTypingAnimation();

    setTimeout(() => loader.remove(), 1000);
}

const syncVisualInput = () => {
    const terminalInput = document.getElementById('terminalInput');
    const visualDisplay = document.getElementById('terminalVisualDisplay');
    if (!terminalInput || !visualDisplay) return;

    const value = terminalInput.value;
    const start = terminalInput.selectionStart;
    const end = terminalInput.selectionEnd;

    // Handle character escaping for HTML
    const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;");

    if (start === end) {
        // Normal cursor
        const before = value.substring(0, start);
        const at = value.substring(start, start + 1) || " ";
        const after = value.substring(start + 1);

        visualDisplay.innerHTML = `${escape(before)}<span class="terminal-cursor">${escape(at)}</span>${escape(after)}`;
    } else {
        // Selection handling (optional but good for realism)
        const before = value.substring(0, start);
        const middle = value.substring(start, end);
        const after = value.substring(end);
        visualDisplay.innerHTML = `${escape(before)}<span class="terminal-cursor">${escape(middle)}</span>${escape(after)}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminalInput');
    const terminalContainer = document.querySelector('.terminal-container');
    const terminalBody = document.getElementById('terminalBody'); // Added for scroll

    // Keep focus on input
    terminalContainer?.addEventListener('click', () => {
        terminalInput?.focus();
        syncVisualInput();
    });

    terminalInput?.addEventListener('input', syncVisualInput);
    terminalInput?.addEventListener('click', syncVisualInput);
    terminalInput?.addEventListener('keyup', syncVisualInput);

    terminalInput?.addEventListener('keydown', (e) => {
        // Immediate sync for movement keys
        setTimeout(syncVisualInput, 0);

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
                syncVisualInput();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[commandHistory.length - 1 - historyIndex];
                syncVisualInput();
            } else {
                historyIndex = -1;
                terminalInput.value = "";
                syncVisualInput();
            }
        }

        if (e.key === 'Enter') {
            const rawInput = terminalInput.value.trim();
            const inputParts = rawInput.toLowerCase().split(' ');
            const cmd = inputParts[0];
            const args = inputParts.slice(1);

            if (!rawInput) return;

            commandHistory.push(rawInput);
            historyIndex = -1;

            if (terminalState === 'PROFILING') {
                if (cmd === 'y' || cmd === 'yes') {
                    terminalMode = 'techy';
                    terminalState = 'COMMAND';
                    printLine({ text: `Guest:$ ${rawInput}`, type: "info" });
                    printLine({ text: "Hacker Mode Enabled. Type 'help' for advanced tools.", type: "success" });
                    document.querySelector('.terminal-prompt').textContent = "BBOYO_ROOT:#";
                } else if (cmd === 'n' || cmd === 'no') {
                    terminalMode = 'standard';
                    terminalState = 'COMMAND';
                    printLine({ text: `Guest:$ ${rawInput}`, type: "info" });
                    printLine({ text: "Standard Mode Enabled. Type 'help' for simple commands.", type: "success" });
                    document.querySelector('.terminal-prompt').textContent = "User:$";
                } else {
                    printLine({ text: `Guest:$ ${rawInput}`, type: "info" });
                    printLine({ text: "Please enter 'Y' for Tech-Savvy or 'N' for Standard user.", type: "warning" });
                }
            } else {
                printLine({ text: `${document.querySelector('.terminal-prompt').textContent} ${rawInput}`, type: "info" });

                // Special case for 'sudo access' due to space
                if (rawInput.toLowerCase() === 'sudo access') {
                    TECHY_COMMANDS['sudo access']();
                } else {
                    const cmdSet = terminalMode === 'techy' ? TECHY_COMMANDS : STANDARD_COMMANDS;

                    if (cmdSet[cmd]) {
                        const response = cmdSet[cmd](args);
                        if (response) printLine({ text: response, type: "success" });
                    } else {
                        if (terminalMode === 'techy' && STANDARD_COMMANDS[cmd]) {
                            printLine({ text: `Command available in Standard mode. Use techy tools or type 'help'.`, type: "info" });
                        } else if (terminalMode === 'standard' && TECHY_COMMANDS[cmd]) {
                            printLine({ text: `Command reserved for tech-savvy sessions. Try 'about' or 'help'.`, type: "error" });
                        } else {
                            printLine({ text: `Command not found: ${cmd}. Type 'help' for options.`, type: "error" });
                        }
                    }
                }
            }

            terminalInput.value = "";
            syncVisualInput();
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });

    document.getElementById('skipLoader')?.addEventListener('click', revealSite);

    document.addEventListener('keydown', (e) => {
        const loader = document.getElementById('loader');
        if (e.key === 'Escape' && loader && !loader.classList.contains('hidden')) {
            revealSite();
        }
    });

    // Start boot sequence
    document.body.style.overflow = 'hidden';
    runBootSequence();
});

// ===== Theme Toggle =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

function updateThemeIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// ===== Custom Cursor Glow =====
const cursorGlow = document.getElementById('cursorGlow');

document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top = e.clientY + 'px';
});

// ===== Typing Animation =====
const typingTexts = [
    'Securing Systems.',
    'Building Solutions.',
    'Defending Networks.',
    'Writing Clean Code.'
];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typingText');

function startTypingAnimation() {
    const currentText = typingTexts[textIndex];

    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        typeSpeed = 500; // Pause before next word
    }

    setTimeout(startTypingAnimation, typeSpeed);
}

// ===== Animated Counters =====
function animateCounters() {
    const counters = document.querySelectorAll('.counter');

    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        updateCounter();
    });
}

// ===== Back to Top Button =====
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== Navigation Scroll Effect =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Active Navigation Link =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}
window.addEventListener('scroll', updateActiveLink);

// ===== Mobile Menu =====
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

mobileToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Project Filter =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        projectCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeInUp 0.4s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ===== Contact Form Validation =====
const contactForm = document.getElementById('contactForm');
const formInputs = contactForm.querySelectorAll('input, textarea');

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(input, message) {
    input.classList.add('error');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

function clearError(input) {
    input.classList.remove('error');
    const errorEl = input.parentElement.querySelector('.form-error');
    if (errorEl) errorEl.style.display = 'none';
}

formInputs.forEach(input => {
    input.addEventListener('input', () => clearError(input));
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const name = contactForm.querySelector('#name');
    const email = contactForm.querySelector('#email');
    const message = contactForm.querySelector('#message');

    if (!name.value.trim()) {
        showError(name, 'Name is required');
        isValid = false;
    }

    if (!email.value.trim()) {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
    }

    if (!message.value.trim()) {
        showError(message, 'Message is required');
        isValid = false;
    }

    if (isValid) {
        const formData = {
            name: name.value,
            email: email.value,
            message: message.value
        };
        console.log('Form submitted:', formData);
        alert('Thank you for your message! I\'ll get back to you soon.');
        contactForm.reset();
    }
});

// ===== Scroll Animations =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// ===== Smooth Scroll for CTA buttons =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Add fadeInUp animation =====
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

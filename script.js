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
    'help': () => `Available commands:<br> - [whoami]: Identity summary<br> - [ls]: List sections<br> - [nmap]: Scan network<br> - [netstat]: Network stats<br> - [ssh]: Remote access<br> - [grep]: Search files<br> - [top]: Process monitor<br> - [ping]: Network check<br> - [history]: Command log<br> - [neofetch]: System information<br> - [socials]: Contact links<br> - [date/pwd/uname]: System info<br> - [sudo access]: Enter portfolio<br> - [clear]: Reset terminal`,
    'whoami': () => `Batya Boyo — Cybersecurity Specialist & Full-Stack Developer.<br>Focus: SOC Operations, Pentesting, and Django Security.`,
    'neofetch': () => `
        <span class="info">               .-/+oossssoo+/-.               </span><br>
        <span class="info">           .:+ssssssssssssssssss+:.           </span>&nbsp;&nbsp;&nbsp;<span class="success">OS</span>: BBOYO Terminal OS<br>
        <span class="info">         -+ssssssssssssssssssyyssss+-         </span>&nbsp;&nbsp;&nbsp;<span class="success">Kernel</span>: 1.0.4-LTS<br>
        <span class="info">       .osssssssshhhhyyyssssyyhhyyssssso.     </span>&nbsp;&nbsp;&nbsp;<span class="success">Uptime</span>: 2h 45m<br>
        <span class="info">      /ssssyyyyhhhhhhhyyysssyyhhhyyyssss/     </span>&nbsp;&nbsp;&nbsp;<span class="success">Shell</span>: bsh (Boyo Shell)<br>
        <span class="info">     .osyyhhyyyyhhhhhhhhhhhyyysssyyyyssssso.  </span>&nbsp;&nbsp;&nbsp;<span class="success">Theme</span>: Cyber-Hacker<br>
        <span class="info">     osyyhhhhyyhhhhhhhhhhhhhhhhyyysyssssso    </span>&nbsp;&nbsp;&nbsp;<span class="success">CPU</span>: AI Core v3<br>
        <span class="info">     oyyhhhhyyyyyyyyyyhhhhhhhhyyysyssssyo     </span>&nbsp;&nbsp;&nbsp;<span class="success">Memory</span>: 512MB / 2.0GB<br>
        <span class="info">     .oyyhhyyyyyyyyyyhhhhhhhhyyysssyyyyo.     </span><br>
        <span class="info">      .oyyhyyyyyyyyyhhhhhhhhyyysssyyyo.       </span><br>
        <span class="info">        ./oyyhyyyyyhhhhhhhyyysssyyoo.         </span><br>
        <span class="info">           ./osyyyhhhhhhhyyysssyyoo.          </span><br>
    `,
    'socials': () => `Connect with me:<br> - <a href="https://github.com" target="_blank">GitHub</a><br> - <a href="https://linkedin.com" target="_blank">LinkedIn</a><br> - <a href="https://twitter.com" target="_blank">Twitter/X</a>`,
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
    'projects': () => `I have 18 projects in my portfolio, focusing on Django, security tools, and IT systems.`,
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

// ===== Projects Data =====
const PROJECTS_DATA = [
    {
        title: "SME SOC-in-a-Box",
        category: "security",
        difficulty: "advanced",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&h=400&fit=crop",
        icon: "🛡",
        role: "Security Lead",
        badges: [{ text: "Security Ops", class: "badge-security" }, { text: "Advanced", class: "badge-advanced" }],
        problem: "Small businesses lack affordable security monitoring, leaving them vulnerable to undetected attacks.",
        solution: "A lightweight, containerized SOC platform that provides enterprise-grade monitoring on a budget.",
        impact: "Reduced detection time by 60% in pilot environments. Developed as a turnkey solution for IT teams.",
        tech: ["Wazuh", "ELK Stack", "Docker"],
        github: "#",
        demo: "#"
    },
    {
        title: "Phishing Defense Platform",
        category: "security",
        difficulty: "intermediate",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
        icon: "🎣",
        role: "Developer",
        badges: [{ text: "Awareness", class: "badge-security" }, { text: "Intermediate", class: "badge-intermediate" }],
        problem: "Organizations struggle to train employees effectively against evolving phishing tactics and track progress.",
        solution: "An automated simulation platform that delivers targeted training based on real-world threat intelligence.",
        impact: "Achieved a 45% reduction in click-through rates during quarterly testing for a 50-user organization.",
        tech: ["Python", "Django", "PostgreSQL"],
        github: "#",
        demo: "#"
    },
    {
        title: "Incident Response Automation",
        category: "security",
        difficulty: "intermediate",
        image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=600&h=400&fit=crop",
        icon: "⚡",
        role: "Security Engineer",
        badges: [{ text: "IR Automation", class: "badge-security" }, { text: "Intermediate", class: "badge-intermediate" }],
        problem: "Manual incident response is too slow for modern threats, leading to analyst fatigue and missed signals.",
        solution: "An automated enrichment pipeline that correlates IOCs across multiple intelligence feeds in real-time.",
        impact: "Trimmed average response time from 40 minutes to under 5 minutes per incident. Integrated with MISP/VT.",
        tech: ["Python", "MISP", "VirusTotal"],
        github: "#",
        demo: "#"
    },
    {
        title: "Vulnerability Management Dashboard",
        category: "security",
        difficulty: "advanced",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
        icon: "📊",
        role: "Lead Analyst",
        badges: [{ text: "Vuln Management", class: "badge-security" }, { text: "Advanced", class: "badge-advanced" }],
        problem: "Security teams often lack visibility into real-time vulnerability status and remediation bottlenecks.",
        solution: "A centralized analytics dashboard that tracks CVEs and maps remediation progress to asset criticality.",
        impact: "Improved remediation SLA compliance by 35% through automated prioritization logic and executive reporting.",
        tech: ["Django", "Chart.js", "OpenVAS"],
        github: "#",
        demo: "#"
    },
    {
        title: "Detection Engineering Lab",
        category: "security",
        difficulty: "advanced",
        image: "https://images.unsplash.com/photo-1517134191118-9d595e4c8c2b?w=600&h=400&fit=crop",
        icon: "🔍",
        role: "Research Lead",
        badges: [{ text: "Detection Eng", class: "badge-security" }, { text: "Advanced", class: "badge-advanced" }],
        problem: "Generic SIEM rules often overlook environment-specific attacker behaviors, leading to high false positives.",
        solution: "A structured testing environment for custom Sigma rules mapped to specific MITRE ATT&CK techniques.",
        impact: "Developed 20+ validated detection rules with a 90% reduction in false-positive noise compared to defaults.",
        tech: ["Sigma", "Splunk", "YAML"],
        github: "#",
        demo: "#"
    },
    {
        title: "Secure Password Validator",
        category: "security",
        difficulty: "beginner",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
        icon: "🔑",
        role: "Junior Security Analyst",
        badges: [{ text: "AppSec", class: "badge-security" }, { text: "Beginner", class: "badge-beginner" }],
        problem: "Users frequently use predictable passwords that are vulnerable to brute-force attacks.",
        solution: "A Python-based CLI tool that evaluates password entropy and complexity using pattern libraries.",
        impact: "Increased local security awareness; used as a demo tool for training sessions.",
        tech: ["Python", "Regex", "Zxcvbn"],
        github: "#"
    },
    {
        title: "Incident Case Management System",
        category: "django",
        difficulty: "intermediate",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
        icon: "📋",
        role: "Full-Stack Dev",
        badges: [{ text: "Python/Django", class: "badge-django" }, { text: "Intermediate", class: "badge-intermediate" }],
        problem: "Security teams using fragmented tools for tracking incidents often lose critical context and evidence.",
        solution: "A secure, Django-backed platform for centralized case management with automated evidence logging.",
        impact: "Standardized IR workflows across teams, ensuring 100% data integrity for digital forensic artifacts.",
        tech: ["Django", "PostgreSQL", "Celery"],
        github: "#",
        demo: "#"
    },
    {
        title: "Secure Multi-Tenant SaaS Platform",
        category: "django",
        difficulty: "advanced",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
        icon: "🏢",
        role: "Lead Architect",
        badges: [{ text: "Architecture", class: "badge-django" }, { text: "Advanced", class: "badge-advanced" }],
        problem: "Shared infrastructure in multi-tenant apps often introduces significant risks of cross-tenant data leakage.",
        solution: "A robust SaaS architecture featuring strict schema-level isolation and role-based access controls.",
        impact: "Provides a \"security-by-default\" framework that reduces deployment time for secure applications by 40%.",
        tech: ["Django", "Tenants", "Stripe"],
        github: "#",
        demo: "#"
    },
    {
        title: "Cybersecurity Learning Platform",
        category: "django",
        difficulty: "intermediate",
        image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&h=400&fit=crop",
        icon: "📚",
        role: "Platform Dev",
        badges: [{ text: "EdTech", class: "badge-django" }, { text: "Intermediate", class: "badge-intermediate" }],
        problem: "Aspiring security professionals struggle with fragmented resources and lack of structured hands-on practice.",
        solution: "A gamified LMS that integrates curated learning paths with automated virtual lab provisioning.",
        impact: "Successfully onboarded 100+ beta users with a 50% higher lab completion rate vs. static reading material.",
        tech: ["Django", "JavaScript", "Docker"],
        github: "#",
        demo: "#"
    },
    {
        title: "Secure Authentication Microservice",
        category: "django",
        difficulty: "intermediate",
        image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=600&h=400&fit=crop",
        icon: "🔑",
        role: "Backend Dev",
        badges: [{ text: "Microservices", class: "badge-django" }, { text: "Intermediate", class: "badge-intermediate" }],
        problem: "Repeatedly implementing complex authentication logic leads to security vulnerabilities and slow development cycles.",
        solution: "A plug-and-play microservice handling MFA, JWT rotation, and session management with high-availability support.",
        impact: "Simplified 10+ internal projects with drop-in secure auth, reducing total vulnerability surface by 25%.",
        tech: ["Django REST", "JWT", "Redis"],
        github: "#",
        demo: "#"
    },
    {
        title: "Vulnerability Tracking Web App",
        category: "django",
        difficulty: "intermediate",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
        icon: "🐛",
        role: "Lead Developer",
        badges: [{ text: "AppSec", class: "badge-django" }, { text: "Intermediate", class: "badge-intermediate" }],
        problem: "Manual tracking of vulnerability remediation leads to communication gaps between security and IT teams.",
        solution: "A collaborative web application that streamlines the lifecycle from discovery to remediation verification.",
        impact: "Reduced time-to-remediate critical findings by 30% through automated notifications and asset ownership mapping.",
        tech: ["Django", "HTMX", "PostgreSQL"],
        github: "#",
        demo: "#"
    },
    {
        title: "Recipe Manager Lite",
        category: "django",
        difficulty: "beginner",
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop",
        icon: "🍳",
        role: "Junior Web Developer",
        badges: [{ text: "Python/Django", class: "badge-django" }, { text: "Beginner", class: "badge-beginner" }],
        problem: "Managing personal recipes across different platforms leads to data fragmentation.",
        solution: "A simple CRUD application with category filtering, image uploads, and search functionality.",
        impact: "Streamlined kitchen workflow; successfully managed 100+ entries in testing.",
        tech: ["Django", "PostgreSQL", "Pillow"],
        github: "#"
    },
    {
        title: "IT Support Ticketing System",
        category: "it",
        difficulty: "intermediate",
        image: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=600&h=400&fit=crop",
        icon: "🎫",
        role: "System Admin",
        badges: [{ text: "IT Operations", class: "badge-it" }, { text: "Intermediate", class: "badge-intermediate" }],
        problem: "Fragmented support requests lead to missed SLAs and inconsistent service delivery.",
        solution: "A smart ticketing system featuring automated priority queuing and real-time technician metrics.",
        impact: "Cut average ticket resolution time by 20% by eliminating manual triage bottlenecks.",
        tech: ["Django", "JavaScript", "SQLite"],
        github: "#",
        demo: "#"
    },
    {
        title: "Network Monitoring & Alerting",
        category: "it",
        difficulty: "intermediate",
        image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&h=400&fit=crop",
        icon: "📡",
        role: "Network Admin",
        badges: [{ text: "Networking", class: "badge-it" }, { text: "Intermediate", class: "badge-intermediate" }],
        problem: "Proactive outage detection is missing, causing reliance on user reports for system downtime.",
        solution: "A robust monitoring node performing high-frequency ICMP/TCP checks with instant SMS/Email escalation.",
        impact: "Reduced unplanned downtime by 15% through early-warning detection of infrastructure strain.",
        tech: ["Python", "Flask", "SNMP"],
        github: "#",
        demo: "#"
    },
    {
        title: "Linux Server Hardening Toolkit",
        category: "it",
        difficulty: "advanced",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop",
        icon: "🔒",
        role: "Security Admin",
        badges: [{ text: "Security Hardening", class: "badge-it" }, { text: "Advanced", class: "badge-advanced" }],
        problem: "Default OS configurations are often insecure, leaving servers exposed to basic brute-force and exploit attempts.",
        solution: "An automated hardening framework implementing CIS Benchmarks and custom security policies.",
        impact: "Secured 50+ production nodes with baseline hardening in under 10 minutes per server.",
        tech: ["Bash", "Ansible", "CIS Bench"],
        github: "#",
        demo: "#"
    },
    {
        title: "Backup & Disaster Recovery",
        category: "it",
        difficulty: "intermediate",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
        icon: "💾",
        role: "Infrastructure Lead",
        badges: [{ text: "Disaster Recovery", class: "badge-it" }, { text: "Intermediate", class: "badge-intermediate" }],
        problem: "Organizations lack verified backup strategies, risking total data loss during hardware or security failures.",
        solution: "A redundant backup pipeline with automated integrity checks and off-site cloud replication.",
        impact: "Guaranteed 99.9% data availability. Successfully executed 5 recovery drills without data loss.",
        tech: ["Bash", "rsync", "AWS S3"],
        github: "#",
        demo: "#"
    },
    {
        title: "Internal IT Knowledge Base",
        category: "it",
        difficulty: "beginner",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop",
        icon: "📖",
        role: "Content Lead",
        badges: [{ text: "Documentation", class: "badge-it" }, { text: "Beginner", class: "badge-beginner" }],
        problem: "Institutional knowledge is undocumented, leading to slow onboarding and inconsistent troubleshooting.",
        solution: "A version-controlled, searchable documentation hub using Markdown for easy technical updates.",
        impact: "Reduced internal support escalations by 15% through high-quality self-service runbooks.",
        tech: ["Markdown", "Git", "VitePress"],
        github: "#",
        demo: "#"
    },
    {
        title: "Automated Health Reporter",
        category: "it",
        difficulty: "beginner",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?w=600&h=400&fit=crop",
        icon: "🚑",
        role: "IT Support Assistant",
        badges: [{ text: "IT Operations", class: "badge-it" }, { text: "Beginner", class: "badge-beginner" }],
        problem: "Manually checking service availability across multiple local servers is tedious.",
        solution: "A Bash script that probes local endpoints and generates a color-coded HTML status report.",
        impact: "Reduced verification time by 80%; integrated into daily morning checks.",
        tech: ["Bash", "Curl", "Linux"],
        github: "#"
    }
];

function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = PROJECTS_DATA.map((project, index) => `
        <article class="project-card fade-in" 
                 data-category="${project.category}" 
                 data-difficulty="${project.difficulty}">
            <div class="project-image-container">
                <img src="${project.image}" alt="${project.title}" class="project-image" loading="lazy">
                <div class="project-image-overlay"></div>
                <div class="project-badges">
                    ${project.badges.map(badge => `<span class="badge ${badge.class}">${badge.text}</span>`).join('')}
                </div>
            </div>
            <div class="project-header">
                <div class="project-icon">${project.icon}</div>
                <span class="project-role">${project.role}</span>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-problem"><strong>Problem:</strong> ${project.problem}</p>
                <p class="project-solution"><strong>Solution:</strong> ${project.solution}</p>
                <p class="project-impact"><strong>Impact:</strong> ${project.impact}</p>
                <div class="project-tech">
                    ${project.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.github}" class="project-btn" aria-label="View ${project.title} Code on GitHub">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58V22"></path>
                        </svg>
                        <span>Code</span>
                    </a>
                    ${project.demo ? `
                    <a href="${project.demo}" class="project-btn btn-view" aria-label="View ${project.title} Live Demo">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        <span>Demo</span>
                    </a>` : ''}
                </div>
            </div>
        </article>
    `).join('');
}

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
    // Inject dynamic content
    renderProjects();
    initAnimations();
    applyFilters();

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

let activeFilters = {
    category: 'all',
    difficulty: 'all'
};

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const filterType = btn.dataset.filterType;
        const filterValue = btn.dataset.filter;

        // Update active state for buttons in the same group
        const groupBtns = document.querySelectorAll(`.filter-btn[data-filter-type="${filterType}"]`);
        groupBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update filter state
        activeFilters[filterType] = filterValue;

        applyFilters();
    });
});

function applyFilters() {
    const projectCards = document.querySelectorAll('.project-card');
    let visibleIndex = 0;

    projectCards.forEach(card => {
        const matchesCategory = activeFilters.category === 'all' || card.dataset.category === activeFilters.category;
        const matchesDifficulty = activeFilters.difficulty === 'all' || card.dataset.difficulty === activeFilters.difficulty;

        if (matchesCategory && matchesDifficulty) {
            card.classList.remove('hidden');
            // Apply staggered entry animation
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = `fadeInUp 0.5s ease forwards ${visibleIndex * 0.1}s`;
            visibleIndex++;
        } else {
            card.classList.add('hidden');
            card.style.animation = 'none';
        }
    });
}

// Initialize filters is now handled in DOMContentLoaded

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
        const submitBtn = contactForm.querySelector('#submitBtn');
        const originalBtnText = submitBtn.innerHTML;

        // Set loading state
        submitBtn.classList.add('is-loading');
        submitBtn.disabled = true;

        const formData = {
            name: name.value,
            email: email.value,
            message: message.value
        };

        // Simulate API call
        setTimeout(() => {
            console.log('Form submitted:', formData);
            alert('Thank you for your message! I\'ll get back to you soon.');

            submitBtn.classList.remove('is-loading');
            submitBtn.disabled = false;

            contactForm.reset();
        }, 2000);
    }
});

function initAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Smooth Scroll for CTA buttons
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Add fadeInUp animation keyframes if not present
    if (!document.getElementById('fadeInUpStyle')) {
        const style = document.createElement('style');
        style.id = 'fadeInUpStyle';
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
    }
}

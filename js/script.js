// Mouse Cursor Glow Effect
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.cursor-glow');
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Change icon based on state
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.querySelector('i').classList.remove('fa-times');
        hamburger.querySelector('i').classList.add('fa-bars');
    });
});

// Smooth Scroll for Anchor Links (Optional if scroll-behavior: smooth is not enough)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

// Target elements to animate
// We group cards by their container to stagger them
const grids = document.querySelectorAll('.skills-grid, .projects-grid, .timeline');

grids.forEach(grid => {
    const children = grid.querySelectorAll('.skill-card, .project-card, .timeline-item');
    children.forEach((child, index) => {
        child.style.transitionDelay = `${index * 0.15}s`; // Stagger effect: 0s, 0.15s, 0.3s...
        child.classList.add('hidden-animate'); // Initial hidden state
        observer.observe(child);
    });
});

// Also animate section titles and hero
const otherElements = document.querySelectorAll('.hero-content, .section-title, .achievements-box, .edu-card');
otherElements.forEach(el => {
    el.classList.add('hidden-animate');
    observer.observe(el);
});

// Dynamic 3D Tilt Effect for Cards
const cards = document.querySelectorAll('.skill-card, .project-card');

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate rotation based on cursor Position
        // Center is (0,0), Top-Left is (-ve, +ve), Bottom-Right is (+ve, -ve)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5; // Max 5deg rotation
        const rotateY = ((x - centerX) / centerX) * 5;

        // Apply transform (retain translateY hover effect roughly or override it)
        // We override the hover transform here for more dynamic control
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    // Reset on mouse leave
    card.addEventListener('mouseleave', () => {
        card.style.transform = ''; // Clears inline style, reverting to CSS hover or default
    });
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    document.querySelector('.scroll-progress').style.width = scrolled + '%';
});

// Typewriter Effect
const typedTextSpan = document.querySelector(".typewriter-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["Software Development Intern", "Data Analyst", "AI & ML Enthusiast", "Web Developer"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", () => { // On DOM Load initiate the effect
    if (textArray.length) setTimeout(type, newTextDelay + 250);
});


// Add class for animation via observer
// Modify the observer callback in styles to handle the transition classes
/* 
   Note: The CSS 'fade-in' class handles the animation. 
   We just need to attach it when the element is in view.
*/


// Scroll Spy for Active Nav Link
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        // Offset for fixed header (approx 100px)
        if (pageYOffset >= (sectionTop - 150)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href').includes(current)) {
            a.classList.add('active');
        }
    });
});

// Back to Top Button Logic
const backToTopBtn = document.querySelector('.back-to-top');

if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Chatbot Logic
const chatToggle = document.querySelector('.chat-toggle-btn');
const chatWindow = document.querySelector('.chat-window');
const closeChat = document.querySelector('.close-chat');
const chatMessages = document.querySelector('.chat-messages');
const chatOptions = document.querySelectorAll('.chat-option-btn');

// Toggle Chat
if (chatToggle) {
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('active');
        document.querySelector('.notification-badge').style.display = 'none';
        chatToggle.style.animation = 'none';
    });
}

if (closeChat) {
    closeChat.addEventListener('click', () => {
        chatWindow.classList.remove('active');
    });
}

// Handle Options
chatOptions.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        const text = e.target.innerText;

        // Add User Message
        addMessage(text, 'user');

        // Simulate Bot Delay
        setTimeout(() => {
            handleBotResponse(action);
        }, 500);
    });
});

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.classList.add('message', sender);
    div.innerHTML = `<p>${text}</p>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleBotResponse(action) {
    let response = "";

    switch (action) {
        case 'projects':
            response = "I've worked on some cool projects like the 'Farm Advisor' and 'IPO Web App'. check them out in the <a href='#projects' style='color: #22c55e;'>Projects Section</a>!";
            // Optional: Smooth scroll if needed
            document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
            break;
        case 'resume':
            response = "Great choice! You can <a href='assets/resume.pdf' download style='color: #22c55e; text-decoration: underline;'>Download my Resume here</a>.";
            break;
        case 'contact':
            response = "You can email me at <a href='mailto:shivshukla9111@gmail.com' style='color: #22c55e;'>shivshukla9111@gmail.com</a> or connect on <a href='https://www.linkedin.com/in/shiv-shukla-Ex' target='_blank' style='color: #22c55e;'>LinkedIn</a>.";
            break;
        case 'skills':
            response = "My tech stack includes Python, Django, React, SQL, and Power BI. I love analyzing data and building web apps!";
            break;
        default:
            response = "I'm here to help! Feel free to explore the portfolio.";
    }

    addMessage(response, 'bot');
}


// Project Modal Logic
const modal = document.getElementById("project-modal");
const modalBtnClose = document.getElementsByClassName("close-modal")[0];
const projectCards = document.querySelectorAll('.project-card');

// Project Data (Simulated Database for AI/ML Student)
const projectData = {
    "Farm Advisor – AI-Based Farmer Advisory Platform": {
        title: "Farm Advisor",
        desc: "A comprehensive platform helping farmers make data-driven decisions. Uses ML models to predict crop yields and suggest optimal fertilizers based on soil data.",
        tech: ["Machine Learning", "React", "Python", "API Integration"],
        metrics: ["Increased yield prediction accuracy by 15%", "Used Random Forest Algorithm", "Real-time weather data integration"],
        link: "https://github.com/shivshukla2006?tab=repositories"
    },
    "IPO Web Application": {
        title: "IPO Web Application",
        desc: "Full-stack web platform for tracking Initial Public Offerings. Features real-time data updates, investor dashboards, and subscription tracking.",
        tech: ["Django", "PostgreSQL", "Full Stack", "Bootstrap"],
        metrics: ["Real-time data scraping from NSE/BSE", "User authentication & dashboard", "Deployed on Heroku"],
        link: "https://github.com/shivshukla2006?tab=repositories"
    },
    "Financial Risk ML Model": {
        title: "Financial Risk ML Model",
        desc: "Machine learning model designed to analyze financial data for risk profiling and investment prediction. Utilizes statistical methods for accurate forecasting.",
        tech: ["Python", "Pandas", "Scikit-Learn", "Matplotlib"],
        metrics: ["Risk classification accuracy: 88%", "Feature engineering on 50+ variables", "Visualized risk trends"],
        link: "https://github.com/shivshukla2006?tab=repositories"
    },
    "Student Performance Dashboard": {
        title: "Student Performance Dashboard",
        desc: "Interactive dashboard visualizing student performance metrics. Uses clustering to identify learning gaps and suggest personalized strategies.",
        tech: ["Power BI", "SQL", "Python", "K-Means"],
        metrics: ["Identified 3 distinct student clusters", "Automated data cleaning pipeline", "Interactive drill-down reports"],
        link: "https://github.com/shivshukla2006?tab=repositories"
    }
};

projectCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Prevent default if clicking the specific link button
        if (e.target.tagName === 'A' || e.target.parentElement.tagName === 'A') return;

        const title = card.querySelector('h3').innerText;
        const data = projectData[title];

        if (data) {
            document.getElementById('modal-title').innerText = data.title;
            document.getElementById('modal-description').innerText = data.desc;

            // Populate Tags
            const tagContainer = document.getElementById('modal-tags');
            tagContainer.innerHTML = '';
            data.tech.forEach(tag => {
                const span = document.createElement('span');
                span.innerText = tag;
                tagContainer.appendChild(span);
            });

            // Populate Metrics
            const metricsList = document.getElementById('modal-highlights');
            metricsList.innerHTML = '';
            data.metrics.forEach(metric => {
                const li = document.createElement('li');
                li.innerText = metric;
                metricsList.appendChild(li);
            });

            document.getElementById('modal-link').href = data.link;
            console.log("Link updated to:", data.link); // Debug Log

            modal.style.display = "block";
        }
    });
});

// Close Modal
if (modalBtnClose) {
    modalBtnClose.onclick = function () {
        modal.style.display = "none";
    }
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Pre-loader Logic
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
    }, 1500); // Minimum 1.5s load time for effect
});

// Hacker Mode (Konami Code) Logic
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiPosition = 0;

let hackerAudioCtx = null;
let hackerOscillator = null;
let hackerGain = null;
let hackerSirenInterval = null;

function startSiren() {
    if (!hackerAudioCtx) {
        hackerAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    hackerOscillator = hackerAudioCtx.createOscillator();
    hackerGain = hackerAudioCtx.createGain();
    hackerOscillator.type = 'square';
    hackerGain.gain.value = 0.05; // Keep volume relatively low
    hackerOscillator.connect(hackerGain);
    hackerGain.connect(hackerAudioCtx.destination);
    hackerOscillator.start();

    let high = true;
    hackerSirenInterval = setInterval(() => {
        if (hackerAudioCtx && hackerAudioCtx.state === 'running') {
            hackerOscillator.frequency.setTargetAtTime(high ? 800 : 400, hackerAudioCtx.currentTime, 0.1);
        }
        high = !high;
    }, 400); // Toggle frequency every 400ms for a siren alarm effect
}

function stopSiren() {
    if (hackerSirenInterval) clearInterval(hackerSirenInterval);
    if (hackerOscillator) {
        try { hackerOscillator.stop(); } catch (e) {}
        hackerOscillator.disconnect();
    }
    if (hackerAudioCtx && hackerAudioCtx.state !== 'closed') {
        hackerAudioCtx.close();
        hackerAudioCtx = null;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiPosition]) {
        konamiPosition++;
        if (konamiPosition === konamiCode.length) {
            document.body.classList.toggle('hacker-mode');
            konamiPosition = 0;
            
            if (document.body.classList.contains('hacker-mode')) {
                startSiren();
            } else {
                stopSiren();
            }
            
            // Add a small delay for CSS to apply before alerting
            setTimeout(() => {
                if (document.body.classList.contains('hacker-mode')) {
                    alert('HACKER MODE ACTIVATED. Welcome to the Matrix.');
                } else {
                    alert('System Restored. Hacker Mode Deactivated.');
                }
            }, 100);
        }
    } else {
         // Reset position if sequence is broken
        konamiPosition = 0;
    }
});

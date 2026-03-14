// CampusBot JavaScript - TechTitans
// Bridging Students and Faculty with AI

// Global variables
let isRecording = false;
let recognition = null;
let currentLanguage = 'en';

// Language configurations
const languages = {
    'en': { name: 'English', flag: '🇺🇸' },
    'hi': { name: 'हिंदी', flag: '🇮🇳' },
    'ta': { name: 'தமிழ்', flag: '🇮🇳' },
    'te': { name: 'తెలుగు', flag: '🇮🇳' }
};

// Mock responses for demo
const mockResponses = {
    en: {
        'courses': 'Our college offers various courses including Computer Science, Electronics, Mechanical, Civil Engineering, and more. Each course has specific eligibility criteria and duration.',
        'faculty': 'You can contact faculty members through the college portal or visit their respective departments during office hours (9 AM - 5 PM).',
        'events': 'Upcoming events include: Tech Fest (Next Month), Cultural Week (Dec), Sports Day (Jan). Check the notice board for detailed schedules.',
        'library': 'Library timings: Monday-Friday: 8 AM - 8 PM, Saturday: 9 AM - 6 PM, Sunday: Closed. Digital resources are available 24/7.',
        'default': 'I\'m here to help with college-related queries. You can ask about courses, faculty, events, library, admissions, or any other campus information.'
    },
    hi: {
        'courses': 'हमारे कॉलेज में कंप्यूटर साइंस, इलेक्ट्रॉनिक्स, मैकेनिकल, सिविल इंजीनियरिंग आदि विभिन्न कोर्स उपलब्ध हैं।',
        'faculty': 'आप कॉलेज पोर्टल के माध्यम से या कार्यालय समय (सुबह 9 बजे - शाम 5 बजे) में संबंधित विभागों में जाकर संकाय सदस्यों से संपर्क कर सकते हैं।',
        'events': 'आगामी कार्यक्रम: टेक फेस्ट (अगले महीने), सांस्कृतिक सप्ताह (दिसंबर), खेल दिवस (जनवरी)।',
        'library': 'पुस्तकालय समय: सोमवार-शुक्रवार: सुबह 8 बजे - रात 8 बजे, शनिवार: सुबह 9 बजे - शाम 6 बजे, रविवार: बंद।',
        'default': 'मैं कॉलेज संबंधी प्रश्नों में आपकी सहायता के लिए यहाँ हूँ। आप कोर्स, संकाय, कार्यक्रम या कैंपस की जानकारी के बारे में पूछ सकते हैं।'
    },
    ta: {
        'courses': 'எங்கள் கல்லூரியில் கணினி அறிவியல், மின்னணுவியல், இயந்திர, சிவில் இன்ஜினியரிங் போன்ற பல்வேறு பாடநெறிகள் உள்ளன.',
        'faculty': 'கல்லூரி போர்ட்டல் மூலம் அல்லது அலுவலக நேரத்தில் (காலை 9 மணி - மாலை 5 மணி) சம்பந்தித் துறைகளுக்குச் சென்று ஆசிரியர்களை தொடர்பு கொள்ளலாம்.',
        'events': 'வரவிருக்கும் நிகழ்வுகள்: டெக் ஃபெஸ்ட் (அடுத்த மாதம்), கலாச்சார வாரம் (டிசம்பர்), விளையாட்டு நாள் (ஜனவரி).',
        'library': 'நூலக நேரம்: திங்கள்-வெள்ளி: காலை 8 மணி - இரவு 8 மணி, சனி: காலை 9 மணி - மாலை 6 மணி, ஞாயிறு: மூடப்பட்டுள்ளது.',
        'default': 'கல்லூரி தொடர்பான கேள்விகளுக்கு உதவ நான் இங்கே இருக்கிறேன். நீங்கள் பாடநெறிகள், ஆசிரியர்கள், நிகழ்வுகள் அல்லது வளாக தகவல்களைப் பற்றி கேட்கலாம்.'
    },
    te: {
        'courses': 'మా కాలేజీలో కంప్యూటర్ సైన్స్, ఎలక్ట్రానిక్స్, మెకానికల్, సివిల్ ఇంజనీరింగ్ వంటి వివిధ కోర్సులు అందుబాటులో ఉన్నాయి.',
        'faculty': 'మీరు కాలేజీ పోర్టల్ ద్వారా లేదా కార్యాలయ సమయంలో (ఉదయం 9 గంటలు - సాయంత్రం 5 గంటలు) సంబంధిత విభాగాలను సందర్శించి అధ్యాపకులను సంప్రదించవచ్చు.',
        'events': 'రాబోయే కార్యక్రమాలు: టెక్ ఫెస్ట్ (వచ్చే నెల), సాంస్కృతిక వారం (డిసెంబర్), క్రీడా దినోత్సవం (జనవరి).',
        'library': 'లైబ్రరీ సమయాలు: సోమవారం-శుక్రవారం: ఉదయం 8 గంటలు - రాత్రి 8 గంటలు, శనివారం: ఉదయం 9 గంటలు - సాయంత్రం 6 గంటలు, ఆదివారం: మూసివేయబడుతుంది.',
        'default': 'కాలేజీ సంబంధిత ప్రశ్నలతో మీకు సహాయం చేయడానికి నేను ఇక్కడ ఉన్నాను. మీరు కోర్సులు, అధ్యాపకులు, కార్యక్రమాలు లేదా క్యాంపస్ సమాచారం గురించి అడగవచ్చు.'
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupSpeechRecognition();
    setupScrollEffects();
});

function initializeApp() {
    // Add welcome message
    addBotMessage(mockResponses[currentLanguage]['default']);
    
    // Initialize language selector
    const langSelect = document.getElementById('chat-language');
    if (langSelect) {
        langSelect.value = currentLanguage;
    }
    
    console.log('CampusBot initialized - TechTitans');
}

function setupEventListeners() {
    // Send button
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
    }
    
    // Enter key for input
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
    
    // Voice button
    const voiceButton = document.getElementById('voiceButton');
    if (voiceButton) {
        voiceButton.addEventListener('click', toggleVoiceRecording);
    }
    
    // Language selector
    const languageSelect = document.getElementById('chat-language');
    if (languageSelect) {
        languageSelect.addEventListener('change', function(e) {
            currentLanguage = e.target.value;
            addBotMessage(mockResponses[currentLanguage]['default']);
        });
    }
    
    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

function setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = function() {
            isRecording = true;
            const voiceBtn = document.getElementById('voiceButton');
            if (voiceBtn) {
                voiceBtn.classList.add('recording');
                voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            }
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const messageInput = document.getElementById('messageInput');
            if (messageInput) {
                messageInput.value = transcript;
                sendMessage();
            }
        };
        
        recognition.onend = function() {
            isRecording = false;
            const voiceBtn = document.getElementById('voiceButton');
            if (voiceBtn) {
                voiceBtn.classList.remove('recording');
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            }
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isRecording = false;
            const voiceBtn = document.getElementById('voiceButton');
            if (voiceBtn) {
                voiceBtn.classList.remove('recording');
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            }
        };
    }
}

function setupScrollEffects() {
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.feature-card, .workflow-step, .tech-item').forEach(el => {
        observer.observe(el);
    });
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message === '') return;
    
    // Add user message
    addUserMessage(message);
    
    // Clear input
    messageInput.value = '';
    
    // Simulate bot thinking
    setTimeout(() => {
        const response = getBotResponse(message.toLowerCase());
        addBotMessage(response);
    }, 1000);
}

function addUserMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message user-message';
    messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addBotMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message bot-message';
    messageElement.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Text-to-speech for bot messages
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.lang = currentLanguage === 'en' ? 'en-US' : 
                         currentLanguage === 'hi' ? 'hi-IN' : 
                         currentLanguage === 'ta' ? 'ta-IN' : 'te-IN';
        utterance.rate = 0.8;
        utterance.pitch = 1;
        speechSynthesis.speak(utterance);
    }
}

function getBotResponse(message) {
    const responses = mockResponses[currentLanguage];
    
    // Check for keyword matches
    if (message.includes('course') || message.includes('subject') || message.includes('program')) {
        return responses['courses'];
    } else if (message.includes('faculty') || message.includes('teacher') || message.includes('professor')) {
        return responses['faculty'];
    } else if (message.includes('event') || message.includes('fest') || message.includes('activity')) {
        return responses['events'];
    } else if (message.includes('library') || message.includes('book') || message.includes('timing')) {
        return responses['library'];
    } else {
        return responses['default'];
    }
}

function askQuestion(question) {
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.value = question;
        sendMessage();
    }
}

function toggleVoiceRecording() {
    if (!recognition) {
        alert('Speech recognition is not supported in your browser.');
        return;
    }
    
    if (isRecording) {
        recognition.stop();
    } else {
        recognition.lang = currentLanguage === 'en' ? 'en-US' : 
                          currentLanguage === 'hi' ? 'hi-IN' : 
                          currentLanguage === 'ta' ? 'ta-IN' : 'te-IN';
        recognition.start();
    }
}

// Smooth scrolling functions
function scrollToDemo() {
    const demoSection = document.getElementById('demo');
    if (demoSection) {
        demoSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function scrollToFeatures() {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
        featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Theme and animations
function addThemeEffects() {
    // Add particle effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: 2px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${3 + Math.random() * 4}s infinite linear;
            `;
            hero.appendChild(particle);
        }
    }
}

// Initialize theme effects after DOM load
setTimeout(addThemeEffects, 1000);

// Export functions for global access
window.scrollToDemo = scrollToDemo;
window.scrollToFeatures = scrollToFeatures;
window.askQuestion = askQuestion;

console.log('CampusBot by TechTitans - Bridging Students and Faculty with AI');

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Language selection handling
document.addEventListener('DOMContentLoaded', function() {
    const languageSelect = document.getElementById('languageSelect');
    
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            // This would call the chatbot's setLanguage function
            if (typeof setLanguage === 'function') {
                setLanguage(selectedLanguage);
            }
        });
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Form submission handling for student portal
function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const name = document.getElementById('studentName').value;
    const email = document.getElementById('studentEmail').value;
    const enrollment = document.getElementById('enrollmentNumber').value;
    const query = document.getElementById('studentQuery').value;
    const language = document.getElementById('queryLanguage').value;
    
    // Validate form
    if (!name || !email || !enrollment || !query) {
        alert('Please fill in all fields');
        return;
    }
    
    // In a real application, you would send this data to a server
    // For now, we'll just show a success message
    alert('Your query has been submitted successfully! We will respond shortly.');
    
    // Reset form
    document.getElementById('studentQueryForm').reset();
}

// Initialize form submission handler if on student page
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentQueryForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
});

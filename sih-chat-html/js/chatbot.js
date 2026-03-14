// Chatbot implementation with instant response knowledge base
const knowledgeBase = {
    'en': {
        'course': 'B.Tech, M.Tech, PhD programs available. Visit website for details.',
        'fee': 'Contact finance@college.edu for fee information.',
        'admission': 'Admissions open in May. Check website for forms and deadlines.',
        'hostel': 'Hostel facilities available for all students. Contact hostel@college.edu for details.',
        'library': 'Library open 24/7 for students. Over 50,000 books and journals available.',
        'exam': 'Exam schedule available on student portal. Contact exam@college.edu for queries.',
        'placement': 'Placement cell active. Top companies visit campus regularly.',
        'scholarship': 'Merit and need-based scholarships available. Apply through student portal.',
        'contact': 'Contact us at info@college.edu or call +91-9876543210',
        'hello': 'Hello! How can I assist you today?',
        'hi': 'Hi there! How can I help you?',
        'thanks': 'You\'re welcome! Is there anything else I can help with?',
        'thank you': 'You\'re welcome! Is there anything else I can help with?'
    },
    'hi': {
        'पाठ्यक्रम': 'बी.टेक, एम.टेक, पीएचडी कार्यक्रम उपलब्ध हैं। विवरण के लिए वेबसाइट पर जाएं।',
        'शुल्क': 'शुल्क जानकारी के लिए finance@college.edu से संपर्क करें।',
        'प्रवेश': 'मई में प्रवेश खुला है। फॉर्म और समय सीमा के लिए वेबसाइट देखें।',
        'छात्रावास': 'सभी छात्रों के लिए छात्रावास सुविधाएं उपलब्ध हैं। विवरण के लिए hostel@college.edu से संपर्क करें।',
        'पुस्तकालय': 'छात्रों के लिए 24/7 पुस्तकालय खुला है। 50,000 से अधिक पुस्तकें और पत्रिकाएं उपलब्ध हैं।',
        'परीक्षा': 'छात्र पोर्टल पर परीक्षा कार्यक्रम उपलब्ध है। पूछताछ के लिए exam@college.edu से संपर्क करें।',
        'नौकरी': 'नौकरी कक्ष सक्रिय है। शीर्ष कंपनियां नियमित रूप से परिसर का दौरा करती हैं।',
        'छात्रवृत्ति': 'योग्यता और आवश्यकता के आधार पर छात्रवृत्ति उपलब्ध है। छात्र पोर्टल के माध्यम से आवेदन करें।',
        'संपर्क': 'हमसे संपर्क करें info@college.edu या कॉल करें +91-9876543210',
        'नमस्ते': 'नमस्ते! मैं आज आपकी कैसे सहायता कर सकता हूँ?',
        'हैलो': 'हैलो! मैं आपकी कैसे मदद कर सकता हूँ?',
        'धन्यवाद': 'आपका स्वागत है! क्या मैं कुछ और मदद कर सकता हूँ?',
        'शुक्रिया': 'आपका स्वागत है! क्या मैं कुछ और मदद कर सकता हूँ?'
    },
    'mr': {
        'अभ्यासक्रम': 'बी.टेक, एम.टेक, पीएचडी कार्यक्रम उपलब्ध. तपशीलांसाठी संकेतस्थळ पहा.',
        'शुल्क': 'शुल्क माहितीसाठी finance@college.edu शी संपर्क साधा.',
        'प्रवेश': 'मे मध्ये प्रवेश उघडे आहे. अर्ज आणि अंतिम तारीखींसाठी संकेतस्थळ पहा.',
        'छात्रावास': 'सर्व विद्यार्थ्यांसाठी छात्रावास सुविधा उपलब्ध. तपशीलांसाठी hostel@college.edu शी संपर्क साधा.',
        'ग्रंथालय': 'विद्यार्थ्यांसाठी 24/7 ग्रंथालय उघडे आहे. 50,000 हून अधिक पुस्तके आणि वृत्तपत्रे उपलब्ध.',
        'परीक्षा': 'छात्र पोर्टल वर परीक्षा वेळापत्रक उपलब्ध. पृच्छांसाठी exam@college.edu शी संपर्क साधा.',
        'नोकरी': 'नोकरी कक्ष सक्रिय. शीर्ष कंपन्या नियमितपणे कॅम्पस भेट देतात.',
        'शिष्यवृत्ती': 'पात्रता आणि गरजेनुसार शिष्यवृत्ती उपलब्ध. छात्र पोर्टल वरून अर्ज करा.',
        'संपर्क': 'आमच्याशी संपर्क साधा info@college.edu किंवा कॉल करा +91-9876543210',
        'हॅलो': 'हॅलो! मी तुम्हाला कशी मदत करू शकतो?',
        'नमस्कार': 'नमस्कार! मी तुम्हाला कशी मदत करू शकतो?',
        'धन्यवाद': 'तुमचे स्वागत आहे! इतर काहीतरी मदत हवी आहे का?',
        'आभार': 'तुमचे स्वागत आहे! इतर काहीतरी मदत हवी आहे का?'
    },
    'bn': {
        'কোর্স': 'বি.টেক, এম.টেক, পিএইচডি প্রোগ্রাম উপলব্ধ। বিস্তারিত জানতে ওয়েবসাইট দেখুন।',
        'ফি': 'ফি তথ্যের জন্য finance@college.edu এ যোগাযোগ করুন।',
        'ভর্তি': 'মে মাসে ভর্তি খোলা। ফর্ম এবং শেষ তারিখের জন্য ওয়েবসাইট দেখুন।',
        'আবাসন': 'সমস্ত ছাত্রছাত্রীদের জন্য আবাসন সুবিধা উপলব্ধ। বিস্তারিত জানতে hostel@college.edu এ যোগাযোগ করুন।',
        'লাইব্রেরি': 'ছাত্রছাত্রীদের জন্য 24/7 লাইব্রেরি খোলা। 50,000 এর বেশি বই এবং জার্নাল উপলব্ধ।',
        'পরীক্ষা': 'ছাত্র পোর্টালে পরীক্ষার সময়সূচি উপলব্ধ। প্রশ্নের জন্য exam@college.edu এ যোগাযোগ করুন।',
        'চাকরি': 'চাকরি সেল সক্রিয়। শীর্ষ কোম্পানিগুলি নিয়মিতভাবে ক্যাম্পাসে আসে।',
        'উপকরণ': 'যোগ্যতা এবং প্রয়োজনের উপর ভিত্তি করে উপকরণ উপলব্ধ। ছাত্র পোর্টালের মাধ্যমে আবেদন করুন।',
        'যোগাযোগ': 'আমাদের সাথে যোগাযোগ করুন info@college.edu বা কল করুন +91-9876543210',
        'হ্যালো': 'হ্যালো! আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
        'হাই': 'হাই! আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
        'ধন্যবাদ': 'স্বাগতম! আরও কিছু সাহায্য করতে পারি কি?',
        'ধন্যবাদ': 'স্বাগতম! আরও কিছু সাহায্য করতে পারি কি?'
    },
    'te': {
        'కోర్సు': 'బి.టెక్, ఎం.టెక్, పిహెచ్‌డి ప్రోగ్రామ్‌లు అందుబాటులో ఉన్నాయి. వివరాల కోసం వెబ్‌సైట్‌ను సందర్శించండి.',
        'ఫీజు': 'ఫీజు సమాచారం కోసం finance@college.edu కు సంప్రదించండి.',
        'ఎడ్మిషన్': 'మే లో ఎడ్మిషన్లు తెరవబడతాయి. ఫారమ్‌లు మరియు డెడ్‌లైన్‌ల కోసం వెబ్‌సైట్‌ను చూడండి.',
        'హాస్టల్': 'అన్ని విద్యార్థులకు హాస్టల్ సౌకర్యాలు అందుబాటులో ఉన్నాయి. వివరాల కోసం hostel@college.edu కు సంప్రదించండి.',
        'లైబ్రరీ': 'విద్యార్థుల కోసం 24/7 లైబ్రరీ తెరవబడింది. 50,000 కంటే ఎక్కువ పుస్తకాలు మరియు జర్నల్స్ అందుబాటులో ఉన్నాయి.',
        'పరీక్ష': 'విద్యార్థి పోర్టల్‌లో పరీక్ష షెడ్యూల్ అందుబాటులో ఉంది. ప్రశ్నలకు exam@college.edu కు సంప్రదించండి.',
        'ప్లేస్మెంట్': 'ప్లేస్మెంట్ సెల్ క్రియాశీలంగా ఉంది. టాప్ కంపెనీలు రెగ్యులర్‌గా క్యాంపస్‌ను సందర్శిస్తాయి.',
        'స్కాలర్‌షిప్': 'అర్హత మరియు అవసరం ఆధారంగా స్కాలర్‌షిప్‌లు అందుబాటులో ఉన్నాయి. విద్యార్థి పోర్టల్ ద్వారా దరఖాస్తు చేయండి.',
        'కాంటాక్ట్': 'మమ్మల్ని సంప్రదించండి info@college.edu లేదా కాల్ చేయండి +91-9876543210',
        'హలో': 'హలో! నేను మీకు ఏవిధంగా సహాయపడగలను?',
        'హాయ్': 'హాయ్! నేను మీకు ఏవిధంగా సహాయపడగలను?',
        'ధన్యవాదాలు': 'స్వాగతం! మరి ఏమైనా సహాయం కావాలా?',
        'ధన్యవాదాలు': 'స్వాగతం! మరి ఏమైనా సహాయం కావాలా?'
    }
};

// Language mapping for IndicTrans
const languageMap = {
    'en': 'English',
    'hi': 'Hindi',
    'mr': 'Marathi',
    'bn': 'Bengali',
    'te': 'Telugu'
};

let currentLanguage = 'en';
let recognition;

// Initialize speech recognition
function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            document.getElementById('userInput').value = transcript;
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error', event.error);
        };
    }
}

// Translate text using IndicTrans (simulated)
function translateText(text, targetLang) {
    // In a real implementation, this would call the IndicTrans API
    // For now, we'll simulate translation by returning the text as-is
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(text);
        }, 100);
    });
}

// Get response from knowledge base
function getResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    // Check if we have a response in the knowledge base
    if (knowledgeBase[currentLanguage]) {
        for (const [key, value] of Object.entries(knowledgeBase[currentLanguage])) {
            if (lowerQuery.includes(key)) {
                return value;
            }
        }
    }
    
    // Check English knowledge base as fallback
    if (currentLanguage !== 'en' && knowledgeBase['en']) {
        for (const [key, value] of Object.entries(knowledgeBase['en'])) {
            if (lowerQuery.includes(key)) {
                return value;
            }
        }
    }
    
    return null; // No immediate response found
}

// Add message to chat display
function addMessageToChat(message, isUser = false) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Process user query
async function processQuery(query) {
    if (!query.trim()) return;
    
    // Add user message to chat
    addMessageToChat(query, true);
    
    // Get immediate response if available
    const immediateResponse = getResponse(query);
    
    if (immediateResponse) {
        // Provide immediate response
        addMessageToChat(immediateResponse);
        
        // Speak the response if speech is enabled
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(immediateResponse);
            utterance.lang = currentLanguage === 'en' ? 'en-US' : `${currentLanguage}-${currentLanguage.toUpperCase()}`;
            speechSynthesis.speak(utterance);
        }
    } else {
        // Queue for admin response
        addMessageToChat("I don't have information on that right now. Your query has been sent to the administration for response.");
        
        // In a real implementation, you would send this to your backend
        // For now, we'll simulate storing it in localStorage
        const queuedQueries = JSON.parse(localStorage.getItem('queuedQueries') || '[]');
        queuedQueries.push({
            query: query,
            language: currentLanguage,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('queuedQueries', JSON.stringify(queuedQueries));
        
        // Notify admin (in a real app, this would be a backend notification)
        console.log('New query queued for admin:', query);
    }
    
    // Clear input
    document.getElementById('userInput').value = '';
}

// Set current language
function setLanguage(lang) {
    currentLanguage = lang;
    document.getElementById('currentLanguage').textContent = languageMap[lang];
    
    // Update speech recognition language
    if (recognition) {
        recognition.lang = lang === 'en' ? 'en-US' : `${lang}-${lang.toUpperCase()}`;
    }
    
    // Update UI language
    updateUILanguage();
}

// Update UI language
function updateUILanguage() {
    const elements = document.querySelectorAll('[data-lang]');
    elements.forEach(element => {
        const langKey = element.getAttribute('data-lang');
        if (knowledgeBase[currentLanguage] && knowledgeBase[currentLanguage][langKey]) {
            element.textContent = knowledgeBase[currentLanguage][langKey];
        }
    });
}

// Start voice input
function startVoiceInput() {
    if (recognition) {
        recognition.start();
    } else {
        alert('Speech recognition not supported in your browser.');
    }
}

// Initialize chatbot
function initChatbot() {
    initSpeechRecognition();
    
    // Set up event listeners
    document.getElementById('sendButton').addEventListener('click', () => {
        const query = document.getElementById('userInput').value;
        processQuery(query);
    });
    
    document.getElementById('userInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = document.getElementById('userInput').value;
            processQuery(query);
        }
    });
    
    document.getElementById('voiceButton').addEventListener('click', startVoiceInput);
    
    // Initialize with a welcome message
    setTimeout(() => {
        addMessageToChat("Hello! I'm CampusBot. How can I assist you today?");
    }, 500);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
} else {
    initChatbot();
}
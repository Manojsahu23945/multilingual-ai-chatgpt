// Student Portal JavaScript with IndicTrans Integration
// TechTitans - CampusBot Student Portal

let currentLanguage = 'en';
let isRecording = false;
let recognition = null;
let queryCounter = 1;

// Language configurations
const languages = {
    'en': { name: 'English', code: 'eng_Latn' },
    'hi': { name: 'हिंदी', code: 'hin_Deva' },
    'ta': { name: 'தமிழ்', code: 'tam_Taml' },
    'te': { name: 'తెలుగు', code: 'tel_Telu' },
    'bn': { name: 'বাংলা', code: 'ben_Beng' }
};

// Mock IndicTrans API simulation
const mockIndicTransAPI = {
    translate: async function(text, srcLang, tgtLang) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTranslations = {
            'hi': 'I need information about my course (translated from Hindi)',
            'ta': 'I need information about my course (translated from Tamil)',
            'te': 'I need information about my course (translated from Telugu)',
            'bn': 'I need information about my course (translated from Bengali)'
        };
        
        return mockTranslations[srcLang] || `Translated from ${srcLang}: ${text}`;
    }
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    setupSpeechRecognition();
    loadPreviousQueries();
});

function initializeApp() {
    updateCharacterCount();
    console.log('Student Portal initialized - TechTitans CampusBot');
}

function setupEventListeners() {
    // Language selection
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectLanguage(this.dataset.lang);
        });
    });
    
    // Voice input
    const voiceBtn = document.getElementById('voiceBtn');
    if (voiceBtn) voiceBtn.addEventListener('click', toggleVoiceRecording);
    
    // Translation
    const translateBtn = document.getElementById('translateBtn');
    if (translateBtn) translateBtn.addEventListener('click', translateQuery);
    
    // Submit
    const submitBtn = document.getElementById('submitQuery');
    if (submitBtn) submitBtn.addEventListener('click', submitQuery);
    
    // Query text
    const queryText = document.getElementById('queryText');
    if (queryText) {
        queryText.addEventListener('input', updateCharacterCount);
        queryText.addEventListener('input', debounce(autoTranslate, 1000));
    }
    
    // Modal close
    const modalClose = document.getElementById('modalClose');
    const modalOk = document.getElementById('modalOk');
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalOk) modalOk.addEventListener('click', closeModal);
}

function selectLanguage(lang) {
    currentLanguage = lang;
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    if (recognition) {
        recognition.lang = getVoiceLanguageCode(lang);
    }
}

function setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        
        recognition.onstart = function() {
            isRecording = true;
            const voiceBtn = document.getElementById('voiceBtn');
            if (voiceBtn) {
                voiceBtn.classList.add('recording');
                voiceBtn.innerHTML = '<i class="fas fa-stop"></i>';
            }
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            const queryText = document.getElementById('queryText');
            if (queryText) {
                queryText.value = transcript;
                updateCharacterCount();
                autoTranslate();
            }
        };
        
        recognition.onend = function() {
            isRecording = false;
            const voiceBtn = document.getElementById('voiceBtn');
            if (voiceBtn) {
                voiceBtn.classList.remove('recording');
                voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            }
        };
    }
}

function getVoiceLanguageCode(lang) {
    const codes = {
        'en': 'en-US', 'hi': 'hi-IN', 'ta': 'ta-IN', 'te': 'te-IN', 'bn': 'bn-IN'
    };
    return codes[lang] || 'en-US';
}

function toggleVoiceRecording() {
    if (!recognition) {
        alert('Speech recognition not supported');
        return;
    }
    
    if (isRecording) {
        recognition.stop();
    } else {
        recognition.lang = getVoiceLanguageCode(currentLanguage);
        recognition.start();
    }
}

async function translateQuery() {
    const queryText = document.getElementById('queryText');
    const text = queryText.value.trim();
    
    if (!text || currentLanguage === 'en') return;
    
    showLoading('Translating...');
    
    try {
        const translated = await mockIndicTransAPI.translate(text, currentLanguage, 'en');
        showTranslationPreview(translated);
    } catch (error) {
        console.error('Translation error:', error);
    } finally {
        hideLoading();
    }
}

async function autoTranslate() {
    const queryText = document.getElementById('queryText');
    const text = queryText.value.trim();
    
    if (!text || currentLanguage === 'en') {
        hideTranslationPreview();
        return;
    }
    
    try {
        const translated = await mockIndicTransAPI.translate(text, currentLanguage, 'en');
        showTranslationPreview(translated);
    } catch (error) {
        console.error('Auto-translation error:', error);
    }
}

function showTranslationPreview(translatedText) {
    const preview = document.getElementById('translationPreview');
    const translatedDiv = document.getElementById('translatedText');
    
    if (preview && translatedDiv) {
        translatedDiv.textContent = translatedText;
        preview.style.display = 'block';
    }
}

function hideTranslationPreview() {
    const preview = document.getElementById('translationPreview');
    if (preview) {
        preview.style.display = 'none';
    }
}

async function submitQuery() {
    if (!validateForm()) return;
    
    const formData = collectFormData();
    
    showLoading('Submitting your query...');
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate query ID
        const queryId = `CQ${Date.now()}${Math.floor(Math.random() * 1000)}`;
        
        // Save query locally
        saveQueryLocally(formData, queryId);
        
        // Send email (simulate)
        await sendEmailNotification(formData, queryId);
        
        // Show success modal
        showSuccessModal(queryId);
        
        // Reset form
        resetForm();
        
    } catch (error) {
        console.error('Submission error:', error);
        alert('Error submitting query. Please try again.');
    } finally {
        hideLoading();
    }
}

function collectFormData() {
    return {
        studentId: document.getElementById('studentId').value,
        email: document.getElementById('studentEmail').value,
        department: document.getElementById('department').value,
        year: document.getElementById('year').value,
        category: document.getElementById('queryCategory').value,
        priority: document.getElementById('priority').value,
        query: document.getElementById('queryText').value,
        language: currentLanguage,
        timestamp: new Date().toISOString()
    };
}

function validateForm() {
    const required = ['studentId', 'studentEmail', 'department', 'year', 'queryCategory', 'queryText'];
    
    for (let field of required) {
        const element = document.getElementById(field);
        if (!element.value.trim()) {
            element.focus();
            alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
            return false;
        }
    }
    
    const email = document.getElementById('studentEmail').value;
    if (!isValidEmail(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function saveQueryLocally(formData, queryId) {
    const queries = JSON.parse(localStorage.getItem('studentQueries') || '[]');
    queries.unshift({
        id: queryId,
        ...formData,
        status: 'pending',
        submittedAt: new Date().toLocaleString()
    });
    localStorage.setItem('studentQueries', JSON.stringify(queries.slice(0, 10)));
}

async function sendEmailNotification(formData, queryId) {
    // Simulate email sending to admin
    console.log('Email sent to admin:', {
        to: 'admin@college.edu',
        subject: `New Student Query - ${queryId}`,
        body: `
Query ID: ${queryId}
Student: ${formData.studentId}
Email: ${formData.email}
Department: ${formData.department}
Category: ${formData.category}
Priority: ${formData.priority}
Language: ${formData.language}

Query: ${formData.query}

Submitted at: ${new Date().toLocaleString()}
        `
    });
}

function showSuccessModal(queryId) {
    const modal = document.getElementById('successModal');
    const queryIdSpan = document.getElementById('generatedQueryId');
    
    if (modal && queryIdSpan) {
        queryIdSpan.textContent = queryId;
        modal.classList.add('show');
    }
}

function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

function resetForm() {
    document.getElementById('studentId').value = '';
    document.getElementById('studentEmail').value = '';
    document.getElementById('department').value = '';
    document.getElementById('year').value = '';
    document.getElementById('queryCategory').value = '';
    document.getElementById('queryText').value = '';
    document.getElementById('priority').value = 'low';
    updateCharacterCount();
    hideTranslationPreview();
}

function loadPreviousQueries() {
    const queries = JSON.parse(localStorage.getItem('studentQueries') || '[]');
    const queriesList = document.getElementById('queriesList');
    
    if (!queriesList) return;
    
    if (queries.length === 0) {
        queriesList.innerHTML = '<p style="text-align: center; color: #64748b;">No previous queries found.</p>';
        return;
    }
    
    queriesList.innerHTML = queries.map(query => `
        <div class="query-item">
            <div class="query-header-row">
                <span class="query-id">${query.id}</span>
                <span class="query-status ${query.status}">${query.status}</span>
            </div>
            <div class="query-content">${query.query.substring(0, 100)}${query.query.length > 100 ? '...' : ''}</div>
            <div class="query-meta">
                <span>${query.category} • ${query.language}</span>
                <span>${query.submittedAt}</span>
            </div>
        </div>
    `).join('');
}

function updateCharacterCount() {
    const queryText = document.getElementById('queryText');
    const charCount = document.getElementById('charCount');
    
    if (queryText && charCount) {
        const count = queryText.value.length;
        charCount.textContent = count;
        
        if (count > 900) {
            charCount.style.color = '#ef4444';
        } else if (count > 700) {
            charCount.style.color = '#f59e0b';
        } else {
            charCount.style.color = '#64748b';
        }
    }
}

function showLoading(text = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    const loadingText = document.getElementById('loadingText');
    
    if (overlay && loadingText) {
        loadingText.textContent = text;
        overlay.classList.add('show');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Export functions for global access
window.selectLanguage = selectLanguage;
window.submitQuery = submitQuery;

console.log('CampusBot Student Portal - TechTitans | Multilingual Support Ready');
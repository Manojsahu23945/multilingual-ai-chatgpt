// Admin Panel JavaScript for CampusBot
// TechTitans - CampusBot Administration

// Global variables
let currentQuery = null;
let queries = [];

// Mock data for demonstration
const mockQueries = [
    {
        id: 'CQ2024001',
        studentId: 'STU2024001',
        studentName: 'Rahul Sharma',
        studentEmail: 'rahul.sharma@college.edu',
        department: 'cse',
        year: '3',
        category: 'academic',
        language: 'hi',
        priority: 'high',
        status: 'pending',
        query: 'मुझे अपने कोर्स के बारे में जानकारी चाहिए। मैं कंप्यूटर साइंस में हूँ और मुझे नहीं पता कि मेरे पास कौन से वैकल्पिक विषय हैं।',
        queryEnglish: 'I need information about my course. I am in Computer Science and I don\'t know what elective subjects I have.',
        submittedAt: '2024-09-20T10:30:00Z',
        response: null
    },
    {
        id: 'CQ2024002',
        studentId: 'STU2024002',
        studentName: 'Priya Patel',
        studentEmail: 'priya.patel@college.edu',
        department: 'ece',
        year: '2',
        category: 'exam',
        language: 'en',
        priority: 'medium',
        status: 'in-progress',
        query: 'What is the syllabus for the upcoming mid-term exams in Digital Electronics?',
        queryEnglish: 'What is the syllabus for the upcoming mid-term exams in Digital Electronics?',
        submittedAt: '2024-09-20T14:15:00Z',
        response: 'The syllabus for Digital Electronics mid-term exam covers chapters 1-5 from the prescribed textbook. Please refer to the LMS for detailed breakdown.'
    },
    {
        id: 'CQ2024003',
        studentId: 'STU2024003',
        studentName: 'Arjun Reddy',
        studentEmail: 'arjun.reddy@college.edu',
        department: 'mech',
        year: '4',
        category: 'placement',
        language: 'te',
        priority: 'high',
        status: 'pending',
        query: 'నాకు ఉద్యోగ నియామకాల గురించి సమాచారం కావాలి. మీరు ఏ కంపెనీలతో కలిసారు?',
        queryEnglish: 'I need information about job placements. Which companies have you collaborated with?',
        submittedAt: '2024-09-21T09:45:00Z',
        response: null
    },
    {
        id: 'CQ2024004',
        studentId: 'STU2024004',
        studentName: 'Sneha Krishnan',
        studentEmail: 'sneha.krishnan@college.edu',
        department: 'civil',
        year: '1',
        category: 'hostel',
        language: 'ta',
        priority: 'low',
        status: 'resolved',
        query: 'எனது ஹாஸ்டல் அறையில் விசை குறைவாக உள்ளது. புதிய விசைகளை எப்போது வழங்குவீர்கள்?',
        queryEnglish: 'There is a shortage of keys in my hostel room. When will you provide new keys?',
        submittedAt: '2024-09-19T16:20:00Z',
        response: 'New keys have been ordered and will be distributed by Friday. Please collect from the hostel office.'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadQueries();
    updateStats();
});

function initializeApp() {
    console.log('Admin Panel initialized - TechTitans CampusBot');
}

function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                alert('Logged out successfully');
                // In real app, redirect to login page
            }
        });
    }
    
    // Filter changes
    const statusFilter = document.getElementById('statusFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    
    if (statusFilter) statusFilter.addEventListener('change', filterQueries);
    if (categoryFilter) categoryFilter.addEventListener('change', filterQueries);
    if (priorityFilter) priorityFilter.addEventListener('change', filterQueries);
    
    // Template type change
    const templateType = document.getElementById('templateType');
    if (templateType) {
        templateType.addEventListener('change', function() {
            loadEmailTemplate(this.value);
        });
    }
    
    // Language toggle in query modal
    document.querySelectorAll('.lang-toggle').forEach(btn => {
        btn.addEventListener('click', function() {
            toggleQueryLanguage(this.dataset.lang);
        });
    });
}

function loadQueries() {
    // In real app, this would fetch from backend
    queries = [...mockQueries];
    renderQueriesTable();
}

function renderQueriesTable() {
    const tbody = document.getElementById('queriesTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = queries.map(query => `
        <tr>
            <td class="query-id-cell">${query.id}</td>
            <td class="student-info">
                <div class="student-name">${query.studentName}</div>
                <div class="student-email">${query.studentEmail}</div>
                <div class="student-dept">${getDepartmentName(query.department)} • Year ${query.year}</div>
            </td>
            <td><span class="category-badge">${getCategoryName(query.category)}</span></td>
            <td><span class="language-badge">${getLanguageName(query.language)}</span></td>
            <td><span class="priority-badge ${query.priority}">${getPriorityName(query.priority)}</span></td>
            <td><span class="status-badge ${query.status}">${getStatusName(query.status)}</span></td>
            <td class="date-cell">${formatDate(query.submittedAt)}</td>
            <td class="actions-cell">
                <button class="action-icon-btn view" onclick="viewQuery('${query.id}')" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-icon-btn reply" onclick="replyToQuery('${query.id}')" title="Reply">
                    <i class="fas fa-reply"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewQuery(queryId) {
    const query = queries.find(q => q.id === queryId);
    if (!query) return;
    
    currentQuery = query;
    
    // Populate modal with query details
    document.getElementById('modalStudentId').textContent = query.studentId;
    document.getElementById('modalStudentName').textContent = query.studentName;
    document.getElementById('modalStudentEmail').textContent = query.studentEmail;
    document.getElementById('modalDepartment').textContent = getDepartmentName(query.department);
    document.getElementById('modalYear').textContent = query.year;
    document.getElementById('modalCategory').textContent = getCategoryName(query.category);
    document.getElementById('originalQuery').textContent = query.query;
    document.getElementById('translatedQuery').textContent = query.queryEnglish;
    
    // Show modal
    document.getElementById('queryModal').classList.add('show');
}

function replyToQuery(queryId) {
    const query = queries.find(q => q.id === queryId);
    if (!query) return;
    
    currentQuery = query;
    viewQuery(queryId);
    
    // Focus on response text area
    setTimeout(() => {
        const responseText = document.getElementById('responseText');
        if (responseText) {
            responseText.focus();
        }
    }, 500);
}

function closeQueryModal() {
    document.getElementById('queryModal').classList.remove('show');
    currentQuery = null;
}

function toggleQueryLanguage(lang) {
    document.querySelectorAll('.lang-toggle').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
    
    document.querySelectorAll('.query-version').forEach(version => {
        version.classList.remove('active');
    });
    document.getElementById(`${lang === 'original' ? 'original' : 'translated'}Query`).classList.add('active');
}

function sendResponse() {
    const responseText = document.getElementById('responseText').value.trim();
    if (!responseText || !currentQuery) {
        alert('Please enter a response');
        return;
    }
    
    showLoading('Sending response...');
    
    setTimeout(() => {
        // Update query status
        currentQuery.status = 'resolved';
        currentQuery.response = responseText;
        currentQuery.respondedAt = new Date().toISOString();
        
        // Update UI
        renderQueriesTable();
        updateStats();
        
        // Simulate email sending
        sendEmailResponse(currentQuery, responseText);
        
        // Close modal
        closeQueryModal();
        
        hideLoading();
        alert('Response sent successfully!');
    }, 1500);
}

function sendEmailResponse(query, response) {
    console.log('Email response sent:', {
        to: query.studentEmail,
        subject: `Response to your query ${query.id}`,
        body: `
Dear ${query.studentName},

Thank you for your query. Here is our response:

${response}

Best regards,
CampusBot Administration Team
        `
    });
}

function saveAsDraft() {
    const responseText = document.getElementById('responseText').value.trim();
    if (!responseText || !currentQuery) {
        alert('Please enter a response to save as draft');
        return;
    }
    
    // In real app, save to backend
    currentQuery.draftResponse = responseText;
    alert('Response saved as draft');
}

function translateResponse() {
    const responseText = document.getElementById('responseText').value.trim();
    if (!responseText) {
        alert('Please enter text to translate');
        return;
    }
    
    showLoading('Translating response...');
    
    setTimeout(() => {
        // Simulate translation
        const translated = `Translated response in ${document.getElementById('responseLanguage').value}: ${responseText}`;
        document.getElementById('responseText').value = translated;
        hideLoading();
        alert('Response translated');
    }, 1000);
}

function filterQueries() {
    const status = document.getElementById('statusFilter').value;
    const category = document.getElementById('categoryFilter').value;
    const priority = document.getElementById('priorityFilter').value;
    
    let filtered = [...mockQueries];
    
    if (status !== 'all') {
        filtered = filtered.filter(q => q.status === status);
    }
    
    if (category !== 'all') {
        filtered = filtered.filter(q => q.category === category);
    }
    
    if (priority !== 'all') {
        filtered = filtered.filter(q => q.priority === priority);
    }
    
    queries = filtered;
    renderQueriesTable();
}

function refreshQueries() {
    showLoading('Refreshing queries...');
    setTimeout(() => {
        loadQueries();
        hideLoading();
        alert('Queries refreshed');
    }, 1000);
}

function updateStats() {
    const pending = queries.filter(q => q.status === 'pending').length;
    const resolvedToday = queries.filter(q => 
        q.status === 'resolved' && 
        new Date(q.submittedAt).toDateString() === new Date().toDateString()
    ).length;
    const urgent = queries.filter(q => q.priority === 'high' && q.status === 'pending').length;
    const total = queries.length;
    
    document.getElementById('pendingCount').textContent = pending;
    document.getElementById('resolvedCount').textContent = resolvedToday;
    document.getElementById('urgentCount').textContent = urgent;
    document.getElementById('totalCount').textContent = total;
}

function showAllQueries() {
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('categoryFilter').value = 'all';
    document.getElementById('priorityFilter').value = 'all';
    loadQueries();
}

function showUrgentQueries() {
    document.getElementById('statusFilter').value = 'pending';
    document.getElementById('priorityFilter').value = 'high';
    filterQueries();
}

function exportQueries() {
    alert('Queries exported successfully! (In a real application, this would download a CSV file)');
}

function showSettings() {
    alert('Email settings opened! (In a real application, this would show the settings panel)');
}

function testEmailConnection() {
    showLoading('Testing email connection...');
    setTimeout(() => {
        hideLoading();
        alert('Email connection successful!');
    }, 1500);
}

function saveTemplate() {
    const template = document.getElementById('emailTemplate').value.trim();
    if (!template) {
        alert('Please enter template content');
        return;
    }
    
    alert('Email template saved successfully!');
}

function loadEmailTemplate(type) {
    const templates = {
        confirmation: 'Dear {student_name},\n\nThank you for your query #{query_id}. We have received your question and will respond within 24-48 hours.\n\nBest regards,\nCampusBot Team',
        response: 'Dear {student_name},\n\nRegarding your query #{query_id}:\n\n{response_text}\n\nIf you have any further questions, please feel free to contact us.\n\nBest regards,\nCampusBot Team',
        followup: 'Dear {student_name},\n\nThis is a follow-up to your query #{query_id}. We wanted to ensure that your question was fully addressed.\n\nBest regards,\nCampusBot Team'
    };
    
    document.getElementById('emailTemplate').value = templates[type] || '';
}

// Helper functions
function getDepartmentName(code) {
    const departments = {
        'cse': 'Computer Science',
        'ece': 'Electronics & Communication',
        'mech': 'Mechanical Engineering',
        'civil': 'Civil Engineering',
        'eee': 'Electrical Engineering',
        'chem': 'Chemical Engineering'
    };
    return departments[code] || code;
}

function getCategoryName(code) {
    const categories = {
        'academic': 'Academic',
        'admission': 'Admission',
        'hostel': 'Hostel',
        'exam': 'Examination',
        'fee': 'Fee Related',
        'library': 'Library',
        'placement': 'Placement',
        'technical': 'Technical',
        'other': 'Other'
    };
    return categories[code] || code;
}

function getLanguageName(code) {
    const languages = {
        'en': 'English',
        'hi': 'Hindi',
        'ta': 'Tamil',
        'te': 'Telugu',
        'bn': 'Bengali'
    };
    return languages[code] || code;
}

function getPriorityName(code) {
    const priorities = {
        'low': 'Low',
        'medium': 'Medium',
        'high': 'High'
    };
    return priorities[code] || code;
}

function getStatusName(code) {
    const statuses = {
        'pending': 'Pending',
        'in-progress': 'In Progress',
        'resolved': 'Resolved'
    };
    return statuses[code] || code;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

function showLoading(text = 'Processing...') {
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

// Export functions for global access
window.viewQuery = viewQuery;
window.replyToQuery = replyToQuery;
window.closeQueryModal = closeQueryModal;
window.sendResponse = sendResponse;
window.saveAsDraft = saveAsDraft;
window.translateResponse = translateResponse;
window.refreshQueries = refreshQueries;
window.showAllQueries = showAllQueries;
window.showUrgentQueries = showUrgentQueries;
window.exportQueries = exportQueries;
window.showSettings = showSettings;
window.testEmailConnection = testEmailConnection;
window.saveTemplate = saveTemplate;

console.log('CampusBot Admin Panel - TechTitans | Ready for query management');
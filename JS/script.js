/* ===== STORAGE MANAGEMENT ===== */
const STORAGE_KEYS = {
    CURRENT_USER: 'valorant_current_user',
    PLAYERS_DATA: 'valorant_players_data'
};

// User management
function getCurrentUser() {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
}

function setCurrentUser(username) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, username);
}

function clearCurrentUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

// Players data management
function getPlayersData() {
    const data = localStorage.getItem(STORAGE_KEYS.PLAYERS_DATA);
    return data ? JSON.parse(data) : {};
}

function savePlayersData(data) {
    localStorage.setItem(STORAGE_KEYS.PLAYERS_DATA, JSON.stringify(data));
}

function saveDiagnosisResult(result) {
    const username = getCurrentUser();
    if (!username) return;

    const playersData = getPlayersData();
    if (!playersData[username]) {
        playersData[username] = {
            createdAt: new Date().toISOString(),
            history: []
        };
    }

    const diagnosisEntry = {
        id: Date.now().toString(),
        result: result,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    };

    playersData[username].history.unshift(diagnosisEntry);
    playersData[username].lastActivity = new Date().toISOString();
    
    savePlayersData(playersData);
}

/* ===== QUESTION SYSTEM ===== */
const QUESTIONS = [
    {
        id: 1,
        text: "Apakah kamu sering kalah dalam duel 1 lawan 1?",
        category: "Aim & Dueling"
    },
    {
        id: 2,
        text: "Apakah kamu sering meleset saat menembak meskipun crosshair sudah di target?",
        category: "Accuracy"
    },
    {
        id: 3,
        text: "Apakah kamu sering mati dari arah yang tidak terduga atau dari belakang?",
        category: "Awareness"
    },
    {
        id: 4,
        text: "Apakah kamu jarang berkomunikasi dengan tim saat bermain?",
        category: "Communication"
    },
    {
        id: 5,
        text: "Apakah kamu sering salah dalam mengambil timing rotasi atau push?",
        category: "Game Sense"
    }
];

const DIAGNOSIS_RESULTS = {
    AIM_DUELING: {
        title: "🎯 Area Improvement: Aim & Dueling",
        message: "Kamu perlu fokus melatih aim dan confidence dalam duel 1v1. Coba latihan flick shots dan tracking di Practice Range.",
        tips: [
            "Gunakan Deathmatch untuk berlatih duel realistik",
            "Latih flick shots di Practice Range 15 menit sehari",
            "Fokus pada crosshair placement di head level",
            "Practice strafing dan counter-strafing"
        ]
    },
    ACCURACY: {
        title: "🔫 Area Improvement: Accuracy & Control",
        message: "Konsistensi tembakan perlu ditingkatkan. Perbaiki crosshair placement dan kontrol recoil senjata.",
        tips: [
            "Latih spray control untuk senjata favoritmu",
            "Gunakan Sheriff untuk melatih tap shooting",
            "Practice strafe shooting untuk movement yang baik",
            "Fokus pada first shot accuracy"
        ]
    },
    AWARENESS: {
        title: "🗺️ Area Improvement: Map Awareness",
        message: "Tingkatkan kesadaran situasional dengan lebih sering mengecek minimap dan mendengarkan audio cues.",
        tips: [
            "Cek minimap setiap 3-5 detik",
            "Dengarkan suara langkah dan ability musuh",
            "Pelajari common angles di setiap map",
            "Gunakan agent dengan recon abilities"
        ]
    },
    COMMUNICATION: {
        title: "🎤 Area Improvement: Team Communication",
        message: "Komunikasi yang efektif adalah kunci kemenangan tim. Berikan info yang jelas dan konsisten.",
        tips: [
            "Gunakan ping system dengan efektif",
            "Beri callout yang spesifik (lokasi, jumlah musuh)",
            "Dengarkan dan respond callout tim",
            "Berikan info ability usage"
        ]
    },
    GAME_SENSE: {
        title: "🧠 Area Improvement: Game Sense & Strategy",
        message: "Perbaiki pengambilan keputusan dan understanding game flow. Pelajari kapan harus agresif atau passive.",
        tips: [
            "Tonton VOD pro player untuk belajar decision making",
            "Pelajari agent role dan responsibilities",
            "Review gameplay sendiri untuk analisis kesalahan",
            "Pahami economy management"
        ]
    },
    BALANCED: {
        title: "⭐ Well Rounded Player",
        message: "Berdasarkan jawabanmu, kamu menunjukkan fundamental yang solid! Pertahankan dan terus tingkatkan skill.",
        tips: [
            "Coba master agent baru untuk expand skillset",
            "Latih advanced techniques seperti jump peeks",
            "Main scrim dengan tim terorganisir",
            "Analisis VOD pro player di role yang sama"
        ]
    }
};

/* ===== HAMBURGER MENU ===== */
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    const hamburger = document.querySelector('.hamburger-menu');
    menu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const menu = document.getElementById('navMenu');
    const hamburger = document.querySelector('.hamburger-menu');
    
    if (menu && hamburger && !menu.contains(event.target) && !hamburger.contains(event.target)) {
        menu.classList.remove('active');
        hamburger.classList.remove('active');
    }
});

/* ===== MODAL SYSTEM ===== */
function showModal(title, message, tips) {
    const modalHTML = `
        <div class="modal-overlay active">
            <div class="modal-content">
                <button class="modal-close" onclick="closeModal()">×</button>
                <div class="result-header">
                    <div class="result-icon">🎯</div>
                    <h2>${title}</h2>
                </div>
                <div class="result-message">
                    <p>${message}</p>
                </div>
                <div class="tips-section">
                    <h4><i class="fas fa-lightbulb"></i> Tips Improvement:</h4>
                    <ul>
                        ${tips.map(tip => `<li>${tip}</li>`).join('')}
                    </ul>
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn btn-primary" onclick="restartDiagnosis()">
                        <i class="fas fa-redo"></i>
                        Ulangi Diagnosa
                    </button>
                    <button class="modal-btn btn-secondary" onclick="goToHome()">
                        <i class="fas fa-home"></i>
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

function restartDiagnosis() {
    closeModal();
    if (typeof startDiagnosis === 'function') {
        startDiagnosis();
    }
}

function goToHome() {
    window.location.href = 'index.html';
}

/* ===== LOGIN SYSTEM ===== */
function initLoginPage() {
    // Redirect if already logged in
    if (getCurrentUser()) {
        window.location.href = 'index.html';
        return;
    }

    const usernameInput = document.getElementById('username');
    
    if (usernameInput) {
        usernameInput.focus();
        
        // Enter key support
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
}

function login() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim();
    const errorMessage = document.getElementById('errorMessage');

    if (!username) {
        if (errorMessage) {
            errorMessage.classList.add('show');
        } else {
            alert('Please enter your name to continue!');
        }
        usernameInput.focus();
        return;
    }

    // Hide error message if shown
    if (errorMessage) {
        errorMessage.classList.remove('show');
    }

    // Set current user and redirect
    setCurrentUser(username);
    
    // Initialize user data if not exists
    const playersData = getPlayersData();
    if (!playersData[username]) {
        playersData[username] = {
            createdAt: new Date().toISOString(),
            history: [],
            lastActivity: new Date().toISOString()
        };
        savePlayersData(playersData);
    }
    
    window.location.href = 'index.html';
}

// Global login function for HTML onclick
window.login = login;

/* ===== HOME PAGE ===== */
function initHomePage() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Update player name
    const playerNameElement = document.getElementById('playerName');
    if (playerNameElement) {
        playerNameElement.textContent = currentUser;
    }

    // Update home statistics
    updateHomeStats();
}

function updateHomeStats() {
    const currentUser = getCurrentUser();
    const playersData = getPlayersData();
    const userData = playersData[currentUser] || { history: [] };

    const totalDiagnosesElement = document.getElementById('totalDiagnoses');
    const improvementRateElement = document.getElementById('improvementRate');

    if (totalDiagnosesElement) {
        totalDiagnosesElement.textContent = userData.history.length;
    }

    if (improvementRateElement) {
        if (userData.history.length > 0) {
            improvementRateElement.textContent = 'Good';
        } else {
            improvementRateElement.textContent = '-';
        }
    }
}

/* ===== DIAGNOSIS SYSTEM ===== */
let currentQuestionIndex = 0;
let userAnswers = [];

function initDiagnosisPage() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    startDiagnosis();
}

function startDiagnosis() {
    currentQuestionIndex = 0;
    userAnswers = [];
    showQuestion();
}

function showQuestion() {
    const questionElement = document.getElementById('questionText');
    const optionsElement = document.getElementById('optionsContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const progressPercentage = document.getElementById('progressPercentage');
    const progressCategory = document.getElementById('progressCategory');
    const currentQuestionNumber = document.getElementById('currentQuestionNumber');
    const questionCategory = document.getElementById('questionCategory');
    const currentQuestion = document.getElementById('currentQuestion');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');

    if (currentQuestionIndex >= QUESTIONS.length) {
        showDiagnosisResult();
        return;
    }

    const currentQuestionData = QUESTIONS[currentQuestionIndex];
    
    // Update question text
    if (questionElement) questionElement.textContent = currentQuestionData.text;
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / QUESTIONS.length) * 100;
    if (progressFill) progressFill.style.width = `${progress}%`;
    if (progressText) progressText.textContent = `Pertanyaan ${currentQuestionIndex + 1}/${QUESTIONS.length}`;
    if (progressPercentage) progressPercentage.textContent = `${Math.round(progress)}%`;
    if (progressCategory) progressCategory.textContent = currentQuestionData.category;
    if (currentQuestionNumber) currentQuestionNumber.textContent = currentQuestionIndex + 1;
    if (questionCategory) questionCategory.textContent = currentQuestionData.category;
    if (currentQuestion) currentQuestion.textContent = currentQuestionIndex + 1;
    
    // Update navigation buttons
    if (prevButton) prevButton.disabled = currentQuestionIndex === 0;
    if (nextButton) nextButton.style.display = currentQuestionIndex === QUESTIONS.length - 1 ? 'none' : 'flex';
    
    // Create options
    if (optionsElement) {
        optionsElement.innerHTML = `
            <button class="option-btn" onclick="answerQuestion(true)">
                <i class="fas fa-check"></i>
                Ya
            </button>
            <button class="option-btn" onclick="answerQuestion(false)">
                <i class="fas fa-times"></i>
                Tidak
            </button>
        `;
    }
}

function answerQuestion(answer) {
    userAnswers.push({
        questionId: currentQuestionIndex,
        answer: answer,
        category: QUESTIONS[currentQuestionIndex].category
    });
    currentQuestionIndex++;
    showQuestion();
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        userAnswers.pop(); // Remove last answer
        showQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

function showDiagnosisResult() {
    // Improved scoring based on categories
    const categoryScores = {};
    
    userAnswers.forEach(answer => {
        const category = answer.category;
        if (!categoryScores[category]) {
            categoryScores[category] = 0;
        }
        if (answer.answer) {
            categoryScores[category]++;
        }
    });
    
    // Find the category with highest score (most problems)
    let maxCategory = 'BALANCED';
    let maxScore = 0;
    
    Object.keys(categoryScores).forEach(category => {
        if (categoryScores[category] > maxScore) {
            maxScore = categoryScores[category];
            // Convert category to match DIAGNOSIS_RESULTS keys
            maxCategory = category.toUpperCase().replace(' & ', '_').replace(' ', '_');
        }
    });
    
    const result = DIAGNOSIS_RESULTS[maxCategory] || DIAGNOSIS_RESULTS.BALANCED;
    
    // Save result
    saveDiagnosisResult(result.title);
    
    // Show modal with result
    showModal(result.title, result.message, result.tips);
}

/* ===== PROFILE PAGE ===== */
function initProfilePage() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    updateProfileInfo();
}

function updateProfileInfo() {
    const currentUser = getCurrentUser();
    const playersData = getPlayersData();
    const userData = playersData[currentUser] || { history: [], createdAt: new Date().toISOString() };

    // Update profile name
    const profileNameElement = document.getElementById('profileName');
    if (profileNameElement) {
        profileNameElement.textContent = currentUser;
    }

    // Update player rank
    const playerRankElement = document.getElementById('playerRank');
    if (playerRankElement) {
        const totalDiagnoses = userData.history.length;
        if (totalDiagnoses >= 10) {
            playerRankElement.textContent = 'Expert Analyst';
        } else if (totalDiagnoses >= 5) {
            playerRankElement.textContent = 'Advanced Player';
        } else if (totalDiagnoses >= 1) {
            playerRankElement.textContent = 'Improving Player';
        } else {
            playerRankElement.textContent = 'New Player';
        }
    }

    // Update member since
    const memberSinceElement = document.getElementById('memberSince');
    if (memberSinceElement && userData.createdAt) {
        const createdDate = new Date(userData.createdAt);
        memberSinceElement.textContent = createdDate.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Update statistics
    const totalDiagnosa = userData.history.length;
    
    document.getElementById('totalDiagnosa').textContent = totalDiagnosa;
    document.getElementById('lastActivity').textContent = 
        userData.history.length > 0 ? userData.history[0].date : 'Belum ada aktivitas';
    
    // Calculate improvement score
    document.getElementById('improvementScore').textContent = 
        totalDiagnosa > 0 ? Math.min(totalDiagnosa * 10, 100) : '-';
    
    // Calculate completion rate
    document.getElementById('completionRate').textContent = 
        totalDiagnosa > 0 ? '100%' : '0%';

    // Update history
    const historyListElement = document.getElementById('historyList');
    if (historyListElement) {
        if (userData.history.length === 0) {
            historyListElement.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clipboard-list"></i>
                    <p>Belum ada riwayat diagnosa</p>
                    <button class="cta-btn" onclick="window.location.href='diagnosa.html'" style="margin-top: 20px;">
                        <i class="fas fa-rocket"></i>
                        Mulai Diagnosa Pertama
                    </button>
                </div>
            `;
        } else {
            historyListElement.innerHTML = userData.history.map(entry => `
                <div class="history-item">
                    <div class="history-content">
                        <div class="history-message">${entry.result}</div>
                        <div class="history-date">
                            <i class="fas fa-calendar"></i>
                            ${entry.date}
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
}

function editProfile() {
    const newName = prompt('Masukkan nama baru:', getCurrentUser());
    if (newName && newName.trim() !== '') {
        const oldName = getCurrentUser();
        const playersData = getPlayersData();
        
        if (playersData[oldName]) {
            playersData[newName] = playersData[oldName];
            delete playersData[oldName];
            savePlayersData(playersData);
        }
        
        setCurrentUser(newName);
        updateProfileInfo();
        alert('Profil berhasil diupdate!');
    }
}

function clearHistory() {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat diagnosa?')) {
        const username = getCurrentUser();
        const playersData = getPlayersData();
        
        if (playersData[username]) {
            playersData[username].history = [];
            savePlayersData(playersData);
            updateProfileInfo();
            alert('Riwayat berhasil dihapus!');
        }
    }
}

function exportData() {
    const username = getCurrentUser();
    const playersData = getPlayersData();
    const userData = playersData[username];
    
    if (!userData || userData.history.length === 0) {
        alert('Tidak ada data untuk diexport!');
        return;
    }
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `valorant-analysis-${username}-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    alert('Data berhasil diexport!');
}

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        clearCurrentUser();
        window.location.href = 'login.html';
    }
}

// Global logout function
window.logout = logout;
window.previousQuestion = previousQuestion;
window.nextQuestion = nextQuestion;
window.editProfile = editProfile;
window.clearHistory = clearHistory;
window.exportData = exportData;

/* ===== PAGE INITIALIZATION ===== */
document.addEventListener('DOMContentLoaded', function() {
    // Check current page and initialize accordingly
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('login.html') || document.getElementById('username')) {
        initLoginPage();
    } else if (currentPath.includes('index.html') || document.getElementById('playerName')) {
        initHomePage();
    } else if (currentPath.includes('diagnosa.html') || document.getElementById('questionText')) {
        initDiagnosisPage();
    } else if (currentPath.includes('profil.html') || document.getElementById('profileName')) {
        initProfilePage();
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Prevent modal close when clicking inside modal
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
        closeModal();
    }
});
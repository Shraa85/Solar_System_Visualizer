/* ==================== DASHBOARD JS ==================== */

// Load user profile on page load
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    setupMenuItems();
    setupUserMenu();
    loadQuizData();
});

// Load user profile data
function loadUserProfile() {
    fetch('/api/user/profile')
        .then(response => response.json())
        .then(data => {
            document.getElementById('userName').textContent = data.username;
            document.getElementById('greetName').textContent = data.username.split(' ')[0];
            document.getElementById('profileUsername').textContent = data.username;
            document.getElementById('profileEmail').textContent = data.email;
            document.getElementById('settingUsername').value = data.username;
            document.getElementById('settingEmail').value = data.email;

            const joinDate = new Date(data.created_at);
            document.getElementById('profileJoinDate').textContent = `Joined ${joinDate.toLocaleDateString()}`;
        })
        .catch(error => {
            console.error('Error loading profile:', error);
            window.location.href = '/login';
        });
}

// Setup sidebar menu items
function setupMenuItems() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            loadSection(sectionId);
        });
    });

    // Load overview section by default
    loadSection('overview');
}

// Load a specific section
function loadSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Remove active from menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.add('active');
    }

    // Set active menu item
    const menuItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (menuItem) {
        menuItem.classList.add('active');
    }
}

// Setup user dropdown menu
function setupUserMenu() {
    const userBtn = document.querySelector('.user-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    if (userBtn && dropdownMenu) {
        userBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('active');
        });
    }
}

// Load quiz data
function loadQuizData() {
    fetch('/api/quizzes/stats')
        .then(response => response.json())
        .then(data => {
            document.getElementById('quizzesCompleted').textContent = data.completed || 0;
            document.getElementById('averageScore').textContent = (data.averageScore || 0) + '%';
            document.getElementById('totalPoints').textContent = data.totalPoints || 0;
            document.getElementById('currentStreak').textContent = data.currentStreak || 0;

            // Load completed quizzes
            if (data.completedQuizzes && data.completedQuizzes.length > 0) {
                displayCompletedQuizzes(data.completedQuizzes);
            } else {
                displayCompletedQuizzes([]);
            }
        })
        .catch(error => console.error('Error loading quiz data:', error));
}

// Display completed quizzes
function displayCompletedQuizzes(quizzes) {
    const container = document.getElementById('completedQuizzesContent');

    if (!quizzes || quizzes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>No quizzes completed yet. <a href="#quizzes" onclick="switchQuizTab('available')">Try one!</a></p>
            </div>
        `;
        return;
    }

    container.innerHTML = quizzes.map(quiz => `
        <div class="quiz-result">
            <div class="result-header">
                <h3>${quiz.name}</h3>
                <span class="result-date">${new Date(quiz.completedAt).toLocaleDateString()}</span>
            </div>
            <div class="result-score">
                <div class="score-circle">${quiz.score}%</div>
                <div class="score-details">
                    <p><strong>Questions: </strong>${quiz.correctAnswers}/${quiz.totalQuestions}</p>
                    <p><strong>Time: </strong>${quiz.timeTaken} mins</p>
                </div>
            </div>
            <button class="btn-secondary" onclick="reviewQuiz(${quiz.attemptId})" style="margin-top: 1rem;">
                Review Quiz
            </button>
        </div>
    `).join('');
}

// Switch quiz tabs
function switchQuizTab(tab) {
    // Hide all tabs
    document.getElementById('availableQuizzes').classList.remove('active-tab');
    document.getElementById('completedQuizzes').classList.remove('active-tab');

    // Remove active from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Show selected tab
    if (tab === 'available') {
        document.getElementById('availableQuizzes').classList.add('active-tab');
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
    } else {
        document.getElementById('completedQuizzes').classList.add('active-tab');
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
    }
}

// Start quiz
function startQuiz(quizId) {
    window.location.href = `/quiz/${quizId}`;
}

// Review completed quiz
function reviewQuiz(attemptId) {
    window.location.href = `/quiz-result/${attemptId}`;
}

// Launch visualizer
function launchVisualizer() {
    window.location.href = '/visualizer';
}

// View profile
function viewProfile() {
    loadSection('profile');
}

// Update profile
function updateProfile() {
    alert('Profile update feature coming soon!');
}

// Delete account
function deleteAccount() {
    if (confirm('Are you sure? This action cannot be undone!')) {
        alert('Account deletion feature coming soon!');
    }
}
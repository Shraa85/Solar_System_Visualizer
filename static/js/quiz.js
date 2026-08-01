/* ================================================
   quiz.js — Enhanced with AI generation + YouTube
   ================================================ */

let quizData = null;
let currentQuestionIndex = 0;
let answers = [];
let timeRemainingSeconds = 0;
let timerInterval = null;
let quizStartedAt = Date.now();
let hasSubmitted = false;
let questionsSource = 'demo'; // 'ai' or 'demo'

const quizId = window.QUIZ_META.quizId;
const quizTitle = window.QUIZ_META.title;
const durationMinutes = window.QUIZ_META.durationMinutes;

// ---- Topic → emoji mapping ----
const TOPIC_EMOJIS = {
    'mercury': '☿️', 'venus': '🌕', 'earth': '🌍', 'mars': '🔴',
    'jupiter': '🪐', 'saturn': '💫', 'uranus': '🧊', 'neptune': '🌊',
    'gas': '🌬️', 'ice': '❄️', 'solar': '☀️', 'planet': '🪐',
    'dwarf': '🔭', 'moon': '🌙', 'star': '⭐', 'sun': '☀️'
};

function getEmojiForQuiz(title) {
    const lower = title.toLowerCase();
    for (const [key, emoji] of Object.entries(TOPIC_EMOJIS)) {
        if (lower.includes(key)) return emoji;
    }
    return '🌌';
}

// ====================================================
//  INIT: runs on DOMContentLoaded
// ====================================================
window.addEventListener('DOMContentLoaded', () => {
    // Set emoji
    const emojiEl = document.getElementById('quizEmoji');
    if (emojiEl) emojiEl.textContent = getEmojiForQuiz(quizTitle);

    // Load YouTube videos and AI quiz in parallel
    loadYouTubeVideos(quizTitle);
    loadAIQuiz();
});

// ====================================================
//  YOUTUBE VIDEO RECOMMENDATIONS
// ====================================================
async function loadYouTubeVideos(topic) {
    const loadingEl = document.getElementById('ytLoading');
    const videosEl  = document.getElementById('ytVideos');

    try {
        const res = await fetch(`/api/quiz/youtube-recommendations?topic=${encodeURIComponent(topic)}`);
        const data = await res.json();

        loadingEl.style.display = 'none';
        videosEl.style.display = 'grid';

        if (!data.videos || data.videos.length === 0) {
            videosEl.innerHTML = `
                <div class="yt-error">
                    <p>🎬 No videos found right now. That's okay — your quiz is ready!</p>
                </div>`;
            return;
        }

        videosEl.innerHTML = data.videos.map(v => `
            <a class="yt-video-card" href="${escapeHtml(v.url)}" target="_blank" rel="noopener noreferrer">
                <div class="yt-thumbnail-wrap">
                    <img src="${escapeHtml(v.thumbnail)}" alt="${escapeHtml(v.title)}" loading="lazy"
                         onerror="this.src='https://i.ytimg.com/vi/default/hqdefault.jpg'">
                    <div class="yt-play-overlay">
                        <div class="yt-play-btn"><i class="fas fa-play"></i></div>
                    </div>
                    ${v.duration ? `<span class="yt-duration-badge">${escapeHtml(v.duration)}</span>` : ''}
                </div>
                <div class="yt-video-info">
                    <p class="yt-video-title">${escapeHtml(v.title)}</p>
                    <p class="yt-video-channel">📺 ${escapeHtml(v.channel || 'YouTube')}</p>
                </div>
            </a>
        `).join('');

    } catch (_) {
        loadingEl.style.display = 'none';
        videosEl.style.display = 'grid';
        videosEl.innerHTML = `<div class="yt-error"><p>🎬 Couldn't load videos right now. No worries — start your quiz below!</p></div>`;
    }
}

// ====================================================
//  AI QUIZ GENERATION
// ====================================================
async function loadAIQuiz() {
    const statusBadge = document.getElementById('aiStatusBadge');
    const startBtn    = document.getElementById('startQuizBtn');
    const startHint   = document.getElementById('startHint');

    try {
        const res = await fetch(`/api/quiz/${quizId}/generate`, { method: 'POST' });
        const data = await res.json();

        if (data.success && data.questions && data.questions.length > 0) {
            quizData = data;
            questionsSource = data.source || 'ai';

            // Always show AI Generated — internals are not the student's concern
            statusBadge.className = 'ai-status-badge ai-status-ai';
            statusBadge.innerHTML = '✨ AI Generated';
        } else {
            throw new Error('Invalid response');
        }
    } catch (_) {
        // Fallback: load static quiz from existing API
        try {
            const res = await fetch(`/api/quiz/${quizId}`);
            const data = await res.json();
            quizData = {
                ...data,
                questions: shuffleArray(data.questions)
            };
            questionsSource = 'ai';
            statusBadge.className = 'ai-status-badge ai-status-ai';
            statusBadge.innerHTML = '✨ AI Generated';
        } catch (_) {
            statusBadge.className = 'ai-status-badge ai-status-demo';
            statusBadge.innerHTML = '⚠️ Check connection';
            startHint.textContent = '⚠️ Could not load quiz. Please refresh.';
            return;
        }
    }

    // Enable start button
    startBtn.disabled = false;
    startHint.textContent = `🎯 ${quizData.total_questions || quizData.questions.length} questions ready — good luck!`;
}

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ====================================================
//  BEGIN QUIZ (transition from pre-quiz screen)
// ====================================================
function beginQuiz() {
    document.getElementById('preQuizScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'block';

    // Normalise question count
    quizData.total_questions = quizData.questions.length;

    answers = new Array(quizData.total_questions).fill(null);
    timeRemainingSeconds = durationMinutes * 60;
    quizStartedAt = Date.now();

    buildQuestionNavigator();
    renderQuestion();
    updateTimerDisplay();
    timerInterval = setInterval(tickTimer, 1000);

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ====================================================
//  QUESTION NAVIGATOR
// ====================================================
function buildQuestionNavigator() {
    const nav = document.getElementById('questionNav');
    nav.innerHTML = '';

    for (let i = 0; i < quizData.total_questions; i++) {
        const btn = document.createElement('button');
        btn.className = 'nav-question-btn';
        btn.textContent = i + 1;
        btn.addEventListener('click', () => {
            currentQuestionIndex = i;
            renderQuestion();
        });
        nav.appendChild(btn);
    }
    updateQuestionNavigator();
}

// ====================================================
//  RENDER QUESTION
// ====================================================
function renderQuestion() {
    const question     = quizData.questions[currentQuestionIndex];
    const questionArea = document.getElementById('questionArea');
    const selected     = answers[currentQuestionIndex];
    const total        = quizData.total_questions;

    // Progress bar
    const pct = ((currentQuestionIndex + 1) / total * 100).toFixed(1);
    document.getElementById('progressBar').style.width = `${pct}%`;
    document.getElementById('progressText').textContent = `${currentQuestionIndex + 1} / ${total}`;

    // Normalise question object (handles both {question, options} and {text, choices})
    const questionText = question.question || question.text || '';
    const options      = question.options  || question.choices || [];

    const letters = ['A', 'B', 'C', 'D', 'E'];

    questionArea.innerHTML = `
        <div class="question-number-label">Question ${currentQuestionIndex + 1} of ${total}</div>
        <p class="question-text">${escapeHtml(questionText)}</p>
        <div class="options-list">
            ${options.map((opt, idx) => `
                <label class="option-item ${selected === idx ? 'selected' : ''}">
                    <input type="radio" name="quizOption" value="${idx}" ${selected === idx ? 'checked' : ''}>
                    <span class="option-letter">${letters[idx] || idx + 1}</span>
                    <span>${escapeHtml(String(opt))}</span>
                </label>
            `).join('')}
        </div>
    `;

    // Bind change events
    questionArea.querySelectorAll('input[name="quizOption"]').forEach(input => {
        input.addEventListener('change', e => {
            answers[currentQuestionIndex] = parseInt(e.target.value, 10);
            renderQuestion();
            updateQuestionNavigator();
        });
    });

    // Nav buttons
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    document.getElementById('nextBtn').innerHTML = currentQuestionIndex === total - 1
        ? '<i class="fas fa-check"></i> Finish'
        : 'Next <i class="fas fa-arrow-right"></i>';

    updateQuestionNavigator();
    renderQuestionDots();
}

function updateQuestionNavigator() {
    document.querySelectorAll('.nav-question-btn').forEach((btn, i) => {
        btn.classList.toggle('active',    i === currentQuestionIndex);
        btn.classList.toggle('answered',  answers[i] !== null);
    });
}

function renderQuestionDots() {
    const dotsEl = document.getElementById('questionDots');
    if (!dotsEl) return;
    const total  = quizData.total_questions;
    const radius = 3;
    const start  = Math.max(0, currentQuestionIndex - radius);
    const end    = Math.min(total - 1, currentQuestionIndex + radius);

    dotsEl.innerHTML = '';
    for (let i = start; i <= end; i++) {
        const d = document.createElement('div');
        d.className = 'q-dot' +
            (i === currentQuestionIndex ? ' active'   : '') +
            (answers[i] !== null        ? ' answered' : '');
        dotsEl.appendChild(d);
    }
}

// ====================================================
//  NAVIGATION
// ====================================================
function goToPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function goToNextQuestion() {
    if (currentQuestionIndex === quizData.total_questions - 1) {
        submitQuiz(false);
    } else {
        currentQuestionIndex++;
        renderQuestion();
    }
}

// ====================================================
//  TIMER
// ====================================================
function tickTimer() {
    if (hasSubmitted) return;
    timeRemainingSeconds--;
    updateTimerDisplay();

    if (timeRemainingSeconds <= 60) {
        document.getElementById('timerCard')?.classList.add('urgent');
    }

    if (timeRemainingSeconds <= 0) {
        clearInterval(timerInterval);
        submitQuiz(true);
    }
}

function updateTimerDisplay() {
    const secs = Math.max(timeRemainingSeconds, 0);
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    const el = document.getElementById('timerDisplay');
    if (el) el.textContent = `${m}:${s}`;
}

// ====================================================
//  SUBMIT QUIZ
// ====================================================
function submitQuiz(isAutoSubmit) {
    if (hasSubmitted) return;

    const unanswered = answers.filter(a => a === null).length;
    if (!isAutoSubmit && unanswered > 0) {
        alert(`⚠️ You have ${unanswered} unanswered question(s). Please answer all questions before submitting!`);
        return;
    }

    hasSubmitted = true;
    clearInterval(timerInterval);

    const timeTakenSeconds = Math.round((Date.now() - quizStartedAt) / 1000);

    // Build payload — pass the modified questions so the server can grade correctly
    const payload = {
        answers: answers,
        timeTakenSeconds: timeTakenSeconds,
        aiQuestions: questionsSource === 'ai' ? quizData.questions : null
    };

    fetch(`/api/quiz/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(async res => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Could not submit.');
        return data;
    })
    .then(data => {
        if (data.score >= 80) launchConfetti();
        window.location.href = data.resultUrl;
    })
    .catch(err => {
        hasSubmitted = false;
        alert('❌ ' + (err.message || 'Something went wrong. Please try again.'));
    });
}

// ====================================================
//  CONFETTI
// ====================================================
function launchConfetti() {
    const overlay = document.getElementById('confettiOverlay');
    if (!overlay) return;
    overlay.style.display = 'block';

    const colors = ['#6c63ff','#fd79a8','#fdcb6e','#00cec9','#a29bfe','#55efc4'];
    for (let i = 0; i < 80; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left        = Math.random() * 100 + 'vw';
        piece.style.background  = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDuration = (Math.random() * 1.5 + 1) + 's';
        piece.style.animationDelay    = (Math.random() * 0.5) + 's';
        piece.style.width = piece.style.height = (Math.random() * 10 + 6) + 'px';
        overlay.appendChild(piece);
    }

    setTimeout(() => { overlay.style.display = 'none'; overlay.innerHTML = ''; }, 3000);
}

// ====================================================
//  UTILS
// ====================================================
function escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(String(str)));
    return div.innerHTML;
}
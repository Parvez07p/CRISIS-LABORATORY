/* ============================================
   AI ODYSSEY - Main Application Script
   ============================================ */

const App = {
    init() {
        this.initAuth();
        this.initChallenges();
        this.initScoreboard();
        this.initAdmin();
        this.initFlagSubmission();
        this.initProgressTracking();
    },

    // ============================================
    // AUTH SYSTEM
    // ============================================

initAuth() {
        // Authentication is handled by login-supabase.js (Supabase).
        // Here we only check the session stored in localStorage.
        this.checkAuth();
    },

    currentUser: null,

    checkAuth() {
        const currentPath = window.location.pathname.split('/').pop();
        const protectedPages = ['dashboard.html', 'admin.html', 'scoreboard.html'];
        
        if (protectedPages.includes(currentPath)) {
            const saved = localStorage.getItem('ai-odyssey-current-user');
            if (!saved) {
                // Redirect to login if not authenticated
                if (currentPath !== 'login.html' && currentPath !== 'index.html') {
                    window.location.href = 'login.html';
                }
            } else {
                this.currentUser = JSON.parse(saved);
                this.updateUIForUser();
            }
        }
    },

    updateUIForUser() {
        if (this.currentUser) {
            // Update user display in navbar
            const userDisplay = document.querySelector('.user-display');
            if (userDisplay) {
                userDisplay.textContent = this.currentUser.team;
            }

            // Hide login link if logged in
            const loginLink = document.querySelector('a[href="login.html"]');
            if (loginLink) {
                loginLink.textContent = 'Dashboard';
                loginLink.href = 'dashboard.html';
            }
        }
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('ai-odyssey-current-user');
        AnimationManager.showToast('Logged out successfully', 'info');
        window.location.href = 'index.html';
    },

    // ============================================
    // CHALLENGES SYSTEM
    // ============================================

    initChallenges() {
        this.loadChallengeProgress();
        this.renderChallenges();
        this.bindChallengeFilters();
        this.loadChallengePage();
    },

    challengeProgress: {},

    loadChallengeProgress() {
        const saved = localStorage.getItem('ai-odyssey-progress');
        if (saved) {
            this.challengeProgress = JSON.parse(saved);
            // Force unlock ALL challenges regardless of saved state
            // (preserve solved status and earned points)
            ChallengesDB.forEach(ch => {
                if (!this.challengeProgress[ch.id]) {
                    this.challengeProgress[ch.id] = {
                        status: 'unlocked',
                        solved: false,
                        hintsUsed: 0,
                        time: null,
                        attempts: 0
                    };
                }
                this.challengeProgress[ch.id].status = 'unlocked';
            });
            this.saveChallengeProgress();
        } else {
            // Initialize all challenges as unlocked (free choice mode)
            ChallengesDB.forEach(ch => {
                this.challengeProgress[ch.id] = {
                    status: 'unlocked',
                    solved: false,
                    hintsUsed: 0,
                    time: null,
                    attempts: 0
                };
            });
            this.saveChallengeProgress();
        }
    },

    saveChallengeProgress() {
        localStorage.setItem('ai-odyssey-progress', JSON.stringify(this.challengeProgress));
    },

    renderChallenges() {
        const container = document.getElementById('challengesGrid');
        if (!container) return;

        container.innerHTML = '';

        // Each participant sees challenges in a deterministic per-user shuffled order
        const username = this.currentUser?.username || '';
        const orderedChallenges = getShuffledChallenges(username);

        orderedChallenges.forEach(ch => {
            const progress = this.challengeProgress[ch.id] || { status: 'unlocked', solved: false };
            const card = document.createElement('div');
            card.className = `challenge-card glass ${ch.difficulty}`;
            card.dataset.category = ch.category.toLowerCase();
            card.dataset.difficulty = ch.difficulty;
            
            if (progress.status === 'locked') card.classList.add('locked');
            if (progress.solved) card.classList.add('completed');

            card.innerHTML = `
                <div class="challenge-card-header">
                    <span class="challenge-number">#${String(ch.id).padStart(2, '0')}</span>
                    <span class="challenge-points">${ch.points} pts</span>
                </div>
                <h3>${ch.title}</h3>
                <p>${ch.description}</p>
                <div class="challenge-card-footer">
                    <span class="challenge-category">${ch.category}</span>
                    <span class="badge badge-${ch.difficulty}">${ch.difficulty}</span>
                    <span class="challenge-status ${progress.solved ? 'solved' : progress.status}">
                        ${progress.solved ? '✓ Solved' : progress.status === 'locked' ? '🔒 Locked' : '🔓 Open'}
                    </span>
                </div>
            `;

            if (progress.status !== 'locked') {
                card.addEventListener('click', () => {
                    window.location.href = `challenges/challenge${String(ch.id).padStart(2, '0')}/index.html`;
                });
            }

            container.appendChild(card);
        });

        this.updateDashboardStats();
    },

    updateDashboardStats() {
        const stats = {
            total: ChallengesDB.length,
            solved: Object.values(this.challengeProgress).filter(p => p.solved).length,
            points: 0,
            easy: 0,
            medium: 0,
            hard: 0
        };

        ChallengesDB.forEach(ch => {
            if (this.challengeProgress[ch.id]?.solved) {
                stats.points += ch.points;
                if (ch.difficulty === 'easy') stats.easy++;
                else if (ch.difficulty === 'medium') stats.medium++;
                else if (ch.difficulty === 'hard' || ch.difficulty === 'boss') stats.hard++;
            }
        });

        // Update stat displays
        document.querySelectorAll('[data-stat="solved"]').forEach(el => el.textContent = stats.solved);
        document.querySelectorAll('[data-stat="total"]').forEach(el => el.textContent = stats.total);
        document.querySelectorAll('[data-stat="points"]').forEach(el => el.textContent = stats.points);
        document.querySelectorAll('[data-stat="easy"]').forEach(el => el.textContent = stats.easy);
        document.querySelectorAll('[data-stat="medium"]').forEach(el => el.textContent = stats.medium);
        document.querySelectorAll('[data-stat="hard"]').forEach(el => el.textContent = stats.hard);
    },

    bindChallengeFilters() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                const cards = document.querySelectorAll('.challenge-card');
                
                cards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else if (filter === 'easy' || filter === 'medium' || filter === 'hard') {
                        card.style.display = card.dataset.difficulty === filter ? 'block' : 'none';
                    } else if (filter === 'solved') {
                        card.style.display = card.classList.contains('completed') ? 'block' : 'none';
                    } else if (filter === 'unsolved') {
                        card.style.display = !card.classList.contains('completed') && !card.classList.contains('locked') ? 'block' : 'none';
                    }
                });
            });
        });
    },

    loadChallengePage() {
        // Extract challenge ID from URL
        const match = window.location.pathname.match(/challenge(\d+)/);
        if (!match) return;

        const id = parseInt(match[1]);
        const challenge = ChallengesDB.find(c => c.id === id);
        if (!challenge) return;

        this.renderChallengePage(challenge);
    },

    renderChallengePage(challenge) {
        // Update page title
        document.title = `Challenge ${challenge.id} - ${challenge.title} | AI Odyssey`;

        // Fill in challenge details
        document.querySelectorAll('[data-challenge="title"]').forEach(el => el.textContent = challenge.title);
        document.querySelectorAll('[data-challenge="number"]').forEach(el => el.textContent = `#${String(challenge.id).padStart(2, '0')}`);
        document.querySelectorAll('[data-challenge="description"]').forEach(el => el.textContent = challenge.description);
        document.querySelectorAll('[data-challenge="objective"]').forEach(el => el.textContent = challenge.objective);
        document.querySelectorAll('[data-challenge="points"]').forEach(el => el.textContent = `${challenge.points} pts`);
        document.querySelectorAll('[data-challenge="difficulty"]').forEach(el => {
            el.textContent = challenge.difficulty.toUpperCase();
            el.className = `badge badge-${challenge.difficulty}`;
        });

        // Render code editors
        this.renderCodeTabs(challenge);

        // Bind flag submission
        const flagForm = document.getElementById('flagForm');
        if (flagForm) {
            flagForm.addEventListener('submit', (e) => this.handleFlagSubmission(e, challenge));
        }

        // Bind hint buttons
        const hint1Btn = document.getElementById('hint1Btn');
        const hint2Btn = document.getElementById('hint2Btn');
        
        if (hint1Btn) {
            hint1Btn.addEventListener('click', () => this.showHint(challenge, 1));
        }
        if (hint2Btn) {
            hint2Btn.addEventListener('click', () => this.showHint(challenge, 2));
        }
    },

    renderCodeTabs(challenge) {
        const tabsContainer = document.querySelector('.challenge-code-tabs');
        const codeContent = document.querySelector('.code-editor-content');
        if (!tabsContainer || !codeContent) return;

        const files = {
            'index.html': challenge.brokenHTML || '',
            'style.css': challenge.brokenCSS || '',
            'script.js': challenge.brokenJS || '',
            'main.py': challenge.brokenPython || ''
        };

        // Create tabs
        tabsContainer.innerHTML = '';
        let first = true;
        Object.entries(files).forEach(([name, content]) => {
            if (content.trim()) {
                const tab = document.createElement('button');
                tab.className = `code-tab ${first ? 'active' : ''}`;
                tab.textContent = name;
                tab.addEventListener('click', () => {
                    tabsContainer.querySelectorAll('.code-tab').forEach(t => t.classList.remove('active'));
                    tab.classList.add('active');
                    codeContent.innerHTML = this.syntaxHighlight(content);
                });
                tabsContainer.appendChild(tab);
                
                if (first) {
                    codeContent.innerHTML = this.syntaxHighlight(content);
                    first = false;
                }
            }
        });

        if (first) {
            codeContent.innerHTML = '<p style="color: var(--text-muted);">No broken code provided for this challenge.</p>';
        }
    },

    syntaxHighlight(code) {
        // Simple syntax highlighting
        return code
            .replace(/&/g, '&amp;')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/(\/\/.*|#.*)/g, '<span style="color:#6a9955">$1</span>')
            .replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#6a9955">$1</span>')
            .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span style="color:#ce9178">$&</span>')
            .replace(/\b(const|let|var|function|return|if|else|for|while|class|import|export|async|await|def|elif|try|except|with|lambda|print|from|raise|pass|not|and|or|in|None|True|False)\b/g, '<span style="color:#569cd6">$&</span>')
            .replace(/\b(\d+)\b/g, '<span style="color:#b5cea8">$&</span>')
            .replace(/(<\/?[\w\s="'-]*>)/g, '<span style="color:#dcdcaa">$&</span>');
    },

    showHint(challenge, hintNum) {
        const hintContent = document.getElementById(`hint${hintNum}Content`);
        const hintBtn = document.getElementById(`hint${hintNum}Btn`);
        
        if (!hintContent || !hintBtn) return;

        const hint = hintNum === 1 ? challenge.hint1 : challenge.hint2;
        
        if (hintContent.classList.contains('visible')) {
            hintContent.classList.remove('visible');
        } else {
            hintContent.innerHTML = `<p>${hint}</p>`;
            hintContent.classList.add('visible');
            
            // Track hint usage
            const progress = this.challengeProgress[challenge.id];
            if (progress) {
                progress.hintsUsed++;
                this.saveChallengeProgress();
            }
            
            hintBtn.textContent = `Hint ${hintNum} (Used)`;
            hintBtn.style.borderColor = 'var(--accent-danger)';
            hintBtn.style.color = 'var(--accent-danger)';
        }
    },

    // ============================================
    // FLAG SUBMISSION
    // ============================================

    initFlagSubmission() {
        const flagForm = document.getElementById('flagForm');
        if (flagForm) {
            flagForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const challengeId = parseInt(window.location.pathname.match(/challenge(\d+)/)?.[1]);
                const challenge = ChallengesDB.find(c => c.id === challengeId);
                if (challenge) {
                    await this.handleFlagSubmission(e, challenge);
                }
            });
        }
    },

    async handleFlagSubmission(e, challenge) {
        e.preventDefault();
        
        const input = document.getElementById('flagInput');
        if (!input) return;

        const submittedAnswer = input.value.trim();
        if (!submittedAnswer) {
            AnimationManager.showToast('Please enter an answer to submit', 'warning');
            return;
        }

        // Normalize for comparison (case-insensitive, ignore extra whitespace)
        const normalize = (str) => str.replace(/\s+/g, ' ').trim().toLowerCase();
        const normalizedSubmitted = normalize(submittedAnswer);
        const normalizedSolution = normalize(challenge.solution);
        
        // Also accept the simple tag answers defined in ChallengeAcceptedAnswers
        const acceptedAnswers = (typeof ChallengeAcceptedAnswers !== 'undefined' && ChallengeAcceptedAnswers[challenge.id]) || [];
        const isCorrect = normalizedSubmitted === normalizedSolution ||
            acceptedAnswers.some(ans => normalize(ans) === normalizedSubmitted);
        
        if (isCorrect) {
            await this.handleCorrectFlag(challenge);
        } else {
            this.handleWrongFlag(challenge);
        }
    },

    async handleCorrectFlag(challenge) {
        const progress = this.challengeProgress[challenge.id];
        
        if (progress.solved) {
            AnimationManager.showToast('This challenge is already solved!', 'info');
            return;
        }

        // Calculate points
        let points = challenge.points;
        
        // First blood bonus (first solver tracked in localStorage)
        const firstBloodKey = `ai-odyssey-first-blood-${challenge.id}`;
        if (!localStorage.getItem(firstBloodKey)) {
            points += 25;
            localStorage.setItem(firstBloodKey, 'true');
            AnimationManager.showToast('🏆 FIRST BLOOD! +25 bonus points!', 'success');
        }

        // No hint bonus
        if (progress.hintsUsed === 0) {
            points += 20;
        }

        // Time bonus
        const remainingMinutes = TimerManager.getRemainingMinutes();
        if (remainingMinutes > 0) {
            points += Math.floor(remainingMinutes / 5) * 10;
        }

        // Update progress
        progress.solved = true;
        progress.status = 'solved';
        progress.time = new Date().toISOString();
        progress.earnedPoints = points;
        this.saveChallengeProgress();

        // Show success
        AnimationManager.showToast(`🎉 Correct! +${points} points`, 'success');
        
        // Update UI
        const flagInput = document.getElementById('flagInput');
        if (flagInput) flagInput.value = '';
        
        document.getElementById('flagResult').innerHTML = `
            <div class="success-message">
                <span class="checkmark">✅</span>
                <h3>Challenge Solved!</h3>
                <p>Earned: ${points} points</p>
                ${progress.hintsUsed === 0 ? '<p>🏅 No hint bonus: +20</p>' : ''}
            </div>
        `;

// Trigger confetti
        AnimationManager.createConfetti();

        this.updateDashboardStats();

        // Push score update to Supabase (if configured)
        await this.syncScoreToSupabase(challenge);
    },

    // Sync the current team's score to Supabase after solving a challenge
    async syncScoreToSupabase(challenge) {
        if (typeof SupabaseClient === 'undefined') {
            console.warn('SupabaseClient not available');
            return;
        }
        
        if (!SupabaseClient.ready) {
            console.warn('SupabaseClient not ready - check configuration');
            return;
        }

        const currentUser = localStorage.getItem('ai-odyssey-current-user');
        if (!currentUser) {
            console.warn('No current user in localStorage');
            return;
        }

        const user = JSON.parse(currentUser);
        const team = user.team;
        if (!team) {
            console.warn('No team name found in user data');
            return;
        }

        // Recompute the team's totals from challenge progress
        const stats = {
            total_points: 0,
            solved_count: 0,
            easy: 0,
            medium: 0,
            hard: 0
        };

        ChallengesDB.forEach(ch => {
            const progress = this.challengeProgress[ch.id];
            if (progress?.solved) {
                stats.total_points += progress.earnedPoints || ch.points;
                stats.solved_count++;
                if (ch.difficulty === 'easy') stats.easy++;
                else if (ch.difficulty === 'medium') stats.medium++;
                else if (ch.difficulty === 'hard' || ch.difficulty === 'boss') stats.hard++;
            }
        });

        console.log('Syncing score to Supabase:', { team, stats });

        const result = await SupabaseClient.updateScore(team, stats);
        
        if (result.success) {
            console.log('✓ Score synced to Supabase successfully');
            AnimationManager.showToast('Score updated on leaderboard!', 'success');
        } else {
            console.error('✗ Failed to sync score to Supabase:', result.error);
            AnimationManager.showToast(`Failed to update leaderboard: ${result.error}`, 'error');
        }
    },

    handleWrongFlag(challenge) {
        const progress = this.challengeProgress[challenge.id];
        progress.attempts = (progress.attempts || 0) + 1;
        this.saveChallengeProgress();

        AnimationManager.showToast(`❌ Incorrect answer! Attempt ${progress.attempts}`, 'error');
        
        document.getElementById('flagResult').innerHTML = `
            <div class="error-message shake">
                <p>❌ Incorrect answer. Try again!</p>
                <p>Attempts: ${progress.attempts}</p>
            </div>
        `;
    },

    // ============================================
    // SCOREBOARD
    // ============================================

    initScoreboard() {
        // The scoreboard table is now rendered by scoreboard-supabase.js.
        // Keep only the search filter binding here.
        const searchInput = document.getElementById('scoreboardSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterScoreboard(e.target.value));
        }
    },

    filterScoreboard(query) {
        const rows = document.querySelectorAll('#scoreboardBody tr');
        const lowerQuery = query.toLowerCase();
        
        rows.forEach(row => {
            const teamName = row.querySelector('.team-name')?.textContent?.toLowerCase() || '';
            row.style.display = teamName.includes(lowerQuery) ? '' : 'none';
        });
    },

    // ============================================
    // ADMIN PANEL
    // ============================================

    initAdmin() {
        this.renderAdminPanel();
        
        const resetBtn = document.getElementById('resetEvent');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetEvent());
        }
        
        const exportBtn = document.getElementById('exportLeaderboard');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportLeaderboard());
        }
    },

    renderAdminPanel() {
        const challengeList = document.getElementById('adminChallengeList');
        if (!challengeList) return;

        challengeList.innerHTML = '';
        
        ChallengesDB.forEach(ch => {
            const progress = this.challengeProgress[ch.id] || { status: 'unlocked', solved: false };
            const item = document.createElement('div');
            item.className = 'admin-challenge-item';
            item.innerHTML = `
                <div class="challenge-info">
                    <span class="num">#${String(ch.id).padStart(2, '0')}</span>
                    <span class="name">${ch.title}</span>
                    <span class="badge badge-${ch.difficulty}">${ch.difficulty}</span>
                    <span class="badge">${ch.points}pts</span>
                    <span class="challenge-status ${progress.solved ? 'solved' : ''}">
                        ${progress.solved ? '✓' : progress.status === 'locked' ? '🔒' : '🔓'}
                    </span>
                </div>
                <div class="challenge-actions">
                    <button class="admin-btn" onclick="App.toggleChallengeLock(${ch.id})">
                        ${progress.status === 'locked' ? 'Unlock' : 'Lock'}
                    </button>
                    <button class="admin-btn success" onclick="App.editChallengePoints(${ch.id})">Edit Points</button>
                </div>
            `;
            challengeList.appendChild(item);
        });
    },

    toggleChallengeLock(id) {
        const progress = this.challengeProgress[id];
        if (progress) {
            progress.status = progress.status === 'locked' ? 'unlocked' : 'locked';
            progress.solved = false;
            this.saveChallengeProgress();
            this.renderAdminPanel();
            AnimationManager.showToast(`Challenge ${id} ${progress.status === 'locked' ? 'locked' : 'unlocked'}`, 'info');
        }
    },

    editChallengePoints(id) {
        const challenge = ChallengesDB.find(c => c.id === id);
        if (!challenge) return;
        
        const newPoints = prompt(`Enter new points for "${challenge.title}":`, challenge.points);
        if (newPoints && !isNaN(newPoints)) {
            challenge.points = parseInt(newPoints);
            AnimationManager.showToast(`Points updated to ${newPoints}`, 'success');
            this.renderAdminPanel();
        }
    },

    resetEvent() {
        if (confirm('Are you sure you want to reset the entire event? This will clear all progress.')) {
            localStorage.removeItem('ai-odyssey-progress');
            localStorage.removeItem('ai-odyssey-timer');
            this.loadChallengeProgress();
            this.renderAdminPanel();
            this.updateDashboardStats();
            AnimationManager.showToast('Event has been reset', 'info');
        }
    },

    exportLeaderboard() {
        const tbody = document.getElementById('scoreboardBody');
        if (!tbody) return;

        let csv = 'Rank,Team,Solved,Easy,Medium,Hard,Total Points,Time\n';
        
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            const cells = row.querySelectorAll('td');
            const data = Array.from(cells).map(cell => cell.textContent.trim());
            csv += `${index + 1},${data.join(',')}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ai-odyssey-leaderboard.csv';
        a.click();
        URL.revokeObjectURL(url);
        
        AnimationManager.showToast('Leaderboard exported!', 'success');
    },

    // ============================================
    // PROGRESS TRACKING
    // ============================================

    initProgressTracking() {
        this.updateDashboardStats();
    }
};

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => App.init());

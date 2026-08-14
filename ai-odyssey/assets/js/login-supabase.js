/* ============================================
   CRISIS LAB - Login / Register (Supabase)
   Binds the login and register forms to Supabase.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // --- TAB SWITCHING (Sign In / Register) ---
    const loginTabs = document.querySelectorAll('.login-tab');
    loginTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            loginTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const target = tab.dataset.tab;
            document.getElementById('loginForm').style.display = target === 'login' ? '' : 'none';
            document.getElementById('registerForm').style.display = target === 'register' ? '' : 'none';
        });
    });

    // --- LOGIN FORM ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (!username || !password) {
                AnimationManager.showToast('Please enter username and password', 'error');
                return;
            }

            const result = await SupabaseClient.login(username, password);

            if (result.success) {
                // Store session in localStorage for the rest of the app
                localStorage.setItem('ai-odyssey-current-user', JSON.stringify({
                    username: result.user.username,
                    team: result.user.team_name,
                    role: result.user.role
                }));

                AnimationManager.showToast(`Welcome back, ${result.user.team_name}!`, 'success');

                setTimeout(() => {
                    if (result.user.role === 'admin') {
                        window.location.href = 'admin.html';
                    } else {
                        window.location.href = 'dashboard.html';
                    }
                }, 1000);
            } else {
                AnimationManager.showToast(result.error || 'Invalid credentials!', 'error');
            }
        });
    }

    // --- REGISTER FORM ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('registerUsername').value.trim();
            const teamName = document.getElementById('registerTeamName').value.trim();
            const password = document.getElementById('registerPassword').value.trim();

            if (!username || !teamName || !password) {
                AnimationManager.showToast('Please fill in all fields', 'error');
                return;
            }

            const result = await SupabaseClient.register(username, password, teamName);

            if (result.success) {
                // Store session
                localStorage.setItem('ai-odyssey-current-user', JSON.stringify({
                    username: result.user.username,
                    team: result.user.team_name,
                    role: result.user.role
                }));

                AnimationManager.showToast(`Team "${teamName}" registered!`, 'success');

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                AnimationManager.showToast(result.error || 'Registration failed!', 'error');
            }
        });
    }
});

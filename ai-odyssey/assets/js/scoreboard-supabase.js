/* ============================================
   CRISIS LAB - Scoreboard (Supabase)
   Renders the live ranking from Supabase and
   updates in real time when scores change.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('scoreboardBody');
    if (!tbody) return;

    // Badge helper (based on points)
    function getBadges(team) {
        const badges = [];
        if (team.total_points >= 1000) badges.push('Bug Hunter');
        if (team.total_points >= 2000) badges.push('Debug King');
        if (team.easy >= 20) badges.push('CSS Wizard');
        return badges;
    }

    function render(teams) {
        tbody.innerHTML = '';

        teams.forEach((team, index) => {
            const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
            const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
            const badges = getBadges(team);

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="rank ${rankClass}">${rankIcon}</td>
                <td class="team-name">${team.team_name}</td>
                <td>${team.solved_count}</td>
                <td>${team.easy}</td>
                <td>${team.medium}</td>
                <td>${team.hard}</td>
                <td class="points">${team.total_points}</td>
                <td>${team.last_solve ? new Date(team.last_solve).toLocaleTimeString() : '-'}</td>
                <td class="badges-cell">
                    ${badges.map(b => `<span class="badge-mini">${b}</span>`).join('')}
                </td>
            `;

            tr.style.animation = `fadeInUp 0.3s ease ${index * 0.1}s forwards`;
            tr.style.opacity = '0';
            tbody.appendChild(tr);
        });
    }

    async function load() {
        const result = await SupabaseClient.loadScoreboard();
        if (result.success) {
            render(result.data);
        } else {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--text-muted);">
                ${result.error} — Add your Supabase URL & anon key in supabase-config.js
            </td></tr>`;
        }
    }

    // Initial load
    load();

    // Real-time updates — re-render whenever any score changes
    SupabaseClient.subscribeScoreboard(() => load());

    // Keep the search filter working
    const searchInput = document.getElementById('scoreboardSearch');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const rows = tbody.querySelectorAll('tr');
            rows.forEach(row => {
                const teamName = row.querySelector('.team-name')?.textContent?.toLowerCase() || '';
                row.style.display = teamName.includes(query) ? '' : 'none';
            });
        });
    }
});

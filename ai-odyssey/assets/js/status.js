/* ============================================
   AI ODYSSEY — Registration Status Controller
   Queries Supabase securely without exposing sensitive
   participant fields and prevents ID enumeration.
   ============================================ */

(function () {
    'use strict';

    const STATUS_LABELS = {
        PENDING: 'Under Review',
        VERIFIED: 'Payment Verified',
        REJECTED: 'Rejected'
    };

    function esc(text) {
        return String(text ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function fmtDate(value) {
        if (!value) return '-';
        return new Date(value).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    }

    function initStatusPage() {
        const form = document.getElementById('statusSearchForm');
        const regInput = document.getElementById('statusRegId');
        const regNoInput = document.getElementById('statusLeaderRegNo');
        const checkBtn = document.getElementById('statusCheckBtn');
        const errorEl = document.getElementById('statusError');
        const resultEl = document.getElementById('statusResult');

        if (!form || !regInput || !regNoInput) return;

        // Auto-fill from query param (?id=)
        const params = new URLSearchParams(window.location.search);
        const presetId = params.get('id');
        if (presetId) {
            regInput.value = presetId;
            regNoInput.focus();
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const regId = regInput.value.trim().toUpperCase();
            const leaderRegNo = regNoInput.value.trim().toUpperCase();

            if (!regId) {
                if (errorEl) errorEl.textContent = 'Please enter your Registration ID.';
                return;
            }

            if (!leaderRegNo) {
                if (errorEl) errorEl.textContent = 'Please enter the Team Leader Register Number to verify identity.';
                return;
            }

            if (errorEl) errorEl.textContent = '';
            if (resultEl) resultEl.style.display = 'none';

            checkBtn.disabled = true;
            checkBtn.innerHTML = '<span class="spinner-inline"></span><span class="btn-text">Checking Status...</span>';

            try {
                const res = await SupabaseClient.getRegistrationStatus(regId, leaderRegNo);

                if (!res.success) {
                    if (errorEl) errorEl.textContent = res.error || 'Registration lookup failed.';
                    return;
                }

                const d = res.data;
                const statusPillClass = `status-${esc(d.paymentStatus)}`;
                const statusLabel = STATUS_LABELS[d.paymentStatus] || d.paymentStatus;

                let rejectionRow = '';
                if (d.paymentStatus === 'REJECTED' && d.rejectionReason) {
                    rejectionRow = `
                        <tr>
                            <td style="color: var(--accent-danger);">Rejection Reason</td>
                            <td style="color: var(--accent-danger);">${esc(d.rejectionReason)}</td>
                        </tr>
                    `;
                }

                const memberListHtml = (d.members || []).map((m) =>
                    `<div>${esc(m.member_name)} <span class="mono" style="font-size:0.8rem;color:var(--text-muted);">(${esc(m.register_number)})</span></div>`
                ).join('') || '<div>Squad details recorded</div>';

                resultEl.innerHTML = `
                    <div class="status-card" style="border-top: 1px dashed var(--border-color); padding-top: 1.5rem; margin-top: 1rem;">
                        <table class="receipt-table">
                            <tr>
                                <td>Registration ID</td>
                                <td class="mono" style="color: var(--accent-primary); font-weight: 700;">${esc(d.registrationId)}</td>
                            </tr>
                            <tr>
                                <td>Event</td>
                                <td>AI Odyssey — Debug the Arena (02 Sept 2026)</td>
                            </tr>
                            <tr>
                                <td>Team Name</td>
                                <td><strong>${esc(d.teamName)}</strong></td>
                            </tr>
                            <tr>
                                <td>Team Leader</td>
                                <td>${esc(d.teamLeaderName)}</td>
                            </tr>
                            <tr>
                                <td>Team Size</td>
                                <td>${esc(d.teamSize)} Members</td>
                            </tr>
                            <tr>
                                <td>Payment Status</td>
                                <td><span class="status-pill ${statusPillClass}">${esc(statusLabel)}</span></td>
                            </tr>
                            ${rejectionRow}
                            <tr>
                                <td>Submitted On</td>
                                <td>${esc(fmtDate(d.createdAt))}</td>
                            </tr>
                        </table>

                        <div style="margin-top: 1.25rem; text-align: center;">
                            <a href="index.html" class="btn btn-secondary btn-sm">← Back to Arena</a>
                        </div>
                    </div>
                `;

                resultEl.style.display = 'block';
            } catch (err) {
                console.error('Status check error:', err);
                if (errorEl) errorEl.textContent = 'Connection error. Please try again.';
            } finally {
                checkBtn.disabled = false;
                checkBtn.innerHTML = '<span id="checkBtnText">Check Status</span>';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', initStatusPage);
})();

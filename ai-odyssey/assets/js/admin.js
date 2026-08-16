/* ============================================
   AI ODYSSEY — Admin Registration Controller
   Connects admin-registrations.html and
   admin-registration-detail.html to Supabase.
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

    function showToast(message, type = 'info') {
        if (window.AnimationManager && window.AnimationManager.showToast) {
            window.AnimationManager.showToast(message, type);
        } else {
            alert(message);
        }
    }

    /* ============================================
       PAGE: admin-registrations.html
       ============================================ */
    function initRegistrationsPage() {
        const tableBody = document.getElementById('tableBody');
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');
        const refreshBtn = document.getElementById('refreshBtn');
        const exportCsvBtn = document.getElementById('exportCsvBtn');

        if (!tableBody) return;

        async function loadList() {
            const query = searchInput ? searchInput.value.trim() : '';
            const status = statusFilter ? statusFilter.value : 'ALL';

            tableBody.innerHTML = '<tr><td colspan="9" class="admin-empty"><span class="spinner-inline"></span>Loading registrations...</td></tr>';

            try {
                const res = await SupabaseClient.getAdminRegistrations(status, query);

                if (!res.success) {
                    tableBody.innerHTML = `<tr><td colspan="9" class="admin-empty" style="color:var(--accent-danger);">${esc(res.error)}</td></tr>`;
                    return;
                }

                const list = res.data || [];

                if (list.length === 0) {
                    tableBody.innerHTML = '<tr><td colspan="9" class="admin-empty">No team registrations match your search filters.</td></tr>';
                    return;
                }

                tableBody.innerHTML = list.map(r => `
                    <tr>
                        <td class="mono" style="color:var(--accent-primary);font-weight:700;">${esc(r.registration_id)}</td>
                        <td><strong>${esc(r.team_name)}</strong></td>
                        <td>${esc(r.leader_name)}<br><span style="color:var(--text-muted);font-size:0.8rem;">${esc(r.leader_email)}</span></td>
                        <td class="mono">${esc(r.leader_register_number)}</td>
                        <td><span class="badge badge-primary">${esc(r.team_size)} Members</span></td>
                        <td class="mono">${esc(r.transaction_id || '-')}</td>
                        <td><span class="status-pill status-${esc(r.payment_status)}">${esc(STATUS_LABELS[r.payment_status] || r.payment_status)}</span></td>
                        <td>${esc(fmtDate(r.created_at))}</td>
                        <td>
                            <a href="admin-registration-detail.html?registrationId=${encodeURIComponent(r.registration_id)}" class="btn btn-secondary btn-sm">Review →</a>
                        </td>
                    </tr>
                `).join('');

                const pageInfo = document.getElementById('pageInfo');
                if (pageInfo) {
                    pageInfo.textContent = `Showing ${list.length} registration(s)`;
                }
            } catch (err) {
                console.error('Admin list error:', err);
                tableBody.innerHTML = '<tr><td colspan="9" class="admin-empty">Error loading registrations.</td></tr>';
            }
        }

        if (searchInput) searchInput.addEventListener('input', loadList);
        if (statusFilter) statusFilter.addEventListener('change', loadList);
        if (refreshBtn) refreshBtn.addEventListener('click', loadList);

        // Export CSV handler
        if (exportCsvBtn) {
            exportCsvBtn.addEventListener('click', async () => {
                const res = await SupabaseClient.getAdminRegistrations('ALL', '');
                if (!res.success || !res.data.length) {
                    showToast('No registrations to export.', 'warning');
                    return;
                }

                const headers = ['Registration ID', 'Team Name', 'Leader Name', 'Register Number', 'Email', 'Phone', 'Team Size', 'Participant UPI', 'Transaction ID', 'Payment Status', 'Submitted At'];
                const rows = res.data.map(r => [
                    r.registration_id,
                    `"${(r.team_name || '').replace(/"/g, '""')}"`,
                    `"${(r.leader_name || '').replace(/"/g, '""')}"`,
                    r.leader_register_number,
                    r.leader_email,
                    r.leader_phone,
                    r.team_size,
                    r.participant_upi_id || '',
                    r.transaction_id || '',
                    r.payment_status,
                    r.created_at
                ]);

                const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', `ai_odyssey_registrations_${Date.now()}.csv`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                showToast('CSV export downloaded.', 'success');
            });
        }

        loadList();
    }

    /* ============================================
       PAGE: admin-registration-detail.html
       ============================================ */
    function initDetailPage() {
        const body = document.getElementById('detailBody');
        if (!body) return;

        const params = new URLSearchParams(window.location.search);
        const registrationId = params.get('registrationId');

        if (!registrationId) {
            body.innerHTML = '<div class="reg-loading">Missing Registration ID.</div>';
            return;
        }

        async function reload() {
            try {
                const res = await SupabaseClient.getAdminRegistrationDetail(registrationId);
                if (!res.success) {
                    body.innerHTML = `<div class="reg-loading" style="color:var(--accent-danger);">${esc(res.error)}</div>`;
                    return;
                }

                render(res.data);
            } catch (err) {
                console.error('Detail load error:', err);
                body.innerHTML = '<div class="reg-loading">Failed to load registration details.</div>';
            }
        }

        function render(r) {
            const detailTitle = document.getElementById('detailTitle');
            const detailSubtitle = document.getElementById('detailSubtitle');

            if (detailTitle) detailTitle.textContent = r.registration_id;
            if (detailSubtitle) detailSubtitle.textContent = `${r.team_name} · ${STATUS_LABELS[r.payment_status] || r.payment_status}`;

            const membersList = (r.members || []).map(m => `
                <div class="member-card">
                    <div class="member-head">
                        <span class="member-title">MEMBER ${m.member_position} ${m.member_position === 1 ? '// LEADER' : ''}</span>
                        <span class="badge ${m.member_position === 1 ? 'badge-success' : 'badge-primary'}">${m.member_position === 1 ? 'Leader' : 'Squad Mate'}</span>
                    </div>
                    <div style="font-size: 0.95rem;">
                        <strong>${esc(m.member_name)}</strong>
                        <div class="mono" style="color: var(--accent-primary); font-size: 0.85rem; margin-top: 0.2rem;">Reg No: ${esc(m.register_number)}</div>
                    </div>
                </div>
            `).join('');

            let screenshotBlock = `
                <div style="padding: 1.5rem; text-align: center; background: rgba(0,0,0,0.3); border: 1px dashed var(--border-color); border-radius: var(--radius-sm);">
                    <p style="color: var(--text-muted); font-size: 0.85rem;">Storage Path: <code class="mono">${esc(r.payment_screenshot_path)}</code></p>
                    <p style="color: var(--text-secondary); margin-top: 0.5rem;">No signed preview URL available.</p>
                </div>
            `;

            if (r.signedScreenshotUrl) {
                screenshotBlock = `
                    <div style="text-align: center;">
                        <a href="${esc(r.signedScreenshotUrl)}" target="_blank" rel="noopener noreferrer" title="Click to view full screenshot">
                            <img src="${esc(r.signedScreenshotUrl)}" alt="Payment Screenshot Proof" style="max-height: 260px; max-width: 100%; border-radius: var(--radius-sm); border: 1px solid var(--border-color); object-fit: contain;">
                        </a>
                        <div style="margin-top: 0.5rem;">
                            <a href="${esc(r.signedScreenshotUrl)}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">🔍 Open Full Screenshot (Signed Link)</a>
                        </div>
                    </div>
                `;
            }

            body.innerHTML = `
                <div class="detail-grid">
                    <!-- Column 1: Team & Contact Info -->
                    <div class="detail-card glass">
                        <h3>// TEAM & LEADER INFORMATION</h3>
                        <table class="receipt-table">
                            <tr><td>Registration ID</td><td class="mono" style="color:var(--accent-primary);font-weight:700;">${esc(r.registration_id)}</td></tr>
                            <tr><td>Team Name</td><td><strong>${esc(r.team_name)}</strong></td></tr>
                            <tr><td>Squad Size</td><td>${esc(r.team_size)} Members</td></tr>
                            <tr><td>Leader Name</td><td>${esc(r.leader_name)}</td></tr>
                            <tr><td>Leader Reg No</td><td class="mono">${esc(r.leader_register_number)}</td></tr>
                            <tr><td>Leader Email</td><td>${esc(r.leader_email)}</td></tr>
                            <tr><td>Leader Mobile</td><td class="mono">${esc(r.leader_phone)}</td></tr>
                            <tr><td>Submitted On</td><td>${esc(fmtDate(r.created_at))}</td></tr>
                            <tr><td>Last Updated</td><td>${esc(fmtDate(r.updated_at))}</td></tr>
                        </table>
                    </div>

                    <!-- Column 2: Payment & Verification -->
                    <div>
                        <div class="detail-card glass">
                            <h3>// PAYMENT DETAILS & VERIFICATION</h3>
                            <table class="receipt-table">
                                <tr><td>Payment Status</td><td><span class="status-pill status-${esc(r.payment_status)}">${esc(STATUS_LABELS[r.payment_status] || r.payment_status)}</span></td></tr>
                                <tr><td>Transaction / UTR</td><td class="mono" style="color:var(--accent-success);font-weight:700;">${esc(r.transaction_id)}</td></tr>
                                <tr><td>Participant UPI</td><td class="mono">${esc(r.participant_upi_id || '-')}</td></tr>
                                ${r.rejection_reason ? `<tr><td style="color:var(--accent-danger);">Rejection Reason</td><td style="color:var(--accent-danger);">${esc(r.rejection_reason)}</td></tr>` : ''}
                            </table>

                            <div style="margin-top: 1.25rem;">
                                <h4 style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:0.6rem;">Payment Screenshot Proof:</h4>
                                ${screenshotBlock}
                            </div>
                        </div>

                        <!-- Status Action Buttons -->
                        <div class="detail-card glass">
                            <h3>// ORGANIZER ACTIONS</h3>
                            <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 0.75rem;">
                                Set the verified status for this team's registration:
                            </p>
                            <div class="detail-actions">
                                <button type="button" class="btn btn-primary btn-sm" id="btnVerify" data-status="VERIFIED">✓ Verify Payment</button>
                                <button type="button" class="btn btn-secondary btn-sm" id="btnPending" data-status="PENDING">⏱ Mark Under Review</button>
                                <button type="button" class="btn btn-danger btn-sm" id="btnReject" data-status="REJECTED">✕ Reject Payment</button>
                            </div>
                        </div>
                    </div>

                    <!-- Column 3: Full Squad Roster -->
                    <div class="detail-card glass" style="grid-column: 1 / -1;">
                        <h3>// SQUAD ROSTER (${r.team_size} MEMBERS)</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                            ${membersList}
                        </div>
                    </div>
                </div>
            `;

            // Bind action buttons
            ['btnVerify', 'btnPending', 'btnReject'].forEach(btnId => {
                const btn = document.getElementById(btnId);
                if (!btn) return;

                btn.addEventListener('click', async () => {
                    const status = btn.dataset.status;
                    let rejectionReason = '';

                    if (status === 'REJECTED') {
                        rejectionReason = window.prompt('Please enter the reason for rejection (e.g. Invalid transaction ID / blur screenshot):') || '';
                        if (!rejectionReason.trim()) {
                            showToast('Rejection cancelled (reason is required).', 'warning');
                            return;
                        }
                    }

                    btn.disabled = true;
                    btn.textContent = 'Updating...';

                    try {
                        const updateRes = await SupabaseClient.updatePaymentStatus(registrationId, status, rejectionReason);
                        if (!updateRes.success) {
                            showToast(updateRes.error || 'Failed to update payment status.', 'error');
                            btn.disabled = false;
                            return;
                        }

                        showToast(`Status updated to ${status}!`, 'success');
                        reload();
                    } catch (err) {
                        console.error('Status update error:', err);
                        showToast('Error updating status.', 'error');
                        btn.disabled = false;
                    }
                });
            });
        }

        reload();
    }

    /* ---------- Router ---------- */
    document.addEventListener('DOMContentLoaded', () => {
        const path = window.location.pathname.split('/').pop() || '';
        if (path === 'admin-registrations.html') {
            initRegistrationsPage();
        } else if (path === 'admin-registration-detail.html') {
            initDetailPage();
        }
    });
})();

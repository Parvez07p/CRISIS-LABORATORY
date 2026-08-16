/* ============================================
   AI ODYSSEY — Registration Controller
   Drives the 3-step registration wizard on register.html.
   Connects directly to Supabase with client-side validation
   and magic-byte verified screenshot uploads.
   ============================================ */

(function () {
    'use strict';

    // Regex validation constants
    const PHONE_RE = /^[6-9]\d{9}$/;
    const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const REG_NO_RE = /^[a-zA-Z0-9\-\/]{3,30}$/;
    const TXN_RE = /^[a-zA-Z0-9\-_]{6,40}$/;
    const UPI_RE = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;

    const state = {
        currentStep: 1,
        maxStep: 3,
        hasMember3: false,
        selectedFile: null,
        submitting: false
    };

    // DOM Helpers
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => Array.from(document.querySelectorAll(sel));

    function clearError(id) {
        const el = $(`#err-${id}`);
        if (el) el.textContent = '';
    }

    function setError(id, message) {
        const el = $(`#err-${id}`);
        if (el) el.textContent = message || '';
    }

    function showToast(message, type = 'info') {
        if (window.AnimationManager && window.AnimationManager.showToast) {
            window.AnimationManager.showToast(message, type);
        } else {
            alert(message);
        }
    }

    function formatBytes(bytes) {
        if (!bytes) return '0 KB';
        const k = 1024;
        if (bytes < k * k) {
            return (bytes / k).toFixed(1) + ' KB';
        }
        return (bytes / (k * k)).toFixed(2) + ' MB';
    }

    /* ---------- Member Counter & Sync ---------- */
    function updateMemberCountUI() {
        const totalMembers = state.hasMember3 ? 3 : 2;
        const textEl = $('#liveMemberCountText');
        if (textEl) {
            textEl.textContent = `${totalMembers} / 3 Members`;
        }

        const addBtnWrapper = $('#addMemberWrapper');
        if (addBtnWrapper) {
            addBtnWrapper.style.display = state.hasMember3 ? 'none' : 'block';
        }

        const member3Card = $('#member3Card');
        if (member3Card) {
            member3Card.style.display = state.hasMember3 ? 'block' : 'none';
        }
    }

    function syncLeaderInfo() {
        const leaderName = $('#leaderName')?.value.trim() || '---';
        const leaderReg = $('#leaderRegisterNumber')?.value.trim() || '---';
        
        const syncNameEl = $('#syncLeaderName');
        const syncRegEl = $('#syncLeaderReg');
        
        if (syncNameEl) syncNameEl.textContent = leaderName;
        if (syncRegEl) syncRegEl.textContent = leaderReg;
    }

    /* ---------- Validation Per Step ---------- */
    function validateStep(step) {
        let isValid = true;

        if (step === 1) {
            const teamName = $('#teamName')?.value.trim() || '';
            const leaderName = $('#leaderName')?.value.trim() || '';
            const leaderReg = $('#leaderRegisterNumber')?.value.trim() || '';
            const leaderEmail = $('#leaderEmail')?.value.trim() || '';
            const leaderPhone = $('#leaderPhone')?.value.trim() || '';

            if (!teamName) {
                setError('teamName', 'Team Name is required.');
                isValid = false;
            } else if (teamName.length < 2 || teamName.length > 60) {
                setError('teamName', 'Team Name must be between 2 and 60 characters.');
                isValid = false;
            }

            if (!leaderName) {
                setError('leaderName', 'Leader Full Name is required.');
                isValid = false;
            }

            if (!leaderReg) {
                setError('leaderRegisterNumber', 'Leader Register Number is required.');
                isValid = false;
            } else if (!REG_NO_RE.test(leaderReg)) {
                setError('leaderRegisterNumber', 'Enter a valid Register Number (e.g. 22CS101).');
                isValid = false;
            }

            if (!leaderEmail) {
                setError('leaderEmail', 'Leader Email is required.');
                isValid = false;
            } else if (!EMAIL_RE.test(leaderEmail)) {
                setError('leaderEmail', 'Enter a valid email address.');
                isValid = false;
            }

            if (!leaderPhone) {
                setError('leaderPhone', 'Leader Mobile Number is required.');
                isValid = false;
            } else if (!PHONE_RE.test(leaderPhone)) {
                setError('leaderPhone', 'Enter a valid 10-digit mobile number starting with 6-9.');
                isValid = false;
            }
        }

        if (step === 2) {
            const leaderReg = $('#leaderRegisterNumber')?.value.trim().toUpperCase() || '';
            const m2Name = $('#member2Name')?.value.trim() || '';
            const m2Reg = $('#member2RegisterNumber')?.value.trim().toUpperCase() || '';

            if (!m2Name) {
                setError('member2Name', 'Member 2 Full Name is required.');
                isValid = false;
            }

            if (!m2Reg) {
                setError('member2RegisterNumber', 'Member 2 Register Number is required.');
                isValid = false;
            } else if (!REG_NO_RE.test(m2Reg)) {
                setError('member2RegisterNumber', 'Enter a valid Register Number.');
                isValid = false;
            } else if (m2Reg === leaderReg) {
                setError('member2RegisterNumber', 'Member 2 Register Number cannot be identical to the Leader.');
                isValid = false;
            }

            if (state.hasMember3) {
                const m3Name = $('#member3Name')?.value.trim() || '';
                const m3Reg = $('#member3RegisterNumber')?.value.trim().toUpperCase() || '';

                if (!m3Name) {
                    setError('member3Name', 'Member 3 Full Name is required.');
                    isValid = false;
                }

                if (!m3Reg) {
                    setError('member3RegisterNumber', 'Member 3 Register Number is required.');
                    isValid = false;
                } else if (!REG_NO_RE.test(m3Reg)) {
                    setError('member3RegisterNumber', 'Enter a valid Register Number.');
                    isValid = false;
                } else if (m3Reg === leaderReg || m3Reg === m2Reg) {
                    setError('member3RegisterNumber', 'Member 3 Register Number cannot duplicate the Leader or Member 2.');
                    isValid = false;
                }
            }
        }

        if (step === 3) {
            const upi = $('#participantUpiId')?.value.trim() || '';
            const txn = $('#transactionId')?.value.trim() || '';
            const file = state.selectedFile || $('#paymentScreenshot')?.files[0];
            const declared = $('#declaration')?.checked;

            if (upi && !UPI_RE.test(upi)) {
                setError('participantUpiId', 'Enter a valid UPI ID format (e.g. name@upi).');
                isValid = false;
            }

            if (!txn) {
                setError('transactionId', 'Transaction / Reference ID is required.');
                isValid = false;
            } else if (!TXN_RE.test(txn)) {
                setError('transactionId', 'Enter a valid Transaction ID (minimum 6 characters).');
                isValid = false;
            }

            if (!file) {
                setError('paymentScreenshot', 'Payment screenshot is required.');
                isValid = false;
            }

            if (!declared) {
                setError('declaration', 'You must accept the declaration to submit.');
                isValid = false;
            }
        }

        return isValid;
    }

    /* ---------- Step Switcher ---------- */
    function goToStep(step) {
        if (step < 1) step = 1;
        if (step > state.maxStep) step = state.maxStep;
        state.currentStep = step;

        $$('.reg-step').forEach((s) => {
            const sNum = Number(s.dataset.step);
            s.classList.toggle('active', sNum === step);
        });

        $$('.progress-step').forEach((p) => {
            const pNum = Number(p.dataset.step);
            p.classList.toggle('active', pNum === step);
            p.classList.toggle('done', pNum < step);
        });

        const prevBtn = $('#prevBtn');
        const nextBtn = $('#nextBtn');

        if (prevBtn) prevBtn.disabled = step === 1;
        if (nextBtn) {
            nextBtn.style.display = step === state.maxStep ? 'none' : 'inline-flex';
        }

        if (step === 2) {
            syncLeaderInfo();
        }

        window.scrollTo({ top: 150, behavior: 'smooth' });
    }

    /* ---------- File Dropzone & Image Validation ---------- */
    async function handleFileSelect(file) {
        if (!file) return;

        // Perform instant client validation including magic bytes
        const validation = await SupabaseClient.validateImageFile(file);
        if (!validation.valid) {
            setError('paymentScreenshot', validation.error);
            resetDropzone();
            return;
        }

        clearError('paymentScreenshot');
        state.selectedFile = file;

        // Update UI preview
        const idleEl = $('#dropzoneIdle');
        const previewEl = $('#dropzonePreview');
        const nameEl = $('#previewFileName');
        const sizeEl = $('#previewFileSize');
        const thumbEl = $('#previewThumbnail');

        if (idleEl) idleEl.style.display = 'none';
        if (previewEl) previewEl.style.display = 'flex';
        if (nameEl) nameEl.textContent = file.name;
        if (sizeEl) sizeEl.textContent = formatBytes(file.size);

        if (thumbEl) {
            const reader = new FileReader();
            reader.onload = (e) => {
                thumbEl.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    function resetDropzone() {
        state.selectedFile = null;
        const fileInput = $('#paymentScreenshot');
        if (fileInput) fileInput.value = '';

        const idleEl = $('#dropzoneIdle');
        const previewEl = $('#dropzonePreview');
        const thumbEl = $('#previewThumbnail');

        if (idleEl) idleEl.style.display = 'block';
        if (previewEl) previewEl.style.display = 'none';
        if (thumbEl) thumbEl.src = '';
    }

    function initDropzone() {
        const dropzone = $('#paymentDropzone');
        const fileInput = $('#paymentScreenshot');
        const removeBtn = $('#removeScreenshotBtn');

        if (!dropzone || !fileInput) return;

        dropzone.addEventListener('click', (e) => {
            if (e.target.closest('#removeScreenshotBtn')) return;
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            const file = fileInput.files && fileInput.files[0];
            if (file) handleFileSelect(file);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropzone.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                dropzone.classList.remove('dragover');
            });
        });

        dropzone.addEventListener('drop', (e) => {
            const dt = e.dataTransfer;
            const file = dt && dt.files && dt.files[0];
            if (file) {
                handleFileSelect(file);
            }
        });

        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                resetDropzone();
            });
        }
    }

    /* ---------- UPI Copy Button ---------- */
    function initUpiCopy() {
        const copyBtn = $('#copyUpiBtn');
        const upiDisplay = $('#collegeUpiIdDisplay');
        const copyBtnText = $('#copyBtnText');

        if (upiDisplay && window.EVENT_CONFIG && window.EVENT_CONFIG.upiId) {
            upiDisplay.textContent = window.EVENT_CONFIG.upiId;
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                const upiText = upiDisplay ? upiDisplay.textContent : '';
                try {
                    await navigator.clipboard.writeText(upiText);
                    if (copyBtnText) copyBtnText.textContent = 'Copied! ✓';
                    showToast('UPI ID copied to clipboard.', 'success');
                    setTimeout(() => {
                        if (copyBtnText) copyBtnText.textContent = 'Copy';
                    }, 2000);
                } catch {
                    const ta = document.createElement('textarea');
                    ta.value = upiText;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    ta.remove();
                    showToast('UPI ID copied.', 'success');
                }
            });
        }
    }

    /* ---------- Form Submission Handler ---------- */
    async function handleSubmit(e) {
        e.preventDefault();

        if (state.submitting) return;

        // Final thorough validation across all 3 steps
        for (let s = 1; s <= 3; s++) {
            if (!validateStep(s)) {
                goToStep(s);
                showToast('Please complete all required fields.', 'error');
                return;
            }
        }

        const submitBtn = $('#submitBtn');
        const feedback = $('#submitFeedback');
        state.submitting = true;

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-inline"></span><span class="btn-text">Securing Registration & Uploading...</span>';
        }
        if (feedback) {
            feedback.style.color = 'var(--accent-primary)';
            feedback.textContent = 'Verifying security signature and uploading payment screenshot...';
        }

        // Build member list
        const leader = {
            name: $('#leaderName').value.trim(),
            registerNumber: $('#leaderRegisterNumber').value.trim().toUpperCase(),
            position: 1
        };

        const member2 = {
            name: $('#member2Name').value.trim(),
            registerNumber: $('#member2RegisterNumber').value.trim().toUpperCase(),
            position: 2
        };

        const members = [leader, member2];

        if (state.hasMember3) {
            members.push({
                name: $('#member3Name').value.trim(),
                registerNumber: $('#member3RegisterNumber').value.trim().toUpperCase(),
                position: 3
            });
        }

        const registrationPayload = {
            teamName: $('#teamName').value.trim(),
            leaderName: leader.name,
            leaderRegisterNumber: leader.registerNumber,
            leaderEmail: $('#leaderEmail').value.trim().toLowerCase(),
            leaderPhone: $('#leaderPhone').value.trim(),
            teamSize: members.length,
            participantUpiId: ($('#participantUpiId')?.value || '').trim(),
            transactionId: $('#transactionId').value.trim(),
            screenshotFile: state.selectedFile || $('#paymentScreenshot').files[0],
            members: members
        };

        try {
            const result = await SupabaseClient.submitEventRegistration(registrationPayload);

            if (!result.success) {
                if (feedback) {
                    feedback.style.color = 'var(--accent-danger)';
                    feedback.textContent = result.error || 'Submission failed. Please check your data.';
                }
                showToast(result.error || 'Registration failed.', 'error');
                return;
            }

            showToast('Registration submitted successfully!', 'success');

            // Redirect to registration-success.html
            const regIdParam = encodeURIComponent(result.registrationId || '');
            const teamParam = encodeURIComponent(result.teamName || '');
            window.location.href = `registration-success.html?registrationId=${regIdParam}&teamName=${teamParam}`;
        } catch (err) {
            console.error('Submission catch error:', err);
            if (feedback) {
                feedback.style.color = 'var(--accent-danger)';
                feedback.textContent = 'Connection error. Please verify network and try again.';
            }
            showToast('Network error during submission.', 'error');
        } finally {
            state.submitting = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="btn-text">Complete Registration</span><span class="btn-icon">→</span>';
            }
        }
    }

    /* ---------- Event Listeners Init ---------- */
    document.addEventListener('DOMContentLoaded', () => {
        initDropzone();
        initUpiCopy();
        updateMemberCountUI();

        // Add Member 3 button
        $('#addMemberBtn')?.addEventListener('click', () => {
            state.hasMember3 = true;
            updateMemberCountUI();
            clearError('members');
        });

        // Remove Member 3 button
        $('#removeMember3Btn')?.addEventListener('click', () => {
            state.hasMember3 = false;
            $('#member3Name').value = '';
            $('#member3RegisterNumber').value = '';
            clearError('member3Name');
            clearError('member3RegisterNumber');
            updateMemberCountUI();
        });

        // Wizard navigation buttons
        $('#prevBtn')?.addEventListener('click', () => {
            goToStep(state.currentStep - 1);
        });

        $('#nextBtn')?.addEventListener('click', () => {
            if (validateStep(state.currentStep)) {
                goToStep(state.currentStep + 1);
            } else {
                showToast('Please fix highlighted fields to proceed.', 'error');
            }
        });

        // Form Submission
        $('#registrationForm')?.addEventListener('submit', handleSubmit);

        // Clear individual input errors as user types
        $$('.form-input').forEach((input) => {
            input.addEventListener('input', () => {
                clearError(input.id);
            });
        });

        $('#declaration')?.addEventListener('change', () => {
            clearError('declaration');
        });
    });
})();

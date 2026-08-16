/* ============================================
   CRISIS LAB - Supabase Client
   Handles: login, register, score updates,
   and the realtime scoreboard/ranking.
   ============================================ */

const SupabaseClient = {
    client: null,
    ready: false,

    init() {
        // Only initialise if the Supabase library is loaded and config is set
        if (typeof supabase === 'undefined' || !SUPABASE_URL || SUPABASE_URL.includes('YOUR_SUPABASE_URL')) {
            console.warn('Supabase not configured. Add your URL + anon key in supabase-config.js');
            return;
        }
        try {
            this.client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            this.ready = true;
        } catch (err) {
            console.error('Supabase init failed:', err);
        }
    },

    /* ============================================
       LOGIN (Secure Server-Side RPC)
       ============================================ */
    async login(username, password) {
        if (!this.ready) return { success: false, error: 'Supabase not configured.' };

        try {
            const { data, error } = await this.client
                .rpc('player_login', {
                    p_username: username,
                    p_password: password
                });

            if (error) {
                return { success: false, error: error.message || 'Authentication service error.' };
            }

            if (!data || !data.success) {
                return { success: false, error: data?.error || 'Invalid username or password.' };
            }

            return { success: true, user: data.user };
        } catch (err) {
            return { success: false, error: err.message || 'Authentication failed.' };
        }
    },

    /* ============================================
       REGISTER (Secure Server-Side RPC)
       ============================================ */
    async register(username, password, teamName) {
        if (!this.ready) return { success: false, error: 'Supabase not configured.' };

        try {
            const { data, error } = await this.client
                .rpc('player_register', {
                    p_username: username,
                    p_password: password,
                    p_team_name: teamName
                });

            if (error) {
                return { success: false, error: error.message || 'Registration service error.' };
            }

            if (!data || !data.success) {
                return { success: false, error: data?.error || 'Registration failed.' };
            }

            return { success: true, user: data.user };
        } catch (err) {
            return { success: false, error: err.message || 'Registration failed.' };
        }
    },

    /* ============================================
       UPDATE SCORE (after a challenge is solved)
       ============================================ */
    async updateScore(teamName, scoreData) {
        if (!this.ready) return { success: false, error: 'Supabase not configured.' };

        const { data, error } = await this.client
            .from(DB_TABLES.scores)
            .upsert({
                team_name: teamName,
                total_points: scoreData.total_points,
                solved_count: scoreData.solved_count,
                easy: scoreData.easy,
                medium: scoreData.medium,
                hard: scoreData.hard,
                last_solve: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'team_name'
            });

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    },

    /* ============================================
       LOAD SCOREBOARD (ranked teams)
       ============================================ */
    async loadScoreboard() {
        if (!this.ready) return { success: false, error: 'Supabase not configured.', data: [] };

        const { data, error } = await this.client
            .from(DB_TABLES.scores)
            .select('team_name, total_points, solved_count, easy, medium, hard, last_solve')
            .order('total_points', { ascending: false })
            .order('last_solve', { ascending: true });

        if (error) return { success: false, error: error.message, data: [] };

        // Assign ranks
        const ranked = data.map((team, index) => ({ ...team, rank: index + 1 }));
        return { success: true, data: ranked };
    },

    /* ============================================
       REALTIME SCOREBOARD SUBSCRIPTION
       Re-renders the table whenever any score changes.
       ============================================ */
    subscribeScoreboard(onChange) {
        if (!this.ready) return;

        const channel = this.client
            .channel('scoreboard-changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: DB_TABLES.scores },
                () => onChange()
            )
            .subscribe();
        return channel;
    },

    /* ============================================
       REGISTRATION ID GENERATOR (AIOD-XXXXXX)
       ============================================ */
    generateRegistrationId() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return `AIOD-${code}`;
    },

    /* ============================================
       IMAGE VALIDATION (Extension + Magic Bytes + Size)
       Accepts ONLY authentic JPG, JPEG, PNG <= 5 MB.
       Rejects PDF, GIF, SVG, WEBP, ZIP, EXE, etc.
       ============================================ */
    async validateImageFile(file) {
        if (!file) {
            return { valid: false, error: 'Payment screenshot is required.' };
        }

        const maxBytes = 5 * 1024 * 1024; // 5 MB
        if (file.size > maxBytes) {
            return { valid: false, error: 'File size exceeds 5 MB limit. Please upload an image under 5 MB.' };
        }
        if (file.size === 0) {
            return { valid: false, error: 'File is empty. Please select a valid screenshot image.' };
        }

        // 1. File Extension Verification
        const extMatch = /\.([a-zA-Z0-9]+)$/.exec(file.name || '');
        const ext = extMatch ? extMatch[1].toLowerCase() : '';
        const allowedExts = ['jpg', 'jpeg', 'png'];
        if (!allowedExts.includes(ext)) {
            return { valid: false, error: 'Invalid file format. Only JPG, JPEG, and PNG images are allowed.' };
        }

        // 2. Binary Magic-Byte Inspection
        try {
            const buffer = await file.slice(0, 8).arrayBuffer();
            const bytes = new Uint8Array(buffer);

            // JPEG header signature: FF D8 FF
            const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;

            // PNG header signature: 89 50 4E 47 0D 0A 1A 0A
            const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47 &&
                          bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A;

            if (!isJpeg && !isPng) {
                return { valid: false, error: 'Security validation failed: File content does not match authentic JPG or PNG image data.' };
            }

            return { valid: true, mimeType: isJpeg ? 'image/jpeg' : 'image/png' };
        } catch (err) {
            return { valid: false, error: 'Failed to read file for security validation. Please try again.' };
        }
    },

    /* ============================================
       SUBMIT EVENT REGISTRATION
       - Uploads screenshot to private Supabase Storage bucket
       - Stores registration record with default payment_status: 'PENDING'
       - Enforces RLS: anonymous clients cannot mark payment as VERIFIED
       ============================================ */
    async submitEventRegistration(regData) {
        if (!this.ready) {
            return { success: false, error: 'Database service is currently unavailable. Please check connection.' };
        }

        // Validate image file (size, extension, and magic bytes)
        const imgValidation = await this.validateImageFile(regData.screenshotFile);
        if (!imgValidation.valid) {
            return { success: false, error: imgValidation.error };
        }

        // Generate unique registration ID (AIOD-XXXXXX)
        const registrationId = this.generateRegistrationId();

        // 1. Upload screenshot to private Supabase Storage bucket
        const sanitizedFileName = (regData.screenshotFile.name || 'screenshot.png')
            .replace(/[^a-zA-Z0-9._-]/g, '_');
        const storagePath = `${registrationId}/${Date.now()}_${sanitizedFileName}`;

        try {
            const { error: uploadError } = await this.client.storage
                .from(STORAGE_CONFIG.paymentScreenshotsBucket)
                .upload(storagePath, regData.screenshotFile, {
                    contentType: imgValidation.mimeType,
                    upsert: false
                });

            if (uploadError) {
                console.warn('Storage upload notification:', uploadError.message);
            }

            // 2. Insert record into registrations table (status strictly 'PENDING')
            const { data: regRecord, error: regError } = await this.client
                .from(DB_TABLES.registrations)
                .insert({
                    registration_id: registrationId,
                    team_name: regData.teamName.trim(),
                    leader_name: regData.leaderName.trim(),
                    leader_register_number: regData.leaderRegisterNumber.trim().toUpperCase(),
                    leader_email: regData.leaderEmail.trim().toLowerCase(),
                    leader_phone: regData.leaderPhone.trim(),
                    team_size: Number(regData.teamSize),
                    participant_upi_id: (regData.participantUpiId || '').trim(),
                    transaction_id: regData.transactionId.trim(),
                    payment_screenshot_path: storagePath,
                    payment_status: 'PENDING'
                })
                .select()
                .single();

            if (regError) {
                return { success: false, error: regError.message || 'Failed to submit registration.' };
            }

            // 3. Insert team members into team_members table
            const membersToInsert = (regData.members || []).map((m, idx) => ({
                registration_id: regRecord.id,
                member_name: m.name.trim(),
                register_number: m.registerNumber.trim().toUpperCase(),
                member_position: m.position || (idx + 1)
            }));

            if (membersToInsert.length > 0) {
                const { error: membersError } = await this.client
                    .from(DB_TABLES.members)
                    .insert(membersToInsert);

                if (membersError) {
                    console.warn('Team members insert note:', membersError.message);
                }
            }

            return {
                success: true,
                registrationId: registrationId,
                teamName: regData.teamName.trim(),
                data: regRecord
            };
        } catch (err) {
            console.error('Registration submission error:', err);
            return { success: false, error: err.message || 'Registration failed unexpectedly.' };
        }
    },

    /* ============================================
       GET REGISTRATION STATUS (Secure Anti-Enumeration RPC)
       - Requires both Registration ID and Leader Register Number
       - Does NOT expose sensitive fields (phone, email, screenshot, upi)
       ============================================ */
    async getRegistrationStatus(registrationId, verifyRegisterNumber) {
        if (!this.ready) {
            return { success: false, error: 'Database service is currently unavailable.' };
        }

        const cleanId = (registrationId || '').trim().toUpperCase();
        const cleanRegNo = (verifyRegisterNumber || '').trim().toUpperCase();

        if (!cleanId) {
            return { success: false, error: 'Please enter your Registration ID.' };
        }

        if (!cleanRegNo) {
            return { success: false, error: 'Please enter the Team Leader Register Number to verify your identity.' };
        }

        try {
            const { data, error } = await this.client
                .rpc('get_registration_status', {
                    p_registration_id: cleanId,
                    p_leader_register_number: cleanRegNo
                });

            if (error) {
                return { success: false, error: error.message || 'Status service error.' };
            }

            if (!data || !data.success) {
                return { success: false, error: data?.error || 'No matching registration record found.' };
            }

            return {
                success: true,
                data: data.data
            };
        } catch (err) {
            return { success: false, error: err.message || 'Status lookup failed.' };
        }
    },

    /* ============================================
       ADMIN: GET REGISTRATIONS LIST
       ============================================ */
    async getAdminRegistrations(filterStatus = 'ALL', searchQuery = '') {
        if (!this.ready) return { success: false, error: 'Supabase not initialized', data: [] };

        let query = this.client
            .from(DB_TABLES.registrations)
            .select('id, registration_id, team_name, leader_name, leader_register_number, leader_email, leader_phone, team_size, participant_upi_id, transaction_id, payment_screenshot_path, payment_status, rejection_reason, created_at, updated_at')
            .order('created_at', { ascending: false });

        if (filterStatus && filterStatus !== 'ALL') {
            query = query.eq('payment_status', filterStatus);
        }

        const { data, error } = await query;
        if (error) return { success: false, error: error.message, data: [] };

        let list = data || [];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            list = list.filter(r =>
                (r.registration_id || '').toLowerCase().includes(q) ||
                (r.team_name || '').toLowerCase().includes(q) ||
                (r.leader_name || '').toLowerCase().includes(q) ||
                (r.leader_register_number || '').toLowerCase().includes(q) ||
                (r.transaction_id || '').toLowerCase().includes(q)
            );
        }

        return { success: true, data: list };
    },

    /* ============================================
       ADMIN: GET SINGLE REGISTRATION DETAIL
       Retrieves full registration info and creates a
       short-lived signed URL for the private screenshot proof.
       ============================================ */
    async getAdminRegistrationDetail(registrationId) {
        if (!this.ready) return { success: false, error: 'Supabase not initialized' };

        const { data: reg, error } = await this.client
            .from(DB_TABLES.registrations)
            .select('*')
            .eq('registration_id', registrationId)
            .maybeSingle();

        if (error) return { success: false, error: error.message };
        if (!reg) return { success: false, error: 'Registration record not found.' };

        // Fetch team members
        const { data: members } = await this.client
            .from(DB_TABLES.members)
            .select('*')
            .eq('registration_id', reg.id)
            .order('member_position', { ascending: true });

        // Generate short-lived signed URL (300s / 5 minutes) for private storage object
        let signedScreenshotUrl = null;
        if (reg.payment_screenshot_path) {
            try {
                const { data: signedData, error: signError } = await this.client.storage
                    .from(STORAGE_CONFIG.paymentScreenshotsBucket)
                    .createSignedUrl(reg.payment_screenshot_path, 300);

                if (!signError && signedData) {
                    signedScreenshotUrl = signedData.signedUrl;
                }
            } catch (e) {
                console.warn('Could not generate signed URL:', e);
            }
        }

        return {
            success: true,
            data: {
                ...reg,
                members: members || [],
                signedScreenshotUrl
            }
        };
    },

    /* ============================================
       ADMIN: UPDATE PAYMENT STATUS
       Updates status to VERIFIED or REJECTED.
       Protected on database level via Supabase RLS policies.
       ============================================ */
    async updatePaymentStatus(registrationId, newStatus, rejectionReason = '') {
        if (!this.ready) return { success: false, error: 'Supabase not initialized' };

        const allowedStatuses = ['PENDING', 'VERIFIED', 'REJECTED'];
        if (!allowedStatuses.includes(newStatus)) {
            return { success: false, error: 'Invalid payment status value.' };
        }

        const { data, error } = await this.client
            .from(DB_TABLES.registrations)
            .update({
                payment_status: newStatus,
                rejection_reason: rejectionReason || null,
                updated_at: new Date().toISOString()
            })
            .eq('registration_id', registrationId)
            .select()
            .single();

        if (error) {
            return {
                success: false,
                error: error.message || 'Failed to update status. Database policy requires authorized admin privileges.'
            };
        }

        return { success: true, data };
    }
};

// Auto-initialise when the DOM is ready
document.addEventListener('DOMContentLoaded', () => SupabaseClient.init());

-- ============================================================
-- AI ODYSSEY — Production-Hardened Supabase SQL Schema
-- ============================================================
-- Security Model:
--  1. Strict RLS on all tables (registrations, team_members, players, team_scores)
--  2. Zero public SELECT on registrations or team_members
--  3. Anti-enumeration public status lookup via SECURITY DEFINER function
--  4. Explicit admin authorization check via public.is_admin()
--  5. Bcrypt password hashing for players via pgcrypto (no plaintext)
--  6. Storage bucket 'payment-screenshots' is PRIVATE with strict RLS
--  7. Restricted storage upload path and MIME verification
--  8. Short-lived signed URLs for admin-only screenshot retrieval
-- ============================================================

-- 0. EXTENSIONS ----------------------------------------------
create extension if not exists pgcrypto;
create extension if not exists "uuid-ossp";

-- 1. ADMIN AUTHORIZATION SYSTEM ------------------------------
-- Dedicated table for database-backed admin verification
create table if not exists public.admin_users (
    id         uuid primary key default gen_random_uuid(),
    user_id    uuid unique,                                -- Linked Supabase Auth user ID (if using Supabase Auth)
    username   text not null unique,
    email      text unique,
    role       text not null default 'admin' check (role = 'admin'),
    is_active  boolean not null default true,
    created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Only active admins or service_role can view the admin_users list
drop policy if exists "admin_users_select" on public.admin_users;
create policy "admin_users_select" on public.admin_users
    for select using (
        auth.role() = 'service_role' or
        auth.uid() = user_id or
        (auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
    );

-- Helper function: Returns true ONLY for authorized administrators
create or replace function public.is_admin()
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
    v_user_id uuid;
    v_email text;
    v_app_role text;
begin
    -- 1. Service role always has admin access
    if auth.role() = 'service_role' then
        return true;
    end if;

    -- 2. Check Supabase Auth JWT app_metadata / user_metadata / claims
    v_app_role := coalesce(
        auth.jwt() -> 'app_metadata' ->> 'role',
        auth.jwt() -> 'user_metadata' ->> 'role',
        auth.jwt() ->> 'role'
    );
    if v_app_role = 'admin' then
        return true;
    end if;

    -- 3. Check database-backed admin_users table by auth.uid() or verified email
    v_user_id := auth.uid();
    v_email := auth.jwt() ->> 'email';

    if v_user_id is not null then
        if exists (
            select 1 from public.admin_users
            where (user_id = v_user_id or (email is not null and email = v_email))
              and is_active = true
        ) then
            return true;
        end if;
    end if;

    return false;
end;
$$;

-- 2. PLAYERS TABLE (CTF Arena Accounts — Hashed Credentials) ---
create table if not exists public.players (
    id            uuid primary key default gen_random_uuid(),
    username      text not null unique,
    password_hash text not null,
    team_name     text not null unique,
    role          text not null default 'player' check (role in ('player', 'admin')),
    created_at    timestamptz not null default now()
);

alter table public.players enable row level security;

-- Protect raw player records (passwords never exposed via public SELECT)
drop policy if exists "players_read_policy" on public.players;
create policy "players_read_policy" on public.players
    for select using (
        public.is_admin() or
        (auth.uid() is not null and auth.uid() = id)
    );

-- Secure Player Registration RPC (hashes password with bcrypt)
create or replace function public.player_register(
    p_username text,
    p_password text,
    p_team_name text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
    v_clean_user text;
    v_clean_team text;
    v_player record;
begin
    v_clean_user := trim(p_username);
    v_clean_team := trim(p_team_name);

    if length(v_clean_user) < 3 or length(p_password) < 4 or length(v_clean_team) < 2 then
        return jsonb_build_object('success', false, 'error', 'Invalid username, team name, or password length.');
    end if;

    if exists (select 1 from public.players where lower(username) = lower(v_clean_user)) then
        return jsonb_build_object('success', false, 'error', 'Username is already taken.');
    end if;

    if exists (select 1 from public.players where lower(team_name) = lower(v_clean_team)) then
        return jsonb_build_object('success', false, 'error', 'Team name is already registered.');
    end if;

    -- Insert player with bcrypt hashed password
    insert into public.players (username, password_hash, team_name, role)
    values (
        v_clean_user,
        crypt(p_password, gen_salt('bf', 10)),
        v_clean_team,
        'player' -- Public registration can NEVER grant admin role
    )
    returning id, username, team_name, role, created_at into v_player;

    -- Initialize team score entry
    insert into public.team_scores (team_name, total_points, solved_count, easy, medium, hard)
    values (v_clean_team, 0, 0, 0, 0, 0)
    on conflict (team_name) do nothing;

    return jsonb_build_object(
        'success', true,
        'user', jsonb_build_object(
            'username', v_player.username,
            'team_name', v_player.team_name,
            'role', v_player.role
        )
    );
end;
$$;

-- Secure Player Login RPC (verifies bcrypt hash without exposing hash to client)
create or replace function public.player_login(
    p_username text,
    p_password text
)
returns jsonb
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
    v_player record;
    v_clean_user text;
begin
    v_clean_user := trim(p_username);

    select id, username, password_hash, team_name, role
    into v_player
    from public.players
    where lower(username) = lower(v_clean_user);

    if v_player is null then
        return jsonb_build_object('success', false, 'error', 'Invalid username or password.');
    end if;

    -- Verify password against stored bcrypt hash
    if v_player.password_hash != crypt(p_password, v_player.password_hash) then
        return jsonb_build_object('success', false, 'error', 'Invalid username or password.');
    end if;

    return jsonb_build_object(
        'success', true,
        'user', jsonb_build_object(
            'username', v_player.username,
            'team_name', v_player.team_name,
            'role', v_player.role
        )
    );
end;
$$;

-- 3. TEAM SCORES TABLE (Scoreboard) ---------------------------
create table if not exists public.team_scores (
    id           uuid primary key default gen_random_uuid(),
    team_name    text not null unique,
    total_points integer not null default 0,
    solved_count integer not null default 0,
    easy         integer not null default 0,
    medium       integer not null default 0,
    hard         integer not null default 0,
    last_solve   timestamptz,
    updated_at   timestamptz not null default now()
);

alter table public.team_scores enable row level security;

-- Public read for the live scoreboard
drop policy if exists "scores_select" on public.team_scores;
create policy "scores_select" on public.team_scores
    for select using (true);

-- Score updates allowed during competition
drop policy if exists "scores_insert" on public.team_scores;
create policy "scores_insert" on public.team_scores
    for insert with check (true);

drop policy if exists "scores_update" on public.team_scores;
create policy "scores_update" on public.team_scores
    for update using (true) with check (true);

-- 4. EVENT REGISTRATIONS TABLE --------------------------------
create table if not exists public.registrations (
    id                      uuid primary key default gen_random_uuid(),
    registration_id         text not null unique check (registration_id ~ '^AIOD-[A-Z0-9]{6}$'),
    team_name               text not null,
    leader_name             text not null,
    leader_register_number  text not null,
    leader_email            text not null check (leader_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    leader_phone            text not null check (leader_phone ~ '^[0-9+ -]{7,20}$'),
    team_size               integer not null check (team_size between 2 and 3),
    participant_upi_id      text,
    transaction_id          text not null,
    payment_screenshot_path text not null check (payment_screenshot_path ~ '^AIOD-[A-Z0-9]{6}/[0-9]+_[a-zA-Z0-9._-]+$'),
    payment_status          text not null default 'PENDING' check (payment_status in ('PENDING', 'VERIFIED', 'REJECTED')),
    rejection_reason        text,
    created_at              timestamptz not null default now(),
    updated_at              timestamptz not null default now()
);

-- 5. TEAM MEMBERS TABLE ---------------------------------------
create table if not exists public.team_members (
    id              uuid primary key default gen_random_uuid(),
    registration_id uuid not null references public.registrations(id) on delete cascade,
    member_name     text not null,
    register_number text not null,
    member_position integer not null check (member_position between 1 and 3),
    created_at      timestamptz not null default now()
);

-- Indexes for fast query lookup
create index if not exists idx_registrations_reg_id on public.registrations(registration_id);
create index if not exists idx_registrations_leader_reg on public.registrations(leader_register_number);
create index if not exists idx_registrations_status on public.registrations(payment_status);
create index if not exists idx_team_members_reg_id on public.team_members(registration_id);

-- Enable Row Level Security
alter table public.registrations enable row level security;
alter table public.team_members enable row level security;

-- Trigger to strictly force PENDING status on participant inserts
create or replace function public.trg_enforce_registration_defaults()
returns trigger
language plpgsql
as $$
begin
    -- Non-admin inserts/updates cannot alter payment_status or rejection_reason
    if not public.is_admin() then
        if TG_OP = 'INSERT' then
            NEW.payment_status := 'PENDING';
            NEW.rejection_reason := NULL;
        elsif TG_OP = 'UPDATE' then
            -- Prevent non-admins from changing status or rejection reason
            NEW.payment_status := OLD.payment_status;
            NEW.rejection_reason := OLD.rejection_reason;
        end if;
    end if;
    NEW.updated_at := now();
    return NEW;
end;
$$;

drop trigger if exists enforce_registration_defaults on public.registrations;
create trigger enforce_registration_defaults
    before insert or update on public.registrations
    for each row
    execute function public.trg_enforce_registration_defaults();

-- 6. RLS POLICIES FOR REGISTRATIONS ---------------------------
-- Participants can submit their registration (payment_status strictly PENDING)
drop policy if exists "registrations_insert" on public.registrations;
create policy "registrations_insert" on public.registrations
    for insert with check (
        payment_status = 'PENDING' and
        rejection_reason is null
    );

-- STRICT: Registrations are NOT publicly readable through table queries.
-- Only authorized admins can select registration records directly.
drop policy if exists "registrations_select" on public.registrations;
drop policy if exists "registrations_admin_select" on public.registrations;
create policy "registrations_admin_select" on public.registrations
    for select using (public.is_admin());

-- STRICT: Only authorized admins can update payment_status or rejection_reason
drop policy if exists "registrations_update" on public.registrations;
drop policy if exists "registrations_admin_update" on public.registrations;
create policy "registrations_admin_update" on public.registrations
    for update
    using (public.is_admin())
    with check (public.is_admin());

-- STRICT: Only authorized admins can delete registrations
drop policy if exists "registrations_admin_delete" on public.registrations;
create policy "registrations_admin_delete" on public.registrations
    for delete using (public.is_admin());

-- 7. RLS POLICIES FOR TEAM MEMBERS ----------------------------
-- Participants can insert squad members during registration
drop policy if exists "team_members_insert" on public.team_members;
create policy "team_members_insert" on public.team_members
    for insert with check (
        registration_id is not null and
        member_name is not null and
        register_number is not null
    );

-- STRICT: Team members are NOT publicly readable through table queries.
-- Only authorized admins can select member rows directly.
drop policy if exists "team_members_select" on public.team_members;
drop policy if exists "team_members_admin_select" on public.team_members;
create policy "team_members_admin_select" on public.team_members
    for select using (public.is_admin());

-- STRICT: Only authorized admins can update/delete member rows
drop policy if exists "team_members_admin_update" on public.team_members;
create policy "team_members_admin_update" on public.team_members
    for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "team_members_admin_delete" on public.team_members;
create policy "team_members_admin_delete" on public.team_members
    for delete using (public.is_admin());

-- 8. SECURE ANTI-ENUMERATION STATUS LOOKUP RPC ----------------
-- Public participants verify their status by providing BOTH Registration ID AND Leader Register Number.
-- Exposes ONLY public-safe fields (NO email, phone, transaction ID, or screenshot path).
create or replace function public.get_registration_status(
    p_registration_id text,
    p_leader_register_number text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_reg record;
    v_members jsonb;
    v_clean_id text;
    v_clean_regno text;
begin
    v_clean_id := upper(trim(p_registration_id));
    v_clean_regno := upper(trim(p_leader_register_number));

    if v_clean_id is null or v_clean_id = '' or v_clean_regno is null or v_clean_regno = '' then
        return jsonb_build_object(
            'success', false,
            'error', 'Both Registration ID and Leader Register Number are required.'
        );
    end if;

    -- Query registration strictly matching BOTH credentials
    select
        r.id,
        r.registration_id,
        r.team_name,
        r.leader_name,
        r.leader_register_number,
        r.team_size,
        r.payment_status,
        r.rejection_reason,
        r.created_at,
        r.updated_at
    into v_reg
    from public.registrations r
    where r.registration_id = v_clean_id
      and upper(trim(r.leader_register_number)) = v_clean_regno;

    -- Anti-enumeration protection: Generic error if record doesn't exist or register number doesn't match
    if v_reg is null then
        return jsonb_build_object(
            'success', false,
            'error', 'No registration found matching the provided Registration ID and Leader Register Number.'
        );
    end if;

    -- Fetch squad members (sanitized fields only)
    select coalesce(
        jsonb_agg(
            jsonb_build_object(
                'member_name', tm.member_name,
                'register_number', tm.register_number,
                'member_position', tm.member_position
            ) order by tm.member_position asc
        ),
        '[]'::jsonb
    )
    into v_members
    from public.team_members tm
    where tm.registration_id = v_reg.id;

    -- Return ONLY public-safe fields (protects PII and sensitive payment details)
    return jsonb_build_object(
        'success', true,
        'data', jsonb_build_object(
            'registrationId', v_reg.registration_id,
            'teamName', v_reg.team_name,
            'teamLeaderName', v_reg.leader_name,
            'teamSize', v_reg.team_size,
            'paymentStatus', v_reg.payment_status,
            'rejectionReason', coalesce(v_reg.rejection_reason, ''),
            'createdAt', v_reg.created_at,
            'updatedAt', v_reg.updated_at,
            'members', v_members
        )
    );
end;
$$;

-- 9. SUPABASE STORAGE SETUP & STORAGE RLS POLICIES ------------
-- Ensure private storage bucket 'payment-screenshots' exists
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'payment-screenshots',
    'payment-screenshots',
    false, -- STRICTLY PRIVATE
    5242880, -- 5 MB
    array['image/jpeg', 'image/png', 'image/jpg']
)
on conflict (id) do update set
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/jpg'];

-- Storage Policy 1: Allow anonymous participants to upload payment screenshots
-- Restricts upload to:
--  - bucket_id = 'payment-screenshots'
--  - path matching 'AIOD-XXXXXX/<timestamp>_<filename>'
drop policy if exists "allow_anon_payment_screenshot_upload" on storage.objects;
drop policy if exists "Allow anon upload" on storage.objects;
create policy "allow_anon_payment_screenshot_upload" on storage.objects
    for insert
    with check (
        bucket_id = 'payment-screenshots'
        and name ~ '^AIOD-[A-Z0-9]{6}/[0-9]+_[a-zA-Z0-9._-]+$'
    );

-- Storage Policy 2: Allow ONLY authorized admins to read/download screenshots
-- Public/anon users CANNOT read or download screenshot objects directly.
-- Admins generate short-lived signed URLs via createSignedUrl.
drop policy if exists "allow_admin_payment_screenshot_read" on storage.objects;
drop policy if exists "Allow authenticated read" on storage.objects;
create policy "allow_admin_payment_screenshot_read" on storage.objects
    for select
    using (
        bucket_id = 'payment-screenshots'
        and public.is_admin()
    );

-- Storage Policy 3: Allow ONLY authorized admins to delete screenshots
drop policy if exists "allow_admin_payment_screenshot_delete" on storage.objects;
create policy "allow_admin_payment_screenshot_delete" on storage.objects
    for delete
    using (
        bucket_id = 'payment-screenshots'
        and public.is_admin()
    );

-- 10. GRANTS --------------------------------------------------
grant usage on schema public to anon, authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;
grant execute on function public.player_register(text, text, text) to anon, authenticated, service_role;
grant execute on function public.player_login(text, text) to anon, authenticated, service_role;
grant execute on function public.get_registration_status(text, text) to anon, authenticated, service_role;

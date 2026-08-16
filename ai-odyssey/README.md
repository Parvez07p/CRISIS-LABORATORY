# 🚀 AI Odyssey — Debug the Arena

A **CTF-style debugging competition** web app with 50 challenges across HTML, CSS, and JavaScript. Players register a team, solve challenges by fixing broken code, submit flags, and climb a **live Supabase-powered scoreboard**.

---

## ✨ Features

- 🗺️ **50 Challenges** — Easy / Medium / Hard / Boss, each with broken code, hints, and a flag
- 🏁 **Flag Submission** — case-insensitive, with first-blood, no-hint, and time bonuses
- 📊 **Live Scoreboard** — real-time ranking powered by Supabase Realtime
- 👥 **Team Registration & Login** — Supabase-backed accounts
- 🌙 **Cyberpunk Theme** — dark/light toggle, particles, matrix rain, confetti

---

## 📁 Project Structure

```
ai-odyssey/
├── index.html          # Landing page
├── login.html          # Login + Registration (Supabase CTF account)
├── register.html       # Official event registration (multi-step form)
├── registration-success.html # Post-registration confirmation
├── status.html         # Check registration status by Registration ID
├── admin-login.html    # Organizer login for the registrations control room
├── admin-registrations.html # Registrations list / filters / export
├── admin-registration-detail.html # Registration detail + status control
├── dashboard.html      # Challenge grid
├── scoreboard.html     # Live leaderboard
├── admin.html          # Arena admin panel (challenges / timer)
├── rules.html          # Rules page
├── challenges/         # 50 generated challenge folders
├── assets/
│   ├── css/            # Stylesheets (registration.css adds wizard/admin styles)
│   └── js/             # Application scripts (registration.js, status.js, admin.js)
└── supabase-schema.sql # Database setup script

server/                 # Registration & management backend (Node + Express + MongoDB)
├── src/                # config, db, models, services, routes, middleware
├── tests/              # Integration tests (mongodb-memory-server)
├── data/               # Live Excel workbook (registrations.xlsx, git-ignored)
└── uploads/            # Uploaded documents (git-ignored)
```

---

## 🔐 How to Fill the Supabase Config

The app connects to Supabase through **two key files**. Here's exactly how to fill them.

### Step 1 — Get your Supabase credentials

1. Go to [supabase.com](https://supabase.com) and sign up (free tier is fine).
2. Click **New Project**, name it, set a database password, choose a region → **Create**.
3. Wait for the project to finish provisioning.
4. In the left sidebar go to **Project Settings → API** (or **Settings → API**).
5. Under **Project API keys**, copy two values:

   | Value | Where it looks like |
   |-------|---------------------|
   | **Project URL** | `https://abcdefghij.supabase.co` |
   | **anon / public** key | `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (long jumble) |

### Step 2 — Fill the `.env` file (recommended)

The project stores secrets in an environment file so they are never committed to git.

```bash
# from the ai-odyssey/ folder
cp .env.example .env
```

Then open **`.env`** and paste your values:

```env
# ============================================
# CRISIS LAB - Environment Variables
# ============================================

# From Supabase: Project Settings -> API -> Project URL
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghij.supabase.co

# From Supabase: Project Settings -> API -> anon / public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...

# Table names (keep these unless you edited supabase-schema.sql)
NEXT_PUBLIC_SUPABASE_USERS_TABLE=players
NEXT_PUBLIC_SUPABASE_SCORES_TABLE=team_scores
```

> ✅ `.env` is git-ignored (see `.gitignore` → `.env*`). Your keys stay private.
> `.env.example` is the committed template for other developers.

### Step 3 — Fill `assets/js/supabase-config.js` (static/fallback)

If you open the HTML files **directly in a browser** (double-click or `file://`), `.env` is **not** read — browsers can't access environment files. In that case, put your real values directly in `assets/js/supabase-config.js`:

```js
const SUPABASE_URL = 'https://abcdefghij.supabase.co';          // ← your project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6...';    // ← your anon key

const DB_TABLES = {
  users: 'players',      // register/login table
  scores: 'team_scores'  // scoreboard table
};
```

### Step 4 — Run the SQL schema

Open **Supabase Dashboard → SQL Editor → New query**, paste the contents of **`supabase-schema.sql`**, and click **Run**. This creates:

- `players` table — usernames, team names, passwords
- `team_scores` table — points, solved counts, timing
- `leaderboard` view — pre-sorted ranking
- RLS policies — public read, controlled writes

### Step 5 — Enable Realtime (for live scoreboard)

1. Supabase Dashboard → **Database → Replication**
2. Under **Source**, toggle **Enable Realtime** for the `team_scores` table
3. Click **Save**

### Step 6 — Run & test

```bash
npm install
npm run dev
```

Open `http://localhost:3000/login.html` (or open `login.html` directly), register a team, solve a challenge, and watch your score appear on `scoreboard.html` in real time.

---

## 🔄 How the Config Flows

```
.env  (or fallback values in supabase-config.js)
        │
        ▼
supabase-config.js  → provides SUPABASE_URL, SUPABASE_ANON_KEY, DB_TABLES
        │
        ▼
supabase-client.js  → creates the Supabase client, handles login/register/score sync
        │
        ▼
login.html / scoreboard.html / challenge pages → use SupabaseClient API
```

---

## 🎮 Demo Accounts

> Demo/local-only accounts are used when Supabase is not configured. Once you add real credentials and the `players` table, use your registered accounts instead.

---

## 🛠️ Tech Stack

- **Next.js** (for dev server / env loading)
- **Supabase** (auth, database, realtime)
- **Vanilla JS** (no framework for game logic)
- **CSS** custom properties + animations

---

## 📝 Registration & Management System

In addition to the CTF game, the site now includes a full **event registration and management system**.
It stores registrations in **MongoDB**, automatically records every registration into an **Excel workbook**,
emails participants and organizers, and gives organizers a protected **control room** to verify payments,
update statuses, download documents, and export data.

> The Supabase CTF login (`login.html`) is completely separate. The official event registration
> (`register.html`) stores to MongoDB, not Supabase.

### How it works

```
register.html  ──POST /api/registrations──▶  server (Express + MongoDB)
                                                  │
                                                  ├── Validates & rejects duplicates
                                                  ├── Generates Registration ID (INT-2026-0001)
                                                  ├── Saves files (magic-byte checked)
                                                  ├── Appends a row to data/registrations.xlsx
                                                  └── Emails participant + organizer
                                                          │
admin-registrations.html ◀──/api/admin/*──  control room (JWT protected)
```

- **Registration ID** is generated server-side (atomic counter) — `INT-2026-0001`.
- **Statuses**: `PENDING → PAYMENT_VERIFIED → REGISTERED`, or `REJECTED` (with a reason).
- **Excel workbook** lives at `server/data/registrations.xlsx`. Rows are appended, never overwritten;
  status changes update the matching row.
- **Files** (payment screenshot, college ID, bonafide, abstract, PPT) are stored on disk and only served
  through authenticated admin endpoints — never public.

### Local setup

Requirements: **Node.js 20+** and **MongoDB** (local `mongod` or a free Atlas cluster).

```bash
# 1. Install the server
cd server
npm install

# 2. Configure (create the .env from the template)
cp .env.example .env
#   - Set MONGODB_URI (default: mongodb://127.0.0.1:27017/crisis_lab)
#   - Set ADMIN_EMAIL + ADMIN_PASSWORD
#   - Optional: EMAIL_HOST / EMAIL_USER / EMAIL_PASSWORD for real emails

# 3. Create the organizer account
npm run seed-admin

# 4. Start the server (serves the whole site + API on port 3001)
npm start
```

Open `http://localhost:3001` — the existing site and the new registration pages are served together.

### Email behavior

Emails are only truly sent when `EMAIL_HOST` is configured. Without it, registrations still work
and the email log records `FAILED`, so organizers can hit **Resend Email** later. Nothing is faked.

### Admin control room

1. Open `http://localhost:3001/admin-login.html` and sign in with the seeded organizer credentials.
2. `admin-registrations.html` — search, filter by status/event, paginate, export **XLSX / CSV**.
3. `admin-registration-detail.html` — view team/payment details, download uploaded documents,
   verify payment, confirm/reject with a reason, resend emails, and inspect the email log.

### Running tests

```bash
cd server
npm test
```

The suite uses an in-memory MongoDB (no local MongoDB needed) and covers the whole pipeline:
config, submission, duplicate protection, validation, fake-file rejection, admin auth, status
changes (with Excel sync), exports, and secure file download.

---

## 📄 License

For educational / CTF competition use.
</content>


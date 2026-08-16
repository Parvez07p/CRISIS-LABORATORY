/* ============================================
   CRISIS LAB - Supabase Configuration
   ============================================
   Reads credentials from environment variables
   (set them in the .env file, or Vercel/Next.js
   project settings). Falls back to placeholder
   values so the app still loads locally.

   Where to find your values:
   Supabase Dashboard -> Project Settings -> API
   ============================================ */

// Safely read an environment variable, returning a fallback if unavailable.
function env(key, fallback) {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
}

const SUPABASE_URL = env('NEXT_PUBLIC_SUPABASE_URL', 'https://ybkzjpzzctysnswulkya.supabase.co');
const SUPABASE_ANON_KEY = env('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'sb_publishable_YRsMWA0NwyU3K-h2w9b5_w_0bm_MDKw');

// Table names (must match supabase-schema.sql / the SQL you ran)
const DB_TABLES = {
  users: env('NEXT_PUBLIC_SUPABASE_USERS_TABLE', 'players'),             // stores sign-in names, team names, passwords
  scores: env('NEXT_PUBLIC_SUPABASE_SCORES_TABLE', 'team_scores'),       // stores team points, solved counts, timing
  registrations: env('NEXT_PUBLIC_SUPABASE_REG_TABLE', 'registrations'), // stores team event registrations
  members: env('NEXT_PUBLIC_SUPABASE_MEMBERS_TABLE', 'team_members')     // stores team members
};

// Supabase Storage Bucket configuration
const STORAGE_CONFIG = {
  paymentScreenshotsBucket: 'payment-screenshots'
};

// Event & Payment Configuration (configurable via environment variables or set values)
const EVENT_CONFIG = {
  eventName: 'AI Odyssey — Debug the Arena',
  eventDate: '02 September 2026',
  minTeamSize: 2,
  maxTeamSize: 3,
  upiId: env('NEXT_PUBLIC_EVENT_UPI_ID', '[COLLEGE_UPI_ID]'),
  registrationFee: env('NEXT_PUBLIC_EVENT_REGISTRATION_FEE', ''),
  qrCodeUrl: env('NEXT_PUBLIC_EVENT_QR_CODE_URL', '')
};


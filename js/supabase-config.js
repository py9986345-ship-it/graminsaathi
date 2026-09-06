// ============================================
// SUPABASE CONFIGURATION
// ============================================
// 1. Go to https://supabase.com -> create a free project
// 2. Go to Project Settings -> API
// 3. Copy "Project URL" and paste below as SUPABASE_URL
// 4. Copy "anon public" key and paste below as SUPABASE_ANON_KEY
//    (NEVER use the "service_role" key here — that one is secret)
// ============================================

const SUPABASE_URL = "https://ovphdbiwrvqktsswxgzo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cGhkYml3cnZxa3Rzc3d4Z3pvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2NjQ3MDcsImV4cCI6MjEwNDI0MDcwN30.on25DURmtBldQ30amWDgkz-QGAvaEABRhWVHGaMw76U";

// Creates a single shared Supabase client for use across all pages
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
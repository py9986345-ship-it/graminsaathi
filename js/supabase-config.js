// ============================================
// SUPABASE CONFIGURATION
// ============================================
// 1. Go to https://supabase.com -> create a free project
// 2. Go to Project Settings -> API
// 3. Copy "Project URL" and paste below as SUPABASE_URL
// 4. Copy "anon public" key and paste below as SUPABASE_ANON_KEY
//    (NEVER use the "service_role" key here — that one is secret)
// ============================================

const SUPABASE_URL = "https://ypckoohoaehnlcuzsmqg.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_xQ5iGjcsGebZbNEGNiSwHQ_8WgcEScx";

// Creates a single shared Supabase client for use across all pages
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

(function () {
  const SUPABASE_URL = 'https://hpbqavmpufurvhyhlxwh.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_-gly5lpUiKoPphsfzF81Pg_Woj0Eaqm';

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.error('Supabase JS client is not loaded.');
    return;
  }

  if (!window.attractSupabaseClient) {
    window.attractSupabaseClient = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY,
      {
        auth: { persistSession: false, autoRefreshToken: false }
      }
    );
  }
})();

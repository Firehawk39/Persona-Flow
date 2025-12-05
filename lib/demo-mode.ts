// lib/demo-mode.ts
/**
 * Demo Mode Configuration
 * 
 * This allows PersonaFlow to run in two modes:
 * 1. DEMO MODE - For recruiters/visitors (mock data, no database)
 * 2. PERSONAL MODE - For your actual use (real Supabase data)
 */

export const isDemoMode = () => {
  // Check if we're in demo mode via environment variable
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
};

export const getDemoConfig = () => {
  return {
    isDemo: isDemoMode(),
    showDemoBanner: isDemoMode(),
    allowDataPersistence: !isDemoMode(),
    demoMessage: isDemoMode() 
      ? "🎭 Demo Mode - Changes won't be saved. This is for demonstration purposes only."
      : null
  };
};

// Demo user info (for display purposes)
export const DEMO_USER = {
  name: "Demo User",
  email: "demo@personaflow.com",
  message: "Exploring PersonaFlow's features"
};

// Check if feature should use mock data
export const useMockData = (feature: 'habits' | 'journal' | 'therapy' | 'chat') => {
  if (isDemoMode()) return true;
  
  // In personal mode, check if Supabase is configured
  const hasSupabase = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  
  return !hasSupabase; // Use mock data if Supabase not configured
};

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase using the "Connect to Supabase" button.');
}

// Create Supabase client with automatic retries
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: { 'x-application-name': 'movie-recommendations' }
  },
  db: {
    schema: 'public'
  },
  // Add retry configuration
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Add connection health check
let isConnected = false;

export async function checkConnection() {
  try {
    const { data, error } = await supabase.from('profiles').select('count');
    if (error) throw error;
    isConnected = true;
    return true;
  } catch (err) {
    console.error('Supabase connection error:', err);
    isConnected = false;
    return false;
  }
}

// Export connection status
export function getConnectionStatus() {
  return isConnected;
}
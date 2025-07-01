import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://elpwpvhpesehgeksvych.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVscHdwdmhwZXNlaGdla3N2eWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEzNTM5NTgsImV4cCI6MjA2NjkyOTk1OH0.oxy2Slgkt3FKxjkjwbfukA5LbxpLgyeRLXdJ8_4iKJg';

if (SUPABASE_URL === 'https://<PROJECT-ID>.supabase.co' || SUPABASE_ANON_KEY === '<ANON_KEY>') {
  throw new Error('Missing Supabase variables');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

export default supabase;
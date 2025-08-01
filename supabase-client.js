import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// သင်ပေးပို့ထားသော URL နှင့် Key ကို အသုံးပြုပြီး အောက်တွင် အစားထိုးပြီးဖြစ်သည်။
const SUPABASE_URL = 'https://jonovuoyxyzcqmpsqzdf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impvbm92dW95eHl6Y3FtcHNxemRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNjA1NDQsImV4cCI6MjA2OTYzNjU0NH0.c5usZAG6fDSRZjsSUkYQcS18bI21SeBJwVnWR1xO69Y';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

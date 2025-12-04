import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zdsshtwaxuuvtgfjyrhl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpkc3NodHdheHV1dnRnZmp5cmhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMTY0NTksImV4cCI6MjA3MzU5MjQ1OX0.ofr7dv7t-qm53sZtcYxT2_bR51965UQR7qQ_1R-PiPo';

export const supabase = createClient(supabaseUrl, supabaseKey);
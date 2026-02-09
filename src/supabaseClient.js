import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wxnsepstsfasdafewqnj.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4bnNlcHN0c2Zhc2RhZmV3cW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MDY0NzQsImV4cCI6MjA4NjE4MjQ3NH0.MFXTJa3IcvrFQXf5iKtusmIauw3fmrsEmqaGZaI_eW8'

export const supabase = createClient(supabaseUrl, supabaseKey)

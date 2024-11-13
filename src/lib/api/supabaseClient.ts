import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://asvbflcyaspdrhihjmcg.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzdmJmbGN5YXNwZHJoaWhqbWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1MzA0NzEsImV4cCI6MjA0NzEwNjQ3MX0.4J3SmtC2C0xzTJO02e4LH8fI2HEwgEHMwsC42B1gK1k'

export const supabase = createClient(supabaseUrl, supabaseKey)
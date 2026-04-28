const supabaseUrl = 'https://vdzqejhtdrhzfhgxrvce.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkenFlamh0ZHJoemZoZ3hydmNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY3NTc3MDQsImV4cCI6MjA5MjMzMzcwNH0.XlbYP11T1o1oUCw6MrbWaRNZHC951VXDAXP-lZNfI4Y';

// Initialize the Supabase client
const supabaseClientInstance = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// Attach to global window object
window.supabaseClient = supabaseClientInstance;
window.supabaseClientInstance = supabaseClientInstance;

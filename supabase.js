const supabaseUrl = "https://sdrdpzwldmfpluuythwg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkcmRwendsZG1mcGx1dXl0aHdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NTY3MzgsImV4cCI6MjA5OTQzMjczOH0.vHVpMN0M_CbfvhD3xTY893pIk3NOG6NuKeU5xONRFmg";

const supabaseClient = supabase.createClient(
    supabaseUrl,
    supabaseKey
);

// Configuration constants

// Supabase Configuration
export const SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDk5MTUsImV4cCI6MjA2NjEyNTkxNX0.HBznM8FVX0VnYBN8rTu6T-QOPmq0d60syavTCADl3JI';

// Auto-save Configuration
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

// Script Status IDs
export const SCRIPT_STATUS = {
    READY_FOR_OUTLINE: 15,
    OUTLINE_COMPLETED: 20,
    READY_FOR_CHAPTERS: 40,
    READY_FOR_VISUALS: 46
};

// Completion Types
export const COMPLETION_TYPES = {
    OUTLINE_COMPLETED: 'outline_completed',
    SCRIPT_COMPLETED: 'script_completed'
};

// Website Portfolio Configuration
export const WEBSITE_CONFIG = {
    supabaseUrl: 'https://euzbpslzrimyokzvgbzk.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDk5MTUsImV4cCI6MjA2NjEyNTkxNX0.HBznM8FVX0VnYBN8rTu6T-QOPmq0d60syavTCADl3JI',
    tables: {
        niches: 'website_niches',
        scripts: 'website_scripts',
        pages: 'website_pages',
        articles: 'website_articles',
        articleCategories: 'website_article_categories'
    }
};
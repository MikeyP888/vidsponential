// Configuration constants

// Supabase Configuration
export const SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU0OTkxNSwiZXhwIjoyMDY2MTI1OTE1fQ.0-f5AmioTZHU2PcSKOoSPAO_iQl4abiz4ZeA1dhRNRE';

// Auto-save Configuration
export const AUTO_SAVE_INTERVAL = 10000; // 10 seconds

// Script Status IDs
export const SCRIPT_STATUS = {
    NEW: 10,
    RESEARCH_READY: 12,
    RESEARCH_COMPLETE: 13,
    READY_FOR_OUTLINE: 15,
    OUTLINE_COMPLETED: 20,
    READY_FOR_CHAPTERS: 25,
    READY_FOR_REFINED_CHAPTERS: 32,
    CHAPTERS_COMPLETE: 35,
    READY_FOR_VISUALS: 40,
    VISUALS_COMPLETE: 45
};

// Completion Types
export const COMPLETION_TYPES = {
    OUTLINE_COMPLETED: 'outline_completed',
    SCRIPT_COMPLETED: 'script_completed'
};

// Website Portfolio Configuration
export const WEBSITE_CONFIG = {
    supabaseUrl: 'https://euzbpslzrimyokzvgbzk.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDU0OTkxNSwiZXhwIjoyMDY2MTI1OTE1fQ.0-f5AmioTZHU2PcSKOoSPAO_iQl4abiz4ZeA1dhRNRE',
    tables: {
        niches: 'website_niches',
        scripts: 'website_scripts',
        pages: 'website_pages',
        articles: 'website_articles',
        articleCategories: 'website_article_categories'
    }
};

// Common field configurations for editors
export const RESEARCH_FIELDS = [
    { name: 'angle_suggestions', label: 'ANGLE SUGGESTIONS' },
    { name: 'key_themes', label: 'KEY THEMES' },
    { name: 'story_foundation', label: 'STORY FOUNDATION' },
    { name: 'dramatic_elements', label: 'DRAMATIC ELEMENTS' },
    { name: 'key_players', label: 'KEY PLAYERS' },
    { name: 'quotes', label: 'QUOTES' },
    { name: 'timeline', label: 'TIMELINE' },
    { name: 'facts_and_data', label: 'FACTS AND DATA' },
    { name: 'misc_notes', label: 'MISC NOTES' }
];

export const STORY_DETAILS_FIELDS = [
    { name: 'logline', label: 'LOGLINE' },
    { name: 'script_basic_outline', label: 'BASIC OUTLINE' },
    { name: 'script_outline', label: 'OUTLINE' },
    { name: 'synopsis', label: 'SYNOPSIS' },
    { name: 'primary_keyword', label: 'PRIMARY KEYWORD' },
    { name: 'script_summary', label: 'SCRIPT SUMMARY' },
    { name: 'video_description', label: 'VIDEO DESCRIPTION' }
];

export const CHAPTER_FIELDS = [
    { name: 'chapter_1', label: 'CHAPTER 1' },
    { name: 'chapter_2', label: 'CHAPTER 2' },
    { name: 'chapter_3', label: 'CHAPTER 3' },
    { name: 'chapter_4', label: 'CHAPTER 4' },
    { name: 'chapter_5', label: 'CHAPTER 5' },
    { name: 'chapter_6', label: 'CHAPTER 6' },
    { name: 'chapter_7', label: 'CHAPTER 7' },
    { name: 'chapter_8', label: 'CHAPTER 8' }
];

export const VISUAL_FIELDS = [
    { name: 'opening_visuals', label: 'OPENING VISUALS' },
    { name: 'main_story_visuals', label: 'MAIN STORY VISUALS' },
    { name: 'supporting_visuals', label: 'SUPPORTING VISUALS' },
    { name: 'b_roll_footage', label: 'B-ROLL FOOTAGE' },
    { name: 'graphics_animations', label: 'GRAPHICS & ANIMATIONS' },
    { name: 'closing_visuals', label: 'CLOSING VISUALS' }
];

// Common messages
export const MESSAGES = {
    LOADING: 'Loading...',
    SAVING: 'Saving...',
    SAVED: 'Saved successfully',
    ERROR: 'An error occurred',
    NO_DATA: 'No data found',
    UNSAVED_CHANGES: 'You have unsaved changes. Continue?'
};
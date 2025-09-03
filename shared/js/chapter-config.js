// Configuration constants for Chapter Editor

// Supabase Configuration
export const SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co';
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDk5MTUsImV4cCI6MjA2NjEyNTkxNX0.HBznM8FVX0VnYBN8rTu6T-QOPmq0d60syavTCADl3JI';

// Auto-save Configuration
export const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

// Script Status IDs - Updated for Chapter Editor
export const SCRIPT_STATUS = {
    READY_FOR_CHAPTERS: 25,    // Scripts ready for chapter editing
    CHAPTERS_COMPLETED: 35,    // FIXED: Changed from 30 to 35 to match expected workflow
    READY_FOR_OUTLINE: 15,     // Keep for navigation badges
    READY_FOR_VISUALS: 46
};

// Completion Types - Updated for Chapter Editor
export const COMPLETION_TYPES = {
    CHAPTERS_COMPLETED: 'chapters_completed',  // Changed from outline_completed
    SCRIPT_COMPLETED: 'script_completed'
};
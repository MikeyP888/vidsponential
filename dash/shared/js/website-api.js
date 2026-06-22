// Website API functions for portfolio
import { WEBSITE_CONFIG } from './config.js';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(WEBSITE_CONFIG.supabaseUrl, WEBSITE_CONFIG.supabaseAnonKey);

// Fetch all niches
export async function fetchNiches() {
    try {
        const { data, error } = await supabaseClient
            .from(WEBSITE_CONFIG.tables.niches)
            .select('*')
            .order('website_niche_display_order');
        
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching niches:', error);
        return { data: null, error };
    }
}

// Fetch scripts by niche
export async function fetchScriptsByNiche(nicheId = null) {
    try {
        let query = supabaseClient
            .from(WEBSITE_CONFIG.tables.scripts)
            .select(`
                *,
                website_niches (*)
            `)
            .eq('website_script_status_id', 2) // Published status
            .order('website_script_display_order');
        
        if (nicheId) {
            query = query.eq('website_niche_id', nicheId);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching scripts:', error);
        return { data: null, error };
    }
}

// Fetch all published articles
export async function fetchArticles() {
    try {
        const { data, error } = await supabaseClient
            .from(WEBSITE_CONFIG.tables.articles)
            .select(`
                *,
                website_article_categories (*)
            `)
            .eq('website_article_status_id', 2) // Published status
            .order('website_article_created_at', { ascending: false });
        
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching articles:', error);
        return { data: null, error };
    }
}

// Fetch recent articles for homepage
export async function fetchRecentArticles(limit = 3) {
    try {
        const { data, error } = await supabaseClient
            .from(WEBSITE_CONFIG.tables.articles)
            .select(`
                *,
                website_article_categories (*)
            `)
            .eq('website_article_status_id', 2) // Published status
            .order('website_article_created_at', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching recent articles:', error);
        return { data: null, error };
    }
}

// Fetch portfolio pages
export async function fetchPortfolioPages() {
    try {
        const { data, error } = await supabaseClient
            .from(WEBSITE_CONFIG.tables.pages)
            .select('*')
            .eq('website_page_status_id', 2) // Published status
            .order('website_page_display_order');
        
        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error fetching portfolio pages:', error);
        return { data: null, error };
    }
}
/**
 * Rating Utilities for Centralized Rating System
 * Handles loading and saving ratings from/to the centralized ratings table
 * 
 * Database Schema:
 * - rating_sources: Types of ratings (mp_rating, ai_rating, engagement_rating)
 * - rating_content_types: Configuration for which content gets rated
 * - ratings: Individual rating storage
 * - rating_overall_ratings: Calculated weighted averages
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Load ratings for a record from the centralized ratings table
 * @param {string} tableName - The table name (e.g., 'scripts', 'chapters', 'script_research')
 * @param {number} recordId - The record ID
 * @param {Array<string>} contentFields - Array of content field names to fetch ratings for
 * @returns {Object} - Object with field names as keys and rating values as values
 */
export async function loadRatings(tableName, recordId, contentFields) {
    try {
        // Fetch all ratings for this record with rating_source_id = 1 (mp_rating)
        const { data, error } = await supabase
            .from('ratings')
            .select('content_field, rating_value')
            .eq('table_name', tableName)
            .eq('record_id', recordId)
            .eq('rating_source_id', 1); // mp_rating only

        if (error) {
            console.error('Error loading ratings:', error);
            return {};
        }

        // Convert array to object with content_field as key
        const ratingsObj = {};
        if (data) {
            data.forEach(rating => {
                ratingsObj[rating.content_field] = rating.rating_value;
            });
        }

        return ratingsObj;
    } catch (error) {
        console.error('Error in loadRatings:', error);
        return {};
    }
}

/**
 * Save a single rating to the centralized ratings table using UPSERT
 * @param {string} tableName - The table name (e.g., 'scripts', 'chapters', 'script_research')
 * @param {number} recordId - The record ID
 * @param {string} contentField - The content field name (e.g., 'script_headline', 'story_summary')
 * @param {number} ratingValue - The rating value (1-100)
 * @param {number} scriptId - The script ID (null for non-script content like tweets, social posts)
 * @returns {boolean} - Success status
 */
export async function saveRating(tableName, recordId, contentField, ratingValue, scriptId = null) {
    try {
        // Build rating data object
        const ratingData = {
            table_name: tableName,
            record_id: recordId,
            content_field: contentField,
            rating_source_id: 1, // mp_rating
            rating_value: ratingValue,
            updated_at: new Date().toISOString()
        };

        // Add script_id if provided (can be null for non-script content)
        if (scriptId !== null && scriptId !== undefined) {
            ratingData.script_id = scriptId;
        }

        // Use UPSERT pattern: INSERT with ON CONFLICT DO UPDATE
        // This is more efficient than checking first, then updating/inserting
        const { error } = await supabase
            .from('ratings')
            .upsert(ratingData, {
                onConflict: 'table_name,record_id,content_field,rating_source_id',
                ignoreDuplicates: false
            });

        if (error) {
            console.error('Error upserting rating:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error in saveRating:', error);
        return false;
    }
}

/**
 * Save multiple ratings at once
 * @param {string} tableName - The table name (e.g., 'scripts', 'chapters', 'script_research')
 * @param {number} recordId - The record ID
 * @param {Object} ratingsData - Object with content field names as keys and rating values as values
 * @param {number} scriptId - The script ID (null for non-script content like tweets, social posts)
 * @returns {boolean} - Success status
 */
export async function saveRatings(tableName, recordId, ratingsData, scriptId = null) {
    try {
        const results = await Promise.all(
            Object.entries(ratingsData).map(([contentField, ratingValue]) => {
                // Only save if there's a value
                if (ratingValue !== null && ratingValue !== undefined && ratingValue !== '') {
                    return saveRating(tableName, recordId, contentField, parseInt(ratingValue), scriptId);
                }
                return Promise.resolve(true);
            })
        );

        return results.every(r => r === true);
    } catch (error) {
        console.error('Error in saveRatings:', error);
        return false;
    }
}

/**
 * Helper function to extract rating field names from form data
 * Converts field names ending in '_mp_rating' to their base content field name
 * @param {Object} formData - Object with keys ending in '_mp_rating'
 * @returns {Object} - Object with base field names as keys
 * 
 * Example:
 *   Input:  { story_summary_mp_rating: 85, key_details_mp_rating: 70 }
 *   Output: { story_summary: 85, key_details: 70 }
 */
export function convertRatingFieldNames(formData) {
    const converted = {};
    
    Object.entries(formData).forEach(([key, value]) => {
        if (key.endsWith('_mp_rating')) {
            // Remove '_mp_rating' suffix to get content field name
            const contentField = key.replace('_mp_rating', '');
            converted[contentField] = value;
        }
    });
    
    return converted;
}

/**
 * Populate rating fields in the UI with loaded ratings
 * @param {Object} ratings - Object with content field names as keys and rating values as values
 * @param {string} prefix - Prefix for input field IDs (e.g., 'rating_')
 */
export function populateRatingFields(ratings, prefix = 'rating_') {
    Object.entries(ratings).forEach(([contentField, ratingValue]) => {
        const inputId = prefix + contentField;
        const inputElement = document.getElementById(inputId);
        
        if (inputElement && ratingValue !== null && ratingValue !== undefined) {
            inputElement.value = ratingValue;
        }
    });
}

/**
 * Collect rating values from form inputs
 * @param {Array<string>} contentFields - Array of content field names
 * @param {string} prefix - Prefix for input field IDs (e.g., 'rating_')
 * @returns {Object} - Object with content field names as keys and rating values as values
 */
export function collectRatingValues(contentFields, prefix = 'rating_') {
    const ratings = {};
    
    contentFields.forEach(field => {
        const inputId = prefix + field;
        const inputElement = document.getElementById(inputId);
        
        if (inputElement && inputElement.value) {
            ratings[field] = parseInt(inputElement.value);
        }
    });
    
    return ratings;
}

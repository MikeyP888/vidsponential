// Centralized rating utilities for the Editing DB.
// Editing uses table_id (FK to the `tables` registry), NOT table_name like Vidsponential,
// and has no script_id column. We resolve table_name -> table_id once and cache it.

import { SUPABASE_URL, SUPABASE_ANON_KEY, MP_RATING_SOURCE_ID } from './config.js';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// table_name -> table_id cache (from the `tables` registry, so nothing is hardcoded)
const _tableIdCache = {};
export async function resolveTableId(tableName) {
    if (_tableIdCache[tableName] !== undefined) return _tableIdCache[tableName];
    const { data, error } = await supabase
        .from('tables').select('table_id').eq('table_name', tableName).single();
    if (error || !data) { console.error('resolveTableId failed for', tableName, error); return null; }
    _tableIdCache[tableName] = data.table_id;
    return data.table_id;
}

// Load Michael's ratings for one record, for a set of content fields -> { field: value }
export async function loadRatings(tableName, recordId, contentFields) {
    const tableId = await resolveTableId(tableName);
    if (tableId == null) return {};
    const { data, error } = await supabase
        .from('ratings')
        .select('content_field, rating_value')
        .eq('table_id', tableId)
        .eq('record_id', recordId)
        .eq('rating_source_id', MP_RATING_SOURCE_ID);
    if (error) { console.error('loadRatings error:', error); return {}; }
    const out = {};
    (data || []).forEach(r => { out[r.content_field] = r.rating_value; });
    return out;
}

// Batch: load one content_field's rating for many records -> { recordId: value }
export async function loadRatingsForRecords(tableName, recordIds, contentField) {
    const tableId = await resolveTableId(tableName);
    if (tableId == null || !recordIds.length) return {};
    const { data, error } = await supabase
        .from('ratings')
        .select('record_id, rating_value')
        .eq('table_id', tableId)
        .eq('content_field', contentField)
        .eq('rating_source_id', MP_RATING_SOURCE_ID)
        .in('record_id', recordIds);
    if (error) { console.error('loadRatingsForRecords error:', error); return {}; }
    const out = {};
    (data || []).forEach(r => { out[r.record_id] = r.rating_value; });
    return out;
}

// Upsert one rating. Pass value '' / null to skip.
export async function saveRating(tableName, recordId, contentField, ratingValue) {
    if (ratingValue === null || ratingValue === undefined || ratingValue === '') return true;
    const tableId = await resolveTableId(tableName);
    if (tableId == null) return false;
    const { error } = await supabase.from('ratings').upsert({
        table_id: tableId,
        record_id: recordId,
        content_field: contentField,
        rating_source_id: MP_RATING_SOURCE_ID,
        rating_value: parseInt(ratingValue, 10),
        updated_at: new Date().toISOString()
    }, { onConflict: 'table_id,record_id,content_field,rating_source_id', ignoreDuplicates: false });
    if (error) { console.error('saveRating error:', error); return false; }
    return true;
}

// Save several { field: value } for one record
export async function saveRatings(tableName, recordId, ratingsData) {
    const results = await Promise.all(
        Object.entries(ratingsData).map(([field, val]) => saveRating(tableName, recordId, field, val))
    );
    return results.every(Boolean);
}

// DOM helper: read rating inputs by id `${prefix}${field}` -> { field: value }
export function collectRatingValues(fields, prefix = 'rating_') {
    const out = {};
    fields.forEach(f => {
        const el = document.getElementById(prefix + f);
        if (el && el.value !== '') out[f] = parseInt(el.value, 10);
    });
    return out;
}

// DOM helper: fill rating inputs from { field: value }
export function populateRatingFields(ratings, prefix = 'rating_') {
    Object.entries(ratings || {}).forEach(([field, val]) => {
        const el = document.getElementById(prefix + field);
        if (el && val !== null && val !== undefined) el.value = val;
    });
}

// API layer for all Supabase interactions

import { SUPABASE_URL, SUPABASE_ANON_KEY, SCRIPT_STATUS, COMPLETION_TYPES } from './config.js';

// Load scripts that need outline review
export async function loadScriptsToReview() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/scripts?script_status_id=eq.15&select=script_id,script_headline`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to load scripts: ${response.status} - ${errorText}`);
    }

    return await response.json();
}

// Load reference data from database tables
export async function loadReferenceData(table, idField, id, valueField) {
    if (!id) return null;
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${idField}=eq.${id}&select=${valueField}`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        if (response.ok) {
            const [data] = await response.json();
            return data;
        }
    } catch (error) {
        console.error(`Error loading ${table}:`, error);
    }
    return null;
}

// Load the current script data with all related information
export async function loadCurrentScript(scriptId) {
    try {
        const scriptResponse = await fetch(`${SUPABASE_URL}/rest/v1/scripts?script_id=eq.${scriptId}&select=script_id,script_headline,primary_keyword,script_headline_mp_rating,primary_keyword_mp_rating,target_word_count,client_id,genre_id,subgenre_id,script_format_id,script_structure_id,emotional_tone_id,research_depth_id,content_angle_id,content_type_id`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!scriptResponse.ok) throw new Error('Failed to load script');
        const [scriptData] = await scriptResponse.json();

        // Load client data
        let clientData = null;
        if (scriptData.client_id) {
            const clientResponse = await fetch(`${SUPABASE_URL}/rest/v1/clients?client_id=eq.${scriptData.client_id}&select=client_first_name,client_last_name`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            if (clientResponse.ok) {
                [clientData] = await clientResponse.json();
            }
        }

        // Load youtube channel data
        let channelData = null;
        if (scriptData.client_id) {
            const channelResponse = await fetch(`${SUPABASE_URL}/rest/v1/youtube_channels?client_id=eq.${scriptData.client_id}&select=youtube_channel_name`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            if (channelResponse.ok) {
                const channelArray = await channelResponse.json();
                if (channelArray.length > 0) {
                    channelData = channelArray[0];
                }
            }
        }

        // Load reference data
        const [genreData, subgenreData, formatData, structureData, toneData, researchData, angleData, typeData] = await Promise.all([
            loadReferenceData('genres', 'genre_id', scriptData.genre_id, 'genre'),
            loadReferenceData('subgenres', 'subgenre_id', scriptData.subgenre_id, 'subgenre'),
            loadReferenceData('script_formats', 'script_format_id', scriptData.script_format_id, 'script_format'),
            loadReferenceData('script_structures', 'script_structure_id', scriptData.script_structure_id, 'script_structure'),
            loadReferenceData('emotional_tones', 'emotional_tone_id', scriptData.emotional_tone_id, 'emotional_tone'),
            loadReferenceData('research_depths', 'research_depth_id', scriptData.research_depth_id, 'research_depth'),
            loadReferenceData('content_angles', 'content_angle_id', scriptData.content_angle_id, 'content_angle'),
            loadReferenceData('content_types', 'content_type_id', scriptData.content_type_id, 'content_type')
        ]);

        const headlinesResponse = await fetch(`${SUPABASE_URL}/rest/v1/headlines?script_id=eq.${scriptId}&select=headline_id,headline,headline_mp_rating,headline_overall_rating&order=headline_overall_rating.desc&limit=4`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!headlinesResponse.ok) throw new Error('Failed to load headlines');
        const headlines = await headlinesResponse.json();

        const chaptersResponse = await fetch(`${SUPABASE_URL}/rest/v1/chapters?script_id=eq.${scriptId}&select=chapter_id,chapter_number,chapter_headline,chapter_headline_mp_rating,chapter_outline,chapter_outline_mp_rating&order=chapter_number`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!chaptersResponse.ok) throw new Error('Failed to load chapters');
        const chapters = await chaptersResponse.json();

        return {
            script: scriptData,
            client: clientData,
            channel: channelData,
            genre: genreData,
            subgenre: subgenreData,
            format: formatData,
            structure: structureData,
            tone: toneData,
            research: researchData,
            angle: angleData,
            type: typeData,
            headlines: headlines,
            chapters: chapters
        };

    } catch (error) {
        console.error('Error loading script:', error);
        throw error;
    }
}

// Save current script data to database
export async function saveCurrentData(scriptData, changeStatus = false) {
    try {
        const scriptId = scriptData.script.script_id;

        // Save main script data
        const scriptUpdate = {
            script_headline: document.getElementById('workingHeadline').value,
            primary_keyword: document.getElementById('primaryKeyword').value,
            script_headline_mp_rating: document.getElementById('workingHeadlineRating').value || null,
            primary_keyword_mp_rating: document.getElementById('primaryKeywordRating').value || null
        };

        if (changeStatus) {
            scriptUpdate.script_status_id = SCRIPT_STATUS.OUTLINE_COMPLETED;
        }

        const scriptResponse = await fetch(`${SUPABASE_URL}/rest/v1/scripts?script_id=eq.${scriptId}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(scriptUpdate)
        });

        if (!scriptResponse.ok) {
            const errorText = await scriptResponse.text();
            throw new Error(`Script update failed: ${scriptResponse.status} - ${errorText}`);
        }

        // Save headlines
        const headlineInputs = document.querySelectorAll('.chapter-ti-7a2807fb2c20[data-headline-id]');
        const headlineRatings = document.querySelectorAll('.rating-7a2807fb2c1d[data-field="headline_mp_rating"]');

        for (let i = 0; i < headlineInputs.length; i++) {
            const headlineId = headlineInputs[i].dataset.headlineId;
            
            if (!headlineId || headlineId === 'null') continue;
            
            const rating = headlineRatings[i].value || null;

            const headlineResponse = await fetch(`${SUPABASE_URL}/rest/v1/headlines?headline_id=eq.${headlineId}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    headline: headlineInputs[i].value,
                    headline_mp_rating: rating
                })
            });

            if (!headlineResponse.ok) {
                const errorText = await headlineResponse.text();
                throw new Error(`Headline update failed: ${headlineResponse.status} - ${errorText}`);
            }
        }

        // Save chapters
        const chapterTitles = document.querySelectorAll('.chapter-ti-7a2807fb2c20[data-chapter-id]');
        const chapterOutlines = document.querySelectorAll('.chapter-ou-7a2807fb2c18[data-chapter-id]');
        const chapterTitleRatings = document.querySelectorAll('.rating-7a2807fb2c1d[data-field="chapter_headline_mp_rating"]');
        const chapterOutlineRatings = document.querySelectorAll('.rating-7a2807fb2c15[data-field="chapter_outline_mp_rating"]');

        for (let i = 0; i < chapterTitles.length; i++) {
            const chapterId = chapterTitles[i].dataset.chapterId;
            
            if (!chapterId || chapterId === 'null') continue;
            
            const titleRating = chapterTitleRatings[i] ? chapterTitleRatings[i].value || null : null;
            const outlineRating = chapterOutlineRatings[i] ? chapterOutlineRatings[i].value || null : null;

            const chapterResponse = await fetch(`${SUPABASE_URL}/rest/v1/chapters?chapter_id=eq.${chapterId}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=minimal'
                },
                body: JSON.stringify({
                    chapter_headline: chapterTitles[i].value,
                    chapter_headline_mp_rating: titleRating,
                    chapter_outline: chapterOutlines[i].value,
                    chapter_outline_mp_rating: outlineRating
                })
            });

            if (!chapterResponse.ok) {
                const errorText = await chapterResponse.text();
                throw new Error(`Chapter update failed: ${chapterResponse.status} - ${errorText}`);
            }
        }

        return true;

    } catch (error) {
        console.error('Save error:', error);
        throw error;
    }
}

// Record completion events
export async function recordCompletion(scriptId, completionType) {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/daily_completions`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify({
                script_id: scriptId,
                completion_type: completionType
            })
        });
        
        if (!response.ok) {
            console.error('Failed to record completion:', response.status);
        }
    } catch (error) {
        console.error('Error recording completion:', error);
    }
}

// Load today's completion counts
export async function loadCompletedTodayCount() {
    try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Load Script Outlines Completed Today
        const outlinesResponse = await fetch(`${SUPABASE_URL}/rest/v1/daily_completions?completion_type=eq.outline_completed&completed_date=eq.${todayStr}&select=completion_id`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        let outlinesCount = 0;
        if (outlinesResponse.ok) {
            const outlinesData = await outlinesResponse.json();
            outlinesCount = outlinesData.length;
        } else {
            console.error('Failed to load outlines completed count');
        }
        
        // Load Scripts Completed Today (final completion)
        const scriptsResponse = await fetch(`${SUPABASE_URL}/rest/v1/daily_completions?completion_type=eq.script_completed&completed_date=eq.${todayStr}&select=completion_id`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        let scriptsCount = 0;
        if (scriptsResponse.ok) {
            const scriptsData = await scriptsResponse.json();
            scriptsCount = scriptsData.length;
        } else {
            console.error('Failed to load scripts completed count');
        }
        
        return { outlinesCount, scriptsCount };
        
    } catch (error) {
        console.error('Error loading completed counts:', error);
        return { outlinesCount: 0, scriptsCount: 0 };
    }
}

// Load notification badge counts
export async function loadNotificationCounts() {
    try {
        const counts = { outlines: 0, chapters: 0, visuals: 0 };

        // Load count for Outlines (status 15)
        const outlinesResponse = await fetch(`${SUPABASE_URL}/rest/v1/scripts?script_status_id=eq.15&select=script_id`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (outlinesResponse.ok) {
            const outlinesData = await outlinesResponse.json();
            counts.outlines = outlinesData.length;
        }
        
        // Load count for Chapters (status 25)
        const chaptersResponse = await fetch(`${SUPABASE_URL}/rest/v1/scripts?script_status_id=eq.25&select=script_id`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (chaptersResponse.ok) {
            const chaptersData = await chaptersResponse.json();
            counts.chapters = chaptersData.length;
        }
        
        // Load count for Visuals (status 46)
        const visualsResponse = await fetch(`${SUPABASE_URL}/rest/v1/scripts?script_status_id=eq.46&select=script_id`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (visualsResponse.ok) {
            const visualsData = await visualsResponse.json();
            counts.visuals = visualsData.length;
        }
        
        return counts;
        
    } catch (error) {
        console.error('Error loading notification counts:', error);
        return { outlines: 0, chapters: 0, visuals: 0 };
    }
}
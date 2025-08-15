/* ================================================= */
/*              SCRIPT OUTLINE EDITOR JS            */
/* ================================================= */

// Supabase Configuration
const SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDk5MTUsImV4cCI6MjA2NjEyNTkxNX0.HBznM8FVX0VnYBN8rTu6T-QOPmq0d60syavTCADl3JI';

// Global Variables
let currentScriptData = null;
let scriptsToReview = [];
let currentScriptIndex = 0;
let hasUnsavedChanges = false;
let autoSaveTimer = null;
let isLoading = false;

/* ================================================= */
/*              COMPLETION TRACKING FUNCTIONS       */
/* ================================================= */

async function loadCompletedTodayCount() {
    try {
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Load Script Outlines Completed Today
        const outlinesResponse = await fetch(`${SUPABASE_URL}/rest/v1/daily_completions?completion_type=eq.outline_completed&completed_date=eq.${todayStr}&select=completion_id`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (outlinesResponse.ok) {
            const outlinesData = await outlinesResponse.json();
            document.getElementById('outlinesCompletedTodayCount').textContent = outlinesData.length;
        } else {
            console.error('Failed to load outlines completed count');
            document.getElementById('outlinesCompletedTodayCount').textContent = '0';
        }
        
        // Load Scripts Completed Today
        const scriptsResponse = await fetch(`${SUPABASE_URL}/rest/v1/daily_completions?completion_type=eq.script_completed&completed_date=eq.${todayStr}&select=completion_id`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (scriptsResponse.ok) {
            const scriptsData = await scriptsResponse.json();
            document.getElementById('scriptsCompletedTodayCount').textContent = scriptsData.length;
        } else {
            console.error('Failed to load scripts completed count');
            document.getElementById('scriptsCompletedTodayCount').textContent = '0';
        }
        
    } catch (error) {
        console.error('Error loading completed counts:', error);
        document.getElementById('outlinesCompletedTodayCount').textContent = '0';
        document.getElementById('scriptsCompletedTodayCount').textContent = '0';
    }
}

async function recordCompletion(scriptId, completionType) {
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

/* ================================================= */
/*              NOTIFICATION COUNTS                 */
/* ================================================= */

async function loadNotificationCounts() {
    try {
        // Load count for Outlines (status 15)
        const outlinesResponse = await fetch(`${SUPABASE_URL}/rest/v1/scripts?script_status_id=eq.15&select=script_id`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (outlinesResponse.ok) {
            const outlinesData = await outlinesResponse.json();
            const outlinesCount = outlinesData.length;
            const outlinesBadge = document.getElementById('outlinesBadge');
            
            if (outlinesCount > 0) {
                outlinesBadge.textContent = outlinesCount;
                outlinesBadge.style.display = 'flex';
            } else {
                outlinesBadge.style.display = 'none';
            }
        }
        
        // Load count for Chapters (status 40)
        const chaptersResponse = await fetch(`${SUPABASE_URL}/rest/v1/scripts?script_status_id=eq.40&select=script_id`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (chaptersResponse.ok) {
            const chaptersData = await chaptersResponse.json();
            const chaptersCount = chaptersData.length;
            const chaptersBadge = document.getElementById('chaptersBadge');
            
            if (chaptersCount > 0) {
                chaptersBadge.textContent = chaptersCount;
                chaptersBadge.style.display = 'flex';
            } else {
                chaptersBadge.style.display = 'none';
            }
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
            const visualsCount = visualsData.length;
            const visualsBadge = document.getElementById('visualsBadge');
            
            if (visualsCount > 0) {
                visualsBadge.textContent = visualsCount;
                visualsBadge.style.display = 'flex';
            } else {
                visualsBadge.style.display = 'none';
            }
        }
        
    } catch (error) {
        console.error('Error loading notification counts:', error);
    }
}

/* ================================================= */
/*              DATA LOADING FUNCTIONS              */
/* ================================================= */

async function loadScriptsToReview() {
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

    scriptsToReview = await response.json();
}

async function loadReferenceData(table, idField, id, valueField) {
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

/* ================================================= */
/*              UTILITY FUNCTIONS                   */
/* ================================================= */

function updateStatus(status, message) {
    const indicator = document.getElementById('statusIndicator');
    if (indicator) {
        indicator.className = `status-indicator status-${status}`;
        indicator.textContent = message;
    }
}

function showNoScriptsMessage() {
    const content = document.getElementById('content');
    const noScriptsMessage = document.getElementById('noScriptsMessage');
    if (content) content.style.display = 'none';
    if (noScriptsMessage) noScriptsMessage.style.display = 'block';
    updateStatus('saved', 'All scripts reviewed');
}

function markUnsaved() {
    if (!hasUnsavedChanges) {
        hasUnsavedChanges = true;
        updateStatus('unsaved', 'Unsaved changes');
    }
}

/* ================================================= */
/*              AUTO-RESIZE FUNCTION                */
/* ================================================= */

function autoResize(textarea) {
    function resize() {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        textarea.style.height = Math.max(scrollHeight, 59) + 'px';
    }
    
    setTimeout(resize, 0);
    textarea.addEventListener('input', resize);
    textarea.addEventListener('paste', function() {
        setTimeout(resize, 0);
    });
}

/* ================================================= */
/*              NAVIGATION FUNCTIONS                */
/* ================================================= */

async function navigateScript(direction) {
    if (isLoading) return;

    if (hasUnsavedChanges) {
        if (!confirm('You have unsaved changes. Do you want to continue without saving?')) {
            return;
        }
    }

    const newIndex = currentScriptIndex + direction;
    if (newIndex >= 0 && newIndex < scriptsToReview.length) {
        currentScriptIndex = newIndex;
        // await loadCurrentScript(); // To be implemented
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) prevBtn.disabled = currentScriptIndex === 0;
    if (nextBtn) nextBtn.disabled = currentScriptIndex === scriptsToReview.length - 1;
}

/* ================================================= */
/*              EVENT LISTENERS                     */
/* ================================================= */

function setupEventListeners() {
    // Add input event listeners for form fields
    document.addEventListener('input', function(e) {
        if (e.target.matches('input, textarea')) {
            markUnsaved();
            
            if (e.target.matches('textarea')) {
                autoResize(e.target);
            }
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            // saveScript(); // To be implemented
        }
    });
}

/* ================================================= */
/*              INITIALIZATION                      */
/* ================================================= */

async function init() {
    try {
        updateStatus('loading', 'Loading scripts...');
        await loadNotificationCounts();
        await loadCompletedTodayCount();
        await loadScriptsToReview();
        
        if (scriptsToReview.length > 0) {
            // await loadCurrentScript(); // To be implemented
            setupEventListeners();
            // startAutoSave(); // To be implemented
        } else {
            showNoScriptsMessage();
        }
    } catch (error) {
        console.error('Initialization error:', error);
        updateStatus('error', `Failed to load scripts: ${error.message}`);
    }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', init);

// Warn before leaving with unsaved changes
window.addEventListener('beforeunload', function(e) {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
    }
});

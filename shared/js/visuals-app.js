/* ================================================= */
/*              SCRIPT VISUALS EDITOR APP           */
/*   Handles beats data with script/visual columns  */
/* ================================================= */

console.log('Visuals app JavaScript loaded successfully');

// Application state
let currentScriptData = null;
let beatsData = [];
let currentScriptIndex = 0;
let hasUnsavedChanges = false;
let autoSaveTimer = null;
let isLoading = false;

// Supabase configuration
const SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDk5MTUsImV4cCI6MjA2NjEyNTkxNX0.HBznM8FVX0VnYBN8rTu6T-QOPmq0d60syavTCADl3JI';

/* ================================================= */
/*              SCRIPTS COMPLETED TODAY             */
/* ================================================= */

async function loadCompletedTodayCount() {
    try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];
        
        // Load Script Visuals Completed Today
        const visualsResponse = await fetch(`${SUPABASE_URL}/rest/v1/daily_completions?completion_type=eq.visuals_completed&completed_date=eq.${todayStr}&select=completion_id`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });
        
        if (visualsResponse.ok) {
            const visualsData = await visualsResponse.json();
            document.getElementById('visualsCompletedTodayCount').textContent = visualsData.length;
        } else {
            console.error('Failed to load visuals completed count');
            document.getElementById('visualsCompletedTodayCount').textContent = '0';
        }
        
        // Load Scripts Completed Today (final completion)
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
        console.error('Error loading completion counts:', error);
        document.getElementById('visualsCompletedTodayCount').textContent = '0';
        document.getElementById('scriptsCompletedTodayCount').textContent = '0';
    }
}

/* ================================================= */
/*              LOAD SCRIPTS AND BEATS DATA        */
/* ================================================= */

// Load scripts that need visual suggestions (status 40)
async function loadScriptsToReview() {
    console.log('Making request to:', `${SUPABASE_URL}/rest/v1/scripts?script_status_id=eq.40&select=script_id,script_headline`);
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/scripts?script_status_id=eq.40&select=script_id,script_headline`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });

    console.log('Response status:', response.status, response.statusText);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Request failed:', errorText);
        throw new Error(`Failed to fetch scripts: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Raw response data:', data);
    return data;
}

// Load beats for the current script
async function loadBeatsData(scriptId) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/beats?script_id=eq.${scriptId}&select=*&order=chapter_number.asc,beat_number.asc`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch beats data');
    }

    return await response.json();
}

// Load script info for display
async function loadScriptInfo(scriptId) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/scripts?script_id=eq.${scriptId}&select=*`, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch script info');
    }

    const data = await response.json();
    return data[0];
}

/* ================================================= */
/*              RENDER VISUAL SUGGESTIONS UI       */
/* ================================================= */

function renderVisualsUI() {
    const visualsList = document.getElementById('visualsList');
    
    if (!beatsData || beatsData.length === 0) {
        visualsList.innerHTML = '<p class="no-data">No beats found for this script.</p>';
        return;
    }

    // Group beats by chapter
    const chapterGroups = {};
    beatsData.forEach(beat => {
        const chapterNum = beat.chapter_number || 1;
        if (!chapterGroups[chapterNum]) {
            chapterGroups[chapterNum] = [];
        }
        chapterGroups[chapterNum].push(beat);
    });

    let html = '';

    // Render each chapter section
    Object.keys(chapterGroups).sort((a, b) => parseInt(a) - parseInt(b)).forEach(chapterNum => {
        const chapterBeats = chapterGroups[chapterNum];
        
        html += `
            <div class="chapter-section">
                <!-- Chapter Title Button -->
                <div class="gradient-button" data-chapter="${chapterNum}">
                    <div class="gradient-button__text">CHAPTER ${chapterNum}</div>
                </div>
                
                <!-- Column Headers -->
                <div class="beats-headers">
                    <div class="beats-header-left">Script Beats:</div>
                    <div class="beats-header-right">Visual Suggestions:</div>
                </div>
                
                <!-- Beats Rows -->
                <div class="beats-container">
        `;
        
        chapterBeats.forEach(beat => {
            html += `
                <div class="beat-row" data-beat-id="${beat.beat_id}">
                    <!-- Two Column Layout -->
                    <div class="beat-columns">
                        <!-- Left Column: Script Beat -->
                        <div class="beat-column-left">
                            <div class="text-field-single">
                                <div class="text-field-single__container">
                                    <textarea class="text-field-single__input beat-script-input" 
                                              data-field="script_beat"
                                              data-beat-id="${beat.beat_id}"
                                              placeholder="Enter script beat...">${beat.script_beat || ''}</textarea>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Right Column: Visual Suggestion -->
                        <div class="beat-column-right">
                            <div class="text-field-single">
                                <div class="text-field-single__container">
                                    <textarea class="text-field-single__input beat-visual-input" 
                                              data-field="visual_suggestion"
                                              data-beat-id="${beat.beat_id}"
                                              placeholder="Enter visual suggestion...">${beat.visual_suggestion || ''}</textarea>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Rating Field -->
                        <div class="beat-rating">
                            <div class="beat-rating-label">Rating / 100:</div>
                            <div class="rating-field">
                                <div class="rating-field__container">
                                    <input type="number" 
                                           class="rating-field__input beat-rating-input"
                                           value="${beat.visual_rating || ''}"
                                           min="1" 
                                           max="100"
                                           data-field="visual_rating"
                                           data-beat-id="${beat.beat_id}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    });

    visualsList.innerHTML = html;
    
    // Setup event listeners for inputs
    setupBeatInputListeners();
}

/* ================================================= */
/*              INPUT EVENT LISTENERS              */
/* ================================================= */

function setupBeatInputListeners() {
    // Add input listeners to all beat inputs
    const beatInputs = document.querySelectorAll('.beat-script-input, .beat-visual-input, .beat-rating-input');
    
    beatInputs.forEach(input => {
        // Setup auto-resize for textareas
        if (input.tagName === 'TEXTAREA') {
            setupAutoResize(input);
        }

        input.addEventListener('input', (e) => {
            const beatId = e.target.getAttribute('data-beat-id');
            const field = e.target.getAttribute('data-field');
            const value = e.target.value;
            
            // Auto-resize and match row heights
            if (e.target.tagName === 'TEXTAREA') {
                autoResizeAndMatchHeights(e.target);
            }
            
            // Update local data
            const beat = beatsData.find(b => b.beat_id == beatId);
            if (beat) {
                beat[field] = value;
                markFieldUnsaved(e.target);
                hasUnsavedChanges = true;
                updateAutoSaveIndicator('Unsaved changes...');
                scheduleAutoSave();
            }
        });

        input.addEventListener('blur', (e) => {
            // Auto-save when user leaves field
            if (hasUnsavedChanges) {
                saveCurrentData();
            }
        });
    });
    
    // Initial resize for all textareas
    setupInitialTextareaHeights();
}

/* ================================================= */
/*              SAVE FUNCTIONALITY                 */
/* ================================================= */

async function saveCurrentData() {
    if (!hasUnsavedChanges || isLoading) {
        return;
    }

    try {
        isLoading = true;
        updateAutoSaveIndicator('Saving...');

        // Save all beats data
        for (const beat of beatsData) {
            const updateData = {
                script_beat: beat.script_beat || '',
                visual_suggestion: beat.visual_suggestion || '',
                visual_rating: beat.visual_rating ? parseInt(beat.visual_rating) : null
            };

            const response = await fetch(`${SUPABASE_URL}/rest/v1/beats?beat_id=eq.${beat.beat_id}`, {
                method: 'PATCH',
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateData)
            });

            if (!response.ok) {
                throw new Error(`Failed to save beat ${beat.beat_id}`);
            }
        }

        // Mark all fields as saved
        const unsavedInputs = document.querySelectorAll('.unsaved');
        unsavedInputs.forEach(input => markFieldSaved(input));

        hasUnsavedChanges = false;
        updateAutoSaveIndicator('All changes saved');
        
        setTimeout(() => {
            updateAutoSaveIndicator('Auto-save: Ready');
        }, 2000);

    } catch (error) {
        console.error('Save error:', error);
        updateAutoSaveIndicator('Save failed - try again');
    } finally {
        isLoading = false;
    }
}

/* ================================================= */
/*              NAVIGATION FUNCTIONS               */
/* ================================================= */

// Make functions globally accessible for onclick handlers
window.navigateScript = navigateScript;
window.saveScript = saveScript;

async function loadCurrentScriptData() {
    if (scriptsToReview.length === 0) {
        showNoScriptsMessage();
        return;
    }

    try {
        const currentScript = scriptsToReview[currentScriptIndex];
        console.log('Loading data for script:', currentScript);
        updateStatusIndicator('Loading script data...');

        // Load script info and beats data
        console.log('Loading script info...');
        currentScriptData = await loadScriptInfo(currentScript.script_id);
        console.log('Script info loaded:', currentScriptData);
        
        console.log('Loading beats data...');
        beatsData = await loadBeatsData(currentScript.script_id);
        console.log('Beats data loaded:', beatsData.length, beatsData);

        // Update UI
        updateScriptInfoDisplay();
        renderVisualsUI();
        updateNavigationButtons();
        updateStatusIndicator('Ready');

    } catch (error) {
        console.error('Error loading script data:', error);
        updateStatusIndicator('Error loading data');
    }
}

function navigateScript(direction) {
    if (hasUnsavedChanges) {
        if (!confirm('You have unsaved changes. Continue without saving?')) {
            return;
        }
    }

    const newIndex = currentScriptIndex + direction;
    if (newIndex >= 0 && newIndex < scriptsToReview.length) {
        currentScriptIndex = newIndex;
        loadCurrentScriptData();
    }
}

/* ================================================= */
/*              UI UPDATE FUNCTIONS                */
/* ================================================= */

function updateScriptInfoDisplay() {
    if (!currentScriptData) return;

    // Show the script info section
    const scriptInfo = document.getElementById('scriptInfo');
    if (scriptInfo) {
        scriptInfo.style.display = 'block';
        
        // Update only the info fields that exist (we removed some to make it shorter)
        const updateField = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || '-';
            }
        };
        
        updateField('scriptIdValue', currentScriptData.script_id);
        updateField('wordsValue', currentScriptData.words);
        updateField('clientValue', currentScriptData.client);
        updateField('channelValue', currentScriptData.channel);
        updateField('typeValue', currentScriptData.type);
        updateField('genreValue', currentScriptData.genre);
        
        // These fields were removed from the HTML to make the info box shorter
        // updateField('subgenreValue', currentScriptData.subgenre);
        // updateField('formatValue', currentScriptData.format);
        // updateField('structureValue', currentScriptData.structure);
        // updateField('researchValue', currentScriptData.research_depth);
        // updateField('toneValue', currentScriptData.tone);
        // updateField('angleValue', currentScriptData.angle);
    }
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = currentScriptIndex <= 0;
    if (nextBtn) nextBtn.disabled = currentScriptIndex >= scriptsToReview.length - 1;
}

function updateStatusIndicator(status) {
    console.log('Updating status to:', status);
    const indicator = document.getElementById('statusIndicator');
    if (indicator) {
        indicator.textContent = status;
        console.log('Status indicator updated successfully');
    } else {
        console.error('Status indicator element not found!');
    }
}

function updateAutoSaveIndicator(status) {
    const indicator = document.getElementById('autoSaveStatus');
    if (indicator) {
        indicator.textContent = status;
    }
}

function showNoScriptsMessage() {
    document.getElementById('content').style.display = 'none';
    document.getElementById('noScriptsMessage').style.display = 'block';
    updateStatusIndicator('No scripts to review');
}

/* ================================================= */
/*              UTILITY FUNCTIONS                  */
/* ================================================= */

function markFieldUnsaved(input) {
    input.classList.add('unsaved');
    input.style.borderColor = '#ff9800';
    input.style.background = 'rgba(255, 152, 0, 0.05)';
}

function markFieldSaved(input) {
    input.classList.remove('unsaved');
    input.style.borderColor = '';
    input.style.background = '';
}

function scheduleAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        if (hasUnsavedChanges && !isLoading) {
            saveCurrentData();
        }
    }, 3000); // Auto-save after 3 seconds of inactivity
}

function startAutoSave() {
    // Auto-save every 30 seconds if there are unsaved changes
    setInterval(() => {
        if (hasUnsavedChanges && !isLoading) {
            saveCurrentData();
        }
    }, 30000);
}

// Auto-resize function for individual textarea
function setupAutoResize(textarea) {
    // Set initial height
    autoResizeTextarea(textarea);
}

function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    const newHeight = Math.max(59, textarea.scrollHeight); // Minimum 59px to match rating field
    textarea.style.height = newHeight + 'px';
    return newHeight;
}

// Auto-resize and match heights in the same row
function autoResizeAndMatchHeights(changedTextarea) {
    const beatRow = changedTextarea.closest('.beat-row');
    if (!beatRow) return;
    
    const textareas = beatRow.querySelectorAll('.beat-script-input, .beat-visual-input');
    let maxHeight = 59; // Minimum height matches rating field
    
    // Calculate the required height for each textarea
    textareas.forEach(textarea => {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        maxHeight = Math.max(maxHeight, scrollHeight);
    });
    
    // Set all textareas and their containers to the same height
    textareas.forEach(textarea => {
        textarea.style.height = maxHeight + 'px';
        // Also update the container height
        const container = textarea.closest('.text-field-single__container');
        if (container) {
            container.style.height = maxHeight + 'px';
        }
    });
    
    // Update rating field container to match
    const ratingContainer = beatRow.querySelector('.rating-field__container');
    if (ratingContainer) {
        ratingContainer.style.height = maxHeight + 'px';
    }
}

// Setup initial heights for all textareas
function setupInitialTextareaHeights() {
    // Process each beat row to match heights
    const beatRows = document.querySelectorAll('.beat-row');
    beatRows.forEach(beatRow => {
        const textareas = beatRow.querySelectorAll('.beat-script-input, .beat-visual-input');
        let maxHeight = 59; // Minimum height matches rating field
        
        // Calculate required height for each textarea
        textareas.forEach(textarea => {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            maxHeight = Math.max(maxHeight, scrollHeight);
        });
        
        // Set all textareas and containers in the row to the same height
        textareas.forEach(textarea => {
            textarea.style.height = maxHeight + 'px';
            const container = textarea.closest('.text-field-single__container');
            if (container) {
                container.style.height = maxHeight + 'px';
            }
        });
        
        // Update rating field container to match
        const ratingContainer = beatRow.querySelector('.rating-field__container');
        if (ratingContainer) {
            ratingContainer.style.height = maxHeight + 'px';
        }
    });
}

/* ================================================= */
/*              SAVE & CONTINUE FUNCTION           */
/* ================================================= */

async function saveScript() {
    try {
        updateAutoSaveIndicator('Saving and continuing...');
        
        // Save current data
        await saveCurrentData();
        
        // Record completion
        const today = new Date().toISOString().split('T')[0];
        const completionResponse = await fetch(`${SUPABASE_URL}/rest/v1/daily_completions`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                completion_type: 'visuals_completed',
                completed_date: today,
                script_id: currentScriptData.script_id
            })
        });

        // Update script status to next stage (if needed)
        // For now, just navigate to next script
        navigateScript(1);
        
        // Reload completion counts
        await loadCompletedTodayCount();
        
    } catch (error) {
        console.error('Error saving and continuing:', error);
        updateAutoSaveIndicator('Save failed - try again');
    }
}

/* ================================================= */
/*              INITIALIZATION                     */
/* ================================================= */

document.addEventListener('DOMContentLoaded', async function() {
    try {
        console.log('Starting visuals editor initialization...');
        updateStatusIndicator('Loading scripts...');
        
        // Load completion counts
        console.log('Loading completion counts...');
        await loadCompletedTodayCount();
        
        // Load scripts to review
        console.log('Loading scripts to review...');
        scriptsToReview = await loadScriptsToReview();
        console.log('Found scripts:', scriptsToReview.length, scriptsToReview);
        
        if (scriptsToReview.length > 0) {
            console.log('Loading first script with ID:', scriptsToReview[0].script_id);
            await loadCurrentScriptData();
            startAutoSave();
        } else {
            console.log('No scripts found to review');
            showNoScriptsMessage();
        }
        
    } catch (error) {
        console.error('Initialization error:', error);
        updateStatusIndicator('Error loading data');
    }
});
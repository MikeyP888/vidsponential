/* ================================================= */
/*              PROMPT EDITOR APP                   */
/* ================================================= */


// Configuration
const SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDk5MTUsImV4cCI6MjA2NjEyNTkxNX0.HBznM8FVX0VnYBN8rTu6T-QOPmq0d60syavTCADl3JI';

// Global variables
let allPrompts = [];
let currentPromptData = null;
let currentSections = [];
let currentPromptIndex = 0;
let changesMade = false;
let autoSaveTimeout = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    updateStatus('Loading prompts...');
    await loadPrompts();
    setupAutoSave();
});

// Load all prompts with active_status_id=1
async function loadPrompts() {
    console.log('=== DEBUGGING PROMPTS LOAD ===');
    
    // First, let's see ALL prompts to understand the data structure
    try {
        console.log('STEP 1: Getting ALL prompts to see structure...');
        const allUrl = `${SUPABASE_URL}/rest/v1/prompts?select=*&limit=10`;
        const allResponse = await fetch(allUrl, {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });
        
        if (allResponse.ok) {
            const allData = await allResponse.json();
            console.log('ALL PROMPTS DATA:', allData);
            console.log('Total prompts in table:', allData.length);
            
            if (allData.length > 0) {
                console.log('First prompt structure:', allData[0]);
                console.log('Available fields:', Object.keys(allData[0]));
            }
        }
    } catch (error) {
        console.error('Error getting all prompts:', error);
    }

    // Now try different possible field names and values
    const testQueries = [
        { name: 'active_status_id=1', url: `${SUPABASE_URL}/rest/v1/prompts?active_status_id=eq.1&select=*` },
        { name: 'active_status_id=true', url: `${SUPABASE_URL}/rest/v1/prompts?active_status_id=eq.true&select=*` },
        { name: 'status_id=1', url: `${SUPABASE_URL}/rest/v1/prompts?status_id=eq.1&select=*` },
        { name: 'active=1', url: `${SUPABASE_URL}/rest/v1/prompts?active=eq.1&select=*` },
        { name: 'is_active=true', url: `${SUPABASE_URL}/rest/v1/prompts?is_active=eq.true&select=*` }
    ];

    for (const test of testQueries) {
        try {
            console.log(`TESTING: ${test.name}`);
            const response = await fetch(test.url, {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`${test.name} - Found ${data.length} records:`, data);
                
                if (data.length > 0) {
                    console.log('SUCCESS! Using this query');
                    allPrompts = data;
                    populatePromptDropdown();
                    updateStatus('Ready');
                    return; // Exit on first success
                }
            }
        } catch (error) {
            console.error(`Error with ${test.name}:`, error);
        }
    }

    // If nothing worked
    showNoPromptsMessage();
    updateStatus('No prompts found with any query');
}

// Populate the prompt dropdown
function populatePromptDropdown() {
    console.log('=== DEBUGGING DROPDOWN POPULATION ===');
    const dropdown = document.getElementById('promptSelect');
    console.log('Dropdown element:', dropdown);
    
    if (!dropdown) {
        console.error('ERROR: promptSelect dropdown not found!');
        return;
    }

    console.log('Current dropdown HTML before clearing:', dropdown.innerHTML);

    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">-- Select a Prompt --</option>';
    console.log('Dropdown cleared, now adding options...');

    // Add prompt options
    allPrompts.forEach((prompt, index) => {
        console.log(`Adding prompt ${index + 1}:`, {
            prompt_id: prompt.prompt_id,
            prompt_title: prompt.prompt_title
        });
        
        const option = document.createElement('option');
        option.value = prompt.prompt_id;
        option.textContent = prompt.prompt_title || `Prompt ${prompt.prompt_id}`;
        dropdown.appendChild(option);
    });

    console.log('Final dropdown HTML:', dropdown.innerHTML);
    console.log('Dropdown options count:', dropdown.options.length);
}

// Load selected prompt
async function loadSelectedPrompt() {
    const dropdown = document.getElementById('promptSelect');
    const promptId = dropdown.value;

    if (!promptId) {
        hideSections();
        hideControls();
        return;
    }

    // Find the selected prompt
    currentPromptData = allPrompts.find(p => p.prompt_id == promptId);
    if (!currentPromptData) {
        console.error('Prompt not found');
        return;
    }

    // Update current index
    currentPromptIndex = allPrompts.findIndex(p => p.prompt_id == promptId);

    // Load sections for this prompt
    await loadPromptSections(promptId);
}

// Load prompt sections
async function loadPromptSections(promptId) {
    updateStatus('Loading sections...');

    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/prompt_sections?prompt_id=eq.${promptId}&order=prompt_section_order_number.asc&select=*`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to load sections');
        }

        currentSections = await response.json();
        console.log(`Loaded ${currentSections.length} sections for prompt ${promptId}`);

        displaySections();
        showControls();
        updateStatus('Ready');
    } catch (error) {
        console.error('Error loading sections:', error);
        updateStatus('Error loading sections');
    }
}

// Display sections
function displaySections() {
    const container = document.getElementById('sectionsList');
    const sectionsContainer = document.getElementById('sectionsContainer');
    
    if (!container) return;

    // Show the sections container
    if (sectionsContainer) {
        sectionsContainer.style.display = 'block';
    }

    // Clear existing content
    container.innerHTML = '';

    if (currentSections.length === 0) {
        container.innerHTML = '<div class="no-data">No sections available for this prompt</div>';
        return;
    }

    // Create HTML for each section
    currentSections.forEach((section, index) => {
        const sectionHTML = `
            <div class="chapter-section" data-section-id="${section.prompt_section_id}">
                <h3 class="chapter-number">Section ${section.prompt_section_order_number || (index + 1)}</h3>
                
                <!-- Section Title Field with Rating -->
                <div class="form-row">
                    <div class="form-row__text-field">
                        <div class="text-field-multi">
                            <label class="text-field-multi__label">Section Title</label>
                            <div class="text-field-multi__container">
                                <textarea 
                                    class="text-field-multi__input section-title-input"
                                    data-field="prompt_section_title"
                                    data-section-id="${section.prompt_section_id}"
                                    oninput="handleFieldChange(this)">${section.prompt_section_title || ''}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="form-row__rating-field">
                        <div class="rating-field">
                            <label class="rating-field__label">Title Rating</label>
                            <div class="rating-field__container">
                                <input 
                                    type="number" 
                                    class="rating-field__input"
                                    data-field="prompt_section_title_mp_rating"
                                    data-section-id="${section.prompt_section_id}"
                                    value="${section.prompt_section_title_mp_rating || ''}"
                                    min="1" 
                                    max="10"
                                    oninput="handleFieldChange(this)">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section Content Field with Rating -->
                <div class="form-row">
                    <div class="form-row__text-field">
                        <div class="text-field-multi">
                            <label class="text-field-multi__label">Section Content</label>
                            <div class="text-field-multi__container">
                                <textarea 
                                    class="text-field-multi__input section-content-input"
                                    data-field="prompt_section"
                                    data-section-id="${section.prompt_section_id}"
                                    oninput="handleFieldChange(this)">${section.prompt_section || ''}</textarea>
                            </div>
                        </div>
                    </div>
                    <div class="form-row__rating-field">
                        <div class="rating-field">
                            <label class="rating-field__label">Content Rating</label>
                            <div class="rating-field__container">
                                <input 
                                    type="number" 
                                    class="rating-field__input"
                                    data-field="prompt_section_mp_rating"
                                    data-section-id="${section.prompt_section_id}"
                                    value="${section.prompt_section_mp_rating || ''}"
                                    min="1" 
                                    max="10"
                                    oninput="handleFieldChange(this)">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += sectionHTML;
    });

    // Setup auto-resize for textareas
    setupAutoResize();
}

// Handle field changes
function handleFieldChange(element) {
    const sectionId = element.dataset.sectionId;
    const field = element.dataset.field;
    const value = element.value;

    // Find the section in our data
    const section = currentSections.find(s => s.prompt_section_id == sectionId);
    if (section) {
        section[field] = value;
        changesMade = true;
        element.classList.add('unsaved');
        scheduleAutoSave();
    }

    // Auto-resize if it's a textarea
    if (element.tagName === 'TEXTAREA') {
        autoResizeTextarea(element);
    }
}

// Setup auto-resize for all textareas
function setupAutoResize() {
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        autoResizeTextarea(textarea);
    });
}

// Auto-resize textarea
function autoResizeTextarea(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = (textarea.scrollHeight) + 'px';
}

// Save prompt sections
async function savePrompt() {
    if (!changesMade || currentSections.length === 0) {
        navigatePrompt(1);
        return;
    }

    updateStatus('Saving...');
    updateAutoSaveStatus('Saving...');

    try {
        // Save each section
        for (const section of currentSections) {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/prompt_sections?prompt_section_id=eq.${section.prompt_section_id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=minimal'
                    },
                    body: JSON.stringify({
                        prompt_section_title: section.prompt_section_title,
                        prompt_section: section.prompt_section,
                        prompt_section_mp_rating: section.prompt_section_mp_rating,
                        prompt_section_title_mp_rating: section.prompt_section_title_mp_rating
                    })
                }
            );

            if (!response.ok) {
                throw new Error(`Failed to save section ${section.prompt_section_id}`);
            }
        }

        // Clear unsaved indicators
        document.querySelectorAll('.unsaved').forEach(el => {
            el.classList.remove('unsaved');
        });

        changesMade = false;
        updateStatus('Saved successfully');
        updateAutoSaveStatus('Auto-save: Ready');

        // Navigate to next prompt
        navigatePrompt(1);
    } catch (error) {
        console.error('Error saving prompt:', error);
        updateStatus('Error saving prompt');
        updateAutoSaveStatus('Auto-save: Error');
    }
}

// Navigate between prompts
function navigatePrompt(direction) {
    if (allPrompts.length === 0) return;

    // Calculate new index
    let newIndex = currentPromptIndex + direction;
    
    // Wrap around
    if (newIndex < 0) {
        newIndex = allPrompts.length - 1;
    } else if (newIndex >= allPrompts.length) {
        newIndex = 0;
    }

    // Update dropdown and load new prompt
    const dropdown = document.getElementById('promptSelect');
    if (dropdown) {
        dropdown.value = allPrompts[newIndex].prompt_id;
        loadSelectedPrompt();
    }
}

// Setup auto-save
function setupAutoSave() {
    // Auto-save every 30 seconds if there are changes
    setInterval(() => {
        if (changesMade) {
            savePrompt();
        }
    }, 30000);
}

// Schedule auto-save
function scheduleAutoSave() {
    updateAutoSaveStatus('Auto-save: Pending...');
    
    if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
    }

    autoSaveTimeout = setTimeout(() => {
        if (changesMade) {
            savePrompt();
        }
    }, 5000); // Save after 5 seconds of inactivity
}

// Show/hide sections
function hideSections() {
    const sectionsContainer = document.getElementById('sectionsContainer');
    if (sectionsContainer) {
        sectionsContainer.style.display = 'none';
    }
}

// Show/hide controls
function showControls() {
    const controlsSection = document.getElementById('controlsSection');
    if (controlsSection) {
        controlsSection.style.display = 'block';
    }
}

function hideControls() {
    const controlsSection = document.getElementById('controlsSection');
    if (controlsSection) {
        controlsSection.style.display = 'none';
    }
}

// Show no prompts message
function showNoPromptsMessage() {
    const message = document.getElementById('noPromptsMessage');
    if (message) {
        message.style.display = 'block';
    }
    hideSections();
    hideControls();
}

// Update status
function updateStatus(message) {
    const statusElement = document.getElementById('statusIndicator');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

// Update auto-save status
function updateAutoSaveStatus(message) {
    const autoSaveElement = document.getElementById('autoSaveStatus');
    if (autoSaveElement) {
        autoSaveElement.textContent = message;
    }
}

// Export functions for HTML onclick handlers
window.loadSelectedPrompt = loadSelectedPrompt;
window.handleFieldChange = handleFieldChange;
window.savePrompt = savePrompt;
window.navigatePrompt = navigatePrompt;
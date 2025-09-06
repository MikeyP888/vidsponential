/* ================================================= */
/*              ADD SCRIPT MAGICAL APP              */
/* ================================================= */

// Configuration
const SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDk5MTUsImV4cCI6MjA2NjEyNTkxNX0.HBznM8FVX0VnYBN8rTu6T-QOPmq0d60syavTCADl3JI';

// Global variables
let allClients = [];
let clientChannels = [];
let selectedClientId = null;
let selectedChannelId = null;
let currentScriptIdeas = [];
let pastScripts = [];
let channelSettings = {
    genre_id: null,
    emotional_tone_id: null,
    script_length: null,
    script_structure_id: null,
    script_format_id: null
};

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Add Script App Initialized');
    updateStatus('Loading...');
    
    // Add sparkle effects
    addSparkleEffects();
    
    await Promise.all([
        loadClients(),
        loadChannelSettings()
    ]);
    
    updateStatus('Ready');
    
    // Add typewriter effect to the page title
    addTypewriterEffect();
});

// ================================================
// PHASE 2: Client and Channel Dropdowns
// ================================================

// Load all clients
async function loadClients() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/clients?select=client_id,client_first_name,client_last_name&order=client_first_name`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to load clients');
        }

        allClients = await response.json();
        console.log(`Loaded ${allClients.length} clients`);

        populateClientDropdown();
    } catch (error) {
        console.error('Error loading clients:', error);
        updateStatus('Error loading clients');
    }
}

// Populate client dropdown
function populateClientDropdown() {
    const dropdown = document.getElementById('clientSelect');
    if (!dropdown) return;

    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">-- Select a Client --</option>';

    // Add client options
    allClients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.client_id;
        const fullName = `${client.client_first_name || ''} ${client.client_last_name || ''}`.trim();
        option.textContent = fullName || `Client ${client.client_id}`;
        dropdown.appendChild(option);
    });
}

// Handle client selection change
async function onClientChange() {
    const dropdown = document.getElementById('clientSelect');
    const channelDropdown = document.getElementById('channelSelect');
    selectedClientId = dropdown.value;

    if (!selectedClientId) {
        // Reset channel dropdown
        channelDropdown.innerHTML = '<option value="">-- Select Client First --</option>';
        channelDropdown.disabled = true;
        selectedChannelId = null;
        return;
    }

    // Load channels for this client
    updateStatus('Loading channels...');
    await loadChannelsForClient(selectedClientId);
}

// Load YouTube channels for selected client
async function loadChannelsForClient(clientId) {
    const channelDropdown = document.getElementById('channelSelect');
    
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/youtube_channels?client_id=eq.${clientId}&select=youtube_channel_id,youtube_channel_name&order=youtube_channel_name`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to load channels');
        }

        clientChannels = await response.json();
        console.log(`Loaded ${clientChannels.length} channels for client ${clientId}`);

        // Enable and populate channel dropdown
        channelDropdown.disabled = false;
        channelDropdown.innerHTML = '<option value="">-- Select a Channel --</option>';

        clientChannels.forEach(channel => {
            const option = document.createElement('option');
            option.value = channel.youtube_channel_id;
            option.textContent = channel.youtube_channel_name || `Channel ${channel.youtube_channel_id}`;
            channelDropdown.appendChild(option);
        });

        updateStatus('Ready');
    } catch (error) {
        console.error('Error loading channels:', error);
        channelDropdown.innerHTML = '<option value="">-- No Channels Available --</option>';
        channelDropdown.disabled = true;
        updateStatus('Error loading channels');
    }
}

// Handle channel selection change
async function onChannelChange() {
    const dropdown = document.getElementById('channelSelect');
    selectedChannelId = dropdown.value;

    if (!selectedChannelId) {
        return;
    }

    // When channel is selected, load pre-generated ideas, past scripts, and saved defaults
    updateStatus('Loading script ideas...');
    await Promise.all([
        loadPreGeneratedIdeas(),
        loadPastScripts(),
        loadChannelDefaults()
    ]);
    updateStatus('Ready');
}

// ================================================
// PHASE 3: Pre-generated Script Ideas
// ================================================

async function loadPreGeneratedIdeas() {
    if (!selectedChannelId) return;
    
    try {
        // Load top 5 performing scripts for this channel
        // Using overall_rating or similar field for performance
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/scripts?youtube_channel_id=eq.${selectedChannelId}&select=script_id,script_headline,script_description,overall_rating&order=overall_rating.desc.nullslast&limit=5`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to load top scripts');
        }

        const topScripts = await response.json();
        console.log(`Loaded ${topScripts.length} top scripts for channel`);

        // Generate ideas based on top scripts
        if (topScripts.length > 0) {
            generateIdeasFromTopScripts(topScripts);
        } else {
            // If no scripts exist, show generic ideas
            showGenericIdeas();
        }
    } catch (error) {
        console.error('Error loading pre-generated ideas:', error);
        showGenericIdeas();
    }
}

// Generate script ideas based on top-performing scripts
function generateIdeasFromTopScripts(topScripts) {
    const ideasGrid = document.getElementById('ideasGrid');
    if (!ideasGrid) return;

    // Create 5 script ideas based on top performers
    const ideas = topScripts.map((script, index) => {
        // Create variations of successful scripts
        const variations = [
            { prefix: "Part 2: ", suffix: " - The Sequel" },
            { prefix: "Advanced ", suffix: " Masterclass" },
            { prefix: "", suffix: " - Complete Guide" },
            { prefix: "Ultimate ", suffix: " Tutorial" },
            { prefix: "", suffix: " - Pro Tips & Tricks" }
        ];

        const variation = variations[index % variations.length];
        const title = variation.prefix + (script.script_headline || `Script ${script.script_id}`) + variation.suffix;
        
        return {
            id: `idea-${index + 1}`,
            title: title,
            summary: script.script_description || 
                     `Based on your top-performing content. This variation could explore new angles and deeper insights on the same topic.`,
            originalScriptId: script.script_id,
            rating: script.overall_rating
        };
    });

    // If we have less than 5, add generic ideas
    while (ideas.length < 5) {
        ideas.push(generateGenericIdea(ideas.length));
    }

    displayScriptIdeas(ideas);
}

// Show generic ideas when no past scripts exist
function showGenericIdeas() {
    const ideas = [];
    for (let i = 0; i < 5; i++) {
        ideas.push(generateGenericIdea(i));
    }
    displayScriptIdeas(ideas);
}

// Generate a generic script idea
function generateGenericIdea(index) {
    const genericIdeas = [
        {
            title: "10 Beginner Mistakes to Avoid",
            summary: "Help your audience avoid common pitfalls with this educational format that consistently performs well."
        },
        {
            title: "Complete Guide for 2024",
            summary: "Comprehensive guides are evergreen content that attract both new and returning viewers."
        },
        {
            title: "5 Hidden Features You Didn't Know",
            summary: "Reveal lesser-known tips and tricks that provide immediate value to your audience."
        },
        {
            title: "How I Achieved [Result] in 30 Days",
            summary: "Personal success stories create emotional connection and inspire action."
        },
        {
            title: "Expert Reacts: Industry Trends",
            summary: "Reaction and analysis content leverages current trends for maximum reach."
        }
    ];

    const idea = genericIdeas[index % genericIdeas.length];
    return {
        id: `generic-idea-${index + 1}`,
        title: idea.title,
        summary: idea.summary
    };
}

// Display script ideas in the grid
function displayScriptIdeas(ideas) {
    const ideasGrid = document.getElementById('ideasGrid');
    if (!ideasGrid) return;

    currentScriptIdeas = ideas;

    // Clear skeleton loaders and display actual ideas
    ideasGrid.innerHTML = ideas.map(idea => `
        <div class="idea-card" data-idea-id="${idea.id}">
            <div class="idea-content">
                <h3 class="idea-title">${idea.title}</h3>
                <p class="idea-summary">${idea.summary}</p>
                ${idea.rating ? `<div class="idea-rating">Based on script with rating: ${idea.rating}</div>` : ''}
            </div>
            <button class="idea-create-btn" onclick="createScript('${idea.id}')">
                Create →
            </button>
        </div>
    `).join('');

    // Add fade-in animation
    const cards = ideasGrid.querySelectorAll('.idea-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateX(-20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateX(0)';
            }, 50);
        }, index * 100);
    });
}

// ================================================
// PHASE 5: Past Scripts Performance Dashboard
// ================================================

async function loadPastScripts() {
    if (!selectedClientId) return;

    try {
        // Load all scripts for this client with performance metrics
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/scripts?client_id=eq.${selectedClientId}&select=script_id,script_headline,created_at,overall_rating,view_count,engagement_rate,youtube_channel_id&order=created_at.desc&limit=20`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to load past scripts');
        }

        pastScripts = await response.json();
        console.log(`Loaded ${pastScripts.length} past scripts for client`);

        displayPastScripts(pastScripts);

    } catch (error) {
        console.error('Error loading past scripts:', error);
        displayNoPastScripts();
    }
}

// Display past scripts with performance data
function displayPastScripts(scripts) {
    const listContainer = document.getElementById('pastScriptsList');
    if (!listContainer) return;

    if (scripts.length === 0) {
        displayNoPastScripts();
        return;
    }

    // Create HTML for each past script
    listContainer.innerHTML = scripts.map((script, index) => {
        const createdDate = script.created_at ? new Date(script.created_at).toLocaleDateString() : 'Unknown';
        const views = script.view_count || 0;
        const rating = script.overall_rating || 'N/A';
        const engagement = script.engagement_rate ? (script.engagement_rate * 100).toFixed(1) + '%' : 'N/A';
        
        return `
            <div class="past-script-item" data-script-id="${script.script_id}" style="opacity: 0; transform: translateX(-20px);">
                <div class="past-script-info">
                    <h4 class="past-script-title">${script.script_headline || `Script ${script.script_id}`}</h4>
                    <div class="past-script-metrics">
                        <span class="metric">
                            <span class="metric-label">Date:</span>
                            <span>${createdDate}</span>
                        </span>
                        <span class="metric">
                            <span class="metric-label">Views:</span>
                            <span>${formatNumber(views)}</span>
                        </span>
                        <span class="metric">
                            <span class="metric-label">Rating:</span>
                            <span>${rating}</span>
                        </span>
                        <span class="metric">
                            <span class="metric-label">Engagement:</span>
                            <span>${engagement}</span>
                        </span>
                    </div>
                </div>
                <div class="past-script-actions">
                    <button class="action-btn action-btn-similar" onclick="createSimilarScript('${script.script_id}')">
                        Create Similar
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Animate items appearing
    const items = listContainer.querySelectorAll('.past-script-item');
    items.forEach((item, index) => {
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 50);
    });
}

// Display message when no past scripts exist
function displayNoPastScripts() {
    const listContainer = document.getElementById('pastScriptsList');
    if (!listContainer) return;

    listContainer.innerHTML = `
        <div class="no-data" style="text-align: center; padding: 40px; color: #666;">
            <p>No past scripts found for this client.</p>
            <p style="margin-top: 10px; font-size: 14px;">Create your first script using the ideas above!</p>
        </div>
    `;
}

// Format large numbers with commas
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
}

// Create similar script ideas based on existing script
async function createSimilarScript(scriptId) {
    const script = pastScripts.find(s => s.script_id == scriptId);
    if (!script) return;

    updateStatus('Generating similar ideas... ✨');
    showLoadingIdeas();

    // Simulate generating similar ideas
    await simulateAIDelay();

    const similarIdeas = [
        {
            id: `similar-${scriptId}-1`,
            title: script.script_headline + " - Part 2",
            summary: "Continue the success with a follow-up that dives deeper into advanced concepts."
        },
        {
            id: `similar-${scriptId}-2`,
            title: "Behind the Scenes: " + script.script_headline,
            summary: "Show your audience the process and effort that went into creating your successful content."
        },
        {
            id: `similar-${scriptId}-3`,
            title: script.script_headline + " - Q&A Session",
            summary: "Answer viewer questions and address comments from your original video."
        },
        {
            id: `similar-${scriptId}-4`,
            title: "Updated: " + script.script_headline + " (2024 Edition)",
            summary: "Refresh your successful content with new information and current trends."
        },
        {
            id: `similar-${scriptId}-5`,
            title: script.script_headline + " - Case Studies",
            summary: "Real-world applications and success stories based on your original content."
        }
    ];

    displayScriptIdeas(similarIdeas);
    updateStatus('Similar ideas generated! ✨');
    
    // Scroll to ideas section
    document.querySelector('.ideas-section').scrollIntoView({ behavior: 'smooth' });
}

// ================================================
// PHASE 4: AI-Powered Idea Generation
// ================================================

async function generateIdeas() {
    const input = document.getElementById('scriptInput').value;
    
    if (!input.trim()) {
        alert('Please enter a script title or description');
        return;
    }

    if (!selectedClientId || !selectedChannelId) {
        alert('Please select a client and channel first');
        return;
    }

    updateStatus('Generating magical ideas... ✨');
    showLoadingIdeas();

    try {
        // Call n8n webhook for AI idea generation
        const webhookUrl = 'YOUR_N8N_WEBHOOK_URL/generate-script-ideas'; // Replace with actual webhook
        
        const requestData = {
            client_id: selectedClientId,
            youtube_channel_id: selectedChannelId,
            user_input: input,
            channel_name: document.getElementById('channelSelect').selectedOptions[0]?.text || '',
            client_name: document.getElementById('clientSelect').selectedOptions[0]?.text || '',
            timestamp: new Date().toISOString()
        };

        console.log('Calling n8n with:', requestData);

        // For now, simulate the response since we don't have the actual webhook
        // In production, uncomment the fetch call below
        
        /* 
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error('Failed to generate ideas');
        }

        const aiIdeas = await response.json();
        */

        // Simulated AI response for demonstration
        await simulateAIDelay();
        const aiIdeas = generateSimulatedAIIdeas(input);

        displayScriptIdeas(aiIdeas);
        updateStatus('Ideas generated successfully! ✨');

    } catch (error) {
        console.error('Error generating ideas:', error);
        updateStatus('Error generating ideas');
        showGenericIdeas(); // Fallback to generic ideas
    }
}

// Show loading state for ideas
function showLoadingIdeas() {
    const ideasGrid = document.getElementById('ideasGrid');
    if (!ideasGrid) return;

    // Show animated skeleton loaders
    ideasGrid.innerHTML = '';
    for (let i = 0; i < 5; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'idea-card skeleton';
        skeleton.innerHTML = `
            <div class="idea-content">
                <div class="idea-title"></div>
                <div class="idea-summary"></div>
            </div>
            <div class="skeleton-button"></div>
        `;
        ideasGrid.appendChild(skeleton);

        // Stagger the animation
        setTimeout(() => {
            skeleton.style.opacity = '0';
            skeleton.style.transform = 'translateX(-20px)';
            skeleton.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                skeleton.style.opacity = '1';
                skeleton.style.transform = 'translateX(0)';
            }, 50);
        }, i * 100);
    }
}

// Simulate AI processing delay
async function simulateAIDelay() {
    return new Promise(resolve => setTimeout(resolve, 2000));
}

// Generate simulated AI ideas (for demonstration)
function generateSimulatedAIIdeas(input) {
    const baseIdea = input.toLowerCase();
    const ideas = [];

    // Create 5 AI-generated variations
    const templates = [
        {
            prefix: "The Ultimate Guide to ",
            suffix: " - Everything You Need to Know",
            summary: "A comprehensive deep-dive covering all aspects, perfect for viewers seeking complete understanding."
        },
        {
            prefix: "",
            suffix: " - My Personal Journey & Lessons Learned",
            summary: "Share authentic experiences and valuable insights that resonate with your audience on a personal level."
        },
        {
            prefix: "Why ",
            suffix: " Will Change Everything in 2024",
            summary: "Forward-looking content that positions you as a thought leader in your niche."
        },
        {
            prefix: "",
            suffix: " - Common Myths Debunked",
            summary: "Educational content that challenges misconceptions and provides clarity to confused viewers."
        },
        {
            prefix: "How to Master ",
            suffix: " in Just 7 Days",
            summary: "Action-oriented content with a clear timeframe that motivates viewers to take immediate action."
        }
    ];

    templates.forEach((template, index) => {
        ideas.push({
            id: `ai-idea-${Date.now()}-${index}`,
            title: template.prefix + input + template.suffix,
            summary: template.summary,
            isAIGenerated: true
        });
    });

    return ideas;
}

// ================================================
// PHASE 6: Script Creation with Progress Tracking
// ================================================

function createScript(ideaId) {
    const idea = currentScriptIdeas.find(i => i.id === ideaId);
    if (!idea) {
        console.error('Idea not found:', ideaId);
        return;
    }

    console.log('Creating script from idea:', idea);
    
    // Start the script creation process
    startScriptCreation(idea);
}

async function startScriptCreation(idea) {
    if (!selectedClientId || !selectedChannelId) {
        alert('Please select a client and channel first');
        return;
    }

    // Show progress modal
    showProgressModal();
    updateProgressStatus('Initializing script creation...', 0);

    try {
        // Prepare data for n8n webhook
        const webhookUrl = 'YOUR_N8N_WEBHOOK_URL/create-script'; // Replace with actual webhook
        
        const requestData = {
            client_id: selectedClientId,
            youtube_channel_id: selectedChannelId,
            script_title: idea.title,
            script_summary: idea.summary,
            idea_id: idea.id,
            original_script_id: idea.originalScriptId || null,
            is_ai_generated: idea.isAIGenerated || false,
            channel_name: document.getElementById('channelSelect').selectedOptions[0]?.text || '',
            client_name: document.getElementById('clientSelect').selectedOptions[0]?.text || '',
            timestamp: new Date().toISOString()
        };

        console.log('Starting script creation with:', requestData);

        // Simulate the script creation process
        // In production, this would be replaced with actual n8n webhook calls
        await simulateScriptCreation();

        /* Production code:
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error('Failed to create script');
        }

        const result = await response.json();
        const scriptId = result.script_id;

        // Poll for progress updates
        await pollScriptProgress(scriptId);
        */

    } catch (error) {
        console.error('Error creating script:', error);
        updateProgressStatus('Error creating script. Please try again.', 100);
        setTimeout(() => {
            hideProgressModal();
        }, 3000);
    }
}

// Simulate script creation process with progress updates
async function simulateScriptCreation() {
    const stages = [
        { status: 'Researching topic...', progress: 10, delay: 1500 },
        { status: 'Analyzing audience preferences...', progress: 25, delay: 2000 },
        { status: 'Generating script outline...', progress: 40, delay: 2500 },
        { status: 'Writing introduction...', progress: 55, delay: 2000 },
        { status: 'Developing main content...', progress: 70, delay: 3000 },
        { status: 'Creating call-to-action...', progress: 85, delay: 1500 },
        { status: 'Finalizing script...', progress: 95, delay: 1000 },
        { status: 'Script created successfully! ✨', progress: 100, delay: 500 }
    ];

    for (const stage of stages) {
        updateProgressStatus(stage.status, stage.progress);
        await new Promise(resolve => setTimeout(resolve, stage.delay));
    }

    // Success actions
    setTimeout(() => {
        hideProgressModal();
        showSuccessNotification();
        // Reload past scripts to show the new one
        loadPastScripts();
    }, 2000);
}

// Poll for real-time progress updates (for production)
async function pollScriptProgress(scriptId) {
    const pollInterval = 2000; // Poll every 2 seconds
    const maxPolls = 60; // Max 2 minutes
    let pollCount = 0;

    const poll = async () => {
        try {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/script_progress?script_id=eq.${scriptId}&select=*`,
                {
                    headers: {
                        'apikey': SUPABASE_KEY,
                        'Authorization': `Bearer ${SUPABASE_KEY}`
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                if (data.length > 0) {
                    const progress = data[0];
                    updateProgressStatus(progress.status_message, progress.progress_percentage);

                    if (progress.progress_percentage >= 100) {
                        // Script creation complete
                        setTimeout(() => {
                            hideProgressModal();
                            showSuccessNotification();
                            loadPastScripts();
                        }, 2000);
                        return;
                    }
                }
            }

            pollCount++;
            if (pollCount < maxPolls) {
                setTimeout(poll, pollInterval);
            } else {
                throw new Error('Script creation timeout');
            }

        } catch (error) {
            console.error('Error polling progress:', error);
            updateProgressStatus('Error getting progress. Please check manually.', 100);
        }
    };

    poll();
}

// Update progress modal status
function updateProgressStatus(status, percentage) {
    const progressBar = document.getElementById('progressBar');
    const progressStatus = document.getElementById('progressStatus');
    const progressTime = document.getElementById('progressTime');

    if (progressBar) {
        progressBar.style.width = percentage + '%';
    }

    if (progressStatus) {
        progressStatus.textContent = status;
    }

    if (progressTime && percentage < 100) {
        // Estimate remaining time based on progress
        const estimatedTotal = 120; // 2 minutes total
        const elapsed = (percentage / 100) * estimatedTotal;
        const remaining = Math.ceil(estimatedTotal - elapsed);
        
        if (remaining > 60) {
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            progressTime.textContent = `Estimated time: ${minutes}m ${seconds}s`;
        } else {
            progressTime.textContent = `Estimated time: ${remaining}s`;
        }
    } else if (progressTime && percentage >= 100) {
        progressTime.textContent = 'Complete!';
    }
}

// Show success notification
function showSuccessNotification() {
    // Show confetti animation
    showConfetti();
    
    // Create a temporary success message
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(to right, rgba(11, 230, 255, 1) 0%, rgba(175, 11, 255, 1) 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-family: 'Inter', sans-serif;
        font-weight: 600;
        font-size: 14px;
        z-index: 10000;
        animation: slideIn 0.5s ease;
    `;
    notification.textContent = 'Script created successfully! ✨';
    document.body.appendChild(notification);

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.5s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 500);
    }, 5000);
}

function createSimilarScript(scriptId) {
    // Phase 5: Will create ideas similar to existing script
    console.log('Creating similar script to:', scriptId);
}

// ================================================
// UTILITY FUNCTIONS
// ================================================

// Update status indicator
function updateStatus(message) {
    const statusElement = document.getElementById('statusIndicator');
    if (statusElement) {
        statusElement.textContent = message;
    }
}

// Show progress modal
function showProgressModal() {
    const modal = document.getElementById('progressModal');
    if (modal) {
        modal.classList.add('active');
        simulateProgress();
    }
}

// Hide progress modal
function hideProgressModal() {
    const modal = document.getElementById('progressModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Simulate progress for demo
function simulateProgress() {
    const progressBar = document.getElementById('progressBar');
    const progressStatus = document.getElementById('progressStatus');
    let progress = 0;

    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) {
            progress = 100;
            clearInterval(interval);
            progressStatus.textContent = 'Script created successfully!';
            setTimeout(() => {
                hideProgressModal();
            }, 2000);
        }
        progressBar.style.width = progress + '%';
    }, 500);
}

// ================================================
// PHASE 7: Magical Polish and Effects
// ================================================

// Add sparkle effects
function addSparkleEffects() {
    // Create sparkles that appear randomly
    const createSparkle = () => {
        const sparkle = document.createElement('div');
        sparkle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: sparkle 1.5s linear;
        `;
        
        // Random position
        sparkle.style.left = Math.random() * window.innerWidth + 'px';
        sparkle.style.top = Math.random() * window.innerHeight + 'px';
        
        document.body.appendChild(sparkle);
        
        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(sparkle);
        }, 1500);
    };
    
    // Create sparkles periodically
    setInterval(createSparkle, 3000);
}

// Add typewriter effect to page title
function addTypewriterEffect() {
    const title = document.querySelector('.page-title');
    if (!title) return;
    
    const originalText = title.textContent;
    title.textContent = '';
    title.style.opacity = '1';
    
    let index = 0;
    const typeInterval = setInterval(() => {
        if (index < originalText.length) {
            title.textContent += originalText[index];
            index++;
        } else {
            clearInterval(typeInterval);
        }
    }, 100);
}

// Add hover sound effect (optional - requires audio file)
function addHoverSounds() {
    const buttons = document.querySelectorAll('button, .idea-card');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            // Play a subtle hover sound
            // const audio = new Audio('hover.mp3');
            // audio.volume = 0.1;
            // audio.play();
        });
    });
}

// Add ripple effect on button clicks
function addRippleEffect(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.6s ease-out;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation style
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Apply ripple effect to all buttons
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' || e.target.classList.contains('idea-create-btn')) {
        addRippleEffect(e);
    }
});

// Add confetti effect on successful script creation
function showConfetti() {
    const confettiCount = 50;
    const colors = ['#0BE6FF', '#AF0BFF', '#FFD700', '#FF69B4', '#00FF00'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: 50%;
            top: 50%;
            pointer-events: none;
            z-index: 10000;
            transform: translate(-50%, -50%);
        `;
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const angle = (Math.PI * 2 * i) / confettiCount;
        const velocity = 200 + Math.random() * 200;
        const duration = 2000 + Math.random() * 1000;
        
        confetti.animate([
            {
                transform: 'translate(-50%, -50%) translate(0, 0) rotate(0deg)',
                opacity: 1
            },
            {
                transform: `translate(-50%, -50%) translate(${Math.cos(angle) * velocity}px, ${Math.sin(angle) * velocity}px) rotate(720deg)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0, .9, .57, 1)'
        });
        
        setTimeout(() => {
            confetti.remove();
        }, duration);
    }
}

// ================================================
// CHANNEL SETTINGS MANAGEMENT
// ================================================

// Load channel settings dropdowns
async function loadChannelSettings() {
    try {
        // Load all setting options in parallel
        await Promise.all([
            loadGenres(),
            loadEmotionalTones(),
            loadStructures(),
            loadFormats()
        ]);
    } catch (error) {
        console.error('Error loading channel settings:', error);
    }
}

// Load genres
async function loadGenres() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/genres?select=genre_id,genre_name&order=genre_name`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (response.ok) {
            const genres = await response.json();
            const dropdown = document.getElementById('genreSelect');
            dropdown.innerHTML = '<option value="">-- Select Genre --</option>';
            genres.forEach(genre => {
                const option = document.createElement('option');
                option.value = genre.genre_id;
                option.textContent = genre.genre_name;
                dropdown.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading genres:', error);
    }
}

// Load emotional tones
async function loadEmotionalTones() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/emotional_tones?select=emotional_tone_id,emotional_tone_name&order=emotional_tone_name`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (response.ok) {
            const tones = await response.json();
            const dropdown = document.getElementById('toneSelect');
            dropdown.innerHTML = '<option value="">-- Select Tone --</option>';
            tones.forEach(tone => {
                const option = document.createElement('option');
                option.value = tone.emotional_tone_id;
                option.textContent = tone.emotional_tone_name;
                dropdown.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading emotional tones:', error);
    }
}

// Load structures
async function loadStructures() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/script_structures?select=script_structure_id,script_structure_name&order=script_structure_name`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (response.ok) {
            const structures = await response.json();
            const dropdown = document.getElementById('structureSelect');
            dropdown.innerHTML = '<option value="">-- Select Structure --</option>';
            structures.forEach(structure => {
                const option = document.createElement('option');
                option.value = structure.script_structure_id;
                option.textContent = structure.script_structure_name;
                dropdown.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading structures:', error);
    }
}

// Load formats
async function loadFormats() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/script_formats?select=script_format_id,script_format_name&order=script_format_name`,
            {
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (response.ok) {
            const formats = await response.json();
            const dropdown = document.getElementById('formatSelect');
            dropdown.innerHTML = '<option value="">-- Select Format --</option>';
            formats.forEach(format => {
                const option = document.createElement('option');
                option.value = format.script_format_id;
                option.textContent = format.script_format_name;
                dropdown.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading formats:', error);
    }
}

// Save channel defaults
async function saveChannelDefaults() {
    if (!selectedChannelId) {
        alert('Please select a channel first');
        return;
    }

    // Collect current settings
    channelSettings = {
        genre_id: document.getElementById('genreSelect').value || null,
        emotional_tone_id: document.getElementById('toneSelect').value || null,
        script_length: document.getElementById('lengthSelect').value || null,
        script_structure_id: document.getElementById('structureSelect').value || null,
        script_format_id: document.getElementById('formatSelect').value || null
    };

    try {
        // Save to localStorage with channel-specific key
        const storageKey = `channel_defaults_${selectedChannelId}`;
        localStorage.setItem(storageKey, JSON.stringify(channelSettings));

        // Show success message
        updateStatus('Channel defaults saved! ✨');
        
        // Show temporary success notification
        const btn = document.querySelector('.save-defaults-btn');
        const originalText = btn.textContent;
        btn.textContent = 'Saved! ✓';
        btn.style.background = 'linear-gradient(to right, #27ae60 0%, #2ecc71 100%)';
        
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
            updateStatus('Ready');
        }, 2000);

    } catch (error) {
        console.error('Error saving defaults:', error);
        updateStatus('Error saving defaults');
    }
}

// Load channel defaults
async function loadChannelDefaults() {
    if (!selectedChannelId) return;

    try {
        const storageKey = `channel_defaults_${selectedChannelId}`;
        const savedDefaults = localStorage.getItem(storageKey);

        if (savedDefaults) {
            channelSettings = JSON.parse(savedDefaults);

            // Apply saved settings to dropdowns
            if (channelSettings.genre_id) {
                document.getElementById('genreSelect').value = channelSettings.genre_id;
            }
            if (channelSettings.emotional_tone_id) {
                document.getElementById('toneSelect').value = channelSettings.emotional_tone_id;
            }
            if (channelSettings.script_length) {
                document.getElementById('lengthSelect').value = channelSettings.script_length;
            }
            if (channelSettings.script_structure_id) {
                document.getElementById('structureSelect').value = channelSettings.script_structure_id;
            }
            if (channelSettings.script_format_id) {
                document.getElementById('formatSelect').value = channelSettings.script_format_id;
            }

            console.log('Loaded channel defaults:', channelSettings);
        }
    } catch (error) {
        console.error('Error loading channel defaults:', error);
    }
}

// Export functions for HTML onclick handlers
window.onClientChange = onClientChange;
window.onChannelChange = onChannelChange;
window.generateIdeas = generateIdeas;
window.createScript = createScript;
window.createSimilarScript = createSimilarScript;
window.saveChannelDefaults = saveChannelDefaults;
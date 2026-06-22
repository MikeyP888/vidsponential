// Script Info Box Component
// Shared component for displaying script information across all editing pages

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

class ScriptInfoBox {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.scriptId = null;
        this.refreshInterval = null;
    }

    // Initialize the component with a script ID
    async init(scriptId, options = {}) {
        this.scriptId = scriptId;

        // Options with defaults
        this.autoRefresh = options.autoRefresh || false;
        this.refreshRate = options.refreshRate || 30000; // 30 seconds

        if (!this.container) {
            console.error('Script info box container not found:', this.containerId);
            return;
        }

        // Load and display the data
        await this.loadAndDisplay();

        // Set up auto-refresh if enabled
        if (this.autoRefresh) {
            this.startAutoRefresh();
        }
    }

    // Load all data efficiently in one query
    async loadAndDisplay() {
        try {
            // Show loading state
            this.showLoading();

            // Fetch all data
            const data = await this.fetchScriptData();

            // Display the data
            this.displayData(data);

        } catch (error) {
            console.error('Error loading script info:', error);
            this.showError('Failed to load script information');
        }
    }

    // Fetch script data with all related information in one query
    async fetchScriptData() {
        try {
            // First, let's try a simple query to see what we get
            const simpleUrl = `${SUPABASE_URL}/rest/v1/scripts?script_id=eq.${this.scriptId}&select=*`;

            const simpleResponse = await fetch(simpleUrl, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!simpleResponse.ok) {
                throw new Error('Failed to fetch basic script data');
            }

            const basicData = await simpleResponse.json();
            console.log('Basic script data:', basicData[0]);

            if (!basicData || basicData.length === 0) {
                throw new Error('Script not found');
            }

            // Now let's fetch related data separately to ensure it works
            const script = basicData[0];
            const enrichedData = await this.enrichScriptData(script);

            console.log('Enriched script data:', enrichedData);
            return enrichedData;

        } catch (error) {
            console.error('Error in fetchScriptData:', error);
            throw error;
        }
    }

    // Enrich script data with related table information
    async enrichScriptData(script) {
        const enriched = { ...script };

        console.log('=== FOREIGN KEYS IN SCRIPT ===');
        console.log('client_id:', script.client_id);
        console.log('youtube_channel_id:', script.youtube_channel_id);
        console.log('content_type_id:', script.content_type_id);
        console.log('genre_id:', script.genre_id);
        console.log('subgenre_id:', script.subgenre_id);
        console.log('script_format_id:', script.script_format_id);
        console.log('research_depth_id:', script.research_depth_id);
        console.log('emotional_tone_id:', script.emotional_tone_id);
        console.log('content_angle_id:', script.content_angle_id);
        console.log('script_structure_id:', script.script_structure_id);
        console.log('opening_chapter_type_id:', script.opening_chapter_type_id);
        console.log('final_chapter_type_id:', script.final_chapter_type_id);
        console.log('visual_suggestion_style_id:', script.visual_suggestion_style_id);
        console.log('author_to_mimic_id:', script.author_to_mimic_id);
        console.log('copywriter_id:', script.copywriter_id);
        console.log('narration_style_id:', script.narration_style_id);

        // Helper function to fetch related data
        const fetchRelated = async (table, idField, selectField, primaryKeyField = null) => {
            const foreignKeyValue = script[idField];
            console.log(`\\n=== FETCHING ${table.toUpperCase()} ===`);
            console.log(`Foreign key ${idField}:`, foreignKeyValue);

            if (!foreignKeyValue) {
                console.log(`❌ No foreign key value for ${idField}, skipping ${table}`);
                return null;
            }

            try {
                // Map foreign key to primary key
                const pkField = primaryKeyField || idField;
                const url = `${SUPABASE_URL}/rest/v1/${table}?${pkField}=eq.${foreignKeyValue}&select=${selectField}`;

                console.log(`🔍 Query URL: ${url}`);

                const response = await fetch(url, {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    }
                });

                console.log(`📡 Response status: ${response.status}`);

                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ ${table} data received:`, data);
                    const result = data[0] || null;
                    if (result) {
                        console.log(`✅ Extracted value: ${result[selectField.split(',')[0]]}`);
                    } else {
                        console.log(`❌ No records found in ${table} for ${pkField}=${foreignKeyValue}`);
                    }
                    return result;
                } else {
                    const errorText = await response.text();
                    console.log(`❌ Error response (${response.status}): ${errorText}`);

                    if (response.status === 401 || response.status === 403) {
                        console.log(`🔒 RLS Policy blocking access to ${table} - this table needs read permissions`);
                    }
                }
            } catch (error) {
                console.log(`❌ Exception fetching ${table}:`, error);
            }
            return null;
        };

        // Fetch all related data with correct primary key mappings
        const [
            client,
            channel,
            contentType,
            genre,
            subgenre,
            format,
            researchDepth,
            tone,
            angle,
            structure,
            openingType,
            finalType,
            visualStyle,
            authorMimic,
            copywriter,
            narrationStyle
        ] = await Promise.all([
            fetchRelated('clients', 'client_id', 'client_first_name,client_last_name', 'client_id'),
            fetchRelated('youtube_channels', 'youtube_channel_id', 'youtube_channel_name', 'youtube_channel_id'),
            fetchRelated('content_types', 'content_type_id', 'content_type', 'content_type_id'),
            fetchRelated('genres', 'genre_id', 'genre', 'genre_id'),
            fetchRelated('subgenres', 'subgenre_id', 'subgenre', 'subgenre_id'),
            fetchRelated('script_formats', 'script_format_id', 'script_format', 'script_format_id'),
            fetchRelated('research_depths', 'research_depth_id', 'research_depth', 'research_depth_id'),
            fetchRelated('emotional_tones', 'emotional_tone_id', 'emotional_tone', 'emotional_tone_id'),
            fetchRelated('content_angles', 'content_angle_id', 'content_angle', 'content_angle_id'),
            fetchRelated('script_structures', 'script_structure_id', 'script_structure', 'script_structure_id'),
            fetchRelated('opening_chapter_types', 'opening_chapter_type_id', 'opening_chapter_type', 'opening_chapter_type_id'),
            fetchRelated('final_chapter_types', 'final_chapter_type_id', 'final_chapter_type', 'final_chapter_type_id'),
            fetchRelated('visual_suggestion_styles', 'visual_suggestion_style_id', 'visual_suggestion_style', 'visual_suggestion_style_id'),
            fetchRelated('authors_to_mimic', 'author_to_mimic_id', 'author_to_mimic', 'author_to_mimic_id'),
            fetchRelated('copywriters', 'copywriter_id', 'copywriter', 'copywriter_id'),
            fetchRelated('narration_styles', 'narration_style_id', 'narration_style', 'narration_style_id')
        ]);

        // Add related data to enriched object
        enriched.clients = client;
        enriched.youtube_channels = channel;
        enriched.content_types = contentType;
        enriched.genres = genre;
        enriched.subgenres = subgenre;
        enriched.script_formats = format;
        enriched.research_depths = researchDepth;
        enriched.emotional_tones = tone;
        enriched.content_angles = angle;
        enriched.script_structures = structure;
        enriched.opening_chapter_types = openingType;
        enriched.final_chapter_types = finalType;
        enriched.visual_suggestion_styles = visualStyle;
        enriched.authors_to_mimic = authorMimic;
        enriched.copywriters = copywriter;
        enriched.narration_styles = narrationStyle;

        // Debug specifically for Author to Mimic
        console.log('🔍 DEBUGGING AUTHOR TO MIMIC:');
        console.log('script.author_to_mimic_id:', script.author_to_mimic_id);
        console.log('authorMimic result:', authorMimic);
        console.log('enriched.authors_to_mimic:', enriched.authors_to_mimic);

        return enriched;
    }

    // Display the data in the info box
    displayData(data) {
        console.log('Raw data received:', data);

        // Define the fields to display based on the CSV
        const fields = [
            { label: 'Script ID', value: data.script_id },
            { label: 'Words', value: data.target_word_count },
            { label: 'Client', value: this.getClientName(data) },
            { label: 'Channel', value: this.getNestedValue(data, 'youtube_channels', 'youtube_channel_name') },
            { label: 'Type', value: this.getNestedValue(data, 'content_types', 'content_type') },
            { label: 'Genre', value: this.getNestedValue(data, 'genres', 'genre') },
            { label: 'Subgenre', value: this.getNestedValue(data, 'subgenres', 'subgenre') },
            { label: 'Format', value: this.getNestedValue(data, 'script_formats', 'script_format') },
            { label: 'Research Depth', value: this.getNestedValue(data, 'research_depths', 'research_depth') },
            { label: 'Tone', value: this.getNestedValue(data, 'emotional_tones', 'emotional_tone') },
            { label: 'Angle', value: this.getNestedValue(data, 'content_angles', 'content_angle') },
            { label: 'Structure', value: this.getNestedValue(data, 'script_structures', 'script_structure') },
            { label: 'Opening Chapter Type', value: this.getNestedValue(data, 'opening_chapter_types', 'opening_chapter_type') },
            { label: 'Final Chapter Type', value: this.getNestedValue(data, 'final_chapter_types', 'final_chapter_type') },
            { label: 'Visual Style', value: this.getNestedValue(data, 'visual_suggestion_styles', 'visual_suggestion_style') },
            { label: 'SEO Keyword', value: data.primary_keyword },
            { label: 'Author to Mimic', value: this.getNestedValue(data, 'authors_to_mimic', 'author_to_mimic') },
            { label: 'Copywriter to Mimic', value: this.getNestedValue(data, 'copywriters', 'copywriter') },
            { label: 'Narration Style', value: this.getNestedValue(data, 'narration_styles', 'narration_style') }
        ];

        console.log('Processed fields:', fields);

        // Debug Author to Mimic specifically
        console.log('🔍 AUTHOR TO MIMIC FIELD DEBUG:');
        console.log('data.authors_to_mimic:', data.authors_to_mimic);
        const authorToMimicValue = this.getNestedValue(data, 'authors_to_mimic', 'author_to_mimic');
        console.log('Extracted author_to_mimic value:', authorToMimicValue);

        // Generate HTML for each field
        const items = fields.map(field => {
            const value = field.value || '-';
            return `
                <div class="info-item">
                    <span class="info-label">${field.label}:</span>
                    <span class="info-value" title="${value}">${value}</span>
                </div>
            `;
        }).join('');

        // Get the script headline for the title
        const scriptTitle = data.script_headline || 'Untitled Script';

        this.container.innerHTML = `
            <div class="section-container">
                <div class="script-info-box">
                    <h2 class="script-info-title">${scriptTitle}</h2>
                    <div class="script-info-grid">
                        ${items}
                    </div>
                </div>
            </div>
        `;

        this.addStyles();
    }

    // Get full client name
    getClientName(data) {
        if (data.clients) {
            const firstName = data.clients.client_first_name || '';
            const lastName = data.clients.client_last_name || '';
            return `${firstName} ${lastName}`.trim() || null;
        }
        return null;
    }

    // Helper to safely get nested values
    getNestedValue(data, parentKey, childKey) {
        if (data[parentKey] && typeof data[parentKey] === 'object') {
            return data[parentKey][childKey];
        }
        return null;
    }

    // Show loading state
    showLoading() {
        this.container.innerHTML = `
            <div class="section-container">
                <div class="script-info-box loading">
                    <div class="loading-spinner">Loading script information...</div>
                </div>
            </div>
        `;
    }

    // Show error state
    showError(message) {
        this.container.innerHTML = `
            <div class="section-container">
                <div class="script-info-box error">
                    <div class="error-message">${message}</div>
                </div>
            </div>
        `;
    }

    // Refresh the data
    async refresh() {
        if (this.scriptId) {
            await this.loadAndDisplay();
        }
    }

    // Start auto-refresh
    startAutoRefresh() {
        this.stopAutoRefresh(); // Clear any existing interval
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, this.refreshRate);
    }

    // Stop auto-refresh
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    // Add component styles (only once)
    addStyles() {
        // Remove old styles if they exist to force refresh
        const oldStyles = document.getElementById('script-info-box-styles');
        if (oldStyles) {
            oldStyles.remove();
        }

        const styles = `
            <style id="script-info-box-styles" data-version="3.1">
                .script-info-box {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%) !important;
                    border: 1px solid #dee2e6 !important;
                    border-radius: 12px !important;
                    padding: 25px 20px 20px 20px !important;
                    margin: 0 !important;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
                    position: relative !important;
                    width: 100% !important;
                    box-sizing: border-box !important;
                }

                .script-info-title {
                    font-size: 1.5rem !important;
                    font-weight: 600 !important;
                    color: #333 !important;
                    margin: 0 0 20px 0 !important;
                    padding: 0 !important;
                    text-align: left !important;
                    line-height: 1.2 !important;
                }

                .script-info-box .script-info-grid {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 8px 20px !important;
                }

                .script-info-box .info-item {
                    display: flex !important;
                    flex-direction: row !important;
                    align-items: center !important;
                    justify-content: flex-start !important;
                    font-size: 12px !important;
                    line-height: 1.3 !important;
                    min-height: 18px !important;
                    overflow: hidden !important;
                    margin: 0 !important;
                    padding: 2px 0 !important;
                }

                .script-info-box .info-label {
                    font-weight: 600 !important;
                    color: #495057 !important;
                    white-space: nowrap !important;
                    margin-right: 6px !important;
                    margin-bottom: 0 !important;
                    flex-shrink: 0 !important;
                    display: inline !important;
                }

                .script-info-box .info-value {
                    color: #212529 !important;
                    font-weight: 600 !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    white-space: nowrap !important;
                    flex: 1 !important;
                    display: inline !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }

                .script-info-box.loading,
                .script-info-box.error {
                    text-align: center;
                    padding: 30px;
                    color: #666;
                }

                .error-message {
                    color: #d9534f;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .loading-spinner::before {
                    content: '⏳';
                    display: inline-block;
                    animation: spin 2s linear infinite;
                    margin-right: 10px;
                }

                /* Responsive adjustments */
                @media (max-width: 768px) {
                    .script-info-grid {
                        grid-template-columns: 1fr;
                        gap: 6px;
                    }

                    .script-info-box {
                        padding: 15px;
                    }

                    .info-item {
                        font-size: 11px;
                    }
                }
            </style>
        `;

        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Cleanup
    destroy() {
        this.stopAutoRefresh();
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// Export for use in other modules
export default ScriptInfoBox;

// Also make it available globally for non-module scripts
window.ScriptInfoBox = ScriptInfoBox;
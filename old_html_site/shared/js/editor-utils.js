// Common utility functions for editor pages
import { SUPABASE_URL, SUPABASE_ANON_KEY, MESSAGES } from './config.js';

// Initialize Supabase client (for pages that need it)
export function initSupabase() {
    if (typeof window.supabase !== 'undefined') {
        return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return null;
}

// Common status indicator update function
export function updateStatus(status, message) {
    // Update sticky status bar (if exists)
    const stickyStatusIndicator = document.getElementById('stickyStatusIndicator');
    if (stickyStatusIndicator) {
        stickyStatusIndicator.textContent = message;
        stickyStatusIndicator.className = `status-indicator status-${status}`;
    }

    // Also update regular status indicator (for backwards compatibility)
    const statusIndicator = document.getElementById('statusIndicator');
    if (statusIndicator) {
        statusIndicator.textContent = message;
        statusIndicator.className = `status-indicator status-${status}`;
    }
}

// Common script info display function
export function displayScriptInfo(scriptData) {
    const scriptInfoElements = {
        scriptIdValue: scriptData.script_id,
        wordsValue: scriptData.target_word_count,
        clientValue: scriptData.client_name,
        channelValue: scriptData.channel_name,
        typeValue: scriptData.script_type,
        genreValue: scriptData.genre,
        subgenreValue: scriptData.subgenre,
        formatValue: scriptData.format,
        structureValue: scriptData.structure,
        researchValue: scriptData.research_depth,
        toneValue: scriptData.tone,
        angleValue: scriptData.angle
    };

    Object.entries(scriptInfoElements).forEach(([elementId, value]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value || '-';
        }
    });

    // Show script info section
    const scriptInfo = document.getElementById('scriptInfo');
    if (scriptInfo) {
        scriptInfo.style.display = 'grid';
    }
}

// Common fetch wrapper with error handling
export async function fetchWithErrorHandling(url, options = {}) {
    const defaultHeaders = {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
    };

    const config = {
        ...options,
        headers: { ...defaultHeaders, ...options.headers }
    };

    try {
        const response = await fetch(url, config);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        // Check if response has content (not 204 No Content)
        if (response.status === 204 || response.headers.get('content-length') === '0') {
            return null; // No content to parse
        }
        
        // Check if the Prefer header requested minimal response
        const preferHeader = config.headers?.['Prefer'];
        if (preferHeader && preferHeader.includes('return=minimal')) {
            return null; // Minimal response requested, no content expected
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

// Common function to load script info
export async function loadScriptInfo(scriptId) {
    const url = `${SUPABASE_URL}/rest/v1/scripts?script_id=eq.${scriptId}&select=*`;
    const data = await fetchWithErrorHandling(url);
    return data[0];
}

// Common function to update script status
export async function updateScriptStatus(scriptId, statusId) {
    const url = `${SUPABASE_URL}/rest/v1/scripts?script_id=eq.${scriptId}`;
    const options = {
        method: 'PATCH',
        body: JSON.stringify({ script_status_id: statusId }),
        headers: { 'Prefer': 'return=minimal' }
    };
    return await fetchWithErrorHandling(url, options);
}

// Common function to show "no scripts" message
export function showNoScriptsMessage(message = 'No scripts found') {
    document.getElementById('content').style.display = 'none';
    const noScriptsElement = document.getElementById('noScriptsMessage');
    if (noScriptsElement) {
        noScriptsElement.innerHTML = `
            <div class="message info">
                <strong>No scripts found</strong><br>
                ${message}
            </div>
        `;
        noScriptsElement.style.display = 'block';
    }
}

// Common function to get week start date (Monday)
export function getWeekStart() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - daysToMonday);
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
}

// Common function to setup unsaved changes tracking
export function setupUnsavedChangesTracking(callback) {
    let hasUnsavedChanges = false;
    
    const trackChanges = (e) => {
        if (e.target.dataset.field) {
            hasUnsavedChanges = true;
            if (callback) callback(true);
            updateStatus('editing', 'Editing data...');
        }
    };

    document.addEventListener('input', trackChanges);
    document.addEventListener('change', trackChanges);

    return {
        hasChanges: () => hasUnsavedChanges,
        reset: () => {
            hasUnsavedChanges = false;
            if (callback) callback(false);
        }
    };
}

// Common function to handle navigation with unsaved changes check
export function handleNavigation(hasUnsavedChanges, navigationFunction) {
    if (hasUnsavedChanges && !confirm(MESSAGES.UNSAVED_CHANGES)) {
        return;
    }
    navigationFunction();
}

// Common function to clean console logs (remove debug statements)
export function cleanupDebugLogs() {
    // This would be used during build process to remove console.log statements
    // For now, it's just a placeholder
    console.info('Debug cleanup would happen here in production build');
}

// Common textarea auto-resize functionality
export function setupTextareaAutoResize() {
    const textareas = document.querySelectorAll('textarea[data-auto-resize]');
    
    textareas.forEach(textarea => {
        const resize = () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        };
        
        textarea.addEventListener('input', resize);
        textarea.addEventListener('change', resize);
        
        // Initial resize
        resize();
    });
}

// Common form validation
export function validateRequiredFields(fieldsSelector) {
    const fields = document.querySelectorAll(fieldsSelector);
    let isValid = true;
    
    fields.forEach(field => {
        if (field.hasAttribute('required') && !field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}
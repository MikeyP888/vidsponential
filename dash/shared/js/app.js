// Main application orchestrator

import { AUTO_SAVE_INTERVAL, COMPLETION_TYPES } from './config.js';
import { 
    updateStatus, 
    updateNavigationButtons, 
    showNoScriptsMessage, 
    validateData,
    getHasUnsavedChanges,
    setHasUnsavedChanges
} from './utils.js';
import {
    loadScriptsToReview,
    loadCurrentScript,
    saveCurrentData,
    recordCompletion,
    loadCompletedTodayCount,
    loadNotificationCounts
} from './api.js';
import {
    displayScriptData,
    setupEventListeners,
    updateNotificationBadges,
    updateCompletionCounts
} from './ui.js';

// Application state
let currentScriptData = null;
let scriptsToReview = [];
let currentScriptIndex = 0;
let autoSaveTimer = null;
let isLoading = false;

// Main initialization function
export async function init() {
    try {
        console.log('=== OUTLINE EDITOR DEBUG: Starting initialization ===');
        updateStatus('loading', 'Loading scripts...');
        
        console.log('=== OUTLINE EDITOR DEBUG: About to load initial data ===');
        
        // Direct API test
        console.log('=== OUTLINE EDITOR DEBUG: Testing direct API call ===');
        try {
            const testResponse = await fetch('https://euzbpslzrimyokzvgbzk.supabase.co/rest/v1/scripts?script_status_id=eq.15&select=script_id,script_headline', {
                headers: {
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDk5MTUsImV4cCI6MjA2NjEyNTkxNX0.HBznM8FVX0VnYBN8rTu6T-QOPmq0d60syavTCADl3JI',
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDk5MTUsImV4cCI6MjA2NjEyNTkxNX0.HBznM8FVX0VnYBN8rTu6T-QOPmq0d60syavTCADl3JI'
                }
            });
            const testData = await testResponse.json();
            console.log('=== OUTLINE EDITOR DEBUG: Direct API result ===', testData);
        } catch (testError) {
            console.error('=== OUTLINE EDITOR DEBUG: Direct API failed ===', testError);
        }
        
        // Load initial data
        const [notificationCounts, completionCounts, scripts] = await Promise.all([
            loadNotificationCounts(),
            loadCompletedTodayCount(),
            loadScriptsToReview()
        ]);
        
        console.log('Loaded data:', { notificationCounts, completionCounts, scriptsCount: scripts.length });
        console.log('Scripts data:', scripts);
        
        // Update UI with counts
        updateNotificationBadges(notificationCounts);
        updateCompletionCounts(completionCounts);
        
        // Set scripts data
        scriptsToReview = scripts;
        
        if (scripts.length > 0) {
            console.log('Loading first script with ID:', scripts[0].script_id);
            await loadCurrentScriptData();
            console.log('Successfully loaded script data');
            setupEventListeners(saveScript);
            startAutoSave();
        } else {
            console.log('No scripts found, showing message...');
            showNoScriptsMessage();
        }
    } catch (error) {
        console.error('Initialization error:', error);
        handleInitializationError(error);
    }
}

// Handle initialization errors
function handleInitializationError(error) {
    updateStatus('error', `Failed to load scripts: ${error.message}`);
    
    document.getElementById('noScriptsMessage').innerHTML = `
        <div class="message error">
            <strong>Error loading scripts:</strong><br>
            ${error.message}<br><br>
            <small>Check the browser console (F12) for more details.</small>
        </div>
    `;
    document.getElementById('content').style.display = 'none';
    document.getElementById('noScriptsMessage').style.display = 'block';
}

// Load current script data and display it
async function loadCurrentScriptData() {
    if (scriptsToReview.length === 0) {
        console.log('No scripts to review, showing message...');
        showNoScriptsMessage();
        return;
    }

    const scriptId = scriptsToReview[currentScriptIndex].script_id;
    console.log('Loading script data for ID:', scriptId);
    
    try {
        updateStatus('loading', 'Loading script data...');
        console.log('Calling loadCurrentScript API...');
        currentScriptData = await loadCurrentScript(scriptId);
        console.log('Received script data:', currentScriptData);
        
        console.log('Calling displayScriptData...');
        displayScriptData(currentScriptData);
        console.log('Script data displayed successfully');
        
        updateNavigationButtons(currentScriptIndex, scriptsToReview);
        updateStatus('saved', 'Loaded successfully');
        setHasUnsavedChanges(false);
    } catch (error) {
        console.error('Error loading script:', error);
        updateStatus('error', 'Failed to load script data');
    }
}

// Main save function called by Save button
export async function saveScript() {
    await performSave(true, true);
}

// Core save functionality
async function performSave(changeStatus = false, showValidationErrors = false) {
    if (isLoading) return;

    const validation = validateData(showValidationErrors);
    if (showValidationErrors && !validation.isValid) {
        updateStatus('error', 'Please fix validation errors');
        return;
    }

    isLoading = true;
    updateStatus('loading', 'Saving...');

    try {
        await saveCurrentData(currentScriptData, changeStatus);
        
        setHasUnsavedChanges(false);
        document.querySelectorAll('.unsaved').forEach(el => {
            el.classList.remove('unsaved');
        });

        if (changeStatus) {
            // Record the completion
            await recordCompletion(currentScriptData.script.script_id, COMPLETION_TYPES.OUTLINE_COMPLETED);
            
            // Remove from review list
            scriptsToReview.splice(currentScriptIndex, 1);
            
            // Refresh counts
            const [notificationCounts, completionCounts] = await Promise.all([
                loadNotificationCounts(),
                loadCompletedTodayCount()
            ]);
            
            updateNotificationBadges(notificationCounts);
            updateCompletionCounts(completionCounts);
            
            if (scriptsToReview.length === 0) {
                showNoScriptsMessage();
            } else {
                if (currentScriptIndex >= scriptsToReview.length) {
                    currentScriptIndex = 0;
                }
                await loadCurrentScriptData();
            }
            updateStatus('saved', 'Saved & moved to next');
        } else {
            updateStatus('saved', 'Saved');
        }

    } catch (error) {
        console.error('Save error:', error);
        updateStatus('error', 'Save failed');
    } finally {
        isLoading = false;
    }
}

// Navigate between scripts
export async function navigateScript(direction) {
    if (isLoading) return;

    if (getHasUnsavedChanges()) {
        if (!confirm('You have unsaved changes. Do you want to continue without saving?')) {
            return;
        }
    }

    const newIndex = currentScriptIndex + direction;
    if (newIndex >= 0 && newIndex < scriptsToReview.length) {
        currentScriptIndex = newIndex;
        await loadCurrentScriptData();
    }
}

// Start auto-save timer
function startAutoSave() {
    setInterval(() => {
        if (getHasUnsavedChanges() && !isLoading) {
            autoSave();
        }
    }, AUTO_SAVE_INTERVAL);
}

// Perform auto-save
async function autoSave() {
    try {
        const autoSaveStatus = document.getElementById('autoSaveStatus');
        if (autoSaveStatus) {
            autoSaveStatus.textContent = 'Auto-save: Saving...';
        }
        
        await performSave(false, false);
        
        if (autoSaveStatus) {
            autoSaveStatus.textContent = 'Auto-save: Saved';
            setTimeout(() => {
                autoSaveStatus.textContent = 'Auto-save: Ready';
            }, 2000);
        }
    } catch (error) {
        const autoSaveStatus = document.getElementById('autoSaveStatus');
        if (autoSaveStatus) {
            autoSaveStatus.textContent = 'Auto-save: Failed';
        }
        console.error('Auto-save failed:', error);
    }
}

// Make functions available globally for HTML onclick handlers
window.saveScript = saveScript;
window.navigateScript = navigateScript;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting initialization...');
    console.log('=== OUTLINE EDITOR DEBUG: DOM listener triggered ===');
    init().catch(error => {
        console.error('Failed to initialize app:', error);
        console.error('=== OUTLINE EDITOR DEBUG: Initialization failed ===', error);
    });
});
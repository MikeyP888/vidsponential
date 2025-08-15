// Utility functions

// Global state for unsaved changes
let hasUnsavedChanges = false;

// Update status indicator
export function updateStatus(status, message) {
    const indicator = document.getElementById('statusIndicator');
    indicator.className = `status-indicator status-${status}`;
    indicator.textContent = message;
}

// Mark changes as unsaved
export function markUnsaved() {
    if (!hasUnsavedChanges) {
        hasUnsavedChanges = true;
        updateStatus('unsaved', 'Unsaved changes');
        
        document.querySelectorAll('.chapter-ti-7a2807fb2c20, .chapter-ou-7a2807fb2c18').forEach(el => {
            el.classList.add('unsaved');
        });
    }
}

// Update navigation button states
export function updateNavigationButtons(currentScriptIndex, scriptsToReview) {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.disabled = currentScriptIndex === 0;
    nextBtn.disabled = currentScriptIndex === scriptsToReview.length - 1;
}

// Show message when no scripts available
export function showNoScriptsMessage() {
    document.getElementById('content').style.display = 'none';
    document.getElementById('noScriptsMessage').style.display = 'block';
    updateStatus('saved', 'All scripts reviewed');
}

// Auto-resize textarea elements
export function autoResize(textarea) {
    function resize() {
        // Check field type for special handling
        const isTitleField = textarea.classList.contains('chapter-ti-7a2807fb2c20');
        const isOutlineField = textarea.classList.contains('chapter-ou-7a2807fb2c18');
        
        if (isTitleField) {
            // TITLE/HEADLINE FIELDS: Keep same height as rating field (59px) for single line
            const content = textarea.value;
            const hasLineBreaks = content.includes('\n');
            
            if (!hasLineBreaks && content.length < 100) {
                // Single line or short text - LOCK to rating field height
                textarea.style.height = '59px';
                textarea.style.maxHeight = '59px';
                textarea.style.overflow = 'hidden';
            } else {
                // Multiple lines - allow expansion but keep minimum
                textarea.style.maxHeight = 'none';
                textarea.style.overflow = 'auto';
                textarea.style.height = 'auto';
                const scrollHeight = textarea.scrollHeight;
                textarea.style.height = Math.max(scrollHeight, 59) + 'px';
            }
        } else if (isOutlineField) {
            // CHAPTER OUTLINE: Always expand to show all content
            // Reset height first to get accurate scrollHeight
            textarea.style.height = 'auto';
            textarea.style.overflow = 'hidden';
            textarea.style.maxHeight = 'none';
            
            // Force recalculation by triggering reflow
            textarea.offsetHeight;
            
            const scrollHeight = textarea.scrollHeight;
            // Always expand to fit content, minimum 150px, add buffer for padding
            const newHeight = Math.max(scrollHeight + 20, 150);
            textarea.style.height = newHeight + 'px';
        } else {
            // OTHER FIELDS: Normal auto-resize behavior
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height = Math.max(scrollHeight, 59) + 'px';
        }
    }
    
    // Initial resize with multiple attempts for initial load
    setTimeout(resize, 0);
    setTimeout(resize, 10);
    setTimeout(resize, 50);
    
    // Add event listeners
    textarea.addEventListener('input', resize);
    textarea.addEventListener('paste', function() {
        setTimeout(resize, 0);
    });
}

// Data validation logic
export function validateData(showErrors = false) {
    let isValid = true;

    document.querySelectorAll('.validation-error').forEach(el => {
        el.classList.remove('validation-error');
    });
    document.querySelectorAll('.error-message').forEach(el => {
        el.remove();
    });

    if (!showErrors) {
        return { isValid: true, errors: [] };
    }

    const workingHeadline = document.getElementById('workingHeadline');
    if (!workingHeadline.value.trim()) {
        workingHeadline.classList.add('validation-error');
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = 'Working headline is required';
        workingHeadline.parentNode.appendChild(error);
        isValid = false;
    }

    const primaryKeyword = document.getElementById('primaryKeyword');
    if (!primaryKeyword.value.trim()) {
        primaryKeyword.classList.add('validation-error');
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = 'Primary keyword is required';
        primaryKeyword.parentNode.appendChild(error);
        isValid = false;
    }

    return { isValid, errors: [] };
}

// Getters and setters for unsaved changes state
export function getHasUnsavedChanges() {
    return hasUnsavedChanges;
}

export function setHasUnsavedChanges(value) {
    hasUnsavedChanges = value;
}
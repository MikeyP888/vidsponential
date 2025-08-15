/* ================================================= */
/*              REUSABLE COMPONENT FUNCTIONS        */
/* ================================================= */

/**
 * Design System Components for Script Editor Pages
 * Contains reusable functions for creating and managing UI components
 */

class ComponentLibrary {
    
    /**
     * 1. VIDSPONENTIAL LOGO COMPONENT
     * Creates a standardized logo element
     */
    static createLogo(src = "../shared/assets/vidsponential logo.png", alt = "Vidsponential Logo") {
        const logo = document.createElement('img');
        logo.src = src;
        logo.alt = alt;
        logo.className = 'vidsponential-logo';
        return logo;
    }

    /**
     * 2. TAB NAVIGATION COMPONENT
     * Creates tab navigation with notification badges
     */
    static createTabNavigation(tabs) {
        const container = document.createElement('div');
        container.className = 'tab-navigation';

        tabs.forEach(tab => {
            const tabBtn = document.createElement('a');
            tabBtn.href = tab.href;
            tabBtn.className = `tab-nav-btn tab-nav-btn--${tab.active ? 'primary' : 'secondary'}`;
            tabBtn.setAttribute('data-status', tab.status || '');
            tabBtn.textContent = tab.label;

            if (tab.badgeCount && tab.badgeCount > 0) {
                const badge = document.createElement('span');
                badge.className = 'tab-nav-badge';
                badge.id = tab.badgeId || '';
                badge.textContent = tab.badgeCount;
                badge.style.display = 'flex';
                tabBtn.appendChild(badge);
            } else if (tab.badgeId) {
                const badge = document.createElement('span');
                badge.className = 'tab-nav-badge';
                badge.id = tab.badgeId;
                badge.textContent = '0';
                badge.style.display = 'none';
                tabBtn.appendChild(badge);
            }

            container.appendChild(tabBtn);
        });

        return container;
    }

    /**
     * 3. SINGLE-LINE TEXT FIELD COMPONENT
     * Creates a single-line editable text field with label
     */
    static createSingleLineTextField(config) {
        const {
            label,
            placeholder = '',
            value = '',
            id = '',
            dataAttributes = {}
        } = config;

        const container = document.createElement('div');
        container.className = 'text-field-single';

        const labelEl = document.createElement('label');
        labelEl.className = 'text-field-single__label';
        labelEl.textContent = label;
        if (id) labelEl.setAttribute('for', id);

        const inputContainer = document.createElement('div');
        inputContainer.className = 'text-field-single__container';

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'text-field-single__input';
        input.placeholder = placeholder;
        input.value = value;
        if (id) input.id = id;

        // Add data attributes
        Object.entries(dataAttributes).forEach(([key, val]) => {
            input.setAttribute(`data-${key}`, val);
        });

        inputContainer.appendChild(input);
        container.appendChild(labelEl);
        container.appendChild(inputContainer);

        return { container, input, label: labelEl };
    }

    /**
     * 4. MULTI-LINE TEXT FIELD COMPONENT
     * Creates a multi-line editable text field with label and auto-resize
     */
    static createMultiLineTextField(config) {
        const {
            label,
            placeholder = '',
            value = '',
            id = '',
            dataAttributes = {}
        } = config;

        const container = document.createElement('div');
        container.className = 'text-field-multi';

        const labelEl = document.createElement('label');
        labelEl.className = 'text-field-multi__label';
        labelEl.textContent = label;
        if (id) labelEl.setAttribute('for', id);

        const inputContainer = document.createElement('div');
        inputContainer.className = 'text-field-multi__container';

        const textarea = document.createElement('textarea');
        textarea.className = 'text-field-multi__input';
        textarea.placeholder = placeholder;
        textarea.value = value;
        if (id) textarea.id = id;

        // Add data attributes
        Object.entries(dataAttributes).forEach(([key, val]) => {
            textarea.setAttribute(`data-${key}`, val);
        });

        // Auto-resize functionality
        this.setupAutoResize(textarea);

        inputContainer.appendChild(textarea);
        container.appendChild(labelEl);
        container.appendChild(inputContainer);

        return { container, input: textarea, label: labelEl };
    }

    /**
     * 5. RATING INPUT FIELD COMPONENT
     * Creates a centered rating input field (1-100)
     */
    static createRatingField(config) {
        const {
            label = 'Rating / 100:',
            value = '',
            id = '',
            min = 1,
            max = 100,
            dataAttributes = {}
        } = config;

        const container = document.createElement('div');
        container.className = 'rating-field';

        const labelEl = document.createElement('label');
        labelEl.className = 'rating-field__label';
        labelEl.textContent = label;
        if (id) labelEl.setAttribute('for', id);

        const inputContainer = document.createElement('div');
        inputContainer.className = 'rating-field__container';

        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'rating-field__input';
        input.min = min;
        input.max = max;
        input.value = value;
        if (id) input.id = id;

        // Add data attributes
        Object.entries(dataAttributes).forEach(([key, val]) => {
            input.setAttribute(`data-${key}`, val);
        });

        inputContainer.appendChild(input);
        container.appendChild(labelEl);
        container.appendChild(inputContainer);

        return { container, input, label: labelEl };
    }

    /**
     * 6. GRADIENT BUTTON COMPONENT
     * Creates a gradient button like "CHAPTER 1"
     */
    static createGradientButton(config) {
        const {
            text,
            onClick = null,
            id = '',
            dataAttributes = {}
        } = config;

        const button = document.createElement('button');
        button.className = 'gradient-button';
        if (id) button.id = id;

        // Add data attributes
        Object.entries(dataAttributes).forEach(([key, val]) => {
            button.setAttribute(`data-${key}`, val);
        });

        const textEl = document.createElement('div');
        textEl.className = 'gradient-button__text';
        textEl.textContent = text;

        button.appendChild(textEl);

        if (onClick) {
            button.addEventListener('click', onClick);
        }

        return button;
    }

    /**
     * FORM ROW LAYOUT COMPONENT
     * Creates a horizontal form row with text field and rating field
     */
    static createFormRow(config) {
        const {
            textField,
            ratingField
        } = config;

        const row = document.createElement('div');
        row.className = 'form-row';

        const textFieldWrapper = document.createElement('div');
        textFieldWrapper.className = 'form-row__text-field';
        textFieldWrapper.appendChild(textField.container);

        const ratingFieldWrapper = document.createElement('div');
        ratingFieldWrapper.className = 'form-row__rating-field';
        ratingFieldWrapper.appendChild(ratingField.container);

        row.appendChild(textFieldWrapper);
        row.appendChild(ratingFieldWrapper);

        return { container: row, textField, ratingField };
    }

    /**
     * SECTION CONTAINER COMPONENT
     * Creates a section container with consistent styling
     */
    static createSectionContainer(content) {
        const container = document.createElement('div');
        container.className = 'section-container';
        
        if (typeof content === 'string') {
            container.innerHTML = content;
        } else if (content instanceof HTMLElement) {
            container.appendChild(content);
        } else if (Array.isArray(content)) {
            content.forEach(item => {
                if (typeof item === 'string') {
                    container.innerHTML += item;
                } else if (item instanceof HTMLElement) {
                    container.appendChild(item);
                }
            });
        }

        return container;
    }

    /**
     * AUTO-RESIZE FUNCTIONALITY
     * Sets up auto-resize for textarea elements
     */
    static setupAutoResize(textarea) {
        function resize() {
            const isTitleField = textarea.classList.contains('text-field-single__input');
            const isOutlineField = textarea.classList.contains('text-field-multi__input');
            
            if (isTitleField) {
                const content = textarea.value;
                const hasLineBreaks = content.includes('\n');
                
                if (!hasLineBreaks && content.length < 100) {
                    textarea.style.height = '59px';
                    textarea.style.maxHeight = '59px';
                    textarea.style.overflow = 'hidden';
                } else {
                    textarea.style.maxHeight = 'none';
                    textarea.style.overflow = 'auto';
                    textarea.style.height = 'auto';
                    const scrollHeight = textarea.scrollHeight;
                    textarea.style.height = Math.max(scrollHeight, 59) + 'px';
                }
            } else if (isOutlineField) {
                textarea.style.height = 'auto';
                textarea.style.overflow = 'hidden';
                textarea.style.maxHeight = 'none';
                
                textarea.offsetHeight; // Force reflow
                
                const scrollHeight = textarea.scrollHeight;
                const newHeight = Math.max(scrollHeight + 20, 150);
                textarea.style.height = newHeight + 'px';
            } else {
                textarea.style.height = 'auto';
                const scrollHeight = textarea.scrollHeight;
                textarea.style.height = Math.max(scrollHeight, 59) + 'px';
            }
        }
        
        // Initial resize with multiple attempts
        setTimeout(resize, 0);
        setTimeout(resize, 10);
        setTimeout(resize, 50);
        
        // Event listeners
        textarea.addEventListener('input', resize);
        textarea.addEventListener('paste', function() {
            setTimeout(resize, 0);
        });
    }

    /**
     * UPDATE NOTIFICATION BADGE
     * Updates the count on a notification badge
     */
    static updateNotificationBadge(badgeId, count) {
        const badge = document.getElementById(badgeId);
        if (badge) {
            if (count > 0) {
                badge.textContent = count;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    /**
     * MARK FIELD AS UNSAVED
     * Adds visual indication that a field has unsaved changes
     */
    static markFieldUnsaved(field) {
        field.classList.add('unsaved');
    }

    /**
     * MARK FIELD AS SAVED
     * Removes visual indication of unsaved changes
     */
    static markFieldSaved(field) {
        field.classList.remove('unsaved');
    }

    /**
     * VALIDATION ERROR HELPER
     * Shows validation error on a field
     */
    static showValidationError(field, message) {
        field.classList.add('validation-error');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        field.parentNode.appendChild(error);
    }

    /**
     * CLEAR VALIDATION ERROR
     * Removes validation error from a field
     */
    static clearValidationError(field) {
        field.classList.remove('validation-error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentLibrary;
}

// Make available globally for browser use
if (typeof window !== 'undefined') {
    window.ComponentLibrary = ComponentLibrary;
}
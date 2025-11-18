// Auto-resizing Textarea Functionality
// Makes textareas automatically expand to fit their content

class TextareaAutosize {
    constructor() {
        this.textareas = new Set();
        this.init();
    }

    init() {
        // Auto-size existing textareas on page load
        this.setupExistingTextareas();
        
        // Set up observer for dynamically added textareas
        this.setupMutationObserver();
        
        // Set up global function for manual initialization
        window.initializeTextareaAutosize = () => this.setupExistingTextareas();
    }

    setupExistingTextareas() {
        // Find all textareas with the multi-line class
        const textareas = document.querySelectorAll('.text-field-multi__input, textarea');
        textareas.forEach(textarea => {
            if (!this.textareas.has(textarea)) {
                this.setupTextarea(textarea);
            }
        });
    }

    setupTextarea(textarea) {
        // Add to our tracking set
        this.textareas.add(textarea);
        
        // Force initial minimum height immediately
        textarea.style.minHeight = '225px';
        textarea.style.height = '225px';
        
        // Set initial height based on content
        this.adjustHeight(textarea);
        
        // Add event listeners for content changes
        textarea.addEventListener('input', () => this.adjustHeight(textarea));
        textarea.addEventListener('paste', () => {
            // Delay to allow paste content to be processed
            setTimeout(() => this.adjustHeight(textarea), 10);
        });
        
        // Handle when textarea gets focus (in case content was programmatically set)
        textarea.addEventListener('focus', () => this.adjustHeight(textarea));
        
        // Handle window resize
        window.addEventListener('resize', () => this.adjustHeight(textarea));
    }

    adjustHeight(textarea) {
        // Store current cursor position and scroll state
        const cursorPosition = textarea.selectionStart;
        const cursorEnd = textarea.selectionEnd;
        const scrollTop = textarea.scrollTop;
        const wasActiveElement = document.activeElement === textarea;

        // Store the page scroll position to prevent jumping
        const pageScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const pageScrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

        // Reset height to get accurate scrollHeight
        textarea.style.height = 'auto';
        textarea.style.overflowY = 'hidden'; // Always hidden - no scrolling

        // Calculate the needed height to fit all content
        const minHeight = 225; // Minimum height in pixels (about 8-9 lines)
        const extraPadding = 15; // Extra bottom padding to match top padding

        // Always expand to fit ALL content - no maximum height limit
        const newHeight = Math.max(minHeight, textarea.scrollHeight + extraPadding);

        // Set the new height to show all content
        textarea.style.height = newHeight + 'px';

        // Ensure no scrolling is ever needed
        textarea.style.overflowY = 'hidden';
        textarea.style.resize = 'none';

        // Restore cursor position and focus if textarea was active
        if (wasActiveElement) {
            textarea.focus();
            textarea.setSelectionRange(cursorPosition, cursorEnd);
            // Only restore scroll if we had some scroll position
            if (scrollTop > 0) {
                textarea.scrollTop = scrollTop;
            }
        }

        // Restore the page scroll position to prevent jumping
        window.scrollTo(pageScrollLeft, pageScrollTop);
    }

    setupMutationObserver() {
        // Watch for new textareas being added to the page
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // Check if the node itself is a textarea
                        if (node.matches && node.matches('.text-field-multi__input, textarea')) {
                            this.setupTextarea(node);
                        }
                        
                        // Check for textareas within the added node
                        if (node.querySelectorAll) {
                            const textareas = node.querySelectorAll('.text-field-multi__input, textarea');
                            textareas.forEach(textarea => {
                                if (!this.textareas.has(textarea)) {
                                    this.setupTextarea(textarea);
                                }
                            });
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Manual method to resize all textareas (useful after content is programmatically set)
    resizeAll() {
        this.textareas.forEach(textarea => {
            if (textarea.isConnected) { // Check if textarea is still in DOM
                this.adjustHeight(textarea);
            } else {
                // Remove from tracking if no longer in DOM
                this.textareas.delete(textarea);
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.textareaAutosize = new TextareaAutosize();
});

// Export for module use
export default TextareaAutosize;
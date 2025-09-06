// Bottom Navigation Component
// Shared component for consistent navigation controls across all editor pages

class BottomNavigation {
    constructor(config = {}) {
        this.config = {
            onSave: config.onSave || (() => console.log('Save clicked')),
            onNavigate: config.onNavigate || ((direction) => console.log('Navigate:', direction)),
            showAutoSave: config.showAutoSave !== false,
            autoSaveInterval: config.autoSaveInterval || 30000,
            ...config
        };
        
        this.currentIndex = 0;
        this.totalItems = 0;
        this.hasUnsavedChanges = false;
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        this.render();
        this.attachEventListeners();
        document.body.classList.add('has-bottom-nav');
    }
    
    render() {
        // Remove existing navigation if present
        const existing = document.querySelector('.bottom-navigation');
        if (existing) {
            existing.remove();
        }
        
        const navHTML = `
            <div class="bottom-navigation">
                <div class="controls-row">
                    <div class="navigation-controls">
                        <button class="btn btn-navigation" id="prevBtn" disabled>
                            ← Previous
                        </button>
                        <button class="btn btn-navigation" id="nextBtn" disabled>
                            Next →
                        </button>
                    </div>
                    ${this.config.showAutoSave ? `
                        <div>
                            <div class="auto-save-indicator" id="autoSaveStatus">Auto-save: Ready</div>
                        </div>
                    ` : ''}
                    <div>
                        <button class="btn btn-success" id="saveBtn">
                            Save & Continue
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', navHTML);
        
        // Store references to elements
        this.elements = {
            prevBtn: document.getElementById('prevBtn'),
            nextBtn: document.getElementById('nextBtn'),
            saveBtn: document.getElementById('saveBtn'),
            autoSaveStatus: document.getElementById('autoSaveStatus')
        };
    }
    
    attachEventListeners() {
        // Previous button
        this.elements.prevBtn.addEventListener('click', () => {
            if (!this.isLoading && this.currentIndex > 0) {
                this.handleNavigate(-1);
            }
        });
        
        // Next button
        this.elements.nextBtn.addEventListener('click', () => {
            if (!this.isLoading && this.currentIndex < this.totalItems - 1) {
                this.handleNavigate(1);
            }
        });
        
        // Save button
        this.elements.saveBtn.addEventListener('click', () => {
            if (!this.isLoading) {
                this.handleSave();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S for save
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.handleSave();
            }
            
            // Alt + Left/Right for navigation
            if (e.altKey) {
                if (e.key === 'ArrowLeft' && !this.elements.prevBtn.disabled) {
                    this.handleNavigate(-1);
                } else if (e.key === 'ArrowRight' && !this.elements.nextBtn.disabled) {
                    this.handleNavigate(1);
                }
            }
        });
    }
    
    async handleNavigate(direction) {
        if (this.hasUnsavedChanges) {
            const confirmMsg = 'You have unsaved changes. Do you want to continue without saving?';
            if (!confirm(confirmMsg)) {
                return;
            }
        }
        
        this.setLoading(true);
        try {
            await this.config.onNavigate(direction);
        } finally {
            this.setLoading(false);
        }
    }
    
    async handleSave() {
        this.setLoading(true);
        this.updateAutoSaveStatus('saving', 'Saving...');
        
        try {
            await this.config.onSave();
            this.hasUnsavedChanges = false;
            this.updateAutoSaveStatus('saved', 'Saved successfully');
            
            // Reset status after 2 seconds
            setTimeout(() => {
                this.updateAutoSaveStatus('ready', 'Auto-save: Ready');
            }, 2000);
        } catch (error) {
            console.error('Save error:', error);
            this.updateAutoSaveStatus('error', 'Save failed');
        } finally {
            this.setLoading(false);
        }
    }
    
    updateNavigation(currentIndex, totalItems) {
        this.currentIndex = currentIndex;
        this.totalItems = totalItems;
        
        // Update button states
        this.elements.prevBtn.disabled = currentIndex === 0 || totalItems === 0;
        this.elements.nextBtn.disabled = currentIndex >= totalItems - 1 || totalItems === 0;
        
        // Update button text to show position
        if (totalItems > 0) {
            this.elements.prevBtn.innerHTML = `← Previous (${currentIndex + 1}/${totalItems})`;
            this.elements.nextBtn.innerHTML = `Next (${currentIndex + 1}/${totalItems}) →`;
        }
    }
    
    setLoading(loading) {
        this.isLoading = loading;
        
        // Disable/enable all buttons
        this.elements.saveBtn.disabled = loading;
        
        if (!loading) {
            // Re-apply navigation button states
            this.updateNavigation(this.currentIndex, this.totalItems);
        } else {
            this.elements.prevBtn.disabled = true;
            this.elements.nextBtn.disabled = true;
        }
    }
    
    updateAutoSaveStatus(status, message) {
        if (!this.elements.autoSaveStatus) return;
        
        this.elements.autoSaveStatus.textContent = message;
        this.elements.autoSaveStatus.className = `auto-save-indicator ${status}`;
    }
    
    setUnsavedChanges(hasChanges) {
        this.hasUnsavedChanges = hasChanges;
        if (hasChanges) {
            this.updateAutoSaveStatus('unsaved', 'Unsaved changes');
        }
    }
    
    // Auto-save functionality
    startAutoSave(saveFunction) {
        if (!this.config.showAutoSave) return;
        
        this.autoSaveTimer = setInterval(async () => {
            if (this.hasUnsavedChanges && !this.isLoading) {
                this.updateAutoSaveStatus('saving', 'Auto-saving...');
                try {
                    await saveFunction();
                    this.hasUnsavedChanges = false;
                    this.updateAutoSaveStatus('saved', 'Auto-saved');
                    
                    setTimeout(() => {
                        this.updateAutoSaveStatus('ready', 'Auto-save: Ready');
                    }, 2000);
                } catch (error) {
                    console.error('Auto-save failed:', error);
                    this.updateAutoSaveStatus('error', 'Auto-save failed');
                }
            }
        }, this.config.autoSaveInterval);
    }
    
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }
    
    destroy() {
        this.stopAutoSave();
        const nav = document.querySelector('.bottom-navigation');
        if (nav) {
            nav.remove();
        }
        document.body.classList.remove('has-bottom-nav');
    }
}

// Export for use in other modules
window.BottomNavigation = BottomNavigation;
export default BottomNavigation;
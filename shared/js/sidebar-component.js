// Vertical Sidebar Navigation Component
import { sidebarConfig, currentUserRole, notificationBadges, fetchScriptCounts } from './sidebar-config.js';

class SidebarNavigation {
    constructor() {
        this.currentPage = this.getCurrentPageName();
        this.badges = {};
        this.init();
        
        // Set up global function for badge updates
        window.updateSidebarBadges = (newBadges) => {
            this.updateBadges(newBadges);
        };
    }

    getCurrentPageName() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop();
        return fileName || 'index.html';
    }

    hasAccess(item) {
        return item.roles.includes(currentUserRole);
    }

    createSectionHeader(section) {
        return `
            <div class="sidebar-section-header">
                <span class="section-icon">${section.icon}</span>
                <span class="section-title">${section.title}</span>
            </div>
        `;
    }

    createNavigationItem(item) {
        if (!this.hasAccess(item)) {
            return '';
        }

        const isActive = this.currentPage === item.fileName;
        const badgeCount = this.badges[item.id] || notificationBadges[item.id];
        const badge = badgeCount ? `<span class="nav-badge" data-badge-id="${item.id}">${badgeCount}</span>` : '';
        
        return `
            <div class="sidebar-nav-item ${isActive ? 'active' : ''}" onclick="navigateToPage('${item.fileName}')">
                <span class="nav-icon">${item.icon}</span>
                <span class="nav-label">${item.label}</span>
                ${badge}
            </div>
        `;
    }

    updateBadges(newBadges) {
        this.badges = newBadges;
        // Update just the badge elements without re-rendering entire sidebar
        Object.keys(newBadges).forEach(id => {
            const badgeElement = document.querySelector(`[data-badge-id="${id}"]`);
            if (badgeElement) {
                badgeElement.textContent = newBadges[id];
            } else {
                // If badge doesn't exist but should, re-render the sidebar
                const hasItem = sidebarConfig.sections.some(section => 
                    section.items.some(item => item.id === id)
                );
                if (hasItem) {
                    this.init();
                }
            }
        });
        
        // Remove badges that should no longer be shown
        document.querySelectorAll('.nav-badge').forEach(badge => {
            const id = badge.dataset.badgeId;
            if (!newBadges[id]) {
                badge.remove();
            }
        });
    }

    createSection(section) {
        const visibleItems = section.items.filter(item => this.hasAccess(item));
        if (visibleItems.length === 0) {
            return '';
        }

        const sectionHeader = this.createSectionHeader(section);
        const sectionItems = visibleItems.map(item => this.createNavigationItem(item)).join('');
        
        return `
            <div class="sidebar-section">
                ${sectionHeader}
                <div class="sidebar-section-items">
                    ${sectionItems}
                </div>
            </div>
        `;
    }

    render() {
        const sections = sidebarConfig.sections
            .map(section => this.createSection(section))
            .filter(section => section !== '')
            .join('');

        return `
            <div class="sidebar-navigation">
                <div class="sidebar-header">
                    <div class="sidebar-logo">
                        <img src="../shared/assets/vidsponential logo.png" alt="Vidsponential" class="logo-image">
                    </div>
                </div>
                <div class="sidebar-content">
                    ${sections}
                </div>
                <div class="sidebar-footer">
                    <div class="user-info">
                        <span class="user-role">${currentUserRole}</span>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        const container = document.getElementById('sidebarContainer');
        if (container) {
            container.innerHTML = this.render();
        }
    }
}

// Navigation function
function navigateToPage(fileName) {
    const currentPath = window.location.pathname;
    const currentDir = currentPath.substring(0, currentPath.lastIndexOf('/'));
    window.location.href = `${currentDir}/${fileName}`;
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new SidebarNavigation();
});

// Export for manual initialization if needed
window.SidebarNavigation = SidebarNavigation;
window.navigateToPage = navigateToPage;

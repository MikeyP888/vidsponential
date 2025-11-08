// Vertical Sidebar Navigation Component
import { sidebarConfig, adminSidebarConfig, userSidebarConfig, currentUserRole, notificationBadges, fetchScriptCounts } from './sidebar-config.js';

class SidebarNavigation {
    constructor() {
        this.currentPage = this.getCurrentPageName();
        this.badges = {};
        this.isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        this.collapsedSections = JSON.parse(localStorage.getItem('collapsedSections') || '{}');
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

    toggleSection(sectionTitle) {
        this.collapsedSections[sectionTitle] = !this.collapsedSections[sectionTitle];
        localStorage.setItem('collapsedSections', JSON.stringify(this.collapsedSections));

        const sectionElement = document.querySelector(`[data-section="${sectionTitle}"]`);
        if (sectionElement) {
            if (this.collapsedSections[sectionTitle]) {
                sectionElement.classList.add('collapsed');
            } else {
                sectionElement.classList.remove('collapsed');
            }
        }
    }

    createSectionHeader(section) {
        return `
            <div class="sidebar-section-header" onclick="window.sidebarInstance.toggleSection('${section.title}')">
                <div class="section-header-left">
                    <span class="section-icon">${section.icon}</span>
                    <span class="section-title">${section.title}</span>
                </div>
                <svg class="section-toggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="6,9 12,15 18,9"></polyline>
                </svg>
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
        const href = this.getNavigationHref(item.fileName);

        return `
            <a href="${href}" class="sidebar-nav-item ${isActive ? 'active' : ''}">
                <span class="nav-icon">${item.icon}</span>
                <span class="nav-label">${item.label}</span>
                ${badge}
            </a>
        `;
    }

    getNavigationHref(fileName) {
        // Determine the correct base path based on the file
        if (fileName === '../index.html') {
            return '/pages/index.html';
        } else if (fileName.startsWith('../dashboards/')) {
            return `/pages/${fileName.substring(3)}`;
        } else {
            return `/pages/editing-pages/${fileName}`;
        }
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
        const isCollapsed = this.collapsedSections[section.title];

        return `
            <div class="sidebar-section ${isCollapsed ? 'collapsed' : ''}" data-section="${section.title}">
                ${sectionHeader}
                <div class="sidebar-section-items">
                    ${sectionItems}
                </div>
            </div>
        `;
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        localStorage.setItem('sidebarCollapsed', this.isCollapsed);

        const sidebar = document.querySelector('.sidebar-navigation');
        const body = document.body;

        if (this.isCollapsed) {
            sidebar.classList.add('collapsed');
            body.classList.add('sidebar-collapsed');
        } else {
            sidebar.classList.remove('collapsed');
            body.classList.remove('sidebar-collapsed');
        }
    }

    render() {
        const sections = sidebarConfig.sections
            .map(section => this.createSection(section))
            .filter(section => section !== '')
            .join('');

        // Create Script button for user view
        const createScriptButton = currentUserRole === 'user' && sidebarConfig.createScriptButton ? `
            <a href="${this.getNavigationHref(sidebarConfig.createScriptButton.fileName)}" class="create-script-btn">
                <span class="create-script-icon">${sidebarConfig.createScriptButton.icon}</span>
                <span class="create-script-label">${sidebarConfig.createScriptButton.label}</span>
            </a>
        ` : '';

        return `
            <div class="sidebar-navigation ${this.isCollapsed ? 'collapsed' : ''}">
                <button class="collapse-btn" onclick="window.sidebarInstance.toggleCollapse()">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15,18 9,12 15,6"></polyline>
                    </svg>
                </button>
                <div class="sidebar-header">
                    <div class="sidebar-logo">
                        <img src="../../shared/assets/vidsponential logo.png" alt="Vidsponential" class="logo-image">
                    </div>
                    ${createScriptButton}
                </div>
                <div class="sidebar-content">
                    ${sections}
                </div>
                <div class="sidebar-footer">
                    <div class="user-info">
                        <span class="user-role ${currentUserRole === 'admin' ? 'active' : ''}" onclick="switchRole('admin')">admin</span>
                        <span class="user-role ${currentUserRole === 'user' ? 'active' : ''}" onclick="switchRole('user')">user</span>
                    </div>
                </div>
            </div>
        `;
    }

    init() {
        const container = document.getElementById('sidebarContainer');
        if (container) {
            container.innerHTML = this.render();

            // Apply initial body state
            if (this.isCollapsed) {
                document.body.classList.add('sidebar-collapsed');
            }
        }
    }
}

// Navigation function
function navigateToPage(fileName) {
    // Determine the correct base path based on the file
    let basePath;

    if (fileName === '../index.html') {
        // Navigate to the root index page
        basePath = window.location.origin;
        window.location.href = `${basePath}/pages/index.html`;
        return;
    } else if (fileName.startsWith('../dashboards/')) {
        // Navigate to a dashboard page
        basePath = window.location.origin;
        window.location.href = `${basePath}/pages/${fileName.substring(3)}`;
        return;
    } else {
        // Default: navigate to editing-pages directory
        basePath = window.location.origin;
        window.location.href = `${basePath}/pages/editing-pages/${fileName}`;
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.sidebarInstance = new SidebarNavigation();
});

// Role switching function
function switchRole(role) {
    localStorage.setItem('userRole', role);
    window.location.reload();
}

// Export for manual initialization if needed
window.SidebarNavigation = SidebarNavigation;
window.navigateToPage = navigateToPage;
window.switchRole = switchRole;

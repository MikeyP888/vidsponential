// Sidebar Component
class SidebarComponent {
    constructor() {
        this.init();
    }

    init() {
        this.createSidebar();
        this.setActiveLink();
        this.initMobileToggle();
    }

    createSidebar() {
        const sidebarContainer = document.getElementById('sidebarContainer');
        if (!sidebarContainer) return;

        const sidebarHTML = `
            <button class="sidebar-toggle" onclick="toggleSidebar()">☰</button>
            <div class="sidebar-header">
                <h2 class="sidebar-title">Vidsponential</h2>
                <p class="sidebar-subtitle">Content Management</p>
            </div>
            <nav class="sidebar-nav">
                <div class="nav-section">
                    <h3 class="nav-section-title">Job Management</h3>
                    <a href="add_job.html" class="sidebar-nav-link">
                        <span class="nav-icon">📝</span>Add Upwork Job
                    </a>
                    <a href="manage_jobs.html" class="sidebar-nav-link">
                        <span class="nav-icon">📋</span>Manage Jobs
                    </a>
                    <a href="upwork_proposals_editor.html" class="sidebar-nav-link">
                        <span class="nav-icon">✏️</span>Proposal Editor
                    </a>
                </div>
                
                <div class="nav-section">
                    <h3 class="nav-section-title">Content Creation</h3>
                    <a href="add_script.html" class="sidebar-nav-link">
                        <span class="nav-icon">➕</span>Add Script
                    </a>
                    <a href="manage_scripts.html" class="sidebar-nav-link">
                        <span class="nav-icon">📑</span>Manage Scripts
                    </a>
                    <a href="script_research_editor.html" class="sidebar-nav-link">
                        <span class="nav-icon">🔍</span>Research Editor
                    </a>
                    <a href="script_outline_editor.html" class="sidebar-nav-link">
                        <span class="nav-icon">📝</span>Outline Editor
                    </a>
                    <a href="script_chapter_editor.html" class="sidebar-nav-link">
                        <span class="nav-icon">📖</span>Chapter Editor
                    </a>
                    <a href="script_visuals_editor.html" class="sidebar-nav-link">
                        <span class="nav-icon">🎨</span>Visuals Editor
                    </a>
                </div>
                
                <div class="nav-section">
                    <h3 class="nav-section-title">Communication</h3>
                    <a href="email_editor.html" class="sidebar-nav-link">
                        <span class="nav-icon">📧</span>Email Editor
                    </a>
                    <a href="social_posts_editor.html" class="sidebar-nav-link">
                        <span class="nav-icon">📱</span>Social Posts
                    </a>
                    <a href="tweet_editor.html" class="sidebar-nav-link">
                        <span class="nav-icon">🐦</span>Tweet Editor
                    </a>
                    <a href="press_releases.html" class="sidebar-nav-link">
                        <span class="nav-icon">📰</span>Press Releases
                    </a>
                    <a href="article_editor.html" class="sidebar-nav-link">
                        <span class="nav-icon">📄</span>Article Editor
                    </a>
                </div>
                
                <div class="nav-section">
                    <h3 class="nav-section-title">System</h3>
                    <a href="add_client.html" class="sidebar-nav-link">
                        <span class="nav-icon">👤</span>Add Client
                    </a>
                    <a href="add_channel.html" class="sidebar-nav-link">
                        <span class="nav-icon">📺</span>Add Channel
                    </a>
                    <a href="prompt_editor.html" class="sidebar-nav-link">
                        <span class="nav-icon">🤖</span>Prompt Editor
                    </a>
                    <a href="user_settings.html" class="sidebar-nav-link">
                        <span class="nav-icon">⚙️</span>User Settings
                    </a>
                    <a href="admin_settings.html" class="sidebar-nav-link">
                        <span class="nav-icon">🔧</span>Admin Settings
                    </a>
                </div>
                
                <div class="nav-section">
                    <a href="index.html" class="sidebar-nav-link">
                        <span class="nav-icon">🏠</span>Home
                    </a>
                </div>
            </nav>
        `;

        sidebarContainer.innerHTML = sidebarHTML;
    }

    setActiveLink() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        const links = document.querySelectorAll('.sidebar-nav-link');
        links.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (linkPath === currentPage) {
                link.classList.add('active');
            }
        });
    }

    initMobileToggle() {
        // Mobile toggle functionality is handled by the toggleSidebar function
    }
}

// Global function for mobile sidebar toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebarContainer');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Initialize sidebar when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SidebarComponent();
});

// Export for module usage
export { SidebarComponent };
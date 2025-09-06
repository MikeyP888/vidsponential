// Sidebar Navigation Configuration
// Supports role-based visibility and organized sections

const sidebarConfig = {
    sections: [
        {
            title: "Create a Script",
            icon: "✨",
            items: [
                {
                    id: "add_script",
                    fileName: "add_script.html",
                    label: "Add Script",
                    icon: "📝",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "prompts",
                    fileName: "prompt_editor.html", 
                    label: "Prompt Editor",
                    icon: "🎯",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "research",
                    fileName: "script_research_editor.html",
                    label: "Research Editor", 
                    icon: "🔍",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "outlines",
                    fileName: "script_outline_editor.html",
                    label: "Outline Editor",
                    icon: "📋",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "chapters",
                    fileName: "script_chapter_editor.html",
                    label: "Chapter Editor",
                    icon: "📖",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "visuals",
                    fileName: "script_visuals_editor.html",
                    label: "Visual Editor",
                    icon: "🎨",
                    roles: ["admin", "premium"]
                }
            ]
        },
        {
            title: "Upwork Jobs",
            icon: "💼", 
            items: [
                {
                    id: "manage_jobs",
                    fileName: "manage_jobs.html",
                    label: "Manage Jobs",
                    icon: "📊",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "add_job", 
                    fileName: "add_job.html",
                    label: "Add Job",
                    icon: "➕",
                    roles: ["admin", "user", "premium"] 
                },
                {
                    id: "manage_scripts",
                    fileName: "manage_scripts.html", 
                    label: "Manage Scripts",
                    icon: "📋",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "add_client",
                    fileName: "add_client.html",
                    label: "Add Client", 
                    icon: "👤",
                    roles: ["admin", "premium"]
                },
                {
                    id: "add_channel",
                    fileName: "add_channel.html", 
                    label: "Add Channel",
                    icon: "📺",
                    roles: ["admin", "premium"]
                }
            ]
        },
        {
            title: "Marketing",
            icon: "📈",
            items: [
                {
                    id: "proposals",
                    fileName: "upwork_proposals_editor.html",
                    label: "Upwork Proposals",
                    icon: "💼",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "social_posts",
                    fileName: "social_posts_editor.html",
                    label: "Social Posts",
                    icon: "📱",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "tweets",
                    fileName: "tweet_editor.html",
                    label: "Tweets",
                    icon: "🐦",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "articles",
                    fileName: "article_editor.html",
                    label: "Articles",
                    icon: "📄",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "emails",
                    fileName: "email_editor.html",
                    label: "Email Campaigns",
                    icon: "📧",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "press_releases",
                    fileName: "press_releases.html",
                    label: "Press Releases", 
                    icon: "📰",
                    roles: ["admin", "premium"]
                }
            ]
        },
        {
            title: "Dashboard", 
            icon: "📊",
            items: [
                {
                    id: "dashboard",
                    fileName: "../index.html",
                    label: "Dashboard",
                    icon: "🏠", 
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "user_settings",
                    fileName: "user_settings.html",
                    label: "User Settings",
                    icon: "⚙️",
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "admin_settings", 
                    fileName: "admin_settings.html",
                    label: "Admin Settings",
                    icon: "🔐",
                    roles: ["admin"]
                }
            ]
        }
    ]
};

// User role configuration - change this to control access
const currentUserRole = "admin"; // Options: "admin", "premium", "user"

// Notification badges (will be updated dynamically)
let notificationBadges = {
    // These will be populated by fetchScriptCounts()
};

// Supabase configuration
const SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDk5MTUsImV4cCI6MjA2NjEyNTkxNX0.HBznM8FVX0VnYBN8rTu6T-QOPmq0d60syavTCADl3JI';

// Function to fetch script counts for each editor
async function fetchScriptCounts() {
    try {
        // Define which status_id each editor should show
        const editorStatuses = {
            'research': 12,    // Research Editor
            'outlines': 15,    // Outline Editor  
            'chapters': 25,    // Chapter Editor
            'visuals': 40      // Visual Editor
        };

        // Fetch counts for each status
        for (const [editorId, statusId] of Object.entries(editorStatuses)) {
            const response = await fetch(
                `${SUPABASE_URL}/rest/v1/scripts?script_status_id=eq.${statusId}&select=script_id`,
                {
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Range': '0-999',
                        'Prefer': 'count=exact'
                    }
                }
            );

            if (response.ok) {
                // Get the count from the content-range header
                const contentRange = response.headers.get('content-range');
                if (contentRange) {
                    const match = contentRange.match(/\d+\-\d+\/(\d+)/);
                    const count = match ? parseInt(match[1]) : 0;
                    
                    // Only set badge if count > 0
                    if (count > 0) {
                        notificationBadges[editorId] = count;
                    }
                }
            }
        }
        
        // Trigger update of sidebar display if it exists
        if (window.updateSidebarBadges) {
            window.updateSidebarBadges(notificationBadges);
        }
        
    } catch (error) {
        console.error('Error fetching script counts:', error);
    }
}

// Fetch counts on load
fetchScriptCounts();

// Refresh counts every 30 seconds
setInterval(fetchScriptCounts, 30000);

export { sidebarConfig, currentUserRole, notificationBadges, fetchScriptCounts };
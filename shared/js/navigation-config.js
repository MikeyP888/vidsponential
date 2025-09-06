/* ================================================= */
/*           NAVIGATION CONFIGURATION FILE          */
/*     Central config for all navigation buttons    */
/* ================================================= */

const NAVIGATION_CONFIG = {
    // Top row buttons (positions 1-6)
    topRow: [
        {
            position: 1,
            fileName: 'add_script.html',
            label: 'Add Script',
            table: null,
            statusField: null,
            statusValue: null,
            queryString: null,
            badgeId: 'addScriptBadge',
            showBadge: false // No badge needed for this page
        },
        {
            position: 2,
            fileName: 'script_research_editor.html',
            label: 'Research',
            table: 'scripts',
            statusField: 'script_status_id',
            statusValue: 12,
            queryString: 'script_status_id=eq.12',
            badgeId: 'researchBadge'
        },
        {
            position: 3,
            fileName: 'script_outline_editor.html',
            label: 'Outlines',
            table: 'scripts',
            statusField: 'script_status_id',
            statusValue: 15,
            queryString: 'script_status_id=eq.15',
            badgeId: 'outlinesBadge'
        },
        {
            position: 4,
            fileName: 'script_chapter_editor.html',
            label: 'Chapters',
            table: 'scripts',
            statusField: 'script_status_id',
            statusValue: 25,
            queryString: 'script_status_id=eq.25',
            badgeId: 'chaptersBadge'
        },
        {
            position: 5,
            fileName: 'script_visuals_editor.html',
            label: 'Visuals',
            table: 'scripts',
            statusField: 'script_status_id',
            statusValue: 40,
            queryString: 'script_status_id=eq.40',
            badgeId: 'visualsBadge'
        },
        {
            position: 6,
            fileName: 'prompt_editor.html',
            label: 'Prompts',
            table: null, // Not yet configured
            statusField: null,
            statusValue: null,
            queryString: null,
            badgeId: 'promptsBadge',
            showBadge: false // Don't show badge until configured
        }
    ],
    
    // Bottom row buttons (positions 1-6)
    bottomRow: [
        {
            position: 1,
            fileName: 'upwork_proposals_editor.html',
            label: 'Proposals',
            table: 'cover_letters',
            statusField: 'cover_letter_status_id',
            statusValue: 10,
            queryString: 'cover_letter_status_id=eq.10',
            badgeId: 'proposalsBadge'
        },
        {
            position: 2,
            fileName: 'social_posts_editor.html',
            label: 'Posts',
            table: 'social_posts',
            statusField: 'social_post_status_id',
            statusValue: 10,
            queryString: 'social_post_status_id=eq.10',
            badgeId: 'postsBadge'
        },
        {
            position: 3,
            fileName: 'tweet_editor.html',
            label: 'Tweets',
            table: 'tweets',
            statusField: 'tweet_status_id',
            statusValue: 12,
            queryString: 'tweet_status_id=eq.12',
            badgeId: 'tweetsBadge'
        },
        {
            position: 4,
            fileName: 'article_editor.html',
            label: 'Articles',
            table: 'website_articles',
            statusField: 'website_article_status_id',
            statusValue: 30,
            queryString: 'website_article_status_id=eq.30',
            badgeId: 'articlesBadge'
        },
        {
            position: 5,
            fileName: 'email_editor.html',
            label: 'Emails',
            table: 'newsletters',
            statusField: 'newsletter_status_id',
            statusValue: 30,
            queryString: 'newsletter_status_id=eq.30',
            badgeId: 'emailsBadge'
        },
        {
            position: 6,
            fileName: 'dashboard.html',
            label: 'Dashboard',
            table: null,
            statusField: null,
            statusValue: null,
            queryString: null,
            badgeId: 'dashboardBadge',
            showBadge: false // No badge needed for this page
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NAVIGATION_CONFIG;
}
// Sidebar Navigation Configuration
// Supports role-based visibility and organized sections

const adminSidebarConfig = {
    sections: [
        {
            title: "Prompts",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline></svg>',
            items: [
                {
                    id: "prompts",
                    fileName: "prompt_editor.html",
                    label: "Prompt Editor",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline></svg>',
                    roles: ["admin", "user", "premium"]
                }
            ]
        },
        {
            title: "Add things",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
            items: [
                {
                    id: "scripts",
                    fileName: "scripts.html",
                    label: "Add Script",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "add_job",
                    fileName: "add_job.html",
                    label: "Add Job",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "add_client",
                    fileName: "add_client.html",
                    label: "Add Client",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
                    roles: ["admin", "premium"]
                },
                {
                    id: "add_channel",
                    fileName: "add_channel.html",
                    label: "Add Channel",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,3 19,12 5,21 5,3"></polygon></svg>',
                    roles: ["admin", "premium"]
                },
                {
                    id: "manage_scripts",
                    fileName: "manage_scripts.html",
                    label: "Manage Scripts",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4"></path><path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path><path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path><path d="M13 12h3"></path><path d="M5 12h3"></path></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "manage_jobs",
                    fileName: "manage_jobs.html",
                    label: "Manage Jobs",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>',
                    roles: ["admin", "user", "premium"]
                }
            ]
        },
        {
            title: "Create scripts",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>',
            items: [
                {
                    id: "research",
                    fileName: "script_research_editor.html",
                    label: "Research Editor",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "story_details",
                    fileName: "story_details_editor.html",
                    label: "Story Details Editor",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="10" y1="9" x2="16" y2="9"></line><line x1="10" y1="13" x2="16" y2="13"></line><line x1="10" y1="17" x2="14" y2="17"></line></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "outlines",
                    fileName: "script_outline_editor.html",
                    label: "Outline Editor",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "chapters",
                    fileName: "script_chapter_editor.html",
                    label: "Chapter Editor",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "refined_chapters",
                    fileName: "script_refined_chapter_editor.html",
                    label: "Refined Chapter Editor",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9 8.91 8.26 12 2"></polygon></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "visuals",
                    fileName: "script_visuals_editor.html",
                    label: "Visual Editor",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21,15 16,10 5,21"></polyline></svg>',
                    roles: ["admin", "premium"]
                }
            ]
        },
        {
            title: "Marketing",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline></svg>',
            items: [
                {
                    id: "proposals",
                    fileName: "upwork_proposals_editor.html",
                    label: "Upwork Proposals",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "social_posts",
                    fileName: "social_posts_editor.html",
                    label: "Social Posts",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14"></path><path d="M7 22l-4-4 4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "tweets",
                    fileName: "tweet_editor.html",
                    label: "Tweets",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "articles",
                    fileName: "article_editor.html",
                    label: "Articles",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "emails",
                    fileName: "email_editor.html",
                    label: "Email Campaigns",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "email_outreach",
                    fileName: "email_outreach_editor.html",
                    label: "Email Outreach",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "social_outreach",
                    fileName: "social_outreach_editor.html",
                    label: "Social Outreach",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l4 4-4 4"></path><path d="M3 11v-1a4 4 0 0 1 4-4h14"></path><path d="M7 22l-4-4 4-4"></path><path d="M21 13v1a4 4 0 0 1-4 4H3"></path></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "press_releases",
                    fileName: "press_releases.html",
                    label: "Press Releases",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"></path><path d="M7 4h10v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4z"></path><line x1="9" y1="9" x2="15" y2="9"></line><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="13" y2="17"></line></svg>',
                    roles: ["admin", "premium"]
                }
            ]
        },
        {
            title: "Website",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
            items: [
                {
                    id: "landing_page_1",
                    fileName: "../dashboards/landing_page_1.html",
                    label: "Landing Page 1",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "newsletter_signup",
                    fileName: "../marketing/newsletter_signup.html",
                    label: "Newsletter Signup",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
                    roles: ["admin"]
                },
                {
                    id: "order_form",
                    fileName: "../dashboards/order_form.html",
                    label: "Order Form",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"></path><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "portfolio",
                    fileName: "../portfolio/celebrity-scripts/index.html",
                    label: "Portfolio",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "blog",
                    fileName: "../portfolio/celebrity-scripts/index.html",
                    label: "Blog",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>',
                    roles: ["admin", "user", "premium"]
                }
            ]
        },
        {
            title: "Dashboard",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect></svg>',
            items: [
                {
                    id: "dashboard",
                    fileName: "../home.html",
                    label: "Dashboard",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9,22 9,12 15,12 15,22"></polyline></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "client_feedback",
                    fileName: "../dashboards/client_feedback.html",
                    label: "Client Feedback",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "client_dashboard",
                    fileName: "../dashboards/client_dashboard.html",
                    label: "Client Dashboard",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "project_pipeline",
                    fileName: "../dashboards/project_pipeline.html",
                    label: "Project Pipeline",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
                    roles: ["admin"]
                },
                {
                    id: "script_showcase",
                    fileName: "../marketing/script_showcase.html",
                    label: "Script Showcase",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "blog_page",
                    fileName: "../marketing/blog.html",
                    label: "Blog",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10,9 9,9 8,9"></polyline></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "user_settings",
                    fileName: "user_settings.html",
                    label: "User Settings",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "admin_settings",
                    fileName: "admin_settings.html",
                    label: "Admin Settings",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><circle cx="12" cy="16" r="1"></circle><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>',
                    roles: ["admin"]
                },
                {
                    id: "component_examples",
                    fileName: "../components-example.html",
                    label: "Component Examples",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="7" width="10" height="10" rx="1" ry="1"></rect><path d="M3 3v18h18"></path></svg>',
                    roles: ["admin"]
                },
                {
                    id: "monitored_channels",
                    fileName: "../dashboards/monitored_channels.html",
                    label: "Monitored Channels",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,3 19,12 5,21 5,3"></polygon></svg>',
                    roles: ["admin", "user", "premium"]
                },
                {
                    id: "delete_data",
                    fileName: "../dashboards/delete_data.html",
                    label: "Delete Data",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>',
                    roles: ["admin"]
                }
            ]
        }
    ]
};

// User sidebar configuration
const userSidebarConfig = {
    sections: [
        {
            title: "Scripts",
            icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline></svg>',
            items: [
                {
                    id: "script_ideas",
                    fileName: "../user-pages/script_ideas.html",
                    label: "Script Ideas",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12" y2="17"></line></svg>',
                    roles: ["user", "admin"]
                },
                {
                    id: "outlines",
                    fileName: "../user-pages/outlines.html",
                    label: "Outlines",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
                    roles: ["user", "admin"]
                },
                {
                    id: "scripts",
                    fileName: "../user-pages/scripts.html",
                    label: "Scripts",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline></svg>',
                    roles: ["user", "admin"]
                },
                {
                    id: "trending",
                    fileName: "../user-pages/trending.html",
                    label: "Trending",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,7 13.5,15.5 8.5,10.5 2,17"></polyline><polyline points="16,7 22,7 22,13"></polyline></svg>',
                    roles: ["user", "admin"]
                },
                {
                    id: "competitors",
                    fileName: "../user-pages/competitors.html",
                    label: "Competitors",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>',
                    roles: ["user", "admin"]
                },
                {
                    id: "video_performance",
                    fileName: "../user-pages/video_performance.html",
                    label: "Video Performance",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12"></polyline></svg>',
                    roles: ["user", "admin"]
                },
                {
                    id: "settings",
                    fileName: "../user-pages/settings.html",
                    label: "Settings",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
                    roles: ["user", "admin"]
                },
                {
                    id: "channels",
                    fileName: "../user-pages/channels.html",
                    label: "Channels",
                    icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5,3 19,12 5,21 5,3"></polygon></svg>',
                    roles: ["user", "admin"]
                }
            ]
        }
    ],
    createScriptButton: {
        fileName: "../user-pages/add_script.html",
        label: "Create Script",
        icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
    }
};

// User role configuration - get from localStorage or default to admin
const currentUserRole = localStorage.getItem('userRole') || "admin"; // Options: "admin", "user"

// Notification badges (will be updated dynamically)
let notificationBadges = {
    // These will be populated by fetchScriptCounts()
};

// Import Supabase configuration from shared config
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

// Function to fetch script counts for each editor using html_page_config table
async function fetchScriptCounts() {
    try {
        // First, get all page configurations
        const configResponse = await fetch(`${SUPABASE_URL}/rest/v1/html_page_config?select=*`, {
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
        });

        if (!configResponse.ok) {
            console.error('Failed to fetch page configurations');
            return;
        }

        const pageConfigs = await configResponse.json();
        console.log('Page configurations loaded:', pageConfigs);

        // Map page names to sidebar IDs
        const pageNameToSidebarId = {
            'script_research_editor': 'research',
            'story_details_editor': 'story_details',
            'script_outline_editor': 'outlines',
            'script_chapter_editor': 'chapters',
            'script_refined_chapter_editor': 'refined_chapters',
            'script_visuals_editor': 'visuals',
            'social_posts_editor': 'social_posts',
            'tweet_editor': 'tweets',
            'email_editor': 'emails',
            'upwork_proposals_editor': 'proposals',
            'article_outline_editor': 'articles_outline',
            'article_section_editor': 'articles_section'
        };

        // Fetch counts for each configured page
        for (const pageConfig of pageConfigs) {
            const sidebarId = pageNameToSidebarId[pageConfig.page_name];

            if (!sidebarId || !pageConfig.display_status_id) {
                continue; // Skip if no sidebar mapping or no display status
            }

            const url = `${SUPABASE_URL}/rest/v1/${pageConfig.status_table_name}?${pageConfig.status_field_name}=eq.${pageConfig.display_status_id}&select=${pageConfig.id_field_name}`;
            console.log(`Fetching count for ${sidebarId} (${pageConfig.page_name}): ${url}`);

            const response = await fetch(url, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'Content-Type': 'application/json',
                    'Range': '0-999',
                    'Prefer': 'count=exact'
                }
            });

            console.log(`Response for ${sidebarId}: ${response.status}`);

            if (response.ok) {
                // Get the count from the content-range header
                const contentRange = response.headers.get('content-range');
                console.log(`Content-Range for ${sidebarId}: ${contentRange}`);

                if (contentRange) {
                    const match = contentRange.match(/\d+\-\d+\/(\d+)/);
                    const count = match ? parseInt(match[1]) : 0;
                    console.log(`Count for ${sidebarId}: ${count}`);

                    // Only set badge if count > 0
                    if (count > 0) {
                        notificationBadges[sidebarId] = count;
                    }
                }
            } else {
                console.error(`Failed to fetch count for ${sidebarId}:`, response.status, await response.text());
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

// Get the appropriate config based on role
const sidebarConfig = currentUserRole === 'user' ? userSidebarConfig : adminSidebarConfig;

export { sidebarConfig, adminSidebarConfig, userSidebarConfig, currentUserRole, notificationBadges, fetchScriptCounts };
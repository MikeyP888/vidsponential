// Editing Dash sidebar configuration.
// Sections/pages are defined here; red-dot counts come live from config_dash
// (count of records at each page's display_status_id). Nothing hardcoded per page.

import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

const ICON = {
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12,6 12,12 16,14"></polyline></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
  pen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>',
  doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>',
  marker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l-4 4v4h4l9-9"></path><path d="M14 6l4 4"></path></svg>',
  comment: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
  report: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14,2 14,8 20,8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line></svg>',
  megaphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>',
  globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>',
  grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><rect x="7" y="7" width="3" height="9"></rect><rect x="14" y="7" width="3" height="5"></rect></svg>',
  scripts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="16 3 21 8 8 21 3 21 3 16 16 3"></polygon></svg>'
};

export const sidebarConfig = {
  // logo: text brand by default (swap to an <img> later)
  brand: { emoji: '🦋', label: 'Editing Dash' },
  sections: [
    { title: 'Prompts', icon: ICON.clock, items: [
      { id: 'prompts', fileName: 'prompts.html', label: 'Prompts', icon: ICON.clock, built: true },
      { id: 'prompt_snippets', fileName: 'prompt_snippets.html', label: 'Prompt Snippets', icon: ICON.doc, built: true }
    ]},
    { title: 'Add Things', icon: ICON.plus, items: [
      { id: 'clients', fileName: 'clients.html', label: 'Clients', icon: ICON.user },
      { id: 'manuscripts', fileName: 'manuscripts.html', label: 'Manuscripts', icon: ICON.book },
      { id: 'edits', fileName: 'edits.html', label: 'Edits', icon: ICON.pen }
    ]},
    { title: 'Editing', icon: ICON.marker, items: [
      { id: 'highlighting_instructions', fileName: 'highlighting_instructions.html', label: 'Highlighting Instructions', icon: ICON.marker, built: true },
      { id: 'annotations', fileName: 'annotations.html', label: 'Annotations', icon: ICON.comment, built: true },
      { id: 'report_sections', fileName: 'report_sections.html', label: 'Report Sections', icon: ICON.report, built: true },
      { id: 'character_feedback', fileName: 'character_feedback.html', label: 'Character Feedback', icon: ICON.user, built: true },
      { id: 'chapter_feedback', fileName: 'chapter_feedback.html', label: 'Chapter Feedback', icon: ICON.book, built: true }
    ]},
    { title: 'Scripts', icon: ICON.scripts, items: [
      { id: 'scripts_soon', fileName: null, label: 'Coming soon', icon: ICON.doc }
    ]},
    { title: 'Marketing', icon: ICON.megaphone, items: [
      { id: 'marketing_soon', fileName: null, label: 'Coming soon', icon: ICON.doc }
    ]},
    { title: 'Website', icon: ICON.globe, items: [
      { id: 'website_soon', fileName: null, label: 'Coming soon', icon: ICON.doc }
    ]},
    { title: 'Dashboard', icon: ICON.grid, items: [
      { id: 'dashboard_soon', fileName: null, label: 'Coming soon', icon: ICON.doc }
    ]}
  ]
};

// Live red-dot counts from config_dash
export let notificationBadges = {};

export async function fetchDashCounts() {
  try {
    const cfgRes = await fetch(`${SUPABASE_URL}/rest/v1/config_dash?is_active=eq.true&select=*`, {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
    });
    if (!cfgRes.ok) return;
    const configs = await cfgRes.json();
    const badges = {};
    for (const cfg of configs) {
      if (!cfg.sidebar_id || cfg.display_status_id == null) continue;
      const url = `${SUPABASE_URL}/rest/v1/${cfg.status_table_name}?${cfg.status_field_name}=eq.${cfg.display_status_id}&select=${cfg.id_field_name}`;
      const res = await fetch(url, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, Range: '0-0', Prefer: 'count=exact' }
      });
      if (!res.ok) continue;
      const cr = res.headers.get('content-range');
      const m = cr && cr.match(/\/(\d+)$/);
      const count = m ? parseInt(m[1], 10) : 0;
      if (count > 0) badges[cfg.sidebar_id] = count;
    }
    notificationBadges = badges;
    if (window.updateSidebarBadges) window.updateSidebarBadges(badges);
  } catch (e) { console.error('fetchDashCounts error:', e); }
}

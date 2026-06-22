// Shared helpers for Editing Dash review pages.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const REST_HEADERS = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
};

// Status pill (top-right). status = loading|saved|unsaved|error|editing|completed
export function updateStatus(status, message) {
    ['stickyStatusIndicator', 'statusIndicator'].forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.textContent = message; el.className = `status-indicator status-${status}`; }
    });
}

export async function fetchWithErrorHandling(url, options = {}) {
    const config = { ...options, headers: { ...REST_HEADERS, ...(options.headers || {}) } };
    const res = await fetch(url, config);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    if (res.status === 204 || res.headers.get('content-length') === '0') return null;
    if ((config.headers.Prefer || '').includes('return=minimal')) return null;
    return res.json();
}

// Load this page's config row from config_dash (page_name = filename without .html)
export async function loadPageConfig(pageName) {
    const { data, error } = await supabase
        .from('config_dash').select('*').eq('page_name', pageName).single();
    if (error || !data) throw new Error(`config_dash row not found for "${pageName}"`);
    return data;
}

// Set a page title from config
export function applyPageTitle(cfg) {
    document.title = cfg.page_title;
    const h1 = document.querySelector('h1.page-title');
    if (h1) h1.textContent = cfg.page_title;
}

// Info box: one query per edit on v_dash_edit_info
export async function loadEditInfo(editId) {
    const { data, error } = await supabase
        .from('v_dash_edit_info').select('*').eq('edit_id', editId).single();
    if (error) { console.warn('loadEditInfo:', error); return null; }
    return data;
}

// Render the shared info box (same six fields on every Editing page)
export function renderInfoBox(containerId, info) {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (!info) { el.innerHTML = ''; return; }
    const items = [
        ['Edit ID', info.edit_id],
        ['Client', info.client_name || '-'],
        ['Book Title', info.book_title || '-'],
        ['Words', info.words != null ? info.words.toLocaleString() : '-'],
        ['English Type', info.english_type || '-'],
        ['Free Sample?', info.free_sample_label || '-']
    ];
    el.innerHTML = `
      <div class="dash-info-box">
        ${items.map(([label, val]) => `
          <div class="dash-info-item">
            <span class="dash-info-label">${label}</span>
            <span class="dash-info-value">${val}</span>
          </div>`).join('')}
      </div>`;
}

// PATCH helper: update rows by a filter and set { field: value }
export async function patchRows(table, filterField, filterValue, patch) {
    const url = `${SUPABASE_URL}/rest/v1/${table}?${filterField}=eq.${filterValue}`;
    return fetchWithErrorHandling(url, {
        method: 'PATCH', body: JSON.stringify(patch), headers: { Prefer: 'return=minimal' }
    });
}

export function showNoRecords(message) {
    const content = document.getElementById('content');
    if (content) content.style.display = 'none';
    const msg = document.getElementById('noRecordsMessage');
    if (msg) {
        msg.innerHTML = `<div class="message info"><strong>Nothing to review</strong><br>${message}</div>`;
        msg.style.display = 'block';
    }
}

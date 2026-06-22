/**
 * Theme Loader
 * Fetches theme config from Supabase site_theme table and sets CSS custom properties.
 * Caches in sessionStorage to avoid re-fetching on every page load.
 * Falls back to hardcoded defaults if Supabase is unreachable.
 */
(function() {
  const SUPABASE_URL = 'https://euzbpslzrimyokzvgbzk.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1emJwc2x6cmlteW9renZnYnprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1NDk5MTUsImV4cCI6MjA2NjEyNTkxNX0.HBznM8FVX0VnYBN8rTu6T-QOPmq0d60syavTCADl3JI';
  const CACHE_KEY = 'vidsponential_theme';
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Fallback defaults if Supabase is down
  var DEFAULTS = {
    'bg-primary': '#ffffff',
    'bg-secondary': '#f8fafb',
    'bg-tertiary': '#f1f3f5',
    'text-primary': '#1a1a2e',
    'text-secondary': '#64748b',
    'text-muted': '#94a3b8',
    'accent-primary': '#4f46e5',
    'accent-primary-hover': '#4338ca',
    'accent-primary-light': '#eef2ff',
    'accent-primary-rgb': '79, 70, 229',
    'border-light': '#e2e8f0',
    'border-medium': '#cbd5e1',
    'color-success': '#10b981',
    'color-error': '#ef4444',
    'color-warning': '#f59e0b',
    'shadow-sm': '0 1px 2px rgba(0,0,0,0.05)',
    'shadow-md': '0 4px 12px rgba(0,0,0,0.06)',
    'shadow-lg': '0 8px 30px rgba(0,0,0,0.08)',
    'font-family': '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    'radius-sm': '6px',
    'radius-md': '10px',
    'radius-lg': '16px'
  };

  function applyTheme(vars) {
    var root = document.documentElement;
    for (var key in vars) {
      root.style.setProperty('--' + key, vars[key]);
    }
  }

  function getCached() {
    try {
      var raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var cached = JSON.parse(raw);
      if (Date.now() - cached.ts > CACHE_TTL) return null;
      return cached.data;
    } catch(e) {
      return null;
    }
  }

  function setCache(data) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data: data }));
    } catch(e) {}
  }

  // Apply defaults immediately to prevent flash of unstyled content
  applyTheme(DEFAULTS);

  // Check cache first
  var cached = getCached();
  if (cached) {
    applyTheme(cached);
    return;
  }

  // Fetch from Supabase
  fetch(SUPABASE_URL + '/rest/v1/site_theme?select=theme_key,theme_value', {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY
    }
  })
  .then(function(r) { return r.json(); })
  .then(function(rows) {
    if (!Array.isArray(rows) || rows.length === 0) return;
    var vars = {};
    rows.forEach(function(row) {
      vars[row.theme_key] = row.theme_value;
    });
    applyTheme(vars);
    setCache(vars);
  })
  .catch(function() {
    // Defaults already applied, nothing to do
  });
})();

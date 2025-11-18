/**
 * Theme Manager - Handles dark mode toggle and persistence
 *
 * Usage:
 * 1. Include this script in your HTML: <script src="../../shared/js/theme-manager.js"></script>
 * 2. The theme will be automatically applied on page load
 * 3. Use toggleTheme() to switch between light and dark mode
 * 4. Use getCurrentTheme() to get the current theme ('light' or 'dark')
 */

const THEME_STORAGE_KEY = 'app-theme-preference';

/**
 * Get the current theme preference from localStorage or system preference
 * @returns {string} 'light' or 'dark'
 */
function getCurrentTheme() {
    // Check localStorage first
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme) {
        return storedTheme;
    }

    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
}

/**
 * Apply the theme to the document
 * @param {string} theme - 'light' or 'dark'
 */
function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
}

/**
 * Save theme preference to localStorage
 * @param {string} theme - 'light' or 'dark'
 */
function saveThemePreference(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Toggle between light and dark theme
 * @returns {string} The new theme ('light' or 'dark')
 */
function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    applyTheme(newTheme);
    saveThemePreference(newTheme);

    // Dispatch custom event so other parts of the page can react
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: newTheme } }));

    return newTheme;
}

/**
 * Set a specific theme
 * @param {string} theme - 'light' or 'dark'
 */
function setTheme(theme) {
    if (theme !== 'light' && theme !== 'dark') {
        console.error('Invalid theme. Use "light" or "dark"');
        return;
    }

    applyTheme(theme);
    saveThemePreference(theme);

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
}

/**
 * Initialize theme on page load
 */
function initializeTheme() {
    const theme = getCurrentTheme();
    applyTheme(theme);
}

// Auto-initialize when the script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
} else {
    // DOM is already loaded
    initializeTheme();
}

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only update if user hasn't set a manual preference
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
            const newTheme = e.matches ? 'dark' : 'light';
            applyTheme(newTheme);
        }
    });
}

// Export functions for use in other scripts
window.themeManager = {
    getCurrentTheme,
    toggleTheme,
    setTheme,
    applyTheme
};

// Editing Dash sidebar. Same styling/behavior as Vidsponential (collapse, section
// collapse, red-dot badges) using the same CSS classes; paths point at /dash/.
import { sidebarConfig, notificationBadges, fetchDashCounts } from './sidebar-config.js';

class SidebarNavigation {
  constructor() {
    this.currentPage = (window.location.pathname.split('/').pop() || '').replace(/\.html$/, '');
    this.badges = {};
    this.isCollapsed = localStorage.getItem('dashSidebarCollapsed') === 'true';
    this.collapsedSections = JSON.parse(localStorage.getItem('dashCollapsedSections') || '{}');
    this.init();
    window.updateSidebarBadges = (b) => this.updateBadges(b);
  }

  toggleSection(title) {
    this.collapsedSections[title] = !this.collapsedSections[title];
    localStorage.setItem('dashCollapsedSections', JSON.stringify(this.collapsedSections));
    const el = document.querySelector(`[data-section="${CSS.escape(title)}"]`);
    if (el) el.classList.toggle('collapsed', this.collapsedSections[title]);
  }

  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
    localStorage.setItem('dashSidebarCollapsed', this.isCollapsed);
    document.querySelector('.sidebar-navigation').classList.toggle('collapsed', this.isCollapsed);
    document.body.classList.toggle('sidebar-collapsed', this.isCollapsed);
  }

  navItem(item) {
    const clean = item.fileName ? item.fileName.replace(/\.html$/, '') : '';
    const isActive = clean === this.currentPage;
    const count = this.badges[item.id] || notificationBadges[item.id];
    const badge = count ? `<span class="nav-badge" data-badge-id="${item.id}">${count}</span>` : '';
    if (!item.fileName || !item.built) {
      return `<span class="sidebar-nav-item disabled" style="opacity:.5;cursor:default">
                <span class="nav-icon">${item.icon}</span><span class="nav-label">${item.label}</span></span>`;
    }
    return `<a href="/dash/${clean}" class="sidebar-nav-item ${isActive ? 'active' : ''}">
              <span class="nav-icon">${item.icon}</span>
              <span class="nav-label">${item.label}</span>${badge}
            </a>`;
  }

  section(sec) {
    const items = sec.items.map(i => this.navItem(i)).join('');
    const collapsed = this.collapsedSections[sec.title] ? 'collapsed' : '';
    return `
      <div class="sidebar-section ${collapsed}" data-section="${sec.title}">
        <div class="sidebar-section-header" onclick="window.sidebarInstance.toggleSection('${sec.title.replace(/'/g, "\\'")}')">
          <div class="section-header-left">
            <span class="section-icon">${sec.icon}</span>
            <span class="section-title">${sec.title}</span>
          </div>
          <svg class="section-toggle" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,9 12,15 18,9"></polyline></svg>
        </div>
        <div class="sidebar-section-items">${items}</div>
      </div>`;
  }

  render() {
    const sections = sidebarConfig.sections.map(s => this.section(s)).join('');
    const brand = sidebarConfig.brand || { emoji: '🦋', label: 'Dash' };
    return `
      <div class="sidebar-navigation ${this.isCollapsed ? 'collapsed' : ''}">
        <button class="collapse-btn" onclick="window.sidebarInstance.toggleCollapse()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,18 9,12 15,6"></polyline></svg>
        </button>
        <div class="sidebar-header">
          <div class="sidebar-logo">
            <a href="/dash/highlighting_instructions" style="text-decoration:none;display:flex;align-items:center;gap:8px;">
              <span style="font-size:22px;">${brand.emoji}</span>
              <span class="nav-label" style="font-weight:700;color:var(--text-primary);">${brand.label}</span>
            </a>
          </div>
        </div>
        <div class="sidebar-content">${sections}</div>
      </div>`;
  }

  updateBadges(b) {
    this.badges = b;
    this.init(); // simplest: re-render with new counts
  }

  init() {
    const c = document.getElementById('sidebarContainer');
    if (!c) return;
    c.innerHTML = this.render();
    if (this.isCollapsed) document.body.classList.add('sidebar-collapsed');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.sidebarInstance = new SidebarNavigation();
  fetchDashCounts();
  setInterval(fetchDashCounts, 30000);
});

window.SidebarNavigation = SidebarNavigation;

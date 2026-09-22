/* ── Shared navbar + footer injector ───────────────────────────────── */

function injectNav(activePage) {
  const pages = [
    { id: 'dashboard', href: 'dashboard.html', label: 'Dashboard' },
    { id: 'patterns',  href: 'patterns.html',  label: 'Patterns'  },
    { id: 'roadmap',   href: 'roadmap.html',   label: 'Roadmap'   },
    { id: 'about',     href: 'about.html',     label: 'About'     },
  ];

  const links = pages.map(p =>
    `<a href="${p.href}" class="nav-link${activePage === p.id ? ' active' : ''}">${p.label}</a>`
  ).join('');

  const html = `
  <nav id="navbar" role="navigation" aria-label="Main navigation">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo" aria-label="Design Patterns Home">
        <svg width="28" height="28" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <rect x="1" y="1" width="8" height="8" rx="1.5" fill="#6366f1"/>
          <rect x="11" y="1" width="8" height="8" rx="1.5" fill="#818cf8" opacity=".7"/>
          <rect x="1" y="11" width="8" height="8" rx="1.5" fill="#818cf8" opacity=".7"/>
          <rect x="11" y="11" width="8" height="8" rx="1.5" fill="#6366f1" opacity=".5"/>
        </svg>
        <span class="nav-logo-text">Design Patterns</span>
      </a>

      <div id="nav-menu" class="nav-links" role="menubar">
        ${links}
        <a href="https://github.com/sprintooo/designPattern" target="_blank" rel="noopener"
           class="nav-link nav-github" aria-label="View on GitHub">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          GitHub
        </a>
      </div>

      <button id="nav-toggle" class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-menu">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
          <line x1="3" y1="6" x2="17" y2="6"/>
          <line x1="3" y1="10" x2="17" y2="10"/>
          <line x1="3" y1="14" x2="17" y2="14"/>
        </svg>
      </button>
    </div>
  </nav>`;

  const placeholder = document.getElementById('nav-placeholder');
  if (placeholder) placeholder.outerHTML = html;
  else document.body.insertAdjacentHTML('afterbegin', html);
}

function injectFooter() {
  const html = `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-brand">
        <a href="index.html" class="nav-logo">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="8" height="8" rx="1.5" fill="#6366f1"/>
            <rect x="11" y="1" width="8" height="8" rx="1.5" fill="#818cf8" opacity=".7"/>
            <rect x="1" y="11" width="8" height="8" rx="1.5" fill="#818cf8" opacity=".7"/>
            <rect x="11" y="11" width="8" height="8" rx="1.5" fill="#6366f1" opacity=".5"/>
          </svg>
          <span>Design Patterns</span>
        </a>
        <p>A free, open-source course for software engineers.</p>
      </div>
      <div class="footer-links">
        <div>
          <h4>Learn</h4>
          <a href="patterns.html">Pattern Library</a>
          <a href="roadmap.html">Roadmap</a>
          <a href="dashboard.html">My Progress</a>
        </div>
        <div>
          <h4>Resources</h4>
          <a href="about.html">About</a>
          <a href="https://github.com/sprintooo/designPattern" target="_blank" rel="noopener">GitHub</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>Built with Java by Patidar · <a href="https://github.com/sprintooo/designPattern" target="_blank" rel="noopener">View Source</a></p>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('beforeend', html);
}

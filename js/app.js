/* ── Progress ──────────────────────────────────────────────────────── */

const Progress = {
  _key: 'dp_progress',
  _dates: 'dp_dates',

  getAll() {
    try { return JSON.parse(localStorage.getItem(this._key) || '{}'); }
    catch { return {}; }
  },

  isDone(id) { return !!this.getAll()[id]; },

  complete(id) {
    const all = this.getAll();
    all[id] = true;
    try {
      localStorage.setItem(this._key, JSON.stringify(all));
      const dates = this._getDates();
      dates[id] = new Date().toISOString();
      localStorage.setItem(this._dates, JSON.stringify(dates));
    } catch {}
    document.dispatchEvent(new CustomEvent('progress-changed', { detail: { id, done: true } }));
  },

  uncomplete(id) {
    const all = this.getAll();
    delete all[id];
    try { localStorage.setItem(this._key, JSON.stringify(all)); } catch {}
    document.dispatchEvent(new CustomEvent('progress-changed', { detail: { id, done: false } }));
  },

  toggle(id) { this.isDone(id) ? this.uncomplete(id) : this.complete(id); },

  getCount() { return Object.keys(this.getAll()).length; },

  getCountByCategory(cat) {
    const all = this.getAll();
    return PATTERN_ORDER.filter(id => PATTERNS[id].category === cat && all[id]).length;
  },

  getNextUncompleted() {
    const all = this.getAll();
    return PATTERN_ORDER.find(id => !all[id]) || null;
  },

  _getDates() {
    try { return JSON.parse(localStorage.getItem(this._dates) || '{}'); }
    catch { return {}; }
  },
};

/* ── Code blocks ────────────────────────────────────────────────────── */

function renderCodeBlock(code, language = 'java') {
  const id = 'cb-' + Math.random().toString(36).slice(2);
  return `
    <div class="code-block">
      <div class="code-header">
        <span class="code-lang">${language.charAt(0).toUpperCase() + language.slice(1)}</span>
        <button class="copy-btn" data-target="${id}" aria-label="Copy code">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/>
            <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/>
          </svg>
          Copy
        </button>
      </div>
      <pre class="code-pre"><code id="${id}" class="language-${language}">${escapeHtml(code)}</code></pre>
    </div>`;
}

function initCodeBlocks() {
  document.querySelectorAll('.code-block code').forEach(el => {
    hljs.highlightElement(el);
  });
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      try {
        await navigator.clipboard.writeText(target.textContent);
        btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/></svg> Copied!`;
        btn.classList.add('copied');
        setTimeout(() => {
          btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"/><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"/></svg> Copy`;
          btn.classList.remove('copied');
        }, 2000);
      } catch {}
    });
  });
}

/* ── Utility ─────────────────────────────────────────────────────────── */

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function categoryBadge(cat) {
  const c = CATEGORIES[cat];
  return `<span class="badge badge-cat" style="--cat-color:${c.color}">${c.label}</span>`;
}

function difficultyBadge(diff) {
  const d = DIFFICULTIES[diff];
  return `<span class="badge badge-diff" style="--diff-color:${d.color}">${d.label}</span>`;
}

function completedBadge() {
  return `<span class="badge badge-done">✓ Completed</span>`;
}

/* ── Mobile nav toggle ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('nav-toggle');
  const menu   = document.getElementById('nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => menu.classList.toggle('open'));
    document.addEventListener('click', e => {
      if (!toggle.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.remove('open');
      }
    });
  }
});

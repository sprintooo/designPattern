const OWNER  = 'sprintooo';
const REPO   = 'designPattern';
const BRANCH = 'main';
const SRC    = 'src/main/java/org/patidar/';
const API    = `https://api.github.com/repos/${OWNER}/${REPO}`;

// ── SVG icons ────────────────────────────────────────────────────────

const CHEV = `<svg class="chev" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,2 7,5 3,8"/></svg>`;

const FOLDER_CLOSED = `<svg class="ico-folder-closed" width="14" height="14" viewBox="0 0 16 16" fill="var(--clr-folder)">
  <path d="M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0 0 16 13.25v-8.5A1.75 1.75 0 0 0 14.25 3H7.5a.25.25 0 0 1-.2-.1l-.9-1.2C6.07 1.26 5.55 1 5 1H1.75z"/>
</svg>`;

const FOLDER_OPEN = `<svg class="ico-folder-open" width="14" height="14" viewBox="0 0 16 16" fill="var(--clr-folder)">
  <path d="M.513 1.513A1.75 1.75 0 0 1 1.75 1h3.5c.55 0 1.07.26 1.4.7l.9 1.2a.25.25 0 0 0 .2.1H14.25c.966 0 1.75.784 1.75 1.75v.5a.75.75 0 0 1-.75.75H1.75A.75.75 0 0 1 1 5.25a.25.25 0 0 0-.25.25v8c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V6.75a.75.75 0 0 1 1.5 0v6.5A1.75 1.75 0 0 1 14.25 15H1.75A1.75 1.75 0 0 1 0 13.25V2.75c0-.464.184-.91.513-1.237z"/>
</svg>`;

const FILE_ICON = `<svg class="ico-file" width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
  <path d="M2 1.75C2 .784 2.784 0 3.75 0h6.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v9.586A1.75 1.75 0 0 1 13.25 16h-9.5A1.75 1.75 0 0 1 2 14.25V1.75zm1.75-.25a.25.25 0 0 0-.25.25v12.5c0 .138.112.25.25.25h9.5a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 9 4.25V1.5H3.75zm6.75.062V4.25c0 .138.112.25.25.25h2.688a.252.252 0 0 0-.011-.013L10.5 1.562z"/>
</svg>`;

// ── Fetch ────────────────────────────────────────────────────────────

async function fetchTree() {
  const r = await fetch(`${API}/git/trees/${BRANCH}?recursive=1`);
  if (!r.ok) throw new Error(`GitHub API ${r.status}`);
  const d = await r.json();
  return d.tree
    .filter(n => n.type === 'blob' && n.path.startsWith(SRC) && n.path.endsWith('.java'))
    .map(n => n.path);
}

async function fetchFile(path) {
  const url = `${API}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`GitHub API ${r.status}`);
  const d = await r.json();
  return atob(d.content.replace(/\n/g, ''));
}

// ── Tree build ───────────────────────────────────────────────────────

function buildTree(paths) {
  const root = {};
  for (const p of paths) {
    const parts = p.slice(SRC.length).split('/');
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      node[parts[i]] ??= {};
      node = node[parts[i]];
    }
    (node._files ??= []).push({ name: parts.at(-1), path: p });
  }
  return root;
}

function label(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
}

function renderTree(node, d) {
  const dirs  = Object.keys(node).filter(k => k !== '_files').sort();
  const files = node._files ?? [];
  if (!dirs.length && !files.length) return '';

  const rows = [];

  for (const key of dirs) {
    rows.push(`
      <li class="folder" data-lvl="${d}" style="--d:${d}">
        <details ${d < 2 ? 'open' : ''}>
          <summary>${CHEV}${FOLDER_CLOSED}${FOLDER_OPEN}<span>${label(key)}</span></summary>
          ${renderTree(node[key], d + 1)}
        </details>
      </li>`);
  }

  for (const f of files) {
    rows.push(`
      <li class="file" data-path="${f.path}" style="--d:${d}">
        ${FILE_ICON}
        <span class="fname">${f.name}</span>
        <span class="badge">java</span>
      </li>`);
  }

  return `<ul>${rows.join('')}</ul>`;
}

// ── Render code ──────────────────────────────────────────────────────

function showCode(src, path) {
  const rel   = path.slice(SRC.length);
  const parts = rel.split('/');

  document.getElementById('breadcrumb').innerHTML = parts.map((p, i) =>
    i < parts.length - 1
      ? `<span class="bc">${p}</span><span class="bc-sep">›</span>`
      : `<span class="bc cur">${p}</span>`
  ).join('');

  const pre  = document.createElement('pre');
  const code = document.createElement('code');
  code.className   = 'language-java';
  code.textContent = src;
  pre.appendChild(code);

  const wrap = document.getElementById('code-wrap');
  wrap.innerHTML = '';
  wrap.appendChild(pre);
  hljs.highlightElement(code);
  wrap.scrollTop = 0;
}

function activate(path) {
  document.querySelectorAll('#nav-tree .file').forEach(el =>
    el.classList.toggle('active', el.dataset.path === path)
  );
  document.querySelector('#nav-tree .file.active')
    ?.scrollIntoView({ block: 'nearest' });
}

async function open(path) {
  activate(path);
  const wrap = document.getElementById('code-wrap');
  wrap.innerHTML = '<p class="state-line"><span class="spinner"></span> Loading…</p>';
  try {
    showCode(await fetchFile(path), path);
  } catch (e) {
    wrap.innerHTML = `<p class="err">Could not load file: ${e.message}</p>`;
  }
}

// ── Search ───────────────────────────────────────────────────────────

function setupSearch() {
  document.getElementById('search-input').addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    document.querySelectorAll('#nav-tree .file').forEach(el => {
      el.hidden = q && !el.querySelector('.fname').textContent.toLowerCase().includes(q);
    });
    if (q) document.querySelectorAll('#nav-tree details').forEach(d => { d.open = true; });
  });
}

// ── Init ─────────────────────────────────────────────────────────────

async function init() {
  const nav = document.getElementById('nav-tree');
  try {
    const paths = await fetchTree();
    if (!paths.length) { nav.innerHTML = '<p class="err">No Java files found.</p>'; return; }

    nav.innerHTML = renderTree(buildTree(paths), 0);
    nav.addEventListener('click', e => {
      const f = e.target.closest('.file');
      if (f) open(f.dataset.path);
    });
    setupSearch();

    const first = nav.querySelector('.file');
    if (first) open(first.dataset.path);

  } catch (e) {
    nav.innerHTML = `<p class="err">Failed to load: ${e.message}<br>Check network / GitHub rate limit.</p>`;
  }
}

document.getElementById('sb-toggle').addEventListener('click', () =>
  document.getElementById('app').classList.toggle('sb-hidden')
);

document.addEventListener('DOMContentLoaded', init);

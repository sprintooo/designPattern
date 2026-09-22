const OWNER = 'sprintooo';
const REPO  = 'designPattern';
const BRANCH = 'main';
const SOURCE_PREFIX = 'src/main/java/org/patidar/';
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;

// ── Data fetching ────────────────────────────────────────────────────

async function fetchTree() {
  const res = await fetch(`${API_BASE}/git/trees/${BRANCH}?recursive=1`);
  if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
  const data = await res.json();
  return data.tree
    .filter(item => item.type === 'blob'
      && item.path.startsWith(SOURCE_PREFIX)
      && item.path.endsWith('.java'))
    .map(item => item.path);
}

async function loadFile(path) {
  const encoded = path.split('/').map(encodeURIComponent).join('/');
  const res = await fetch(`${API_BASE}/contents/${encoded}`);
  if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
  const data = await res.json();
  return atob(data.content.replace(/\n/g, ''));
}

// ── Tree building ────────────────────────────────────────────────────

function buildTreeObject(paths) {
  const root = {};
  for (const fullPath of paths) {
    const rel   = fullPath.slice(SOURCE_PREFIX.length);
    const parts = rel.split('/');
    let node = root;
    for (let i = 0; i < parts.length - 1; i++) {
      if (!node[parts[i]]) node[parts[i]] = {};
      node = node[parts[i]];
    }
    if (!node._files) node._files = [];
    node._files.push({ name: parts[parts.length - 1], path: fullPath });
  }
  return root;
}

function formatLabel(key) {
  // "strategyPattern" → "Strategy Pattern"  |  "payment" → "Payment"
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^(.)/, s => s.toUpperCase());
}

// ── Rendering ────────────────────────────────────────────────────────

const CHEVRON_SVG = `<svg class="chevron" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,2 8,6 4,10"/></svg>`;
const FOLDER_SVG  = `<span class="folder-icon">▸</span>`;

function renderTree(node, depth) {
  const keys  = Object.keys(node).filter(k => k !== '_files').sort();
  const files = node._files || [];
  if (keys.length === 0 && files.length === 0) return '';

  const items = [];

  for (const key of keys) {
    const label = formatLabel(key);
    items.push(`
      <li class="folder" data-depth="${depth}" style="--depth:${depth}">
        <details ${depth < 2 ? 'open' : ''}>
          <summary>
            ${CHEVRON_SVG}
            ${FOLDER_SVG}
            ${label}
          </summary>
          ${renderTree(node[key], depth + 1)}
        </details>
      </li>`);
  }

  for (const file of files) {
    items.push(`
      <li class="file" data-path="${file.path}" style="--depth:${depth}">
        <span class="file-icon">◦</span>
        <span class="file-name">${file.name}</span>
        <span class="java-badge">java</span>
      </li>`);
  }

  return `<ul>${items.join('')}</ul>`;
}

// ── Display ──────────────────────────────────────────────────────────

function showCode(content, path) {
  const rel   = path.startsWith(SOURCE_PREFIX) ? path.slice(SOURCE_PREFIX.length) : path;
  const parts = rel.split('/');

  document.getElementById('breadcrumb').innerHTML = parts
    .map((p, i) => i < parts.length - 1
      ? `<span class="crumb">${p}</span><span class="bc-sep">›</span>`
      : `<span class="crumb current">${p}</span>`)
    .join('');

  const pre  = document.createElement('pre');
  const code = document.createElement('code');
  code.className = 'language-java';
  code.textContent = content;
  pre.appendChild(code);

  const container = document.getElementById('code-container');
  container.innerHTML = '';
  container.appendChild(pre);
  hljs.highlightElement(code);
  container.scrollTop = 0;
}

function setActiveFile(path) {
  document.querySelectorAll('#nav-tree .file').forEach(el => {
    el.classList.toggle('active', el.dataset.path === path);
  });
  // Ensure active file is visible in sidebar
  const active = document.querySelector('#nav-tree .file.active');
  if (active) active.scrollIntoView({ block: 'nearest' });
}

async function handleFileClick(path) {
  setActiveFile(path);
  const container = document.getElementById('code-container');
  container.innerHTML = '<div class="state-msg"><span class="spinner"></span> Loading…</div>';
  try {
    const content = await loadFile(path);
    showCode(content, path);
  } catch (err) {
    container.innerHTML = `<div class="error-msg">Could not load file: ${err.message}</div>`;
  }
}

// ── Search ───────────────────────────────────────────────────────────

function setupSearch() {
  const input = document.getElementById('search-input');
  const clear = document.getElementById('search-clear');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    clear.classList.toggle('visible', q.length > 0);

    document.querySelectorAll('#nav-tree .file').forEach(el => {
      const name = el.querySelector('.file-name').textContent.toLowerCase();
      el.hidden = q.length > 0 && !name.includes(q);
    });

    if (q.length > 0) {
      document.querySelectorAll('#nav-tree details').forEach(d => { d.open = true; });
    }
  });

  clear.addEventListener('click', () => {
    input.value = '';
    input.dispatchEvent(new Event('input'));
    input.focus();
  });
}

// ── Init ─────────────────────────────────────────────────────────────

async function init() {
  const navTree = document.getElementById('nav-tree');
  try {
    const paths = await fetchTree();

    if (paths.length === 0) {
      navTree.innerHTML = '<div class="error-msg">No Java files found in the repository.</div>';
      return;
    }

    const treeObj = buildTreeObject(paths);
    navTree.innerHTML = renderTree(treeObj, 0);

    navTree.addEventListener('click', e => {
      const fileEl = e.target.closest('.file');
      if (fileEl) handleFileClick(fileEl.dataset.path);
    });

    setupSearch();

    // Auto-select first file
    const first = navTree.querySelector('.file');
    if (first) handleFileClick(first.dataset.path);

  } catch (err) {
    navTree.innerHTML = `<div class="error-msg">
      Failed to load: ${err.message}<br>
      Check network or GitHub API rate limit (60 req/hr unauthenticated).
    </div>`;
  }
}

document.getElementById('sidebar-toggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('collapsed');
});

document.addEventListener('DOMContentLoaded', init);

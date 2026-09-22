const OWNER = 'sprintooo';
const REPO   = 'designPattern';
const BRANCH = 'main';
const SOURCE_PREFIX = 'src/main/java/org/patidar/';
const API_BASE = `https://api.github.com/repos/${OWNER}/${REPO}`;

async function fetchTree() {
  const res = await fetch(`${API_BASE}/git/trees/${BRANCH}?recursive=1`);
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const data = await res.json();
  return data.tree
    .filter(item => item.type === 'blob' && item.path.startsWith(SOURCE_PREFIX) && item.path.endsWith('.java'))
    .map(item => item.path);
}

function buildTreeObject(paths) {
  const root = {};
  for (const fullPath of paths) {
    const rel   = fullPath.slice(SOURCE_PREFIX.length);
    const parts = rel.split('/');
    let node    = root;
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
  return key.replace(/([A-Z])/g, ' $1').replace(/^(.)/, s => s.toUpperCase());
}

function renderTree(node, depth) {
  const keys  = Object.keys(node).filter(k => k !== '_files').sort();
  const files = node._files || [];
  if (keys.length === 0 && files.length === 0) return '';

  const items = [];

  for (const key of keys) {
    items.push(`
      <li class="folder" data-depth="${depth}">
        <details ${depth < 2 ? 'open' : ''}>
          <summary>${formatLabel(key)}</summary>
          ${renderTree(node[key], depth + 1)}
        </details>
      </li>`);
  }

  for (const file of files) {
    items.push(`
      <li class="file" data-depth="${depth}" data-path="${file.path}">
        <span class="file-dot">&#9679;</span>
        <span class="file-name">${file.name}</span>
      </li>`);
  }

  return `<ul>${items.join('')}</ul>`;
}

async function loadFile(path) {
  const url = `${API_BASE}/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const data = await res.json();
  return atob(data.content.replace(/\n/g, ''));
}

function showCode(content, path) {
  const rel    = path.startsWith(SOURCE_PREFIX) ? path.slice(SOURCE_PREFIX.length) : path;
  const parts  = rel.split('/');
  const crumbs = parts.map((p, i) =>
    i === parts.length - 1
      ? `<span class="crumb current">${p}</span>`
      : `<span class="crumb">${p}</span><span class="sep">/</span>`
  ).join('');

  document.getElementById('breadcrumb').innerHTML = crumbs;

  const pre  = document.createElement('pre');
  const code = document.createElement('code');
  code.className = 'language-java';
  code.textContent = content;
  pre.appendChild(code);

  const container = document.getElementById('code-container');
  container.innerHTML = '';
  container.appendChild(pre);
  hljs.highlightElement(code);
}

function setActive(path) {
  document.querySelectorAll('#nav-tree .file').forEach(el => {
    el.classList.toggle('active', el.dataset.path === path);
  });
}

async function openFile(path) {
  setActive(path);
  const container = document.getElementById('code-container');
  container.innerHTML = '<div class="loading-msg">Loading&hellip;</div>';
  try {
    showCode(await loadFile(path), path);
  } catch (err) {
    container.innerHTML = `<div class="error-msg">Could not load file: ${err.message}</div>`;
  }
}

async function init() {
  const navTree = document.getElementById('nav-tree');
  try {
    const paths = await fetchTree();
    if (paths.length === 0) {
      navTree.innerHTML = '<div class="error-msg">No Java files found.</div>';
      return;
    }
    navTree.innerHTML = renderTree(buildTreeObject(paths), 0);
    navTree.addEventListener('click', e => {
      const el = e.target.closest('.file');
      if (el) openFile(el.dataset.path);
    });
    const first = navTree.querySelector('.file');
    if (first) openFile(first.dataset.path);
  } catch (err) {
    navTree.innerHTML = `<div class="error-msg">Failed to load: ${err.message}</div>`;
  }
}

document.getElementById('sidebar-toggle').addEventListener('click', () => {
  document.getElementById('app').classList.toggle('collapsed');
});

document.addEventListener('DOMContentLoaded', init);

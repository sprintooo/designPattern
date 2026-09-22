/* ── Roadmap renderer ──────────────────────────────────────────── */

(function () {
  injectNav('roadmap');
  injectFooter();

  const columns = [
    {
      key: 'creational',
      icon: '🏗️',
    },
    {
      key: 'structural',
      icon: '🔩',
    },
    {
      key: 'behavioral',
      icon: '🔄',
    },
  ];

  function renderColumn(col) {
    const cat      = CATEGORIES[col.key];
    const patterns = PATTERN_ORDER.map(id => PATTERNS[id]).filter(p => p.category === col.key);

    const nodes = patterns.map(p => {
      const done = Progress.isDone(p.id);
      const diff = DIFFICULTIES[p.difficulty];
      return `
        <a href="pattern.html?id=${p.id}" class="roadmap-node${done ? ' done' : ''}"
           aria-label="${p.name}${done ? ' (Completed)' : ''}">
          <span class="roadmap-node-dot" aria-hidden="true"></span>
          <span class="roadmap-node-label">
            ${p.name}
            <span style="font-size:11px;color:${diff.color};margin-left:5px;font-weight:600;">${diff.label}</span>
          </span>
        </a>`;
    }).join('');

    const catDone  = Progress.getCountByCategory(col.key);
    const catTotal = patterns.length;

    return `
      <div class="roadmap-col">
        <div class="roadmap-col-header" style="background:color-mix(in srgb,${cat.color} 10%,transparent);color:${cat.color}">
          <span>${col.icon}</span>
          <span>${cat.label}</span>
          <span style="margin-left:auto;font-size:12px;opacity:.8;">${catDone}/${catTotal}</span>
        </div>
        <div class="roadmap-nodes">${nodes}</div>
      </div>`;
  }

  function render() {
    document.getElementById('roadmap-content').innerHTML =
      `<div class="roadmap-grid">${columns.map(renderColumn).join('')}</div>`;
  }

  render();
  document.addEventListener('progress-changed', render);
})();

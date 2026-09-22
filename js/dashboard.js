/* ── Dashboard renderer ────────────────────────────────────────── */

(function () {
  injectNav('dashboard');
  injectFooter();

  const TOTAL = PATTERN_ORDER.length;

  function miniCard(p) {
    const done = Progress.isDone(p.id);
    const d = DIFFICULTIES[p.difficulty];
    const c = CATEGORIES[p.category];
    return `
      <a href="pattern.html?id=${p.id}" class="card card-hover pattern-card" aria-label="${p.name}${done ? ' (Completed)' : ''}">
        <div class="pattern-card-top">
          ${done
            ? '<span class="badge badge-done" aria-label="Completed">✓ Completed</span>'
            : `<span class="badge badge-cat" style="--cat-color:${c.color}">${c.label}</span>`}
        </div>
        <h3 style="font-size:14.5px;">${p.name}</h3>
        <div class="pattern-card-meta" style="margin-top:8px;">
          <span class="badge badge-diff" style="--diff-color:${d.color}">${d.label}</span>
          ${p.hasRepoCode ? '<span style="font-size:11.5px;color:var(--accent);font-weight:500;">Repo ✓</span>' : ''}
        </div>
      </a>`;
  }

  function render() {
    const count = Progress.getCount();
    const pct   = Math.round((count / TOTAL) * 100);

    document.getElementById('done-count').textContent = count;
    const bar = document.getElementById('progress-bar');
    bar.style.width = pct + '%';
    document.getElementById('progress-bar-wrap').setAttribute('aria-valuenow', count);

    // continue button
    const nextId = Progress.getNextUncompleted();
    const contBtn = document.getElementById('continue-btn');
    if (nextId) {
      contBtn.href = `pattern.html?id=${nextId}`;
      contBtn.textContent = `Continue: ${PATTERNS[nextId].name}`;
    } else {
      contBtn.href = 'patterns.html';
      contBtn.textContent = 'All Done! Review Patterns';
    }

    // category progress bars
    const catEl = document.getElementById('cat-progress');
    catEl.innerHTML = Object.entries(CATEGORIES).map(([key, cat]) => {
      const catPatterns = PATTERN_ORDER.filter(id => PATTERNS[id].category === key);
      const catTotal    = catPatterns.length;
      const catDone     = Progress.getCountByCategory(key);
      const catPct      = Math.round((catDone / catTotal) * 100);
      return `
        <div class="cat-progress-item">
          <div class="cat-progress-top">
            <span class="cat-progress-name" style="color:${cat.color}">${cat.label}</span>
            <span class="cat-progress-count">${catDone} / ${catTotal}</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width:${catPct}%;background:${cat.color}"></div>
          </div>
        </div>`;
    }).join('');

    // pattern grids
    ['creational', 'structural', 'behavioral'].forEach(cat => {
      const el = document.getElementById('grid-' + cat);
      const patterns = PATTERN_ORDER.map(id => PATTERNS[id]).filter(p => p.category === cat);
      el.innerHTML = patterns.map(miniCard).join('');
    });
  }

  render();
  document.addEventListener('progress-changed', render);
})();

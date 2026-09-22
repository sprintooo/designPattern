/* ── Individual pattern lesson renderer ─────────────────────────── */

(function () {
  const params  = new URLSearchParams(window.location.search);
  const id      = params.get('id');
  const pattern = id ? PATTERNS[id] : null;

  injectNav('patterns');
  injectFooter();

  if (!pattern) {
    document.getElementById('lesson-content').innerHTML = `
      <div class="empty-state" style="padding:120px 0">
        <h3>Pattern not found</h3>
        <p>The pattern <code>${escapeHtml(id || '')}</code> does not exist.</p>
        <a href="patterns.html" class="btn btn-secondary mt-16">Back to Library</a>
      </div>`;
    return;
  }

  // update meta
  document.getElementById('page-title').textContent = `${pattern.name} — Design Patterns`;
  document.getElementById('page-desc').content = pattern.summary;

  const cat  = CATEGORIES[pattern.category];
  const diff = DIFFICULTIES[pattern.difficulty];

  // prev / next
  const idx  = PATTERN_ORDER.indexOf(id);
  const prev = idx > 0 ? PATTERNS[PATTERN_ORDER[idx - 1]] : null;
  const next = idx < PATTERN_ORDER.length - 1 ? PATTERNS[PATTERN_ORDER[idx + 1]] : null;

  function tocLink(anchor, label) {
    return `<a href="#${anchor}">${label}</a>`;
  }

  function checklist(items, isAvoid) {
    return `<ul class="checklist" role="list">${items.map(item => `
      <li class="checklist-item">
        <span class="check-icon ${isAvoid ? 'no' : 'yes'}" aria-hidden="true">${isAvoid ? '✕' : '✓'}</span>
        <span>${escapeHtml(item)}</span>
      </li>`).join('')}</ul>`;
  }

  function realWorldCards(items) {
    return `<div class="realworld-grid">${items.map(rw => `
      <div class="realworld-card">
        <h4>${escapeHtml(rw.name)}</h4>
        <p>${escapeHtml(rw.description)}</p>
      </div>`).join('')}</div>`;
  }

  function relatedChips(ids) {
    return `<div class="related-chips">${ids.map(rid => {
      const rp = PATTERNS[rid];
      if (!rp) return '';
      return `<a href="pattern.html?id=${rid}" class="related-chip">${escapeHtml(rp.name)}</a>`;
    }).join('')}</div>`;
  }

  function takeawaysList(items) {
    return `<ul class="takeaways" role="list">${items.map(t =>
      `<li class="takeaway-item">${escapeHtml(t)}</li>`
    ).join('')}</ul>`;
  }

  function navBtn(p, direction) {
    if (!p) return `<div></div>`;
    const label = direction === 'prev' ? '← Previous' : 'Next →';
    return `
      <a href="pattern.html?id=${p.id}" class="card pattern-card lesson-nav-btn ${direction}" aria-label="${label}: ${p.name}">
        <span class="lesson-nav-label">${label}</span>
        <span class="lesson-nav-title">${escapeHtml(p.name)}</span>
      </a>`;
  }

  const repoBase = 'https://github.com/sprintooo/designPattern/tree/main/';

  const html = `
    <article>
      <!-- Breadcrumb -->
      <nav class="lesson-breadcrumb" aria-label="Breadcrumb">
        <a href="patterns.html">Patterns</a>
        <span aria-hidden="true">›</span>
        <span style="color:var(--cat-color,var(--accent));" style="--cat-color:${cat.color}">${cat.label}</span>
        <span aria-hidden="true">›</span>
        <span>${escapeHtml(pattern.name)}</span>
      </nav>

      <!-- Header -->
      <header class="lesson-header">
        <h1 class="lesson-title" id="top">${escapeHtml(pattern.name)}</h1>
        <div class="lesson-meta">
          ${categoryBadge(pattern.category)}
          ${difficultyBadge(pattern.difficulty)}
          <span class="reading-time">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7-3.25v2.992l2.028.812a.75.75 0 0 1-.557 1.392l-2.5-1A.751.751 0 0 1 7 8.25v-3.5a.75.75 0 0 1 1.5 0Z"/>
            </svg>
            ${pattern.readingTime} min read
          </span>
          <button class="complete-btn" id="complete-btn" aria-pressed="false">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.75.75 0 0 1 1.06-1.06L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"/>
            </svg>
            <span id="complete-label">Mark as Complete</span>
          </button>
        </div>
        <blockquote class="lesson-intent">${escapeHtml(pattern.intent)}</blockquote>
      </header>

      <!-- Why does this pattern exist? -->
      <section class="lesson-section" id="problem">
        <h2 class="lesson-section-title">Why Does This Pattern Exist?</h2>
        <p>${escapeHtml(pattern.problemDescription)}</p>
        ${renderCodeBlock(pattern.problemCode, 'java')}
      </section>

      <!-- The Solution -->
      <section class="lesson-section" id="solution">
        <h2 class="lesson-section-title">The Solution</h2>
        <p>${escapeHtml(pattern.solutionDescription)}</p>
        <div class="diagram-box" role="img" aria-label="Pattern structure diagram">${escapeHtml(pattern.solutionDiagram)}</div>
      </section>

      <!-- Implementation -->
      <section class="lesson-section" id="implementation">
        <h2 class="lesson-section-title">Implementation</h2>
        ${renderCodeBlock(pattern.implementationCode.java, 'java')}
        ${pattern.hasRepoCode ? `
        <div class="repo-link-box">
          <p>Full working implementation in the repository:</p>
          <a href="${repoBase}${pattern.repoPath}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            View source on GitHub
          </a>
        </div>` : `
        <div class="repo-link-box">
          <p>Java implementation coming soon. Check the <a href="https://github.com/sprintooo/designPattern" target="_blank" rel="noopener" style="color:var(--accent);">repository</a> for updates.</p>
        </div>`}
      </section>

      <!-- When to use -->
      <section class="lesson-section" id="when-to-use">
        <h2 class="lesson-section-title">When to Use</h2>
        ${checklist(pattern.useWhen, false)}
      </section>

      <!-- When NOT to use -->
      <section class="lesson-section" id="avoid">
        <h2 class="lesson-section-title">When NOT to Use</h2>
        ${checklist(pattern.avoidWhen, true)}
      </section>

      <!-- Real world -->
      <section class="lesson-section" id="real-world">
        <h2 class="lesson-section-title">Real-World Examples</h2>
        ${realWorldCards(pattern.realWorld)}
      </section>

      <!-- Related patterns -->
      ${pattern.related.length > 0 ? `
      <section class="lesson-section" id="related">
        <h2 class="lesson-section-title">Related Patterns</h2>
        ${relatedChips(pattern.related)}
      </section>` : ''}

      <!-- Takeaways -->
      <section class="lesson-section" id="takeaways">
        <h2 class="lesson-section-title">Key Takeaways</h2>
        ${takeawaysList(pattern.takeaways)}
      </section>

      <!-- Prev / Next -->
      <nav class="lesson-nav" aria-label="Lesson navigation">
        ${navBtn(prev, 'prev')}
        ${navBtn(next, 'next')}
      </nav>
    </article>`;

  document.getElementById('lesson-content').innerHTML = html;

  // TOC
  const tocEl = document.getElementById('lesson-toc');
  const sections = [
    ['top',            'Overview'],
    ['problem',        'Why It Exists'],
    ['solution',       'The Solution'],
    ['implementation', 'Implementation'],
    ['when-to-use',    'When to Use'],
    ['avoid',          'When NOT to Use'],
    ['real-world',     'Real-World Examples'],
  ];
  if (pattern.related.length > 0) sections.push(['related', 'Related Patterns']);
  sections.push(['takeaways', 'Key Takeaways']);

  tocEl.innerHTML = `<p class="lesson-toc-title">On this page</p>` +
    sections.map(([anchor, label]) => tocLink(anchor, label)).join('');

  // complete button
  const btn   = document.getElementById('complete-btn');
  const label = document.getElementById('complete-label');

  function syncBtn() {
    const done = Progress.isDone(id);
    btn.classList.toggle('done', done);
    btn.setAttribute('aria-pressed', String(done));
    label.textContent = done ? 'Completed' : 'Mark as Complete';
  }

  syncBtn();
  btn.addEventListener('click', () => {
    Progress.toggle(id);
    syncBtn();
  });

  // highlight
  initCodeBlocks();

  // active TOC highlight on scroll
  const sectionEls = sections.map(([anchor]) => document.getElementById(anchor)).filter(Boolean);
  const tocLinks   = tocEl.querySelectorAll('a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const active = entry.target.id;
        tocLinks.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + active);
        });
      }
    });
  }, { rootMargin: '-60px 0px -70% 0px' });

  sectionEls.forEach(el => observer.observe(el));
})();

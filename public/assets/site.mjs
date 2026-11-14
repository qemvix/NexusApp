// Progressive enhancements: every feature and download remains a normal link without JavaScript.
document.documentElement.classList.replace('no-js', 'js');
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const menu = $('.menu-toggle');
const closeMenu = () => { menu?.setAttribute('aria-expanded', 'false'); $('#main-nav')?.classList.remove('is-open'); };
menu?.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); $('#main-nav').classList.toggle('is-open', open); });
$('#main-nav')?.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);

const dialog = $('#detail-dialog');
let lastFocus;
const closeDialog = () => dialog.close();
$('.dialog-close', dialog).addEventListener('click', closeDialog);
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(); } });
dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); lastFocus?.focus(); });
dialog.addEventListener('keydown', event => {
  if (event.key !== 'Tab') return;
  const controls = $$('button, a[href], input, [tabindex="0"]', dialog);
  const first = controls[0], last = controls.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});
const openDialog = (content, image = false) => {
  lastFocus = document.activeElement;
  $('#dialog-content').innerHTML = content;
  dialog.classList.toggle('image-dialog', image);
  document.body.classList.add('modal-open');
  dialog.showModal();
  $('.dialog-close', dialog).focus();
};
let moduleRequest;
document.addEventListener('click', async event => {
  const link = event.target.closest('a[data-module], a[data-image]');
  if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0 || typeof dialog.showModal !== 'function') return;
  event.preventDefault();
  if (link.dataset.image) {
    openDialog(`<h2 id="dialog-title">${escape(link.dataset.image)}</h2><img src="${escape(link.getAttribute('href'))}" alt="${escape(link.dataset.image)} — actual Nexus app screenshot.">`, true);
    return;
  }
  try {
    moduleRequest ??= fetch('/assets/modules.json').then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); });
    const {modules: items} = await moduleRequest;
    const item = items.find(m => m.id === link.dataset.module);
    if (!item) throw new Error('Unknown feature');
    // Do not steal focus if the visitor moved on while the data was loading.
    if (dialog.open) return;
    openDialog(`<p class="eyebrow">INSIDE THE TOOLKIT</p><h2 id="dialog-title">${escape(item.name)}</h2><p class="large-copy">${escape(item.tagline)}</p><p>${escape(item.description)}</p><ul class="check-list">${item.features.map(text => `<li>${escape(text)}</li>`).join('')}</ul><div class="detail-facts"><div><h3>Capability</h3><p>${escape(item.permissions.join(' · '))}</p></div><div><h3>Shortcut</h3><p>${escape(item.shortcut)}</p></div></div><aside class="note"><strong>Current preview limits</strong><p>${escape(item.limit)}</p></aside><a class="text-link" href="/modules/#${item.id}">Read the complete feature guide ↗</a>`);
  } catch { moduleRequest = undefined; location.assign(link.href); }
});

const shots = {
  'nexus-dashboard': ['Overview', 'Your module status and a starting point for your workspace.'],
  'nexus-all-modules': ['Module library', 'Enable, configure or remove tools from one consistent library.'],
  'nexus-permissions': ['Permissions', 'Review capability grants before features begin working.'],
  'nexus-settings-updates': ['Settings', 'Theme, motion, rendering targets and optional update controls.']
};
$$('[data-shot]').forEach(button => button.addEventListener('click', () => {
  $$('[data-shot]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  const [title, caption] = shots[button.dataset.shot];
  const path = `/assets/media/${button.dataset.shot}.png`;
  $('#gallery-image').src = path;
  $('#gallery-image').alt = `Nexus ${title.toLowerCase()} screen, captured from the native app.`;
  $('#gallery-caption').textContent = `${title} — ${caption}`;
  $('#gallery-full').href = path;
  $('#gallery-full').dataset.image = `Nexus ${title.toLowerCase()}`;
}));

let selectedFamily = 'all';
function filterModules() {
  const query = $('#module-search').value.trim().toLocaleLowerCase();
  let count = 0;
  $$('.module-card').forEach(card => { card.hidden = !((selectedFamily === 'all' || card.dataset.family === selectedFamily) && card.textContent.toLocaleLowerCase().includes(query)); if (!card.hidden) count++; });
  $('.result-count').textContent = `${count} ${count === 1 ? 'utility' : 'utilities'}`;
  $('.empty-results').hidden = count !== 0;
}
$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  selectedFamily = button.dataset.filter;
  $$('[data-filter]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  filterModules();
}));
$('#module-search')?.addEventListener('input', filterModules);
let toastTimer;
$$('.copy-hash').forEach(button => button.addEventListener('click', async () => {
  let message = 'Checksum copied.';
  try { await navigator.clipboard.writeText(button.dataset.copy); }
  catch { message = 'Select and copy the checksum shown above.'; }
  $('.toast').textContent = message;
  $('.toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('.toast').hidden = true; }, 4500);
}));

// A bounded, idle-aware illustration. This does not observe input outside this canvas.
const canvas = $('#pointer-demo');
if (canvas) {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let paused = reduced.matches, visible = false, frame = 0, points = [], ripples = [];
    let width = 1, height = 1, x = 0, y = 0;
    const intensity = $('#trail-intensity');
    const pause = $('#demo-pause');
    const hint = $('.demo-hint');
    const updatePause = () => { pause.setAttribute('aria-pressed', String(paused)); pause.textContent = paused ? 'Resume preview' : 'Pause preview'; };
    const clear = () => { cancelAnimationFrame(frame); frame = 0; points = []; ripples = []; ctx.clearRect(0, 0, width, height); };
    const draw = time => {
      frame = 0;
      if (paused || !visible || document.hidden) { clear(); return; }
      ctx.clearRect(0, 0, width, height);
      const duration = 100 + Number(intensity.value) * 5;
      points = points.filter(point => time - point.time < duration);
      ripples = ripples.filter(point => time - point.time < 850);
      points.forEach(point => { const life = 1 - (time - point.time) / duration; ctx.beginPath(); ctx.fillStyle = `rgba(169,143,255,${life * .65})`; ctx.arc(point.x, point.y, 1 + life * (3 + Number(intensity.value) / 12), 0, Math.PI * 2); ctx.fill(); });
      ripples.forEach(point => { const t = (time - point.time) / 850; ctx.beginPath(); ctx.strokeStyle = `rgba(133,224,230,${1 - t})`; ctx.lineWidth = 1.8 * (1 - t); ctx.arc(point.x, point.y, 4 + t * 95, 0, Math.PI * 2); ctx.stroke(); });
      if (points.length || ripples.length) frame = requestAnimationFrame(draw);
    };
    const requestDraw = () => { if (!frame && visible && !paused && !document.hidden) frame = requestAnimationFrame(draw); };
    const addPoint = () => { if (paused || !visible) return; points.push({x, y, time: performance.now()}); if (points.length > 180) points.shift(); hint.hidden = true; requestDraw(); };
    const ripple = () => { if (paused || !visible) return; ripples.push({x, y, time: performance.now()}); if (ripples.length > 12) ripples.shift(); requestDraw(); };
    const resize = () => { const rect = canvas.getBoundingClientRect(); const ratio = Math.min(devicePixelRatio || 1, 2); width = rect.width; height = rect.height; canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); x = width / 2; y = height / 2; clear(); };
    new ResizeObserver(resize).observe(canvas);
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; if (!visible) clear(); }, {threshold: .1}).observe(canvas);
    canvas.addEventListener('pointermove', event => { const rect = canvas.getBoundingClientRect(); x = event.clientX - rect.left; y = event.clientY - rect.top; addPoint(); });
    canvas.addEventListener('pointerdown', event => { const rect = canvas.getBoundingClientRect(); x = event.clientX - rect.left; y = event.clientY - rect.top; ripple(); });
    canvas.addEventListener('keydown', event => {
      const shifts = {ArrowLeft: [-18, 0], ArrowRight: [18, 0], ArrowUp: [0, -18], ArrowDown: [0, 18]};
      if (shifts[event.key]) { event.preventDefault(); x = Math.max(8, Math.min(width - 8, x + shifts[event.key][0])); y = Math.max(8, Math.min(height - 8, y + shifts[event.key][1])); addPoint(); }
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); ripple(); }
    });
    intensity.addEventListener('input', () => { $('#trail-value').value = `${intensity.value}%`; });
    pause.addEventListener('click', () => { paused = !paused; updatePause(); if (paused) clear(); });
    reduced.addEventListener('change', event => { if (event.matches) { paused = true; updatePause(); clear(); } });
    document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
    updatePause();
  }
}

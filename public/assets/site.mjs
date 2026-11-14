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
    moduleRequest ??= fetch('/assets/modules.json?v=0.2.2').then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); });
    const {modules: items} = await moduleRequest;
    const item = items.find(m => m.id === link.dataset.module);
    if (!item) throw new Error('Unknown feature');
    // Do not steal focus if the visitor moved on while the data was loading.
    if (dialog.open) return;
    openDialog(`<h2 id="dialog-title">${escape(item.name)}</h2><p>${escape(item.description)}</p><ul class="check-list">${item.features.map(text => `<li>${escape(text)}</li>`).join('')}</ul><div class="detail-facts"><div><h3>Capability</h3><p>${escape(item.permissions.join(' · '))}</p></div><div><h3>Shortcut</h3><p>${escape(item.shortcut)}</p></div></div><aside class="note"><strong>Current limits</strong><p>${escape(item.limit)}</p></aside><a class="text-link" href="/modules/#${item.id}">Full feature guide ↗︎</a>`);
  } catch { moduleRequest = undefined; location.assign(link.href); }
});

const shots = {
  'nexus-dashboard': ['Overview', 'Running modules, access requirements and common actions.'],
  'nexus-all-modules': ['Module library', 'Enable, disable, configure or remove utilities.'],
  'nexus-permissions': ['Permissions', 'Capabilities required by each module.'],
  'nexus-settings-updates': ['Settings', 'Rendering, accessibility and updates.']
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

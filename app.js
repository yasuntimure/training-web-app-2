'use strict';

let store = freshStore();
let current = dayKey(new Date());
let renderedDay = localDate(new Date());
let flashTimeout;
let storageFailed = false;
try {
  const raw = localStorage.getItem(KEY);
  if (raw) store = cleanStore(JSON.parse(raw));
} catch { storageFailed = true; }

function flash(message) {
  $('saved').textContent = message;
  clearTimeout(flashTimeout);
  flashTimeout = setTimeout(() => { $('saved').textContent = ''; }, 4000);
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(store)); flash('Saved on this device'); }
  catch { flash('Could not save on this device. Back up your log before closing.'); }
}
function dayState() {
  const date = sessionDate(current);
  return store.days[date] ||= {};
}
function previousWeight(id, date) {
  const prior = Object.keys(store.loads).filter(key => key < date && store.loads[key][id] !== undefined).sort().pop();
  return prior ? store.loads[prior][id] : undefined;
}
function renderPills() {
  $('pills').innerHTML = [...ORDER, 'info'].map(key => `<button class="pill" data-k="${key}" data-on="${key === current ? 1 : 0}" data-today="${key === dayKey(new Date()) ? 1 : 0}" aria-pressed="${key === current}">${key === 'info' ? 'Info' : PROGRAM[key].label}</button>`).join('');
  $('pills').querySelectorAll('button').forEach(button => {
    button.onclick = () => { current = button.dataset.k; render(); window.scrollTo(0, 0); $('pills').querySelector('[data-on="1"]').focus({ preventScroll: true }); };
  });
}
function itemHTML(item, state) {
  const ticks = state[item.id] || [];
  const allDone = Array.from({ length: item.sets }, (_, i) => ticks[i] === true).every(Boolean);
  const chips = Array.from({ length: item.sets }, (_, i) => `<button class="chip" data-ex="${item.id}" data-i="${i}" data-on="${ticks[i] ? 1 : 0}" aria-pressed="${Boolean(ticks[i])}" aria-label="${esc(item.name)}: ${item.tickLabel ? 'complete' : `set ${i + 1}${item.bothSides ? ', both sides' : ''}`}">${ticks[i] ? '✓' : item.tickLabel || i + 1}</button>`).join('');
  const date = sessionDate(current);
  const weight = store.loads[date]?.[item.id] ?? store.weights[item.id] ?? '';
  const prev = previousWeight(item.id, date);
  const loadRow = item.load ? `<div class="load"><label for="weight-${item.id}">${item.loadLabel || 'Kettlebell · kg'}</label><input id="weight-${item.id}" type="number" inputmode="decimal" min="0" max="1000" step="0.5" placeholder="kg" data-w="${item.id}" value="${esc(weight)}"></div>${prev !== undefined ? `<div class="sethelp">Previous session: ${prev} kg</div>` : ''}` : '';
  const rest = item.restSec ? `<button class="btn rest" data-rest="${item.restSec}" data-name="${esc(item.name)}">⏱ ${item.restSec / 60} min rest</button>` : '';
  const demo = item.demo ? `<a class="btn" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=${encodeURIComponent(item.demo)}">Find demo ↗</a>` : '';
  return `<article class="card" data-done="${allDone ? 1 : 0}">
    <div class="row1"><h3>${item.name}</h3><div class="rx">${item.rx}</div></div>
    <div class="chips">${chips}</div>
    ${item.bothSides ? '<div class="sethelp">Each tick = both sides completed</div>' : ''}
    ${loadRow}
    <div class="foot">${rest}<button class="btn" data-toggle="1" aria-expanded="false" aria-controls="notes-${item.id}">How to do it</button>${demo}</div>
    <div class="notes" id="notes-${item.id}">${item.notes}</div>
    ${item.optional ? '<div class="optional">Optional · does not affect completion</div>' : ''}
  </article>`;
}
function render() {
  renderedDay = localDate(new Date());
  renderPills();
  $('datelbl').textContent = new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const info = current === 'info';
  $('resetday').hidden = info;
  $('progressbar').hidden = info;
  $('progresslabel').hidden = info;
  if (info) {
    $('daytitle').textContent = 'Keep It Simple';
    $('daysub').textContent = 'Five movements · repeat for 6–8 weeks';
    $('content').innerHTML = `<div class="block">${REFERENCE}</div>`;
    return;
  }
  const day = PROGRAM[current];
  $('daytitle').textContent = day.title;
  $('daysub').textContent = `Day ${ORDER.indexOf(current) + 1} · ${day.sub}`;
  const state = dayState();
  $('content').innerHTML = `<p class="intro">${day.intro}</p>` + day.blocks.map(block => `<section class="block"><div class="blockhead"><span>${block.name}</span><i></i></div>${block.items.map(item => itemHTML(item, state)).join('')}</section>`).join('');
  bind();
  updateProgress();
}
function updateProgress() {
  if (current === 'info') return;
  const state = dayState();
  let total = 0, done = 0;
  for (const block of PROGRAM[current].blocks) for (const item of block.items) {
    if (item.optional) continue;
    total += item.sets;
    for (let i = 0; i < item.sets; i++) if (state[item.id]?.[i]) done++;
  }
  const percent = total ? Math.round(done / total * 100) : 0;
  $('prog').style.width = percent + '%';
  $('progressbar').setAttribute('aria-valuenow', percent);
  const dateLabel = new Date(sessionDate(current) + 'T12:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  $('progresslabel').textContent = `${done} / ${total} sets & activities · ${dateLabel}${done === total ? ' · Session complete' : ''}`;
}
function bind() {
  document.querySelectorAll('.chip').forEach(button => {
    button.onclick = () => {
      if (renderedDay !== localDate(new Date())) { render(); flash('A new day has started. Your session has been refreshed.'); return; }
      const state = dayState(), id = button.dataset.ex, index = Number(button.dataset.i);
      state[id] ||= Array(EXERCISES[id].sets).fill(false);
      state[id][index] = !state[id][index];
      button.dataset.on = state[id][index] ? '1' : '0';
      button.setAttribute('aria-pressed', state[id][index]);
      button.textContent = state[id][index] ? '✓' : EXERCISES[id].tickLabel || index + 1;
      button.closest('.card').dataset.done = state[id].every(Boolean) ? '1' : '0';
      save(); updateProgress();
    };
  });
  document.querySelectorAll('[data-toggle]').forEach(button => {
    button.onclick = () => {
      const card = button.closest('.card');
      card.dataset.open = card.dataset.open === '1' ? '0' : '1';
      button.setAttribute('aria-expanded', card.dataset.open === '1');
    };
  });
  document.querySelectorAll('[data-w]').forEach(input => {
    input.oninput = () => {
      const id = input.dataset.w, date = sessionDate(current);
      store.loads[date] ||= {};
      if (input.value === '') { delete store.weights[id]; delete store.loads[date][id]; }
      else {
        const value = Number(input.value);
        if (!input.validity.valid || !Number.isFinite(value) || value < 0 || value > 1000) return;
        store.weights[id] = value; store.loads[date][id] = value;
      }
      save();
    };
  });
  document.querySelectorAll('[data-rest]').forEach(button => { button.onclick = () => startTimer(Number(button.dataset.rest), button.dataset.name); });
}

let timerInterval = null, timerEnd = 0, timerName = '', timerComplete = false;
function paintTimer() {
  const seconds = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
  $('tval').textContent = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  if (seconds === 0 && !timerComplete) {
    timerComplete = true;
    clearInterval(timerInterval);
    $('timer').dataset.done = '1';
    $('tlbl').textContent = 'Rest complete';
    flash('Rest complete — continue when ready');
    if (navigator.vibrate) navigator.vibrate([120, 80, 120]);
  }
}
function startTimer(seconds, name) {
  clearInterval(timerInterval);
  timerEnd = Date.now() + Math.max(0, seconds) * 1000;
  timerName = name;
  timerComplete = false;
  $('timer').dataset.on = '1';
  $('timer').dataset.done = '0';
  $('tlbl').textContent = 'Rest · ' + name;
  timerInterval = setInterval(paintTimer, 250);
  paintTimer();
}
$('tstop').onclick = () => { clearInterval(timerInterval); $('timer').dataset.on = '0'; $('timer').dataset.done = '0'; };
document.querySelectorAll('[data-adj]').forEach(button => {
  button.onclick = () => startTimer(Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000)) + Number(button.dataset.adj), timerName);
});

$('resetday').onclick = () => {
  if (current === 'info' || !confirm(`Clear the ticks for ${PROGRAM[current].label}? Your saved weights will stay.`)) return;
  store.days[sessionDate(current)] = {};
  save(); render();
};
$('export').onclick = () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(store, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url; link.download = `training-web-app-2-log-${localDate(new Date())}.json`;
  document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
$('import').onclick = () => $('importfile').click();
$('importfile').onchange = async event => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    if (file.size > 5 * 1024 * 1024) throw new Error('Too large');
    const restored = cleanStore(JSON.parse(await file.text()));
    if (!confirm('Restore this Training 2 backup? It will replace the log currently saved on this device.')) return;
    store = restored; save(); render(); flash('Backup restored');
  } catch { flash('Could not restore this file. Choose a Training 2 JSON backup.'); }
  finally { event.target.value = ''; }
};

let lock = null, keepAwake = false;
async function acquireWakeLock() {
  try {
    lock = await navigator.wakeLock.request('screen');
    lock.addEventListener('release', () => { lock = null; $('wake').textContent = 'Keep screen on'; });
    $('wake').textContent = 'Screen staying on';
  } catch { keepAwake = false; $('wake').textContent = 'Keep screen on'; flash('Keeping the screen on is unavailable in this browser.'); }
}
if (!('wakeLock' in navigator)) $('wake').hidden = true;
$('wake').onclick = async () => {
  keepAwake = !keepAwake;
  if (keepAwake) await acquireWakeLock();
  else { if (lock) await lock.release(); $('wake').textContent = 'Keep screen on'; }
};
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible') return;
  if (renderedDay !== localDate(new Date())) { current = dayKey(new Date()); render(); }
  if ($('timer').dataset.on === '1') paintTimer();
  if (keepAwake && !lock) acquireWakeLock();
});

if ('serviceWorker' in navigator && window.isSecureContext) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => flash('Offline setup unavailable; the app still works online.')));
}
render();
if (storageFailed) flash('Could not read the saved log. Restore a backup if you have one.');
requestAnimationFrame(() => $('pills').querySelector('[data-on="1"]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' }));

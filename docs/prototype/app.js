/**
 * app.js — GroundLoop browser demo (sample mode). No login, no Firebase, no
 * network except OpenStreetMap tiles. Resident app (phone) + partner dashboard.
 * Trusted values come from the ported app logic in logic.js.
 */
import {
  REGIONS, ITEMS, verdictFor, searchItems,
  streakInfo, ripeness, recentWeeks,
  nearestSite, distanceM, coarse, withinGeofence,
  badgesFor, seedsFor,
} from './logic.js';
import { t, setLocale, getLocale, LOCALES } from './i18n.js';
import { mascotSvg } from './mascots.js';
import {
  sampleUser, samplePosts, sampleAreaStats, sampleTrend, sampleRequests,
  PUBLIC_DATASET, MASCOTS, MAYA_AREA,
} from './data.sample.js';
import { aggregateByArea, MIN_USERS } from './privacy.js';

/* ───────────────────────── demo state ───────────────────────── */

const DAY = 86_400_000;
const state = {
  view: (typeof location !== 'undefined' && location.hash === '#partner') ? 'partner' : 'resident',
  onboarded: false,
  city: sampleUser.city,
  tab: 'home',
  sessionMascot: 0,                 // rotates Peel→Bram→Cora
  clockOffset: 0,                   // days skipped (demo "skip a day")
  lastDropAt: sampleUser.lastDropAt,
  doneWeeks: [...sampleUser.weeks],
  posts: structuredClone(samplePosts),
  requests: structuredClone(sampleRequests),
  optedIn: sampleUser.optedIn,
  locale: 'en',
  recapIndex: 0,
  lastResult: null,                 // last logged drop-off result (badges/proof)
  checkItem: null,                  // item open in Check
  publicLayer: false,
};

const now = () => new Date(Date.now() + state.clockOffset * DAY);
const greeted = { done: false };

/* ───────────────────────── helpers ───────────────────────── */

const el = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const region = () => REGIONS[state.city];
const hasSites = () => (region().sites?.length ?? 0) > 0;
function cityCenter() {
  const s = region().sites ?? [];
  if (s.length) return [s.reduce((a, x) => a + x.lat, 0) / s.length, s.reduce((a, x) => a + x.lng, 0) / s.length];
  return CITY_CENTROIDS[state.city] ?? [42.36, -71.06];
}
const CITY_CENTROIDS = {
  somerville: [42.3876, -71.0995], worcester: [42.2626, -71.8023], camden: [51.5290, -0.1255],
  wandsworth: [51.4571, -0.1818], nagai: [38.1066, 140.0407], oki: [33.2027, 130.4761],
  inagi: [35.6378, 139.5046], seoul: [37.5665, 126.978], toronto: [43.6532, -79.3832],
};

const VERDICT_PILL = { bin: 'in', not: 'out', share: 'share', ask: 'ask' };
const VERDICT_KEY = { bin: 'check.in', not: 'check.out', share: 'check.share', ask: 'check.ask' };

function applyStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach((n) => { n.textContent = t(n.getAttribute('data-i18n')); });
}

/* ───────────────────────── root render ───────────────────────── */

function render() {
  el('residentView').style.display = state.view === 'resident' ? 'flex' : 'none';
  el('partnerView').style.display = state.view === 'partner' ? 'block' : 'none';
  document.querySelectorAll('#viewSwitch button').forEach((b) =>
    b.classList.toggle('active', b.dataset.view === state.view));
  applyStaticI18n();
  if (state.view === 'resident') renderResident();
  else renderPartner();
}

/* ───────────────────────── resident ───────────────────────── */

function renderResident() {
  el('appMark').innerHTML = mascotSvg(MASCOTS[state.sessionMascot], state.tab === 'home' ? 'fresh' : 24, 24);
  const screen = el('screen');
  if (!state.onboarded) { screen.innerHTML = onboarding(); wireOnboarding(); el('tabbar').innerHTML = ''; return; }
  renderTabbar();
  const map = { home: homeScreen, check: checkScreen, log: logScreen, map: mapScreen, community: communityScreen, you: youScreen };
  screen.innerHTML = (map[state.tab] ?? homeScreen)();
  const wire = { home: wireHome, check: wireCheck, log: wireLog, map: wireMap, community: wireCommunity, you: wireYou };
  (wire[state.tab] ?? (() => {}))();
  if (!greeted.done && state.tab === 'home') showGreeting();
}

function renderTabbar() {
  const tabs = [
    ['home', '🏠', 'tab.home'], ['check', '🔎', 'tab.check'], ['log', '📸', 'tab.log'],
    ['map', '🗺️', 'tab.map'], ['community', '🌱', 'tab.community'], ['you', '🙂', 'tab.you'],
  ];
  el('tabbar').innerHTML = tabs.map(([id, ic, key]) =>
    `<button data-tab="${id}" class="${state.tab === id ? 'active' : ''}"><span class="ic">${ic}</span>${t(key)}</button>`).join('');
  el('tabbar').querySelectorAll('button').forEach((b) =>
    b.onclick = () => { state.tab = b.dataset.tab; render(); });
}

/* Onboarding */
function onboarding() {
  const opts = Object.values(REGIONS).map((r) =>
    `<option value="${r.id}" ${r.id === state.city ? 'selected' : ''}>${esc(r.name)} — ${esc(r.country)}</option>`).join('');
  return `
    <div class="card center" style="margin-top:28px">
      ${mascotSvg('peel', 'fresh', 110)}
      <h3 style="font-size:20px;margin-top:10px">${t('onboard.title')}</h3>
      <p class="muted">${t('onboard.pick')}</p>
      <select id="cityPick" aria-label="${t('onboard.pick')}">${opts}</select>
      <div style="height:14px"></div>
      <button class="btn" id="startBtn">${t('onboard.cta')}</button>
    </div>
    <p class="muted center">${t('you.privacy')}</p>`;
}
function wireOnboarding() {
  el('cityPick').onchange = (e) => { state.city = e.target.value; };
  el('startBtn').onclick = () => { state.onboarded = true; state.tab = 'home'; greeted.done = false; render(); };
}

function showGreeting() {
  greeted.done = true;
  const ov = document.createElement('div');
  ov.className = 'greet-overlay';
  ov.innerHTML = `${mascotSvg(MASCOTS[state.sessionMascot], 'fresh', 130)}<h2>${t('greet.hi', { name: sampleUser.name })}</h2><p>${esc(region().name)}</p>`;
  ov.onclick = () => ov.remove();
  el('residentView').appendChild(ov);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) setTimeout(() => ov.remove(), 2200);
}

/* Home */
function homeScreen() {
  const info = streakInfo(state.doneWeeks, sampleUser.paused, now());
  const rip = ripeness(state.lastDropAt, now().getTime());
  const weeks = recentWeeks(16, now());
  const strip = weeks.map((w) => {
    const done = state.doneWeeks.includes(w), paused = sampleUser.paused.includes(w), cur = w === weeks[weeks.length - 1];
    return `<div class="wk ${done ? 'done' : ''} ${paused ? 'paused' : ''} ${cur ? 'current' : ''}" title="${w}"></div>`;
  }).join('');
  const usual = hasSites() ? region().sites[0] : null;
  return `
    <div class="card center">
      ${mascotSvg('peel', rip, 120)}
      <p class="muted" style="margin:6px 0 0">${t('home.peel.' + rip)}</p>
      <button class="btn secondary" id="skipDay" style="width:auto;margin-top:10px;padding:8px 14px;font-size:13px">⏭️ ${t('home.skipday')}</button>
    </div>
    <div class="card">
      <h3>${t('home.streak')}</h3>
      <p style="font-size:26px;font-weight:800;color:var(--forest);margin:0">${t('home.weeks', { n: info.count })}</p>
      ${!info.thisWeekDone ? `<p class="muted">${t('home.keepgoing')}</p>` : ''}
      <div class="weekstrip" style="margin-top:10px">${strip}</div>
    </div>
    ${usual ? `<div class="card"><h3>${t('home.usual')}</h3><p style="margin:0">${esc(usual.label)}</p><p class="muted">${esc(usual.area)}${usual.note ? ' · ' + esc(usual.note) : ''}</p></div>` : ''}
    <button class="btn" id="goLog">📸 ${t('home.logcta')}</button>`;
}
function wireHome() {
  el('skipDay').onclick = () => { state.clockOffset += 1; render(); };
  el('goLog').onclick = () => { state.tab = 'log'; render(); };
}

/* Check */
function checkScreen() {
  const list = searchItems(el('q')?.value ?? '');
  let detail = '';
  if (state.checkItem) {
    const item = ITEMS.find((i) => i.name === state.checkItem);
    detail = itemDetail(item);
  }
  return `
    <div class="card">
      <h3>${t('check.title')}</h3>
      <input type="text" id="q" placeholder="${t('check.placeholder')}" value="${esc(el('q')?.value ?? '')}" />
    </div>
    ${detail}
    <div class="card">
      ${list.map((i) => `<div class="itemrow" data-item="${esc(i.name)}"><span class="emoji">${i.emoji}</span><span class="name">${esc(i.name)}</span></div>`).join('')}
    </div>`;
}
function itemDetail(item, option) {
  if (item.options && option === undefined) {
    return `<div class="card"><h3>${item.emoji} ${esc(item.name)}</h3><p class="muted">${esc(item.question)}</p>
      ${item.options.map((o, idx) => `<button class="btn secondary" style="margin-bottom:6px" data-opt="${idx}">${esc(o.label)}</button>`).join('')}</div>`;
  }
  const v = verdictFor(item, state.city, option);
  const src = v.unverified ? `<p><a href="${esc(region().source)}" target="_blank" rel="noopener">${t('check.source')} ↗</a></p>` : '';
  return `<div class="card"><h3>${item.emoji} ${esc(item.name)}</h3>
    <span class="pill ${VERDICT_PILL[v.verdict]}">${t(VERDICT_KEY[v.verdict])}</span>
    <p style="margin-top:8px">${esc(v.why)}</p>${src}</div>`;
}
function wireCheck() {
  const q = el('q');
  if (q) { q.oninput = () => render(); q.focus(); q.setSelectionRange(q.value.length, q.value.length); }
  el('screen').querySelectorAll('.itemrow').forEach((r) =>
    r.onclick = () => { state.checkItem = r.dataset.item; render(); });
  el('screen').querySelectorAll('[data-opt]').forEach((b) =>
    b.onclick = () => {
      const item = ITEMS.find((i) => i.name === state.checkItem);
      const card = b.closest('.card');
      card.outerHTML = itemDetail(item, Number(b.dataset.opt));
    });
}

/* Log */
function logScreen() {
  if (state.lastResult) return logResult();
  const sites = region().sites ?? [];
  const siteOpts = sites.length
    ? sites.map((s, i) => `<option value="${i}">${esc(s.label)} — ${esc(s.area)}</option>`).join('')
    : `<option value="-1">${esc(region().name)} — ${esc(region().summary)}</option>`;
  return `
    <div class="card">
      <h3>${t('log.title')}</h3>
      <p class="muted">${t('log.picksite')}</p>
      <select id="siteSel">${siteOpts}</select>
      <label class="row"><input type="checkbox" id="photo" checked /> ${t('log.photo')}</label>
      <label class="row"><input type="checkbox" id="loc" checked /> ${t('log.location')}</label>
      <label class="row"><input type="checkbox" id="careful" checked /> ${t('log.careful')}</label>
      <div style="height:10px"></div>
      <button class="btn" id="submitLog">${t('log.submit')}</button>
    </div>`;
}
function wireLog() {
  const sub = el('submitLog');
  if (sub) sub.onclick = () => {
    const photo = el('photo').checked, loc = el('loc').checked, careful = el('careful').checked;
    const sites = region().sites ?? [];
    const idx = Number(el('siteSel').value);
    let proofLevel = 'self';
    if (photo) {
      proofLevel = 'photo';
      if (loc && idx >= 0 && sites[idx]) {
        // simulate an accurate fix ~30 m from the chosen site → geofence passes
        const site = sites[idx];
        const fix = { lat: site.lat + 0.00025, lng: site.lng, accuracy: 15 };
        if (withinGeofence(fix, site)) proofLevel = 'verified';
      }
    }
    const info = streakInfo(state.doneWeeks, sampleUser.paused, now());
    const newStreak = info.thisWeekDone ? info.count : info.count + 1;
    const badges = badgesFor({ proofLevel, careful }, { streak: newStreak, priorCount: sampleUser.priorCount });
    state.lastResult = { proofLevel, seeds: seedsFor(proofLevel, careful), badges };
    // mark this week done + revive Peel
    const cur = recentWeeks(1, now())[0];
    if (!state.doneWeeks.includes(cur)) state.doneWeeks.push(cur);
    state.lastDropAt = now().getTime();
    render();
  };
  if (state.lastResult) {
    el('logDone').onclick = () => { state.lastResult = null; state.tab = 'home'; render(); };
  }
}
function logResult() {
  const r = state.lastResult;
  const proofKey = { self: 'log.proof.self', photo: 'log.proof.photo', verified: 'log.proof.verified', partner: 'log.proof.verified' }[r.proofLevel];
  return `
    <div class="card center">
      ${mascotSvg('peel', 'fresh', 110)}
      <h3 style="margin-top:8px">${t('log.done')}</h3>
      <span class="pill in">${t(proofKey)}</span>
      <p style="font-weight:800;color:var(--share);font-size:18px;margin:10px 0 0">${t('log.seeds', { n: r.seeds })} 🌱</p>
    </div>
    <div class="card">
      ${r.badges.map((b) => `<span class="badge"><b>${esc(b.label)}</b><span>${esc(b.note)}</span></span>`).join('')}
    </div>
    <button class="btn" id="logDone">${t('recap.done')} ✓</button>`;
}

/* Map (Leaflet) */
function mapScreen() {
  return `
    <div class="card">
      <h3>${t('map.title')}</h3>
      ${!hasSites() ? `<p class="muted">${t('map.nosites')}</p>` : ''}
      <div class="map" id="resMap"></div>
      <div style="height:10px"></div>
      <button class="btn sky" id="suggestBtn">📍 ${t('map.suggest')}</button>
      <p class="muted" id="suggestHint" style="display:none">${t('map.suggesthint')}</p>
    </div>`;
}
let suggestMode = false;
function wireMap() {
  const [lat, lng] = cityCenter();
  const m = makeMap('resMap', lat, lng, hasSites() ? 13 : 12);
  if (!m) return;
  (region().sites ?? []).forEach((s) =>
    L.marker([s.lat, s.lng]).addTo(m).bindPopup(`<b>${esc(s.label)}</b><br>${esc(s.area)}${s.note ? '<br>' + esc(s.note) : ''}`));
  state.requests.filter((r) => r.city === state.city).forEach((r) =>
    L.circleMarker([r.lat, r.lng], { radius: 7, color: '#2C6E9E', fillColor: '#2C6E9E', fillOpacity: .6 }).addTo(m).bindPopup(t('map.suggested')));
  el('suggestBtn').onclick = () => {
    suggestMode = !suggestMode;
    el('suggestHint').style.display = suggestMode ? 'block' : 'none';
    m.getContainer().style.cursor = suggestMode ? 'crosshair' : '';
  };
  m.on('click', (e) => {
    if (!suggestMode) return;
    const req = { id: 'r' + Date.now(), city: state.city, lat: coarse(e.latlng.lat), lng: coarse(e.latlng.lng), note: '' };
    state.requests.push(req);
    L.circleMarker([req.lat, req.lng], { radius: 7, color: '#2C6E9E', fillColor: '#2C6E9E', fillOpacity: .6 }).addTo(m).bindPopup(t('map.suggested')).openPopup();
    suggestMode = false; el('suggestHint').style.display = 'none'; m.getContainer().style.cursor = '';
  });
}

/* Community */
function communityScreen() {
  const filter = state.communityFilter ?? 'all';
  const posts = state.posts.filter((p) => filter === 'all' || p.city === state.city);
  return `
    <div class="seg">
      <button data-f="all" class="${filter === 'all' ? 'active' : ''}">${t('community.everyone')}</button>
      <button data-f="city" class="${filter === 'city' ? 'active' : ''}">${esc(region().name)}</button>
    </div>
    <div class="card">
      ${posts.map((p) => `
        <div class="post">
          <div class="type">${esc(p.type)}</div>
          <div class="who">${esc(p.author)}</div>
          <p style="margin:6px 0">${esc(p.text)}</p>
          <button class="cheer ${p.cheered ? 'on' : ''}" data-post="${p.id}" ${p.mine ? 'disabled title="You can’t cheer your own post"' : ''}>
            👏 ${p.cheers} ${p.cheered ? t('community.cheered') : t('community.cheer')}
          </button>
        </div>`).join('')}
    </div>`;
}
function wireCommunity() {
  el('screen').querySelectorAll('.seg button').forEach((b) =>
    b.onclick = () => { state.communityFilter = b.dataset.f === 'city' ? 'city' : 'all'; render(); });
  el('screen').querySelectorAll('.cheer').forEach((b) =>
    b.onclick = () => {
      const p = state.posts.find((x) => x.id === b.dataset.post);
      if (!p || p.mine || p.cheered) return;
      p.cheered = true; p.cheers += 1; render();
    });
}

/* Recap (Wrapped-style stories) */
function youActivityCities() { return sampleUser.citiesCount; }
function recapCards() {
  const r = region();
  const cityWord = sampleUser.citiesCount === 1 ? 'city' : 'cities';
  return [
    { big: '🌱', mid: t('recap.intro') },
    { big: `${sampleUser.priorCount + 1}`, mid: t('recap.dropoffs', { n: sampleUser.priorCount + 1 }) },
    { big: `${sampleUser.longestStreak}`, mid: t('recap.longest', { n: sampleUser.longestStreak }) },
    { big: `${Math.round(sampleUser.photoShare * 100)}%`, mid: t('recap.photoshare', { n: Math.round(sampleUser.photoShare * 100) }) },
    { big: sampleUser.topItems.map((n) => ITEMS.find((i) => i.name === n)?.emoji ?? '•').join(' '), mid: sampleUser.topItems.join(', ') },
    { big: '🗺️', mid: t('recap.cities', { n: sampleUser.citiesCount, cityWord }) },
    { big: '♻️', mid: t('recap.processor'), body: esc(r.processor) },
  ];
}

/* You */
function youScreen() {
  const langOpts = LOCALES.map((l) => `<option value="${l.code}" ${l.code === state.locale ? 'selected' : ''}>${esc(l.label)}</option>`).join('');
  return `
    <div class="card center">
      ${mascotSvg(MASCOTS[state.sessionMascot], 'fresh', 90)}
      <h3 style="margin-top:6px">${esc(sampleUser.name)}</h3>
      <p class="muted">${esc(region().name)} · ${t('home.weeks', { n: streakInfo(state.doneWeeks, sampleUser.paused, now()).count })}</p>
    </div>
    <div class="card">
      <label class="row" style="align-items:flex-start">
        <input type="checkbox" id="optin" ${state.optedIn ? 'checked' : ''} />
        <span><b>${t('you.optin')}</b><br><span class="muted">${t('you.optinnote')}</span></span>
      </label>
    </div>
    <div class="card">
      <h3>${t('you.language')}</h3>
      <select id="langSel">${langOpts}</select>
    </div>
    <div class="card">
      <button class="btn secondary" id="openRecap">✨ ${t('recap.title')}</button>
    </div>
    <p class="muted center">${t('you.privacy')}</p>`;
}
function wireYou() {
  el('optin').onchange = (e) => { state.optedIn = e.target.checked; };
  el('langSel').onchange = (e) => { state.locale = e.target.value; setLocale(state.locale); render(); };
  el('openRecap').onclick = () => { state.recapIndex = 0; showRecap(); };
}
function showRecap() {
  const cards = recapCards();
  const i = state.recapIndex;
  const c = cards[i];
  const ov = document.createElement('div');
  ov.className = 'story';
  ov.innerHTML = `
    <div class="bars">${cards.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>
    <div style="font-weight:700">${t('recap.title')}</div>
    <div class="body">
      <div class="big">${c.big}</div>
      <div class="mid">${esc(c.mid)}</div>
      ${c.body ? `<p style="opacity:.9;margin-top:10px">${c.body}</p>` : ''}
    </div>
    <button class="btn" style="background:#fff;color:var(--forest)">${i < cards.length - 1 ? t('recap.next') + ' →' : t('recap.done') + ' ✓'}</button>`;
  ov.querySelector('button').onclick = (ev) => {
    ev.stopPropagation();
    if (i < cards.length - 1) { state.recapIndex++; ov.remove(); showRecap(); }
    else ov.remove();
  };
  el('residentView').appendChild(ov);
}

/* ───────────────────────── partner dashboard ───────────────────────── */

function renderPartner() {
  const v = el('partnerView');
  // opted-in count for Maya's area reacts to the You-tab toggle
  const stats = sampleAreaStats.map((s) =>
    s.area === MAYA_AREA ? { ...s, users: s.users + (state.optedIn ? 1 : 0) } : { ...s });
  const { shown, suppressed, merged } = aggregateByArea(stats, { minUsers: MIN_USERS });
  const totalUsers = stats.reduce((a, s) => a + s.users, 0);
  const totalDrops = stats.reduce((a, s) => a + s.dropoffs, 0);

  const maxDrops = Math.max(...shown.map((s) => s.dropoffs), 1);
  const bars = shown.map((s) => `
    <div class="bar"><span class="lbl">${esc(s.area)}</span>
      <span class="track"><span class="fill" style="width:${(s.dropoffs / maxDrops * 100).toFixed(0)}%"></span></span>
      <span class="val">${s.dropoffs}</span></div>`).join('');

  const underserved = rankUnderserved();
  const rank = underserved.map((u, i) => `
    <div class="rank"><span class="n">${i + 1}</span>
      <div><b>${u.count} ${t('partner.requests').toLowerCase()}</b><br>
      <span class="muted">${(u.gap / 1000).toFixed(1)} km to nearest site</span></div></div>`).join('')
    || `<p class="muted">No request clusters beyond walking distance.</p>`;

  const maxTrend = Math.max(...sampleTrend);
  const spark = sampleTrend.map((n) => `<i style="height:${(n / maxTrend * 100).toFixed(0)}%" title="${n}"></i>`).join('');

  // Explain suppression. When the suppressed areas together still clear the
  // minimum they are merged into "Other areas"; when even their combined total is
  // below the minimum we hide them entirely (no small cell, even under a label).
  const suppressedNote = (suppressed.length)
    ? `<div class="note"><span class="ic">🔒</span><span>${t('partner.minnote')}
         <br><span class="muted">${suppressed.length} area${suppressed.length > 1 ? 's' : ''} ${merged
           ? `merged into “Other areas” (${merged.users} residents).`
           : `hidden — too few opted-in residents to show, even combined.`}</span></span></div>`
    : '';

  v.innerHTML = `
    <div class="head">
      <h1>${t('partner.title')}</h1>
      <p class="muted">${t('partner.subtitle')}</p>
    </div>
    <div class="kpi">
      <div class="k"><b>${totalDrops.toLocaleString()}</b><span>drop-offs (all areas)</span></div>
      <div class="k"><b>${totalUsers}</b><span>${t('partner.optedin', { n: '' }).trim()}</span></div>
      <div class="k"><b>${shown.length}</b><span>areas shown (≥ ${MIN_USERS})</span></div>
    </div>
    <div class="grid">
      <div class="card">
        <h3>${t('partner.title')} — map</h3>
        <label class="toggle-layer"><input type="checkbox" id="pubLayer" ${state.publicLayer ? 'checked' : ''}/> ${t('partner.publiclayer')}</label>
        <div class="map tall" id="partnerMap"></div>
        <p class="credit">● ${t('partner.sites')} &nbsp; ◆ ${t('partner.requests')}${state.publicLayer ? ` &nbsp; ▲ ${esc(PUBLIC_DATASET.name)}` : ''}</p>
        ${state.publicLayer ? `<p class="credit">${t('partner.source')}: ${esc(PUBLIC_DATASET.source)} — <a href="${esc(PUBLIC_DATASET.url)}" target="_blank" rel="noopener">${esc(PUBLIC_DATASET.url)}</a></p>` : ''}
      </div>
      <div>
        <div class="card"><h3>${t('partner.persite')}</h3>${bars}
          ${merged ? `<div class="bar" style="opacity:.6"><span class="lbl">Other areas</span>
            <span class="track"><span class="fill" style="width:${(merged.dropoffs / maxDrops * 100).toFixed(0)}%;background:var(--muted)"></span></span>
            <span class="val">${merged.dropoffs}</span></div>` : ''}
          ${suppressedNote}
        </div>
        <div class="card"><h3>${t('partner.underserved')}</h3>${rank}</div>
        <div class="card"><h3>${t('partner.trend')}</h3><div class="spark">${spark}</div>
          <p class="muted" style="margin-top:6px">12 weeks · opted-in active residents</p></div>
      </div>
    </div>`;

  wirePartnerMap();
  el('pubLayer').onchange = (e) => { state.publicLayer = e.target.checked; renderPartner(); };
}

/** Cluster resident requests and rank those far from existing sites (reuses geo.ts). */
function rankUnderserved() {
  const reqs = state.requests.filter((r) => r.city === state.city);
  const sites = region().sites ?? [];
  const clusters = [];
  for (const r of reqs) {
    const near = clusters.find((c) => distanceM(c.center, r) < 600);
    if (near) { near.items.push(r); near.center = { lat: (near.center.lat + r.lat) / 2, lng: (near.center.lng + r.lng) / 2 }; }
    else clusters.push({ center: { lat: r.lat, lng: r.lng }, items: [r] });
  }
  return clusters
    .map((c) => ({ count: c.items.length, gap: sites.length ? (nearestSite(c.center, sites)?.distance ?? Infinity) : Infinity, center: c.center }))
    .filter((c) => c.gap > 800)
    .sort((a, b) => b.count - a.count);
}

function wirePartnerMap() {
  const [lat, lng] = cityCenter();
  const m = makeMap('partnerMap', lat, lng, 12);
  if (!m) return;
  (region().sites ?? []).forEach((s) =>
    L.circleMarker([s.lat, s.lng], { radius: 6, color: '#1F5C3F', fillColor: '#2F7A55', fillOpacity: .9 }).addTo(m).bindPopup(esc(s.label)));
  state.requests.filter((r) => r.city === state.city).forEach((r) =>
    L.marker([r.lat, r.lng]).addTo(m).bindPopup(t('partner.requests')));
  if (state.publicLayer && state.city === 'boston') {
    PUBLIC_DATASET.points.forEach((p) =>
      L.circleMarker([p.lat, p.lng], { radius: 5, color: '#C86A12', fillColor: '#E59A52', fillOpacity: .8 }).addTo(m).bindPopup(`<b>${esc(p.name)}</b><br>${esc(p.area)}<br><i>${esc(PUBLIC_DATASET.source)}</i>`));
  }
}

/* ───────────────────────── Leaflet helper (offline-safe) ───────────────────────── */
function makeMap(id, lat, lng, zoom) {
  const node = el(id);
  if (!node) return null;
  if (typeof L === 'undefined') { node.innerHTML = `<div class="map-fallback">${t('map.tiles')}</div>`; return null; }
  const m = L.map(node, { attributionControl: true }).setView([lat, lng], zoom);
  const layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '© OpenStreetMap contributors',
  });
  layer.on('tileerror', () => {
    if (!node.dataset.warned) { node.dataset.warned = '1';
      const hint = document.createElement('div');
      hint.style.cssText = 'position:absolute;bottom:6px;left:6px;background:#fff;padding:4px 8px;border-radius:8px;font-size:11px;color:#5F6E66;z-index:500;';
      hint.textContent = t('map.tiles');
      node.appendChild(hint);
    }
  });
  layer.addTo(m);
  setTimeout(() => m.invalidateSize(), 60);
  return m;
}

/* ───────────────────────── boot ───────────────────────── */
document.querySelectorAll('#viewSwitch button').forEach((b) =>
  b.onclick = () => { state.view = b.dataset.view; render(); });

setLocale(state.locale);
render();

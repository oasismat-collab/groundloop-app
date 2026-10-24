/**
 * verify.mjs — phone-width, console-error-checking verification harness for the
 * web demo, used after each web-demo task. Bundles app.js with esbuild, loads it
 * in jsdom at 414px (phone width), captures any console.error / pageerror, and
 * runs a scenario. Leaflet is absent in jsdom, so the app's map-fallback path is
 * exercised; a missing-Leaflet message is NOT treated as a console error.
 *
 * Usage: node docs/prototype/verify.mjs [scenario]
 *   scenarios: boot | onboard | home | check | log | map | community | recap | you | partner | all (default)
 */
import { JSDOM, VirtualConsole } from '../../node_modules/jsdom/lib/api.js';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(DIR, '..', '..');
const scenario = process.argv[2] || 'all';

/* bundle app.js fresh so we test exactly what ships */
const esbuild = join(ROOT, 'node_modules', '.bin', 'esbuild');
const work = mkdtempSync(join(tmpdir(), 'glverify-'));
const bundlePath = join(work, 'bundle.js');
execFileSync(esbuild, [join(DIR, 'app.js'), '--bundle', '--format=iife', '--outfile=' + bundlePath], { stdio: 'pipe' });
const bundle = readFileSync(bundlePath, 'utf8');

const html = readFileSync(join(DIR, 'index.html'), 'utf8')
  .replace(/<link rel="stylesheet" href="https:\/\/unpkg[^>]*>/, '')
  .replace(/<script src="https:\/\/unpkg[^>]*><\/script>/, '')
  .replace('<script type="module" src="./app.js"></script>', '');

/* capture console errors; ignore the known jsdom "not implemented" noise and
   our own map-fallback hint (Leaflet simply isn't present in jsdom). */
const consoleErrors = [];
const IGNORE = [/Not implemented: HTMLCanvasElement/, /Could not parse CSS stylesheet/, /map tiles need internet/i];
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => { if (!IGNORE.some((r) => r.test(e.message))) consoleErrors.push('jsdomError: ' + e.message); });

const dom = new JSDOM(html, { runScripts: 'outside-only', pretendToBeVisual: true, url: 'http://localhost/', virtualConsole: vc });
const { window } = dom;
window.console.error = (...a) => { const m = a.join(' '); if (!IGNORE.some((r) => r.test(m))) consoleErrors.push('console.error: ' + m); };
window.onerror = (msg) => { consoleErrors.push('window.onerror: ' + msg); };
window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
window.structuredClone = (x) => JSON.parse(JSON.stringify(x));
/* phone width */
Object.defineProperty(window, 'innerWidth', { value: 414, configurable: true });
Object.defineProperty(window, 'innerHeight', { value: 820, configurable: true });

let runtimeError = null;
try { new window.Function(bundle).call(window); }
catch (e) { runtimeError = e; }

const doc = window.document;
const $ = (s) => doc.querySelector(s);
const $$ = (s) => [...doc.querySelectorAll(s)];
const click = (e) => e && e.dispatchEvent(new window.Event('click', { bubbles: true }));
const change = (e, v) => { if (v !== undefined) e.value = v; e.dispatchEvent(new window.Event('change', { bubbles: true })); };
const input = (e, v) => { e.value = v; e.dispatchEvent(new window.Event('input', { bubbles: true })); };
const dropGreet = () => { const o = $('.greet-overlay'); if (o) o.remove(); };

let n = 0; const checks = [];
const ok = (label, cond) => { if (!cond) throw new Error('CHECK FAILED: ' + label); n++; checks.push(label); };

function onboard(city = 'boston') { change($('#cityPick'), city); click($('#startBtn')); dropGreet(); }

function run() {
  if (runtimeError) throw runtimeError;
  ok('phone frame present', !!$('#residentView.phone'));
  ok('top-bar view switch present', $$('#viewSwitch button').length === 2);
  ok('no password/sign-in field (sample mode, no login)', !/password|sign ?in with/i.test(doc.body.innerHTML));

  if (['boot'].includes(scenario)) return;

  if (['onboard', 'home', 'check', 'log', 'map', 'community', 'recap', 'you', 'all'].includes(scenario)) {
    ok('onboarding start button', !!$('#startBtn'));
    onboard();
    ok('6 tabs after onboarding', $$('#tabbar button').length === 6);
  }
  if (['home', 'all'].includes(scenario)) {
    ok('home 16-week strip', $$('.weekstrip .wk').length === 16);
    ok('home has a Peel mascot', $$('#screen .mascot').length >= 1);
    ok('home shows no weight/kg', !/\bkg\b|weight/i.test($('#screen').textContent));
    const b = $$('#screen .mascot')[0]?.getAttribute('aria-label');
    for (let i = 0; i < 12; i++) click($('#skipDay'));
    const a = $$('#screen .mascot')[0]?.getAttribute('aria-label');
    ok('Peel rots as days skip', b !== a);
  }
  if (['check', 'all'].includes(scenario)) {
    click($('[data-tab="check"]')); input($('#q'), 'dog'); click($('.itemrow'));
    ok('check renders a verdict pill', !!$('#screen .pill'));
  }
  if (['log', 'all'].includes(scenario)) {
    click($('[data-tab="log"]')); click($('#submitLog'));
    ok('log result shows seeds', /seeds|semillas|sementes|grenn|hạt|种子/i.test($('#screen').textContent) || /\+\d+/.test($('#screen').textContent));
    ok('log result shows a badge', $$('#screen .badge').length >= 1);
    if ($('#logDone')) click($('#logDone'));
  }
  if (['map', 'all'].includes(scenario)) {
    click($('[data-tab="map"]'));
    ok('map container present', !!$('#resMap'));
    ok('suggest-a-bin button', !!$('#suggestBtn'));
  }
  if (['community', 'all'].includes(scenario)) {
    click($('[data-tab="community"]'));
    const t = $$('.cheer').find((x) => !x.disabled);
    const c0 = Number((t.textContent.match(/(\d+)/) || [])[1]); click(t);
    const c1 = Number(($$('.cheer').find((x) => x.classList.contains('on'))?.textContent.match(/(\d+)/) || [])[1] || c0);
    ok('cheer increments', c1 === c0 + 1);
  }
  if (['recap', 'you', 'all'].includes(scenario)) {
    click($('[data-tab="you"]'));
    ok('opt-in default OFF', !$('#optin').checked);
    ok('language picker present', !!$('#langSel'));
    change($('#langSel'), 'es');
    ok('i18n switched to Spanish', $$('#tabbar button').some((x) => /Comunidad|Inicio/.test(x.textContent)));
    change($('#langSel'), 'en');
    if ($('#openRecap')) { click($('#openRecap')); ok('recap story opens', !!$('.story')); const s = $('.story'); if (s) s.querySelector('button') && s.remove(); }
  }
  if (['partner', 'all'].includes(scenario)) {
    if (!$('#tabbar button')) onboard();
    click($('#viewSwitch button[data-view="partner"]'));
    ok('partner dashboard title', !!$('#partnerView h1'));
    ok('10-user privacy note shown', $$('#partnerView .note').length >= 1);
    ok('per-site bars rendered', $$('#partnerView .bar').length >= 2);
    ok('weekly trend rendered', $$('#partnerView .spark i').length >= 6);
    ok('sub-10 area (Hyde Park) suppressed', !$$('#partnerView .bar .lbl').some((l) => /Hyde Park/.test(l.textContent)));
    const pub = $('#pubLayer'); pub.checked = true; change(pub);
    ok('public dataset credited', /City of Boston|boston\.gov/i.test($('#partnerView').textContent));
  }
}

let failure = null;
try { run(); } catch (e) { failure = e; }

rmSync(work, { recursive: true, force: true });

if (consoleErrors.length || failure) {
  console.error(`✗ verify[${scenario}] FAILED after ${n} checks`);
  if (failure) console.error('  ' + failure.message);
  if (consoleErrors.length) { console.error('  console errors:'); consoleErrors.forEach((e) => console.error('   - ' + e)); }
  process.exit(1);
}
console.log(`✓ verify[${scenario}] OK — ${n} checks, 0 console errors, phone width 414px`);

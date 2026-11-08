import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
const root = new URL('../', import.meta.url);
const context = vm.createContext({ Date });
for (const file of ['program.js', 'core.js']) vm.runInContext(readFileSync(new URL(file, root), 'utf8'), context);
const run = code => vm.runInContext(code, context);

test('seven separate days contain only three or four tasks', () => {
  assert.equal(run('ORDER.length'), 7);
  for (const key of run('ORDER')) {
    const count = run(`PROGRAM.${key}.blocks.flatMap(block => block.items).length`);
    assert.ok(count >= 3 && count <= 4, `${key}: ${count} tasks`);
  }
  assert.notEqual(run('PROGRAM.sat.title'), run('PROGRAM.sun.title'));
});
test('matching sessions share exercise IDs and keep loaded work at two sets', () => {
  for (const [a, b] of [['mon', 'thu'], ['tue', 'fri']]) {
    assert.equal(run(`JSON.stringify(PROGRAM.${a}.blocks)`), run(`JSON.stringify(PROGRAM.${b}.blocks)`));
  }
  assert.equal(run('Object.values(EXERCISES).filter(item => item.load).length'), 5);
  assert.ok(run('Object.values(EXERCISES).filter(item => item.load).every(item => item.sets === 2)'));
});
test('session dates keep Sunday separate and reset when Monday arrives', () => {
  assert.equal(run("sessionDate('sun', new Date(2026, 10, 8, 23, 59))"), '2026-11-08');
  assert.equal(run("sessionDate('mon', new Date(2026, 10, 8, 23, 59))"), '2026-11-02');
  assert.equal(run("sessionDate('mon', new Date(2026, 10, 9, 0, 1))"), '2026-11-09');
  assert.equal(run('dayKey(new Date(2026, 10, 8))'), 'sun');
});
test('week calculations handle year boundaries and daylight-saving weekends', () => {
  assert.equal(run("sessionDate('mon', new Date(2027, 0, 1))"), '2026-12-28');
  assert.equal(run("sessionDate('sun', new Date(2027, 0, 1))"), '2027-01-03');
  assert.equal(run("sessionDate('sun', new Date(2026, 10, 1))"), '2026-11-01');
  assert.equal(run("sessionDate('mon', new Date(2026, 10, 1))"), '2026-10-26');
});
test('backup round-trip preserves progress and weight history; invalid values are dropped', () => {
  const backup = { version: 1, days: { '2026-11-02': { squat: [true, false] } }, weights: { squat: 16 }, loads: { '2026-11-02': { squat: 16 } } };
  context.backup = backup;
  assert.deepEqual(JSON.parse(run('JSON.stringify(cleanStore(backup))')), backup);
  context.unsafe = JSON.parse('{"version":1,"days":{"__proto__":{"polluted":true}},"weights":{"squat":"<script>","hinge":-2,"unknown":20},"loads":{}}');
  assert.equal(run('JSON.stringify(cleanStore(unsafe))'), '{"version":1,"days":{},"weights":{},"loads":{}}');
  assert.throws(() => run('cleanStore({})'));
});
test('optional recovery walk is excluded from required completion', () => {
  assert.equal(run('PROGRAM.sun.blocks.flatMap(b => b.items).filter(i => !i.optional).reduce((n, i) => n + i.sets, 0)'), 4);
});
test('offline cache includes every application script and all declared assets exist', () => {
  const serviceWorker = readFileSync(new URL('sw.js', root), 'utf8');
  for (const file of ['index.html', 'program.js', 'core.js', 'app.js', 'styles.css', 'manifest.webmanifest', 'app-icon.png']) {
    assert.ok(serviceWorker.includes(`'./${file}'`), `${file} must be cached`);
    assert.ok(existsSync(new URL(file, root)));
  }
});

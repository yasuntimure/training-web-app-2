'use strict';

const ORDER = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
const KEY = 'training-web-app-2-state-v1';
const $ = id => document.getElementById(id);
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const localDate = date => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const dayKey = date => ORDER[(date.getDay() + 6) % 7];
function sessionDate(key, now = new Date()) {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
  date.setDate(date.getDate() - (date.getDay() + 6) % 7 + ORDER.indexOf(key));
  return localDate(date);
}
function freshStore() { return { version: 1, days: {}, weights: {}, loads: {} }; }
function cleanStore(value) {
  if (!value || value.version !== 1 || !value.days || !value.weights || !value.loads) throw new Error('Invalid backup');
  const result = freshStore();
  const validWeight = weight => typeof weight === 'number' && Number.isFinite(weight) && weight >= 0 && weight <= 1000;
  for (const [id, weight] of Object.entries(value.weights)) {
    if (Object.hasOwn(EXERCISES, id) && EXERCISES[id].load && validWeight(weight)) result.weights[id] = weight;
  }
  for (const [date, entries] of Object.entries(value.days)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !entries || typeof entries !== 'object') continue;
    result.days[date] = {};
    for (const [id, ticks] of Object.entries(entries)) {
      if (!Object.hasOwn(EXERCISES, id) || !Array.isArray(ticks)) continue;
      result.days[date][id] = Array.from({ length: EXERCISES[id].sets }, (_, i) => ticks[i] === true);
    }
  }
  for (const [date, entries] of Object.entries(value.loads)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !entries || typeof entries !== 'object') continue;
    result.loads[date] = {};
    for (const [id, weight] of Object.entries(entries)) {
      if (Object.hasOwn(EXERCISES, id) && EXERCISES[id].load && validWeight(weight)) result.loads[date][id] = weight;
    }
  }
  return result;
}


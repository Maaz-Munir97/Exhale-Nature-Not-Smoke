// Single source of truth, persisted to localStorage (data never leaves the device).

const STORAGE_KEY = 'exhale.state.v1';
export const SCHEMA_VERSION = 1;

export function createDefaultState() {
  return {
    version: SCHEMA_VERSION,
    onboarded: false,
    profile: {
      name: '',
      cigsPerDay: 15,
      packSize: 20,
      packPrice: 0,
      currency: 'USD',
      mode: 'quick',
      startDate: null,
    },
    reasons: [],
    // { id, type: 'cigarette' | 'craving', at, trigger, intensity, outcome?, note? }
    logs: [],
    // { [missionId]: number[] } — indices of completed steps
    missions: {},
    // { 'YYYY-MM-DD': { mood } }
    checkins: {},
    toolkit: { ifThen: [], letter: '', supporters: [] },
    // Daily push reminders (local hours, 0–23)
    reminders: { enabled: false, morning: 9, evening: 21 },
    createdAt: new Date().toISOString(),
  };
}

/** Merge any stored/imported data onto the defaults so missing fields never crash the UI. */
export function normalize(data) {
  const base = createDefaultState();
  if (!data || typeof data !== 'object') return base;
  const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
  const arr = (v) => (Array.isArray(v) ? v : []);
  return {
    ...base,
    ...data,
    profile: { ...base.profile, ...obj(data.profile) },
    toolkit: {
      ...base.toolkit,
      ...obj(data.toolkit),
      ifThen: arr(data.toolkit?.ifThen),
      supporters: arr(data.toolkit?.supporters),
    },
    reminders: { ...base.reminders, ...obj(data.reminders) },
    reasons: arr(data.reasons),
    logs: arr(data.logs),
    missions: obj(data.missions),
    checkins: obj(data.checkins),
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalize(JSON.parse(raw)) : createDefaultState();
  } catch {
    return createDefaultState();
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Exhale: could not save state', err);
  }
}

let state = load();
const listeners = new Set();

const notify = () => listeners.forEach((fn) => fn(state));

export const getState = () => state;

/** Apply a change: mutator receives a deep copy it may edit freely. */
export function update(mutator) {
  const draft = structuredClone(state);
  mutator(draft);
  state = draft;
  persist();
  notify();
}

export function replaceState(next) {
  state = normalize(next);
  persist();
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Keep multiple open tabs in sync.
window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY) return;
  state = load();
  notify();
});

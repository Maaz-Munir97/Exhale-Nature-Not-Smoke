// Every state change in the app goes through one of these functions.
import { createDefaultState, getState, replaceState, update } from '../core/store.js';
import { uid } from '../core/dom.js';
import { toDateKey } from '../core/time.js';

export function completeOnboarding({ profile, reasons }) {
  update((s) => {
    s.profile = { ...s.profile, ...profile };
    s.reasons = reasons;
    s.onboarded = true;
  });
}

export function updateProfile(patch) {
  update((s) => {
    s.profile = { ...s.profile, ...patch };
  });
}

export function logCigarette({ trigger = 'other', intensity = null, note = '' } = {}) {
  update((s) => {
    s.logs.push({ id: uid(), type: 'cigarette', at: new Date().toISOString(), trigger, intensity, note });
  });
}

export function logCraving({ trigger = 'other', intensity = null }) {
  update((s) => {
    s.logs.push({ id: uid(), type: 'craving', outcome: 'beaten', at: new Date().toISOString(), trigger, intensity });
  });
}

export function deleteLog(id) {
  update((s) => {
    s.logs = s.logs.filter((l) => l.id !== id);
  });
}

export function setMissionStep(missionId, stepIndex, done) {
  update((s) => {
    const current = new Set(s.missions[missionId] || []);
    if (done) current.add(stepIndex);
    else current.delete(stepIndex);
    s.missions[missionId] = [...current].sort((a, b) => a - b);
  });
}

export function setMood(mood, date = new Date()) {
  update((s) => {
    s.checkins[toDateKey(date)] = { mood };
  });
}

export function addReason(text) {
  update((s) => {
    s.reasons.push(text);
  });
}

export function removeReason(index) {
  update((s) => {
    s.reasons.splice(index, 1);
  });
}

export function addIfThen(trigger, plan) {
  update((s) => {
    s.toolkit.ifThen.push({ id: uid(), trigger, plan });
  });
}

export function removeIfThen(id) {
  update((s) => {
    s.toolkit.ifThen = s.toolkit.ifThen.filter((p) => p.id !== id);
  });
}

export function saveLetter(text) {
  update((s) => {
    s.toolkit.letter = text;
  });
}

export function addSupporter(name, phone) {
  update((s) => {
    s.toolkit.supporters.push({ id: uid(), name, phone });
  });
}

export function removeSupporter(id) {
  update((s) => {
    s.toolkit.supporters = s.toolkit.supporters.filter((p) => p.id !== id);
  });
}

export function exportData() {
  const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `exhale-backup-${toDateKey()}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Throws if the file is not a valid Exhale backup. */
export function importData(json) {
  const data = JSON.parse(json);
  if (!data || typeof data !== 'object' || !data.profile) throw new Error('Not an Exhale backup file');
  replaceState(data);
}

export function resetAll() {
  replaceState(createDefaultState());
}

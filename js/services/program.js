// The 30-day program: which day it is, which phase, which mission.
import { FREE_MISSIONS, GRADUATION_MISSION, PREP_MISSIONS, QUIT_DAY_MISSION } from '../data/missions.js';
import { addDays, calendarDaysBetween, fromDateKey, toDateKey } from '../core/time.js';

export const PROGRAM_LENGTH = 30;

export const MODES = {
  quick: {
    id: 'quick',
    label: 'Quick Stop',
    prepDays: 3,
    summary: '3 days of preparation, then stop completely on day 4.',
  },
  step: {
    id: 'step',
    label: 'Step Down',
    prepDays: 7,
    summary: '7 days of cutting down to zero, then stop on day 8.',
  },
};

export const PHASE_LABELS = {
  upcoming: 'Starting soon',
  prepare: 'Prepare',
  quit: 'Quit day',
  free: 'Smoke-free',
  graduated: 'Graduated',
};

export const getMode = (profile) => MODES[profile.mode] || MODES.quick;
export const quitDayNumber = (profile) => getMode(profile).prepDays + 1;
export const startDate = (profile) => fromDateKey(profile.startDate || toDateKey());
export const dateForDay = (profile, day) => addDays(startDate(profile), day - 1);
export const quitDate = (profile) => dateForDay(profile, quitDayNumber(profile));

/** 1-based program day for `now` (may be < 1 before start or > 30 after). */
export function programDay(profile, now = new Date()) {
  return calendarDaysBetween(startDate(profile), now) + 1;
}

export function phaseOf(profile, day) {
  if (day < 1) return 'upcoming';
  if (day > PROGRAM_LENGTH) return 'graduated';
  const quitDay = quitDayNumber(profile);
  if (day < quitDay) return 'prepare';
  if (day === quitDay) return 'quit';
  return 'free';
}

/** The full 30-day plan for this profile. */
export function buildPlan(profile) {
  const quitDay = quitDayNumber(profile);
  const prep = profile.mode === 'step' ? PREP_MISSIONS : PREP_MISSIONS.filter((m) => m.core);
  const free = [...FREE_MISSIONS.slice(0, PROGRAM_LENGTH - quitDay - 1), GRADUATION_MISSION];
  return [...prep, QUIT_DAY_MISSION, ...free].map((mission, i) => ({
    day: i + 1,
    mission,
    phase: phaseOf(profile, i + 1),
    date: dateForDay(profile, i + 1),
  }));
}

export function missionProgress(state, mission) {
  const done = state.missions[mission.id] || [];
  const count = mission.steps.filter((_, i) => done.includes(i)).length;
  return { done: count, total: mission.steps.length, complete: count === mission.steps.length };
}

// Step Down mode: a daily cigarette allowance that shrinks to zero by quit day.
import { getState } from '../core/store.js';
import { toDateKey } from '../core/time.js';
import { quitDayNumber } from './program.js';

const WAKING_HOURS = 16;

/** Allowed cigarettes on a prep day, or null when there is no limit. */
export function dailyAllowance(profile, day) {
  if (profile.mode !== 'step') return null;
  const quitDay = quitDayNumber(profile);
  if (day < 1 || day >= quitDay) return null;
  return Math.max(1, Math.ceil((profile.cigsPerDay * (quitDay - day)) / quitDay));
}

/** Suggested minutes between cigarettes to spread the allowance across the day. */
export function suggestedGapMinutes(allowance) {
  return allowance ? Math.round((WAKING_HOURS * 60) / allowance) : null;
}

export function cigarettesOn(dateKey, state = getState()) {
  return state.logs.filter((l) => l.type === 'cigarette' && toDateKey(l.at) === dateKey);
}

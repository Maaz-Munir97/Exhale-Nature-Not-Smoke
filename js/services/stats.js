// Derived numbers: smoke-free time, money, cigarettes avoided, health, insights.
import { clamp } from '../core/dom.js';
import { DAY } from '../core/time.js';
import { MINUTES_PER_CIGARETTE } from '../data/content.js';
import { RECOVERY_MILESTONES } from '../data/recovery.js';
import { buildPlan, missionProgress, phaseOf, programDay, quitDate } from './program.js';

export function computeStats(state, now = new Date()) {
  const { profile, logs } = state;
  const day = programDay(profile, now);
  const phase = phaseOf(profile, day);
  const quitAt = quitDate(profile);
  const isQuit = now >= quitAt;

  const cigarettes = logs.filter((l) => l.type === 'cigarette');
  const slips = cigarettes.filter((l) => new Date(l.at) >= quitAt);
  const lastSlip = slips.reduce((max, l) => Math.max(max, +new Date(l.at)), 0);

  // Smoke-free clock: from quit day midnight, or from the latest slip after that.
  const smokeFreeSince = isQuit ? new Date(Math.max(+quitAt, lastSlip)) : null;
  const smokeFreeMs = smokeFreeSince ? now - smokeFreeSince : 0;

  const daysSinceQuit = isQuit ? (now - quitAt) / DAY : 0;
  const avoided = Math.max(0, daysSinceQuit * profile.cigsPerDay - slips.length);
  const pricePerCig = profile.packSize > 0 ? profile.packPrice / profile.packSize : 0;

  const plan = buildPlan(profile);
  const missionsDone = plan.filter((p) => missionProgress(state, p.mission).complete).length;
  const cravingsBeaten = logs.filter((l) => l.type === 'craving' && l.outcome === 'beaten').length;

  return {
    day,
    phase,
    quitAt,
    isQuit,
    smokeFreeSince,
    smokeFreeMs,
    streakDays: Math.floor(smokeFreeMs / DAY),
    avoided,
    moneySaved: avoided * pricePerCig,
    lifeRegainedMs: avoided * MINUTES_PER_CIGARETTE * 60 * 1000,
    cravingsBeaten,
    slips: slips.length,
    missionsDone,
    plan,
  };
}

/** Each recovery milestone with how far along the user is (0–1). */
export function healthProgress(smokeFreeMs) {
  return RECOVERY_MILESTONES.map((m) => ({
    ...m,
    progress: clamp(smokeFreeMs / m.after),
    remainingMs: Math.max(0, m.after - smokeFreeMs),
  }));
}

/** Count of urges (cravings + cigarettes) per hour of the day. */
export function urgesByHour(logs) {
  const hours = Array(24).fill(0);
  logs.forEach((l) => {
    hours[new Date(l.at).getHours()] += 1;
  });
  return hours;
}

/** [{ id, count }] sorted by most frequent. */
export function triggerCounts(logs) {
  const counts = {};
  logs.forEach((l) => {
    if (l.trigger) counts[l.trigger] = (counts[l.trigger] || 0) + 1;
  });
  return Object.entries(counts)
    .map(([id, count]) => ({ id, count }))
    .sort((a, b) => b.count - a.count);
}

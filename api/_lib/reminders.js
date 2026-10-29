// Decides when a device is due a reminder, and what it should say.
// Reuses the app's own program logic so notifications always match the day's mission.
import { PROGRAM_LENGTH, buildPlan, quitDayNumber } from '../../js/services/program.js';

// A reminder may still go out up to this many hours after its chosen time (cron runs can be late).
const SEND_WINDOW_HOURS = 3;

/** The device's local date ("YYYY-MM-DD") and hour (0–23) right now. */
export function localParts(date, timeZone) {
  let parts;
  try {
    parts = new Intl.DateTimeFormat('en-CA', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(date);
  } catch {
    return localParts(date, 'UTC');
  }
  const p = Object.fromEntries(parts.map((x) => [x.type, x.value]));
  return { dateKey: `${p.year}-${p.month}-${p.day}`, hour: Number(p.hour) };
}

const keyToUTC = (key) => {
  const [y, m, d] = String(key).split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};

export const dayNumber = (startDate, dateKey) => Math.round((keyToUTC(dateKey) - keyToUTC(startDate)) / 86400000) + 1;

/** Which reminder (if any) is due for this row now: { slot: 'morning' | 'evening', dateKey } or null. */
export function dueSlot(row, now = new Date()) {
  const { dateKey, hour } = localParts(now, row.timezone);
  const due = (slot, at) => hour >= at && hour < at + SEND_WINDOW_HOURS && row[`last_${slot}`] !== dateKey;
  if (due('evening', row.evening_hour)) return { slot: 'evening', dateKey };
  if (due('morning', row.morning_hour)) return { slot: 'morning', dateKey };
  return null;
}

const firstSentence = (text) => text.split(/(?<=\.)\s/)[0];

export function buildMessage(row, slot, dateKey) {
  const name = row.name ? `, ${row.name}` : '';
  if (!row.start_date) return { title: 'Exhale', body: 'Open Exhale to check in on your quit plan.', url: '#/today' };

  const profile = { mode: row.mode, startDate: row.start_date };
  const day = dayNumber(row.start_date, dateKey);
  const quitDay = quitDayNumber(profile);

  if (day < 1) {
    return { title: `Your 30 days start soon${name}`, body: 'Have a look at the plan so you know what is coming.', url: '#/plan' };
  }
  if (day > PROGRAM_LENGTH) {
    return slot === 'morning'
      ? { title: `Still smoke-free${name} 💙`, body: 'Every day adds up. SOS is one tap away if a craving surprises you.', url: '#/progress' }
      : { title: 'Evening check-in', body: 'How was today? Your lung tree is still growing.', url: '#/progress' };
  }

  const { mission } = buildPlan(profile)[day - 1];
  if (slot === 'morning') {
    if (day === quitDay) {
      return { title: `Quit day${name} 💙`, body: 'Not one puff today. Open SOS for every craving. It only takes 3 minutes.', url: '#/today' };
    }
    return { title: `Day ${day}: ${mission.title}`, body: firstSentence(mission.why), url: '#/today' };
  }

  if (day === quitDay - 1) {
    return { title: 'Quit day is tomorrow', body: 'Tonight, get rid of every cigarette, lighter and ashtray. You are ready.', url: '#/today' };
  }
  if (day < quitDay) {
    return { title: 'Evening check-in', body: "Log today's cigarettes and tick off today's mission.", url: '#/today' };
  }
  return { title: 'Evening check-in', body: 'How did today go? Tick off your mission and log your mood.', url: '#/today' };
}

// Date helpers. All "day" math uses the user's local calendar days.

export const SECOND = 1000;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

const pad = (n) => String(n).padStart(2, '0');

export function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Date -> "YYYY-MM-DD" in local time. */
export function toDateKey(date = new Date()) {
  const d = new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "YYYY-MM-DD" -> local Date at 00:00. */
export function fromDateKey(key) {
  const [y, m, d] = String(key).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Whole calendar days from a to b (DST-safe). */
export function calendarDaysBetween(a, b) {
  return Math.round((startOfDay(b) - startOfDay(a)) / DAY);
}

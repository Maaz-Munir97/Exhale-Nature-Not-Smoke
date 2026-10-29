// Display formatting helpers.
import { DAY, HOUR, MINUTE } from './time.js';

export function money(amount, currency = 'USD') {
  const value = Number(amount) || 0;
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: value >= 100 ? 0 : 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export function number(value, digits = 0) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: digits }).format(value || 0);
}

export function splitDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

/** Compact duration such as "3d 4h", "5h 12m" or "8m". */
export function durationShort(ms) {
  const { days, hours, minutes } = splitDuration(ms);
  if (days) return `${days}d ${hours}h`;
  if (hours) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

/** Human duration for larger amounts, e.g. "2 days 5 hrs". */
export function durationWords(ms) {
  if (ms >= DAY) {
    const days = Math.floor(ms / DAY);
    const hours = Math.floor((ms % DAY) / HOUR);
    return `${plural(days, 'day')}${hours ? ` ${hours} h` : ''}`;
  }
  if (ms >= HOUR) {
    const hours = Math.floor(ms / HOUR);
    const minutes = Math.floor((ms % HOUR) / MINUTE);
    return `${hours} h${minutes ? ` ${minutes} m` : ''}`;
  }
  return `${Math.floor(ms / MINUTE)} min`;
}

/** Seconds -> "m:ss". */
export function clock(totalSeconds) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function plural(count, word, pluralWord = `${word}s`) {
  return `${count} ${count === 1 ? word : pluralWord}`;
}

export function timeOfDay(date) {
  return new Date(date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function shortDate(date) {
  return new Date(date).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
}

export function relativeTime(date, now = new Date()) {
  const diff = now - new Date(date);
  if (diff < MINUTE) return 'just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} min ago`;
  if (diff < 12 * HOUR) return `${Math.floor(diff / HOUR)} h ago`;
  return `${shortDate(date)}, ${timeOfDay(date)}`;
}

export function greeting(now = new Date()) {
  const h = now.getHours();
  if (h < 5) return 'Still up';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

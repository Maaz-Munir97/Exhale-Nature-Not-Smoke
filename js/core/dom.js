// Small DOM utilities shared by views and components.

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape any user-provided text before putting it into HTML. */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/** Event delegation: handler(event, matchedElement). */
export function delegate(root, type, selector, handler) {
  const listener = (event) => {
    const target = event.target.closest(selector);
    if (target && root.contains(target)) handler(event, target);
  };
  root.addEventListener(type, listener);
  return () => root.removeEventListener(type, listener);
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function vibrate(pattern) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    /* not supported (e.g. iOS) */
  }
}

export const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

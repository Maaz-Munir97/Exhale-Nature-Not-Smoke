// Small, auto-dismissing status messages.

let container = null;

export function toast(message, { duration = 2600 } = {}) {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-stack';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.append(container);
  }
  const item = document.createElement('div');
  item.className = 'toast';
  item.textContent = message;
  container.append(item);
  requestAnimationFrame(() => item.classList.add('is-visible'));
  setTimeout(() => {
    item.classList.remove('is-visible');
    setTimeout(() => item.remove(), 300);
  }, duration);
}

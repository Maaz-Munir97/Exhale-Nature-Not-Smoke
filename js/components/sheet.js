// Bottom sheet dialog. onMount(body, close) wires up the content.
import { esc } from '../core/dom.js';
import { icons } from './icons.js';

export function openSheet({ title, content, onMount }) {
  const root = document.getElementById('overlay-root');
  const backdrop = document.createElement('div');
  backdrop.className = 'sheet-backdrop';
  backdrop.innerHTML = `
    <div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      <div class="sheet-handle" aria-hidden="true"></div>
      <header class="sheet-head">
        <h2>${esc(title)}</h2>
        <button type="button" class="icon-btn" data-close aria-label="Close">${icons.close}</button>
      </header>
      <div class="sheet-body">${content}</div>
    </div>`;

  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };

  function close() {
    document.removeEventListener('keydown', onKey);
    backdrop.classList.remove('is-open');
    setTimeout(() => backdrop.remove(), 250);
  }

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', onKey);

  root.append(backdrop);
  requestAnimationFrame(() => backdrop.classList.add('is-open'));
  onMount?.(backdrop.querySelector('.sheet-body'), close);
  return close;
}

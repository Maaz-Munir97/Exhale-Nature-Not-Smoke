// Circular progress ring with arbitrary HTML in the middle.
import { clamp } from '../core/dom.js';

export function ring({ value = 0, size = 240, stroke = 12, tone = 'accent', content = '' }) {
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - clamp(value));
  const c = size / 2;
  return `
    <div class="ring ring--${tone}" style="--ring-size:${size}px">
      <svg viewBox="0 0 ${size} ${size}" aria-hidden="true">
        <circle class="ring-track" cx="${c}" cy="${c}" r="${r}" stroke-width="${stroke}" />
        <circle class="ring-value" cx="${c}" cy="${c}" r="${r}" stroke-width="${stroke}"
          stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
          transform="rotate(-90 ${c} ${c})" />
      </svg>
      <div class="ring-content">${content}</div>
    </div>`;
}

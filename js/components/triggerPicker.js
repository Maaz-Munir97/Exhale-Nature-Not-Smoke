// A wrap of radio "chips" for choosing a trigger. Read it with FormData(form).get(name).
import { TRIGGERS } from '../data/content.js';

export function triggerPicker(name = 'trigger', selected = '') {
  return `
    <div class="chip-group" role="radiogroup" aria-label="Trigger">
      ${TRIGGERS.map(
        (t) => `
        <label class="chip">
          <input type="radio" name="${name}" value="${t.id}" ${t.id === selected ? 'checked' : ''} />
          <span>${t.icon} ${t.label}</span>
        </label>`,
      ).join('')}
    </div>`;
}

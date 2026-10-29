// A day's mission: why it matters + checkable steps. Used on Today and in the Plan sheet.
import { esc } from '../core/dom.js';
import { setMissionStep } from '../services/actions.js';
import { missionProgress } from '../services/program.js';
import { icons } from './icons.js';

export function missionCard(state, { day, mission }, { interactive = true } = {}) {
  const done = state.missions[mission.id] || [];
  const progress = missionProgress(state, mission);
  return `
    <article class="card mission ${progress.complete ? 'is-complete' : ''}" data-mission="${mission.id}">
      <header class="mission-head">
        <span class="eyebrow">Day ${day} · ${esc(mission.tag)}</span>
        <span class="mission-count" data-mission-count>${progress.done}/${progress.total}</span>
      </header>
      <h3 class="mission-title">${esc(mission.title)}</h3>
      <p class="mission-why">${esc(mission.why)}</p>
      <ul class="steps">
        ${mission.steps
          .map(
            (step, i) => `
          <li>
            <label class="step">
              <input type="checkbox" data-step="${i}" ${done.includes(i) ? 'checked' : ''} ${interactive ? '' : 'disabled'} />
              <span class="step-box" aria-hidden="true">${icons.check}</span>
              <span class="step-text">${esc(step)}</span>
            </label>
          </li>`,
          )
          .join('')}
      </ul>
      ${mission.tool ? `<a class="btn btn--ghost btn--sm" href="${mission.tool.href}">${esc(mission.tool.label)} ${icons.chevron}</a>` : ''}
      ${interactive ? '' : '<p class="hint">This mission unlocks on its day.</p>'}
    </article>`;
}

/** Wire checkbox changes inside `root` to the store. */
export function bindMissionCards(root) {
  root.addEventListener('change', (e) => {
    const input = e.target.closest('[data-step]');
    if (!input) return;
    const card = input.closest('[data-mission]');
    setMissionStep(card.dataset.mission, Number(input.dataset.step), input.checked);
    // Keep the counter fresh when the card lives outside the re-rendered view (e.g. in a sheet).
    const checked = card.querySelectorAll('[data-step]:checked').length;
    const total = card.querySelectorAll('[data-step]').length;
    card.querySelector('[data-mission-count]').textContent = `${checked}/${total}`;
    card.classList.toggle('is-complete', checked === total);
  });
}

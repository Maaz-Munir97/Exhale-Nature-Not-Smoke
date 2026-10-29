// The 30-day map. Tap any day to open its mission.
import { esc } from '../core/dom.js';
import { shortDate } from '../core/format.js';
import { PHASE_LABELS, getMode, missionProgress, programDay } from '../services/program.js';
import { computeStats } from '../services/stats.js';
import { icons } from '../components/icons.js';
import { bindMissionCards, missionCard } from '../components/missionCard.js';
import { openSheet } from '../components/sheet.js';

function dayStatus(state, entry, today) {
  const p = missionProgress(state, entry.mission);
  if (p.complete) return 'done';
  if (entry.day === today) return 'today';
  if (entry.day < today) return p.done ? 'partial' : 'missed';
  return 'future';
}

export default {
  title: 'Plan',
  render(host, { state }) {
    const today = programDay(state.profile);
    const { plan, missionsDone } = computeStats(state);
    const mode = getMode(state.profile);

    let lastPhase = null;
    const rows = plan
      .map((entry) => {
        const { phase } = entry;
        const header = phase !== lastPhase ? `<li class="phase-label phase-label--${phase}">${PHASE_LABELS[phase]}</li>` : '';
        lastPhase = phase;
        const status = dayStatus(state, entry, today);
        const p = missionProgress(state, entry.mission);
        return `${header}
          <li>
            <button class="day-row day-row--${status} day-row--${phase}" data-day="${entry.day}">
              <span class="day-dot">${status === 'done' ? icons.check : entry.day}</span>
              <span class="day-body">
                <span class="day-title">${esc(entry.mission.title)}</span>
                <span class="day-meta">${shortDate(entry.date)} · ${esc(entry.mission.tag)}${p.done && !p.complete ? ` · ${p.done}/${p.total}` : ''}</span>
              </span>
              ${status === 'today' ? '<span class="badge">Today</span>' : icons.chevron}
            </button>
          </li>`;
      })
      .join('');

    host.innerHTML = `
      <header class="page-head">
        <div>
          <p class="eyebrow">${esc(mode.label)} path</p>
          <h1 class="h1">Your 30 days</h1>
        </div>
      </header>
      <section class="card plan-summary">
        <div class="plan-bar"><span style="width:${(missionsDone / plan.length) * 100}%"></span></div>
        <p><strong>${missionsDone} of ${plan.length}</strong> missions complete. ${esc(mode.summary)}</p>
      </section>
      <ol class="day-list">${rows}</ol>`;

    host.addEventListener('click', (e) => {
      const row = e.target.closest('[data-day]');
      if (!row) return;
      const entry = plan[Number(row.dataset.day) - 1];
      openSheet({
        title: `Day ${entry.day}`,
        content: missionCard(state, entry, { interactive: entry.day <= today }),
        onMount: (body, close) => {
          bindMissionCards(body);
          body.addEventListener('click', (ev) => {
            if (ev.target.closest('a[href^="#/"]')) close();
          });
        },
      });
    });
  },
};

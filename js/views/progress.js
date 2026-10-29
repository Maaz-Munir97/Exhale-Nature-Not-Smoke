// Progress: the lung tree, live stats, health recovery and personal insights.
import { clamp, esc } from '../core/dom.js';
import { durationShort, durationWords, money, number, relativeTime } from '../core/format.js';
import { DAY } from '../core/time.js';
import { triggerById } from '../data/content.js';
import { deleteLog } from '../services/actions.js';
import { PROGRAM_LENGTH } from '../services/program.js';
import { computeStats, healthProgress, triggerCounts, urgesByHour } from '../services/stats.js';
import { icons } from '../components/icons.js';
import { lungTree } from '../components/lungTree.js';

const HEALTH_FULL_MS = 14 * DAY;

function statTile(icon, value, label, attrs = '') {
  return `<div class="stat"><span class="stat-icon">${icon}</span><span class="stat-value" ${attrs}>${value}</span><span class="stat-label">${label}</span></div>`;
}

function hourChart(logs) {
  const hours = urgesByHour(logs);
  const max = Math.max(...hours, 1);
  const peak = hours.indexOf(Math.max(...hours));
  return `
    <div class="hour-chart" role="img" aria-label="Urges by hour. Peak around ${peak}:00">
      ${hours.map((count, h) => `<span class="hour-bar ${h === peak && count ? 'is-peak' : ''}" style="--h:${(count / max) * 100}%" title="${h}:00 · ${count}"></span>`).join('')}
    </div>
    <div class="hour-axis"><span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span></div>
    <p class="hint">Your peak is around <strong>${peak}:00</strong>. Plan something absorbing for that time.</p>`;
}

function triggerChart(logs) {
  const counts = triggerCounts(logs).slice(0, 5);
  const max = counts[0]?.count || 1;
  return `<ul class="bar-list">${counts
    .map(({ id, count }) => {
      const t = triggerById(id);
      return `<li><span class="bar-label">${t.icon} ${esc(t.label)}</span><span class="bar"><span style="width:${(count / max) * 100}%"></span></span><span class="bar-count">${count}</span></li>`;
    })
    .join('')}</ul>`;
}

function historyList(logs) {
  const recent = [...logs].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 25);
  if (!recent.length) return '<p class="muted">Nothing logged yet. Cravings you beat and cigarettes you log will show up here.</p>';
  return `<ul class="history">${recent
    .map((l) => {
      const t = triggerById(l.trigger);
      const won = l.type === 'craving';
      return `
        <li class="history-item ${won ? 'is-win' : 'is-smoke'}">
          <span class="history-icon">${won ? icons.leaf : icons.flame}</span>
          <span class="history-body">
            <strong>${won ? 'Craving beaten' : 'Cigarette'}</strong>
            <small>${t.icon} ${esc(t.label)}${l.intensity ? ` · ${l.intensity}/10` : ''} · ${relativeTime(l.at)}</small>
            ${l.note ? `<small class="history-note">${esc(l.note)}</small>` : ''}
          </span>
          <button class="icon-btn icon-btn--sm" data-delete="${l.id}" aria-label="Delete entry">${icons.trash}</button>
        </li>`;
    })
    .join('')}</ul>`;
}

export default {
  title: 'Progress',
  render(host, { state }) {
    const s = computeStats(state);
    const { currency } = state.profile;
    const growth = clamp(Math.max(1, s.day) / PROGRAM_LENGTH);
    const health = clamp(s.smokeFreeMs / HEALTH_FULL_MS);
    const leaves = s.cravingsBeaten + s.missionsDone;
    const milestones = healthProgress(s.smokeFreeMs);
    const nextMilestone = milestones.find((m) => m.progress < 1);

    host.innerHTML = `
      <header class="page-head"><div><p class="eyebrow">Progress</p><h1 class="h1">Your lung tree</h1></div></header>

      <section class="card tree-card">
        ${lungTree({ growth, leaves, health })}
        <div class="tree-legend">
          <span><i class="lg-branch"></i> Branches grow each day</span>
          <span><i class="lg-leaf"></i> ${leaves} leaves</span>
          <span><i class="lg-health" style="--p:${health}"></i> ${Math.round(health * 100)}% colour</span>
        </div>
        <p class="hint">Leaves grow for every craving you beat and every mission you complete. Colour returns as your smoke-free streak builds, and slips never take leaves away.</p>
      </section>

      <section class="stat-grid">
        ${statTile(icons.clock, s.isQuit ? durationShort(s.smokeFreeMs) : '—', 'smoke-free', 'data-live-streak')}
        ${statTile(icons.coins, money(s.moneySaved, currency), 'money saved')}
        ${statTile(icons.ban, number(Math.floor(s.avoided)), 'cigarettes not smoked')}
        ${statTile(icons.heart, s.lifeRegainedMs ? durationWords(s.lifeRegainedMs) : '—', 'life regained*')}
        ${statTile(icons.leaf, s.cravingsBeaten, 'cravings beaten')}
        ${statTile(icons.check, `${s.missionsDone}/${PROGRAM_LENGTH}`, 'missions done')}
      </section>
      <p class="footnote">*Estimate: about 20 minutes of life expectancy per cigarette (UCL, 2025).</p>

      <section class="card">
        <header class="card-head"><h3>Body recovery</h3>${nextMilestone && s.isQuit ? `<span class="eyebrow">Next in ${durationShort(nextMilestone.remainingMs)}</span>` : ''}</header>
        ${s.isQuit ? '' : '<p class="muted">Your recovery clock starts on quit day.</p>'}
        <ol class="timeline">
          ${milestones
            .map(
              (m) => `
            <li class="timeline-item ${m.progress >= 1 ? 'is-reached' : ''}">
              <span class="timeline-dot">${m.progress >= 1 ? icons.check : ''}</span>
              <div class="timeline-body">
                <strong>${esc(m.title)}</strong>
                <p>${esc(m.detail)}</p>
                ${m.progress < 1 && m.progress > 0 ? `<div class="progress-bar"><span style="width:${m.progress * 100}%"></span></div>` : ''}
              </div>
            </li>`,
            )
            .join('')}
        </ol>
      </section>

      ${state.logs.length ? `
        <section class="card">
          <header class="card-head"><h3>Urges by hour</h3></header>
          ${hourChart(state.logs)}
        </section>
        <section class="card">
          <header class="card-head"><h3>Top triggers</h3></header>
          ${triggerChart(state.logs)}
        </section>` : ''}

      <section class="card">
        <header class="card-head"><h3>History</h3></header>
        ${historyList(state.logs)}
      </section>`;

    host.addEventListener('click', (e) => {
      const del = e.target.closest('[data-delete]');
      if (del && confirm('Delete this entry?')) deleteLog(del.dataset.delete);
    });

    const streakEl = host.querySelector('[data-live-streak]');
    if (!s.smokeFreeSince) return null;
    const timer = setInterval(() => {
      streakEl.textContent = durationShort(Date.now() - s.smokeFreeSince);
    }, 30000);
    return () => clearInterval(timer);
  },
};

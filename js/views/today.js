// Today: where you are, today's mission, and one-tap tools.
import { esc } from '../core/dom.js';
import { durationShort, greeting, money, number, plural, shortDate, splitDuration, timeOfDay } from '../core/format.js';
import { toDateKey } from '../core/time.js';
import { MOOD_REPLIES, MOODS, TIPS } from '../data/content.js';
import { setMood } from '../services/actions.js';
import { PHASE_LABELS, PROGRAM_LENGTH, dateForDay, quitDayNumber } from '../services/program.js';
import { computeStats } from '../services/stats.js';
import { cigarettesOn, dailyAllowance, suggestedGapMinutes } from '../services/taper.js';
import { icons } from '../components/icons.js';
import { openLogCigaretteSheet } from '../components/logSheet.js';
import { bindMissionCards, missionCard } from '../components/missionCard.js';
import { ring } from '../components/ring.js';

function liveClock(ms) {
  const { days, hours, minutes, seconds } = splitDuration(ms);
  const pad = (n) => String(n).padStart(2, '0');
  return `${days ? `${days}<small>d</small> ` : ''}${pad(hours)}<small>h</small> ${pad(minutes)}<small>m</small> ${days ? '' : `${pad(seconds)}<small>s</small>`}`;
}

function hero(state, s) {
  const progress = Math.min(1, Math.max(0, s.day) / PROGRAM_LENGTH);
  const { profile } = state;

  if (s.phase === 'upcoming') {
    return ring({
      value: 0,
      content: `<span class="ring-kicker">Starts</span><span class="ring-big">${shortDate(dateForDay(profile, 1))}</span><span class="ring-sub">Get ready. Explore the Plan.</span>`,
    });
  }
  if (s.phase === 'prepare') {
    const daysLeft = quitDayNumber(profile) - s.day;
    return ring({
      value: progress,
      tone: 'ember',
      content: `<span class="ring-kicker">Quit day in</span><span class="ring-big">${plural(daysLeft, 'day')}</span><span class="ring-sub">${shortDate(s.quitAt)}</span>`,
    });
  }
  return ring({
    value: progress,
    content: `<span class="ring-kicker">Smoke-free for</span><span class="ring-big ring-clock" data-live-clock>${liveClock(s.smokeFreeMs)}</span>
      <span class="ring-sub">${s.phase === 'graduated' ? 'Protocol complete 🎉' : `Day ${s.day} of ${PROGRAM_LENGTH}`}</span>`,
  });
}

function quickStats(state, s) {
  const { currency } = state.profile;
  return `
    <div class="mini-stats">
      <div><span class="mini-value">${money(s.moneySaved, currency)}</span><span class="mini-label">saved</span></div>
      <div><span class="mini-value">${number(Math.floor(s.avoided))}</span><span class="mini-label">not smoked</span></div>
      <div><span class="mini-value">${s.cravingsBeaten}</span><span class="mini-label">cravings beaten</span></div>
    </div>`;
}

function prepCard(state, s) {
  const todays = cigarettesOn(toDateKey(), state);
  const allowance = dailyAllowance(state.profile, s.day);
  const last = todays[todays.length - 1];
  let body;
  if (allowance) {
    const gap = suggestedGapMinutes(allowance);
    const over = todays.length > allowance;
    const next = last ? new Date(new Date(last.at).getTime() + gap * 60000) : null;
    body = `
      <div class="taper-meter ${over ? 'is-over' : ''}">
        ${Array.from({ length: Math.max(allowance, todays.length) }, (_, i) => `<span class="${i < todays.length ? (i < allowance ? 'is-used' : 'is-extra') : ''}"></span>`).join('')}
      </div>
      <p><strong>${todays.length} of ${allowance}</strong> allowed today. Space them about ${durationShort(gap * 60000)} apart.</p>
      ${next && next > new Date() ? `<p class="hint">Last one at ${timeOfDay(last.at)}. Try to wait until <strong>${timeOfDay(next)}</strong>.</p>` : ''}
      ${over ? '<p class="hint">Over the limit is okay. Tomorrow is a fresh target. Keep logging.</p>' : ''}`;
  } else {
    body = `
      <p><strong>${plural(todays.length, 'cigarette')}</strong> logged today.</p>
      <p class="hint">Smoke as you normally would, but log every one. You're gathering intel for quit day.</p>`;
  }
  return `
    <section class="card">
      <header class="card-head"><h3>${allowance ? 'Step-down target' : 'Smoking tracker'}</h3><span class="eyebrow">${PHASE_LABELS.prepare}</span></header>
      ${body}
      <button class="btn btn--soft btn--block" data-log-cig>${icons.plus} Log a cigarette</button>
    </section>`;
}

function moodCard(state) {
  const today = state.checkins[toDateKey()];
  return `
    <section class="card">
      <header class="card-head"><h3>How are you feeling?</h3></header>
      <div class="mood-row">
        ${MOODS.map(
          (m) => `<button type="button" class="mood ${today?.mood === m.value ? 'is-selected' : ''}" data-mood="${m.value}" aria-label="${m.label}">
            <span>${m.icon}</span><small>${m.label}</small></button>`,
        ).join('')}
      </div>
      ${today ? `<p class="hint">${esc(MOOD_REPLIES[today.mood])}</p>` : ''}
    </section>`;
}

export default {
  title: 'Today',
  render(host, { state }) {
    const now = new Date();
    const s = computeStats(state, now);
    const { profile } = state;
    const todayPlan = s.plan[s.day - 1];
    const tip = TIPS[((s.day % TIPS.length) + TIPS.length) % TIPS.length];

    host.innerHTML = `
      <header class="page-head">
        <div>
          <p class="eyebrow">${PHASE_LABELS[s.phase]}${s.day >= 1 && s.day <= PROGRAM_LENGTH ? ` · Day ${s.day}` : ''}</p>
          <h1 class="h1">${greeting(now)}${profile.name ? `, ${esc(profile.name)}` : ''}</h1>
        </div>
        <a href="#/settings" class="icon-btn" aria-label="Settings">${icons.settings}</a>
      </header>

      <section class="hero">${hero(state, s)}</section>
      ${quickStats(state, s)}

      ${s.isQuit ? `
        <a href="#/sos" class="sos-cta">
          <span class="sos-cta-icon">${icons.wind}</span>
          <span><strong>Craving right now?</strong><small>Ride it out with a 3-minute guided session</small></span>
          ${icons.chevron}
        </a>` : prepCard(state, s)}

      ${todayPlan ? missionCard(state, todayPlan) : `
        <section class="card">
          <h3>${s.phase === 'graduated' ? 'You finished the protocol' : 'Your protocol starts soon'}</h3>
          <p class="muted">${s.phase === 'graduated'
            ? 'Keep checking in, use SOS whenever you need it, and revisit any mission in the Plan.'
            : 'Read through the Plan so you know what is coming.'}</p>
          <a class="btn btn--ghost btn--sm" href="#/plan">Open the Plan ${icons.chevron}</a>
        </section>`}

      ${s.isQuit ? moodCard(state) : ''}

      <section class="card tip-card">
        <span class="eyebrow">Tip of the day</span>
        <p>${esc(tip)}</p>
      </section>

      ${s.isQuit ? '<button class="text-btn" data-log-cig>I slipped and smoked</button>' : moodCard(state)}
    `;

    bindMissionCards(host);
    host.addEventListener('click', (e) => {
      if (e.target.closest('[data-log-cig]')) openLogCigaretteSheet();
      const mood = e.target.closest('[data-mood]');
      if (mood) setMood(Number(mood.dataset.mood));
    });

    const clockEl = host.querySelector('[data-live-clock]');
    if (!clockEl) return null;
    const timer = setInterval(() => {
      if (s.smokeFreeSince) clockEl.innerHTML = liveClock(Date.now() - s.smokeFreeSince);
    }, 1000);
    return () => clearInterval(timer);
  },
};

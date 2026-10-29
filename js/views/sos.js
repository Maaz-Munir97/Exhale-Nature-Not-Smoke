// Craving SOS: name it → ride it out for 3 minutes (breathe / distract / remember) → record the win.
import { esc, vibrate } from '../core/dom.js';
import { clock, money } from '../core/format.js';
import { getState } from '../core/store.js';
import { DISTRACTIONS, triggerById } from '../data/content.js';
import { logCigarette, logCraving } from '../services/actions.js';
import { computeStats } from '../services/stats.js';
import { breatherMarkup, startBreather } from '../components/breather.js';
import { emberGameMarkup, startEmberGame } from '../components/emberGame.js';
import { icons } from '../components/icons.js';
import { ring } from '../components/ring.js';
import { triggerPicker } from '../components/triggerPicker.js';

const SESSION_SECONDS = 180;

function setupScreen(state) {
  const supporter = state.toolkit.supporters[0];
  return `
    <header class="page-head"><div><p class="eyebrow">Craving SOS</p><h1 class="h1">You can ride this out.</h1></div></header>
    <p class="lead">A craving peaks and passes, usually within 3–5 minutes. You don't have to fight it forever. Just outlast it.</p>
    <form class="stack" data-setup>
      <section class="card">
        <p class="field-label">What set it off?</p>
        ${triggerPicker('trigger', 'stress')}
      </section>
      <section class="card">
        <label class="field">
          <span class="field-label">How strong is it? <strong data-intensity-out>6</strong>/10</span>
          <input type="range" name="intensity" min="1" max="10" value="6" />
        </label>
      </section>
      <button type="submit" class="btn btn--primary btn--block btn--lg">${icons.wind} Start 3-minute session</button>
    </form>
    ${supporter?.phone ? `
      <a class="btn btn--ghost btn--block" href="tel:${esc(supporter.phone)}">${icons.phone} Call ${esc(supporter.name)}</a>` : ''}`;
}

function rememberPanel(state, trigger) {
  const { reasons, toolkit, profile } = state;
  const plans = toolkit.ifThen.filter((p) => p.trigger === trigger);
  const s = computeStats(state);
  return `
    ${plans.length ? `
      <div class="card card--accent">
        <span class="eyebrow">Your plan for ${esc(triggerById(trigger).label.toLowerCase())}</span>
        ${plans.map((p) => `<p class="big-quote">Then ${esc(p.plan)}</p>`).join('')}
      </div>` : ''}
    ${reasons.length ? `
      <div class="card">
        <span class="eyebrow">Why you're doing this</span>
        <ul class="reason-list">${reasons.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      </div>` : ''}
    ${toolkit.letter ? `
      <div class="card letter">
        <span class="eyebrow">A letter from you</span>
        <p>${esc(toolkit.letter).replace(/\n/g, '<br>')}</p>
      </div>` : ''}
    ${s.isQuit ? `<div class="card"><p>You have already saved <strong>${money(s.moneySaved, profile.currency)}</strong> and beaten <strong>${s.cravingsBeaten}</strong> cravings. Don't hand that back.</p></div>` : ''}
    <p class="hint">Every craving you ride out without smoking teaches your brain that the cue no longer means nicotine.</p>`;
}

function sessionScreen() {
  return `
    <div class="sos-session">
      <div class="sos-timer" data-timer>${ring({ value: 1, size: 120, stroke: 8, content: `<span class="ring-big" data-time>${clock(SESSION_SECONDS)}</span>` })}</div>
      <div class="tabs" role="tablist">
        <button role="tab" class="tab is-active" data-tab="breathe">Breathe</button>
        <button role="tab" class="tab" data-tab="distract">Distract</button>
        <button role="tab" class="tab" data-tab="remember">Remember</button>
      </div>
      <div class="tab-panel" data-panel></div>
      <button class="btn btn--primary btn--block" data-finish>The craving has passed</button>
    </div>`;
}

function resultScreen() {
  return `
    <div class="sos-result">
      <h1 class="h1">How did it go?</h1>
      <p class="muted">Be honest. Both answers help you.</p>
      <button class="btn btn--primary btn--block btn--lg" data-outcome="beaten">💪 I didn't smoke</button>
      <button class="btn btn--ghost btn--block" data-outcome="smoked">I smoked</button>
    </div>`;
}

function winScreen(count) {
  return `
    <div class="sos-result">
      <div class="win-burst">🌿</div>
      <h1 class="h1">Craving beaten.</h1>
      <p class="lead">That's <strong>${count}</strong> so far. A new leaf just grew on your lung tree.</p>
      <a class="btn btn--primary btn--block" href="#/progress">See my lung tree</a>
      <a class="btn btn--ghost btn--block" href="#/today">Back to today</a>
    </div>`;
}

function slipScreen(isQuit, trigger) {
  return `
    <div class="sos-result">
      <h1 class="h1">${isQuit ? "A slip isn't a relapse." : "That's okay. You're still preparing."}</h1>
      ${isQuit ? `
        <p class="lead">One cigarette doesn't erase your progress. What matters is the next one: don't let it happen.</p>
        <ol class="recovery-steps">
          <li>Throw away any cigarettes you have left, right now.</li>
          <li>Write or update your If-Then plan for <strong>${esc(triggerById(trigger).label.toLowerCase())}</strong>.</li>
          <li>Tell a supporter. Shame grows in silence.</li>
          <li>Check your medicine. A fast-acting nicotine product helps with breakthrough cravings.</li>
        </ol>` : `
        <p class="lead">You just practised noticing a craving. Next time try to finish the full 3 minutes before deciding.</p>`}
      <a class="btn btn--primary btn--block" href="#/toolkit">Update my plans</a>
      <a class="btn btn--ghost btn--block" href="#/today">Back to today</a>
    </div>`;
}

export default {
  title: 'SOS',
  live: false,
  render(host) {
    let stopTab = null;
    let countdown = null;
    let trigger = 'stress';
    let intensity = 6;

    const stopAll = () => {
      stopTab?.();
      stopTab = null;
      clearInterval(countdown);
    };

    function showTab(name) {
      stopTab?.();
      stopTab = null;
      host.querySelectorAll('[data-tab]').forEach((t) => t.classList.toggle('is-active', t.dataset.tab === name));
      const panel = host.querySelector('[data-panel]');
      if (name === 'breathe') {
        panel.innerHTML = breatherMarkup();
        stopTab = startBreather(panel);
      } else if (name === 'distract') {
        panel.innerHTML = `${emberGameMarkup()}
          <ul class="distract-list">${DISTRACTIONS.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>`;
        stopTab = startEmberGame(panel);
      } else {
        panel.innerHTML = rememberPanel(getState(), trigger);
      }
    }

    function startSession() {
      host.innerHTML = sessionScreen();
      showTab('breathe');
      const endAt = Date.now() + SESSION_SECONDS * 1000;
      const timeEl = host.querySelector('[data-time]');
      const arc = host.querySelector('.ring-value');
      const full = Number(arc.getAttribute('stroke-dasharray'));
      countdown = setInterval(() => {
        const left = (endAt - Date.now()) / 1000;
        timeEl.textContent = clock(left);
        // The ring empties as the session runs down.
        arc.setAttribute('stroke-dashoffset', String(full * (1 - Math.max(0, left / SESSION_SECONDS))));
        if (left <= 0) {
          vibrate([120, 80, 120]);
          showResult();
        }
      }, 250);
    }

    function showResult() {
      stopAll();
      host.innerHTML = resultScreen();
      window.scrollTo(0, 0);
    }

    function renderSetup() {
      host.innerHTML = setupScreen(getState());
    }

    host.addEventListener('input', (e) => {
      if (e.target.name === 'intensity') host.querySelector('[data-intensity-out]').textContent = e.target.value;
    });

    host.addEventListener('submit', (e) => {
      if (!e.target.matches('[data-setup]')) return;
      e.preventDefault();
      const data = new FormData(e.target);
      trigger = data.get('trigger') || 'other';
      intensity = Number(data.get('intensity')) || null;
      vibrate(20);
      startSession();
    });

    host.addEventListener('click', (e) => {
      const tab = e.target.closest('[data-tab]');
      if (tab) showTab(tab.dataset.tab);
      if (e.target.closest('[data-finish]')) showResult();

      const outcome = e.target.closest('[data-outcome]');
      if (!outcome) return;
      if (outcome.dataset.outcome === 'beaten') {
        logCraving({ trigger, intensity });
        vibrate([30, 40, 30]);
        host.innerHTML = winScreen(computeStats(getState()).cravingsBeaten);
      } else {
        const { isQuit } = computeStats(getState());
        logCigarette({ trigger, intensity, note: 'After SOS session' });
        host.innerHTML = slipScreen(isQuit, trigger);
      }
    });

    renderSetup();
    return stopAll;
  },
};

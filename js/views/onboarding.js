// First-run wizard: habits → path → reasons → summary.
import { esc } from '../core/dom.js';
import { money, shortDate } from '../core/format.js';
import { toDateKey } from '../core/time.js';
import { completeOnboarding } from '../services/actions.js';
import { MODES, quitDate } from '../services/program.js';
import { icons } from '../components/icons.js';
import { lungTree } from '../components/lungTree.js';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'PKR', 'INR', 'AED', 'SAR', 'CAD', 'AUD', 'TRY', 'BDT', 'EGP', 'NGN', 'ZAR', 'MYR', 'IDR'];
const STEPS = ['welcome', 'habits', 'path', 'reasons', 'summary'];

function guessCurrency() {
  try {
    const region = new Intl.Locale(navigator.language).maximize().region;
    const map = { US: 'USD', GB: 'GBP', PK: 'PKR', IN: 'INR', AE: 'AED', SA: 'SAR', CA: 'CAD', AU: 'AUD', TR: 'TRY', BD: 'BDT', EG: 'EGP', NG: 'NGN', ZA: 'ZAR', MY: 'MYR', ID: 'IDR' };
    return map[region] || 'USD';
  } catch {
    return 'USD';
  }
}

export default {
  title: 'Welcome',
  render(host) {
    let step = 0;
    let error = '';
    const draft = {
      name: '',
      cigsPerDay: 15,
      packSize: 20,
      packPrice: '',
      currency: guessCurrency(),
      mode: 'quick',
      startDate: toDateKey(),
      reasons: ['', '', ''],
    };

    const screens = {
      welcome: () => `
        <div class="onb-hero">
          <div class="onb-tree">${lungTree({ growth: 0.85, leaves: 60, health: 1 })}</div>
          <h1 class="display">Exhale</h1>
          <p class="lead">A 30-day, science-backed protocol to become smoke-free, and stay that way.</p>
        </div>
        <ul class="feature-list">
          <li><span>${icons.plan}</span><div><strong>One mission a day</strong><p>Small, proven steps: prepare, quit, then rewire your habits.</p></div></li>
          <li><span>${icons.wind}</span><div><strong>Craving SOS</strong><p>A 3-minute guided session to ride out any urge.</p></div></li>
          <li><span>${icons.leaf}</span><div><strong>Your lung tree</strong><p>Watch your lungs grow leaves with every craving you beat.</p></div></li>
          <li><span>${icons.shield}</span><div><strong>Private by design</strong><p>Everything stays on this device. No account, no tracking.</p></div></li>
        </ul>
        <button class="btn btn--primary btn--block btn--lg" data-next>Start my 30 days</button>`,

      habits: () => `
        <h2 class="h2">Your smoking, honestly</h2>
        <p class="muted">This powers your savings, your taper and your health stats.</p>
        <div class="stack">
          <label class="field"><span class="field-label">Your first name (optional)</span>
            <input name="name" type="text" maxlength="30" autocomplete="given-name" value="${esc(draft.name)}" /></label>
          <label class="field"><span class="field-label">Cigarettes per day</span>
            <input name="cigsPerDay" type="number" inputmode="numeric" min="1" max="100" value="${esc(draft.cigsPerDay)}" /></label>
          <div class="field-row">
            <label class="field"><span class="field-label">Cigarettes per pack</span>
              <input name="packSize" type="number" inputmode="numeric" min="1" max="50" value="${esc(draft.packSize)}" /></label>
            <label class="field"><span class="field-label">Price per pack</span>
              <input name="packPrice" type="number" inputmode="decimal" min="0" step="0.01" placeholder="e.g. 8.50" value="${esc(draft.packPrice)}" /></label>
          </div>
          <label class="field"><span class="field-label">Currency</span>
            <select name="currency">${CURRENCIES.map((c) => `<option ${c === draft.currency ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
        </div>`,

      path: () => `
        <h2 class="h2">Choose your path</h2>
        <p class="muted">Both paths finish smoke-free inside 30 days.</p>
        <div class="choice-list">
          ${Object.values(MODES)
            .map(
              (m) => `
            <label class="choice">
              <input type="radio" name="mode" value="${m.id}" ${draft.mode === m.id ? 'checked' : ''} />
              <span class="choice-body">
                <span class="choice-title">${m.label} ${m.id === 'quick' ? '<em class="badge">Recommended</em>' : ''}</span>
                <span class="choice-text">${m.summary}</span>
                <span class="choice-note">${
                  m.id === 'quick'
                    ? 'In a 697-person trial, 49% of people who stopped abruptly were smoke-free at 4 weeks vs 39% who cut down gradually.'
                    : 'Better if a sudden stop feels impossible. Your daily allowance shrinks to zero.'
                }</span>
              </span>
            </label>`,
            )
            .join('')}
        </div>
        <label class="field"><span class="field-label">Start date (day 1)</span>
          <input name="startDate" type="date" value="${draft.startDate}" /></label>
        <p class="hint">Your quit day will be <strong data-quit-preview>${shortDate(quitDate(draft))}</strong>.</p>`,

      reasons: () => `
        <h2 class="h2">Why are you quitting?</h2>
        <p class="muted">Be specific. You'll see these at your hardest moments.</p>
        <div class="stack">
          ${draft.reasons
            .map(
              (r, i) => `
            <label class="field"><span class="field-label">Reason ${i + 1}${i === 0 ? '' : ' (optional)'}</span>
              <input name="reason" type="text" maxlength="120" value="${esc(r)}"
                placeholder="${['To breathe easily when I play with my kids', 'To save money for something I really want', 'To stop feeling controlled by cigarettes'][i]}" /></label>`,
            )
            .join('')}
        </div>`,

      summary: () => {
        const perCig = draft.packSize ? Number(draft.packPrice || 0) / draft.packSize : 0;
        const monthly = perCig * draft.cigsPerDay * 30;
        return `
          <h2 class="h2">${draft.name ? `You're ready, ${esc(draft.name)}.` : "You're ready."}</h2>
          <div class="card summary-card">
            <div><span class="eyebrow">Path</span><strong>${MODES[draft.mode].label}</strong></div>
            <div><span class="eyebrow">Quit day</span><strong>${shortDate(quitDate(draft))}</strong></div>
            <div><span class="eyebrow">Each month you'll save</span><strong>${money(monthly, draft.currency)}</strong></div>
            <div><span class="eyebrow">Cigarettes not smoked / month</span><strong>${draft.cigsPerDay * 30}</strong></div>
          </div>
          <p class="muted">Tip: on your phone, use <strong>Share → Add to Home Screen</strong> so SOS is always one tap away, even offline.</p>
          <button class="btn btn--primary btn--block btn--lg" data-finish>Begin day 1</button>`;
      },
    };

    function collect() {
      const form = host.querySelector('form');
      if (!form) return;
      const data = new FormData(form);
      const name = STEPS[step];
      if (name === 'habits') {
        draft.name = String(data.get('name') || '').trim();
        draft.cigsPerDay = Number(data.get('cigsPerDay'));
        draft.packSize = Number(data.get('packSize'));
        draft.packPrice = data.get('packPrice');
        draft.currency = data.get('currency');
      } else if (name === 'path') {
        draft.mode = data.get('mode') || 'quick';
        draft.startDate = data.get('startDate') || toDateKey();
      } else if (name === 'reasons') {
        draft.reasons = data.getAll('reason').map((r) => String(r).trim());
      }
    }

    function validate() {
      const name = STEPS[step];
      if (name === 'habits') {
        if (!(draft.cigsPerDay >= 1 && draft.cigsPerDay <= 100)) return 'Enter how many cigarettes you smoke per day (1–100).';
        if (!(draft.packSize >= 1)) return 'Enter how many cigarettes come in a pack.';
        if (!(Number(draft.packPrice) >= 0) || draft.packPrice === '') return 'Enter the price of a pack (0 is fine if you prefer not to).';
      }
      if (name === 'reasons' && !draft.reasons.some(Boolean)) return 'Add at least one reason. It really matters.';
      return '';
    }

    function render() {
      const name = STEPS[step];
      host.innerHTML = `
        <div class="onboarding">
          ${step > 0 ? `
            <div class="onb-top">
              <button class="icon-btn" data-back aria-label="Back">${icons.back}</button>
              <div class="onb-dots">${STEPS.slice(1).map((_, i) => `<span class="${i < step ? 'is-on' : ''}"></span>`).join('')}</div>
            </div>` : ''}
          <form class="onb-step" novalidate>
            ${screens[name]()}
            ${error ? `<p class="error" role="alert">${esc(error)}</p>` : ''}
            ${name !== 'welcome' && name !== 'summary' ? '<button type="submit" class="btn btn--primary btn--block btn--lg">Continue</button>' : ''}
          </form>
        </div>`;
      host.querySelector('input:not([type=radio])')?.focus({ preventScroll: true });
    }

    host.addEventListener('submit', (e) => {
      e.preventDefault();
      next();
    });

    host.addEventListener('click', (e) => {
      if (e.target.closest('[data-next]')) {
        e.preventDefault();
        next();
      } else if (e.target.closest('[data-back]')) {
        collect();
        error = '';
        step -= 1;
        render();
      } else if (e.target.closest('[data-finish]')) {
        e.preventDefault();
        completeOnboarding({
          profile: {
            name: draft.name,
            cigsPerDay: draft.cigsPerDay,
            packSize: draft.packSize,
            packPrice: Number(draft.packPrice) || 0,
            currency: draft.currency,
            mode: draft.mode,
            startDate: draft.startDate,
          },
          reasons: draft.reasons.filter(Boolean),
        });
        location.hash = '#/today';
      }
    });

    // Live quit-day preview while choosing path/date.
    host.addEventListener('input', () => {
      const preview = host.querySelector('[data-quit-preview]');
      if (!preview) return;
      const data = new FormData(host.querySelector('form'));
      const startDate = data.get('startDate') || toDateKey();
      preview.textContent = shortDate(quitDate({ mode: data.get('mode'), startDate }));
    });

    function next() {
      collect();
      error = validate();
      if (!error) step = Math.min(step + 1, STEPS.length - 1);
      render();
    }

    render();
  },
};

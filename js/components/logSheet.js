// "Log a cigarette" sheet. Before quit day it is tracking; after, it is a slip with a recovery plan.
import { getState } from '../core/store.js';
import { logCigarette } from '../services/actions.js';
import { computeStats } from '../services/stats.js';
import { openSheet } from './sheet.js';
import { toast } from './toast.js';
import { triggerPicker } from './triggerPicker.js';

export function openLogCigaretteSheet() {
  const { isQuit } = computeStats(getState());
  const intro = isQuit
    ? `<p class="muted">A slip is not a relapse. Logging it honestly helps you learn from it. Your smoke-free clock restarts, but every craving you have beaten still counts.</p>`
    : `<p class="muted">No judgement. Every log shows you more about your pattern before quit day.</p>`;

  openSheet({
    title: isQuit ? 'Log a slip' : 'Log a cigarette',
    content: `
      ${intro}
      <form class="stack" data-log-form>
        <p class="field-label">What triggered it?</p>
        ${triggerPicker('trigger', 'other')}
        <label class="field">
          <span class="field-label">Note (optional)</span>
          <input type="text" name="note" maxlength="140" placeholder="Where were you? How did you feel?" />
        </label>
        <button type="submit" class="btn btn--block ${isQuit ? 'btn--ember' : 'btn--primary'}">Save</button>
      </form>`,
    onMount(body, close) {
      body.querySelector('[data-log-form]').addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        logCigarette({ trigger: data.get('trigger') || 'other', note: String(data.get('note') || '').trim() });
        close();
        toast(isQuit ? 'Logged. Throw the rest away and keep going. You\'ve got this.' : 'Logged. Awareness is training.');
      });
    },
  });
}

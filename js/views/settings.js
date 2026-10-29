// Settings: profile, path, backup and reset.
import { esc } from '../core/dom.js';
import { shortDate } from '../core/format.js';
import { SOURCES } from '../data/content.js';
import { exportData, importData, resetAll, updateProfile } from '../services/actions.js';
import { MODES, quitDate } from '../services/program.js';
import { icons } from '../components/icons.js';
import { toast } from '../components/toast.js';

export default {
  title: 'Settings',
  render(host, { state }) {
    const p = state.profile;
    host.innerHTML = `
      <header class="page-head">
        <a href="#/today" class="icon-btn" aria-label="Back">${icons.back}</a>
        <div class="grow"><p class="eyebrow">Settings</p><h1 class="h1">Your profile</h1></div>
      </header>

      <form class="card stack" data-profile>
        <label class="field"><span class="field-label">First name</span>
          <input name="name" type="text" maxlength="30" value="${esc(p.name)}" /></label>
        <div class="field-row">
          <label class="field"><span class="field-label">Cigarettes / day</span>
            <input name="cigsPerDay" type="number" min="1" max="100" inputmode="numeric" value="${p.cigsPerDay}" required /></label>
          <label class="field"><span class="field-label">Per pack</span>
            <input name="packSize" type="number" min="1" max="50" inputmode="numeric" value="${p.packSize}" required /></label>
        </div>
        <div class="field-row">
          <label class="field"><span class="field-label">Pack price</span>
            <input name="packPrice" type="number" min="0" step="0.01" inputmode="decimal" value="${p.packPrice}" required /></label>
          <label class="field"><span class="field-label">Currency</span>
            <input name="currency" type="text" maxlength="3" value="${esc(p.currency)}" pattern="[A-Za-z]{3}" required /></label>
        </div>
        <label class="field"><span class="field-label">Path</span>
          <select name="mode">${Object.values(MODES).map((m) => `<option value="${m.id}" ${m.id === p.mode ? 'selected' : ''}>${m.label}: ${m.summary}</option>`).join('')}</select></label>
        <label class="field"><span class="field-label">Start date (day 1)</span>
          <input name="startDate" type="date" value="${p.startDate}" required /></label>
        <p class="hint">Current quit day: <strong>${shortDate(quitDate(p))}</strong>. Completed missions are kept if you change path.</p>
        <button class="btn btn--primary btn--block" type="submit">Save changes</button>
      </form>

      <section class="card stack">
        <header class="card-head"><h3>Your data</h3></header>
        <p class="muted">Everything is stored only on this device. Export a backup before switching phones or clearing your browser.</p>
        <button class="btn btn--soft btn--block" data-export>${icons.download} Export backup</button>
        <label class="btn btn--soft btn--block file-btn">${icons.upload} Import backup
          <input type="file" accept="application/json,.json" data-import hidden /></label>
        <button class="btn btn--danger btn--block" data-reset>${icons.trash} Erase everything and start over</button>
      </section>

      <section class="card">
        <header class="card-head"><h3>About Exhale</h3></header>
        <p class="muted">Exhale supports your quit attempt but is not medical advice. Talk to a doctor or pharmacist about stop-smoking medicine, especially if you are pregnant, have a health condition or take other medication.</p>
        <p class="field-label">Built on</p>
        <ul class="bullets small">${SOURCES.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      </section>`;

    host.querySelector('[data-profile]').addEventListener('submit', (e) => {
      e.preventDefault();
      const d = new FormData(e.target);
      updateProfile({
        name: String(d.get('name') || '').trim(),
        cigsPerDay: Number(d.get('cigsPerDay')),
        packSize: Number(d.get('packSize')),
        packPrice: Number(d.get('packPrice')),
        currency: String(d.get('currency')).toUpperCase(),
        mode: d.get('mode'),
        startDate: d.get('startDate'),
      });
      toast('Saved');
    });

    host.addEventListener('click', (e) => {
      if (e.target.closest('[data-export]')) exportData();
      if (e.target.closest('[data-reset]') && confirm('Erase all your data? This cannot be undone.')) resetAll();
    });

    host.querySelector('[data-import]').addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        importData(await file.text());
        toast('Backup restored');
      } catch (err) {
        toast(`Import failed: ${err.message}`);
      }
    });
  },
};

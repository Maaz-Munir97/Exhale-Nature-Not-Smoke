// Settings card for daily push reminders: explains what is needed on each phone and lets you pick times.
import { esc } from '../core/dom.js';
import {
  disableReminders,
  enableReminders,
  isIOS,
  pushSupport,
  sendTestReminder,
  setReminderTimes,
} from '../services/notifications.js';
import { icons } from './icons.js';
import { toast } from './toast.js';

const hourLabel = (h) => new Date(2000, 0, 1, h).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

const hourOptions = (from, to, selected) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i)
    .map((h) => `<option value="${h}" ${h === selected ? 'selected' : ''}>${hourLabel(h)}</option>`)
    .join('');

const STATUS_TEXT = {
  'needs-install': 'On iPhone, reminders only work in the installed app. Add Exhale to your Home Screen (Share → Add to Home Screen), open it from the icon, then come back here.',
  denied: isIOS()
    ? 'Notifications are blocked. Turn them on in iPhone Settings → Notifications → Exhale.'
    : 'Notifications are blocked. Allow them in your browser\'s site settings for this app.',
  unsupported: "This browser can't show notifications. Try Chrome on Android, or the Home Screen app on iPhone (iOS 16.4+).",
};

export function remindersCard(state) {
  const { enabled, morning, evening } = state.reminders;
  const support = pushSupport();
  const on = enabled && support === 'ok';

  return `
    <section class="card stack" id="reminders" data-reminders>
      <header class="card-head">
        <h3><span class="card-icon">${icons.bell}</span>Daily reminders</h3>
        ${on ? '<span class="badge">On</span>' : ''}
      </header>
      <p class="muted">A morning nudge with today's mission and an evening check-in. They arrive even when Exhale is closed.</p>
      ${support !== 'ok' ? `<p class="notice">${esc(STATUS_TEXT[support])}</p>` : ''}
      <div class="field-row">
        <label class="field"><span class="field-label">Morning</span>
          <select name="morning" data-reminder-time>${hourOptions(5, 12, morning)}</select></label>
        <label class="field"><span class="field-label">Evening</span>
          <select name="evening" data-reminder-time>${hourOptions(16, 23, evening)}</select></label>
      </div>
      ${
        on
          ? `<button type="button" class="btn btn--soft btn--block" data-reminder="test">${icons.bell} Send a test notification</button>
             <button type="button" class="btn btn--ghost btn--block" data-reminder="off">Turn off reminders</button>`
          : `<button type="button" class="btn btn--primary btn--block" data-reminder="on" ${support === 'ok' ? '' : 'disabled'}>${icons.bell} Turn on reminders</button>`
      }
    </section>`;
}

export function bindRemindersCard(root) {
  const card = root.querySelector('[data-reminders]');
  if (!card) return;

  card.addEventListener('change', (e) => {
    const select = e.target.closest('[data-reminder-time]');
    if (!select) return;
    setReminderTimes({ [select.name]: Number(select.value) })
      .then(() => toast('Reminder time saved'))
      .catch((err) => toast(err.message));
  });

  card.addEventListener('click', async (e) => {
    const button = e.target.closest('[data-reminder]');
    if (!button) return;
    const action = button.dataset.reminder;
    button.disabled = true;
    try {
      if (action === 'on') {
        await enableReminders();
        toast('Reminders on. Sending a test…');
        await sendTestReminder();
      } else if (action === 'test') {
        await sendTestReminder();
        toast('Test sent. It should arrive in a few seconds.');
      } else if (action === 'off') {
        await disableReminders();
        toast('Reminders turned off');
      }
    } catch (err) {
      toast(err.message);
      button.disabled = false;
    }
  });
}

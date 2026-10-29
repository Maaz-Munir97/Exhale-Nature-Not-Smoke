// Toolkit: your reasons, If-Then plans, letter, support team and help.
import { esc } from '../core/dom.js';
import { HELPLINES, IF_THEN_EXAMPLES, RESOURCES, TRIGGERS, triggerById } from '../data/content.js';
import {
  addIfThen,
  addReason,
  addSupporter,
  removeIfThen,
  removeReason,
  removeSupporter,
  saveLetter,
} from '../services/actions.js';
import { icons } from '../components/icons.js';
import { toast } from '../components/toast.js';

function reasonsSection(reasons) {
  return `
    <section class="card" id="why">
      <header class="card-head"><h3>My why</h3></header>
      <ul class="item-list">
        ${reasons.map((r, i) => `<li><span>${esc(r)}</span><button class="icon-btn icon-btn--sm" data-remove-reason="${i}" aria-label="Remove reason">${icons.close}</button></li>`).join('')}
      </ul>
      <form class="inline-form" data-form="reason">
        <input name="text" type="text" maxlength="120" placeholder="Add a specific reason" required />
        <button class="btn btn--primary btn--sm" type="submit" aria-label="Add reason">${icons.plus}</button>
      </form>
    </section>`;
}

function ifThenSection(plans) {
  return `
    <section class="card" id="if-then">
      <header class="card-head"><h3>If-Then plans</h3></header>
      <p class="muted">Decide now, so you don't have to decide during a craving.</p>
      <ul class="plan-list">
        ${plans
          .map((p) => {
            const t = triggerById(p.trigger);
            return `<li><div><span class="eyebrow">If ${t.icon} ${esc(t.label.toLowerCase())}</span><p>then ${esc(p.plan)}</p></div>
              <button class="icon-btn icon-btn--sm" data-remove-plan="${p.id}" aria-label="Remove plan">${icons.close}</button></li>`;
          })
          .join('')}
      </ul>
      <form class="stack" data-form="if-then">
        <label class="field"><span class="field-label">If…</span>
          <select name="trigger">${TRIGGERS.map((t) => `<option value="${t.id}">${t.icon} ${t.label}</option>`).join('')}</select></label>
        <label class="field"><span class="field-label">…then I will</span>
          <input name="plan" type="text" maxlength="140" placeholder="e.g. drink a glass of water and walk for 5 minutes" required /></label>
        <button class="btn btn--primary btn--block" type="submit">Add plan</button>
      </form>
      ${plans.length ? '' : `
        <p class="field-label">Need ideas? Tap one:</p>
        <div class="chip-group">${IF_THEN_EXAMPLES.map((ex, i) => `<button type="button" class="chip chip--btn" data-example="${i}">${triggerById(ex.trigger).icon} ${esc(ex.plan)}</button>`).join('')}</div>`}
    </section>`;
}

function letterSection(letter) {
  return `
    <section class="card" id="letter">
      <header class="card-head"><h3>Letter to future me</h3></header>
      <p class="muted">Write to yourself at your next tough moment. It appears in SOS.</p>
      <form class="stack" data-form="letter">
        <textarea name="letter" rows="6" maxlength="2000" placeholder="Hey, I know this craving feels huge right now. Remember why we started…">${esc(letter)}</textarea>
        <button class="btn btn--soft btn--block" type="submit">Save letter</button>
      </form>
    </section>`;
}

function supportSection(supporters) {
  return `
    <section class="card" id="support">
      <header class="card-head"><h3>Support team</h3></header>
      <ul class="item-list">
        ${supporters
          .map(
            (p) => `<li><span><strong>${esc(p.name)}</strong>${p.phone ? `<small>${esc(p.phone)}</small>` : ''}</span>
            <span class="row-actions">
              ${p.phone ? `<a class="icon-btn icon-btn--sm" href="tel:${esc(p.phone)}" aria-label="Call ${esc(p.name)}">${icons.phone}</a>
              <a class="icon-btn icon-btn--sm" href="sms:${esc(p.phone)}" aria-label="Text ${esc(p.name)}">${icons.message}</a>` : ''}
              <button class="icon-btn icon-btn--sm" data-remove-supporter="${p.id}" aria-label="Remove">${icons.close}</button>
            </span></li>`,
          )
          .join('')}
      </ul>
      <form class="stack" data-form="supporter">
        <div class="field-row">
          <input name="name" type="text" maxlength="40" placeholder="Name" required />
          <input name="phone" type="tel" maxlength="20" placeholder="Phone" />
        </div>
        <button class="btn btn--soft btn--block" type="submit">${icons.plus} Add supporter</button>
      </form>
    </section>`;
}

function helpSection() {
  return `
    <section class="card">
      <header class="card-head"><h3>Medicine & expert help</h3></header>
      <p>Stop-smoking medicine roughly <strong>doubles</strong> your chances. Options include:</p>
      <ul class="bullets">
        <li><strong>Combination NRT:</strong> a daily patch plus gum, lozenge or spray for breakthrough cravings.</li>
        <li><strong>Varenicline</strong> or <strong>bupropion</strong>: prescription tablets. Ask a doctor.</li>
        <li><strong>Behavioural support</strong> from a quitline or stop-smoking service, on top of medicine, works best.</li>
      </ul>
      <p class="field-label">Free quitlines</p>
      <ul class="item-list">
        ${HELPLINES.map((h) => `<li><span><strong>${h.name}</strong><small>${h.region} · ${h.display}</small></span><a class="icon-btn icon-btn--sm" href="tel:${h.phone}" aria-label="Call ${h.name}">${icons.phone}</a></li>`).join('')}
      </ul>
      <p class="hint">Elsewhere: search "quitline" with your country's name, or ask your pharmacist.</p>
      <div class="link-list">${RESOURCES.map((r) => `<a href="${r.href}" target="_blank" rel="noopener">${esc(r.label)} ${icons.link}</a>`).join('')}</div>
    </section>`;
}

export default {
  title: 'Toolkit',
  render(host, { state }) {
    const { reasons, toolkit } = state;
    host.innerHTML = `
      <header class="page-head">
        <div><p class="eyebrow">Toolkit</p><h1 class="h1">Your quit kit</h1></div>
        <a href="#/settings" class="icon-btn" aria-label="Settings">${icons.settings}</a>
      </header>
      ${reasonsSection(reasons)}
      ${ifThenSection(toolkit.ifThen)}
      ${letterSection(toolkit.letter)}
      ${supportSection(toolkit.supporters)}
      ${helpSection()}`;

    host.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.target;
      const data = new FormData(form);
      const value = (key) => String(data.get(key) || '').trim();
      switch (form.dataset.form) {
        case 'reason':
          if (value('text')) addReason(value('text'));
          break;
        case 'if-then':
          if (value('plan')) addIfThen(value('trigger'), value('plan'));
          break;
        case 'letter':
          saveLetter(value('letter'));
          toast('Letter saved. It will be there when you need it.');
          break;
        case 'supporter':
          if (value('name')) addSupporter(value('name'), value('phone'));
          break;
        default:
      }
    });

    host.addEventListener('click', (e) => {
      const t = e.target;
      const reason = t.closest('[data-remove-reason]');
      const plan = t.closest('[data-remove-plan]');
      const supporter = t.closest('[data-remove-supporter]');
      const example = t.closest('[data-example]');
      if (reason) removeReason(Number(reason.dataset.removeReason));
      if (plan) removeIfThen(plan.dataset.removePlan);
      if (supporter) removeSupporter(supporter.dataset.removeSupporter);
      if (example) {
        const ex = IF_THEN_EXAMPLES[Number(example.dataset.example)];
        addIfThen(ex.trigger, ex.plan);
      }
    });
  },
};

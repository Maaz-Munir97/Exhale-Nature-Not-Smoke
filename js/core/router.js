// Hash router (#/today, #/sos …). Works on any static host, including Vercel, with no rewrites.
// Each view: { title, render(host, ctx) -> cleanup?, live? }.
// live: false means the view is not re-rendered on state changes (e.g. an SOS session in progress).
import { renderNav } from '../components/nav.js';
import { getState, subscribe } from './store.js';
import onboarding from '../views/onboarding.js';
import today from '../views/today.js';
import plan from '../views/plan.js';
import sos from '../views/sos.js';
import progress from '../views/progress.js';
import toolkit from '../views/toolkit.js';
import settings from '../views/settings.js';

const ROUTES = { today, plan, sos, progress, toolkit, settings };

let appEl;
let navEl;
let current = { name: null, cleanup: null };

export function navigate(name) {
  if (location.hash === `#/${name}`) mount();
  else location.hash = `#/${name}`;
}

function resolve() {
  const requested = location.hash.replace(/^#\/?/, '').split('?')[0] || 'today';
  if (!getState().onboarded) return 'onboarding';
  return ROUTES[requested] ? requested : 'today';
}

function viewFor(name) {
  return name === 'onboarding' ? onboarding : ROUTES[name];
}

function mount() {
  const name = resolve();
  const view = viewFor(name);
  const isNewRoute = name !== current.name;

  current.cleanup?.();
  // A fresh host per render means old event listeners are dropped with the old DOM.
  const host = document.createElement('div');
  host.className = `view view--${name}`;
  appEl.replaceChildren(host);

  current = { name, cleanup: view.render(host, { state: getState(), navigate }) || null };

  navEl.hidden = name === 'onboarding';
  renderNav(navEl, name);
  document.title = view.title ? `${view.title} · Exhale` : 'Exhale';
  if (isNewRoute) window.scrollTo(0, 0);
}

export function initRouter(app, nav) {
  appEl = app;
  navEl = nav;
  window.addEventListener('hashchange', mount);
  subscribe(() => {
    const view = viewFor(current.name);
    // Still re-route when onboarding status flips (finished onboarding, or data reset).
    if (view?.live === false && resolve() === current.name) return;
    mount();
  });
  mount();
}

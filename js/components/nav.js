// Bottom tab bar. SOS sits in the middle, always one thumb-tap away.
import { icons } from './icons.js';

const ITEMS = [
  { route: 'today', label: 'Today', icon: icons.today },
  { route: 'plan', label: 'Plan', icon: icons.plan },
  { route: 'sos', label: 'SOS', icon: icons.wind, primary: true },
  { route: 'progress', label: 'Progress', icon: icons.leaf },
  { route: 'toolkit', label: 'Toolkit', icon: icons.heart },
];

export function renderNav(el, activeRoute) {
  el.innerHTML = ITEMS.map(
    (item) => `
      <a href="#/${item.route}" class="nav-item ${item.primary ? 'nav-item--primary' : ''} ${item.route === activeRoute ? 'is-active' : ''}"
         ${item.route === activeRoute ? 'aria-current="page"' : ''}>
        <span class="nav-icon">${item.icon}</span>
        <span class="nav-label">${item.label}</span>
      </a>`,
  ).join('');
}

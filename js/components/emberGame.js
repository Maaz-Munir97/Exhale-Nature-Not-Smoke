// "Put out the embers": a tiny tap game that keeps restless hands busy during a craving.
import { vibrate } from '../core/dom.js';

const LIFETIME_MS = 2600;

export function emberGameMarkup() {
  return `
    <div class="ember-game">
      <div class="ember-score">Embers out: <strong data-ember-score>0</strong></div>
      <div class="ember-arena" data-ember-arena aria-label="Tap the glowing embers to put them out"></div>
    </div>`;
}

/** Start spawning embers in the arena. Returns a stop function. */
export function startEmberGame(root) {
  const arena = root.querySelector('[data-ember-arena]');
  const scoreEl = root.querySelector('[data-ember-score]');
  const timers = new Set();
  let score = 0;
  let running = true;

  const later = (fn, ms) => {
    const id = setTimeout(() => {
      timers.delete(id);
      fn();
    }, ms);
    timers.add(id);
  };

  function spawn() {
    if (!running) return;
    const size = 40 + Math.random() * 24;
    const ember = document.createElement('button');
    ember.type = 'button';
    ember.className = 'ember';
    ember.setAttribute('aria-label', 'Ember');
    ember.style.width = ember.style.height = `${size}px`;
    ember.style.left = `${Math.random() * Math.max(0, arena.clientWidth - size)}px`;
    ember.style.top = `${Math.random() * Math.max(0, arena.clientHeight - size)}px`;

    ember.addEventListener('pointerdown', () => {
      if (ember.classList.contains('is-out')) return;
      ember.classList.add('is-out');
      score += 1;
      scoreEl.textContent = score;
      vibrate(8);
      later(() => ember.remove(), 450);
    });

    arena.append(ember);
    later(() => {
      if (!ember.classList.contains('is-out')) {
        ember.classList.add('is-fading');
        later(() => ember.remove(), 400);
      }
    }, LIFETIME_MS);
    later(spawn, 500 + Math.random() * 500);
  }

  spawn();
  return () => {
    running = false;
    timers.forEach(clearTimeout);
    timers.clear();
    arena.replaceChildren();
  };
}

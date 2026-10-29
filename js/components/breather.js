// Guided breathing orb: in 4 · hold 4 · out 6 · rest 2.
// A longer exhale than inhale helps calm the nervous system.

const PATTERN = [
  { label: 'Breathe in', secs: 4, scale: 1 },
  { label: 'Hold', secs: 4, scale: 1 },
  { label: 'Breathe out', secs: 6, scale: 0.55 },
  { label: 'Rest', secs: 2, scale: 0.55 },
];

export function breatherMarkup() {
  return `
    <div class="breather">
      <div class="breath-orb"><span class="breath-count">4</span></div>
      <p class="breath-label">Get ready…</p>
    </div>`;
}

/** Start the animation inside `root`. Returns a stop function. */
export function startBreather(root) {
  const orb = root.querySelector('.breath-orb');
  const label = root.querySelector('.breath-label');
  const count = root.querySelector('.breath-count');
  let index = 0;
  let left = 0;
  let timer = null;

  function nextPhase() {
    const phase = PATTERN[index % PATTERN.length];
    index += 1;
    left = phase.secs;
    label.textContent = phase.label;
    count.textContent = left;
    orb.style.transitionDuration = `${phase.secs}s`;
    orb.style.transform = `scale(${phase.scale})`;
  }

  // Wait one frame so the first transition actually animates from the resting size.
  const raf = requestAnimationFrame(() => {
    nextPhase();
    timer = setInterval(() => {
      left -= 1;
      if (left <= 0) nextPhase();
      else count.textContent = left;
    }, 1000);
  });

  return () => {
    cancelAnimationFrame(raf);
    clearInterval(timer);
  };
}

// The Lung Tree: your bronchi drawn as two mirrored trees.
//  - growth (0–1): how many branches are visible (program progress)
//  - leaves:       one leaf per craving beaten / mission completed
//  - health (0–1): colour shifts from smoky grey to living green with your streak
import { clamp } from '../core/dom.js';

const W = 320;
const H = 300;
const MAX_DEPTH = 7;
const SMOKE = [138, 143, 147];
const ALIVE = [63, 190, 160];

function seededRandom(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let geometry = null;

/** Build the branch layout once; the same seed always gives the same tree. */
function getGeometry() {
  if (geometry) return geometry;
  const rand = seededRandom(11);
  const left = [];

  // angle 0 points straight down; negative angles lean left
  function grow(x, y, angle, length, depth) {
    const x2 = x + Math.sin(angle) * length;
    const y2 = y + Math.cos(angle) * length;
    left.push({ x1: x, y1: y, x2, y2, depth, angle });
    if (depth >= MAX_DEPTH) return;
    const spread = 0.36 + rand() * 0.24;
    const bias = (rand() - 0.5) * 0.24;
    grow(x2, y2, angle - spread + bias, length * (0.7 + rand() * 0.12), depth + 1);
    grow(x2, y2, angle + spread + bias, length * (0.7 + rand() * 0.12), depth + 1);
  }
  grow(W / 2, 112, -0.95, 44, 1);

  const mirror = (s) => ({ ...s, x1: W - s.x1, x2: W - s.x2, angle: -s.angle });
  // Interleave sides and sort by depth so both lungs grow together, trunk-first.
  const segments = left
    .flatMap((s) => [s, mirror(s)])
    .map((s, i) => ({ ...s, order: i }))
    .sort((a, b) => a.depth - b.depth || a.order - b.order);

  geometry = { segments };
  return geometry;
}

const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const rgb = (c, alpha = 1) => `rgba(${c[0]},${c[1]},${c[2]},${alpha})`;

export function lungTree({ growth = 0, leaves = 0, health = 0 }) {
  const { segments } = getGeometry();
  const visibleCount = Math.max(2, Math.round(segments.length * clamp(growth)));
  const visible = segments.slice(0, visibleCount);
  const color = mix(SMOKE, ALIVE, clamp(health));

  const branches = visible
    .map((s) => {
      const width = Math.max(1, 6.5 - s.depth * 0.8);
      return `<line x1="${s.x1.toFixed(1)}" y1="${s.y1.toFixed(1)}" x2="${s.x2.toFixed(1)}" y2="${s.y2.toFixed(1)}"
        stroke-width="${width.toFixed(1)}" style="animation-delay:${(s.depth * 0.12).toFixed(2)}s" />`;
    })
    .join('');

  // Leaves sit on the outer, visible twigs; two slots per twig.
  const rand = seededRandom(5);
  const slots = visible
    .filter((s) => s.depth >= 3)
    .flatMap((s) => [0, 1].map((k) => ({ s, k, r: rand() })))
    .sort((a, b) => a.r - b.r);
  const leafCount = Math.min(leaves, slots.length);
  const leafEls = slots
    .slice(0, leafCount)
    .map(({ s, k }, i) => {
      const t = k === 0 ? 1 : 0.6;
      const x = s.x1 + (s.x2 - s.x1) * t;
      const y = s.y1 + (s.y2 - s.y1) * t;
      const rot = (-s.angle * 180) / Math.PI + (k === 0 ? 30 : -40);
      const hue = 140 + ((i * 37) % 40);
      return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="5.5" ry="2.6"
        transform="rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})"
        fill="hsl(${hue} 60% 52%)" style="animation-delay:${(0.6 + i * 0.015).toFixed(2)}s" />`;
    })
    .join('');

  return `
    <svg class="lung-tree" viewBox="0 0 ${W} ${H}" role="img"
      aria-label="Lung tree: ${Math.round(clamp(growth) * 100)}% grown, ${leafCount} leaves">
      <g class="lung-silhouette">
        <path d="M150 92 C118 76 66 96 42 152 C22 198 24 252 50 274 C82 292 132 282 150 260 Z" />
        <path d="M170 92 C202 76 254 96 278 152 C298 198 296 252 270 274 C238 292 188 282 170 260 Z" />
      </g>
      <g class="lung-branches" stroke="${rgb(color)}" stroke-linecap="round">
        <line x1="160" y1="18" x2="160" y2="112" stroke-width="8" />
        ${branches}
      </g>
      <g class="lung-leaves">${leafEls}</g>
    </svg>`;
}

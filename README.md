# Exhale · 30 Days Smoke-Free

A private, evidence-based 30-day quit-smoking protocol. It's an installable web app (PWA): no build step, no backend, no account. Your data stays in your browser.

## What makes it different

- **A protocol, not a counter.** Each day has one mission with checkable steps: prepare, quit, then rewire your habits and relapse-proof yourself.
- **Two paths.** *Quick Stop* (3 prep days, quit on day 4, recommended by trial evidence) or *Step Down* (a 7-day taper with a daily allowance that shrinks to zero).
- **Craving SOS.** A 3-minute guided session: paced breathing (4-4-6-2), the "put out the embers" tap game for restless hands, and your own reasons, If-Then plans and letter to yourself.
- **The Lung Tree.** Your bronchi drawn as two trees. Branches grow each program day, a leaf appears for every craving beaten and every mission completed, and the colour returns as your smoke-free streak builds. Slips never remove leaves.
- **Compassionate slip handling.** A slip restarts the clock but keeps your progress, and comes with a concrete recovery plan.
- **Insights.** Urges by hour, top triggers, body-recovery timeline, money saved and life regained.

## Project structure

```
index.html              App shell
manifest.webmanifest    PWA manifest (Add to Home Screen)
sw.js                   Service worker (offline support)
vercel.json             Headers for Vercel
assets/icons/           App icons (SVG + PNG for iOS/Android)
css/
  tokens.css            Colours, type, spacing (light + dark)
  base.css              Reset, typography, form controls
  layout.css            Shell, header, bottom nav
  components.css        Buttons, cards, chips, ring, sheet, toast, charts
  views.css             Per-screen styles
js/
  main.js               Entry point
  core/                 store (state + localStorage), router, time, format, dom, pwa
  data/                 missions (30-day content), recovery timeline, triggers/tips/helplines
  services/             program (days/phases/plan), stats, taper, actions (all state changes)
  components/           lungTree, breather, emberGame, ring, nav, sheet, toast, missionCard...
  views/                onboarding, today, plan, sos, progress, toolkit, settings
```

Data flows one way: **views → services/actions → core/store → router re-renders the view**.

## Run locally

ES modules need a web server (opening the file directly won't work):

```bash
npx serve .
# or
python -m http.server 8080
```

Then open the printed URL.

## Deploy

```bash
git init
git add .
git commit -m "Exhale: 30-day quit smoking PWA"
git branch -M main
git remote add origin https://github.com/<you>/exhale.git
git push -u origin main
```

On [vercel.com](https://vercel.com): **Add New → Project → import the repo**. Framework preset: **Other**. Leave the build command and output directory empty, then deploy.

## Install on your phone

- **iPhone (Safari):** open your Vercel URL, tap **Share → Add to Home Screen**.
- **Android (Chrome):** menu **⋮ → Add to Home screen / Install app**.

It then opens full-screen and works offline.

## Updating

The service worker is network-first, so a new deploy shows up on the next launch while you're online. If you add or rename files, also update `APP_SHELL` in `sw.js` and bump `VERSION`.

## Backups

Data lives in this browser's localStorage. Use **Settings → Export backup** before changing phones or clearing browser data, then import it on the new device.

## Evidence base

- Lindson-Hawley et al., *Annals of Internal Medicine* 2016: abrupt quitting beat gradual reduction (49% vs 39% abstinent at 4 weeks).
- Jackson et al., *Addiction* 2025 (UCL): about 20 minutes of life expectancy lost per cigarette.
- HSE Ireland / Australian Dept. of Health: cravings usually pass in 3–5 minutes; the 4 Ds.
- American Cancer Society / CDC: the timeline of health benefits after quitting.
- Cochrane reviews: NRT (especially combination NRT), varenicline and behavioural support raise quit rates.

> Exhale is a support tool, not medical advice. Talk to a doctor or pharmacist about stop-smoking medicine.

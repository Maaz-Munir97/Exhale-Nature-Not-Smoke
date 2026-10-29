// Service worker: makes Exhale work offline after the first visit.
// Bump VERSION whenever you deploy changes so phones pick up the new files.
const VERSION = 'exhale-v1.2.0';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './css/tokens.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/views.css',
  './js/main.js',
  './js/core/dom.js',
  './js/core/format.js',
  './js/core/pwa.js',
  './js/core/router.js',
  './js/core/store.js',
  './js/core/time.js',
  './js/data/content.js',
  './js/data/missions.js',
  './js/data/recovery.js',
  './js/services/actions.js',
  './js/services/notifications.js',
  './js/services/program.js',
  './js/services/stats.js',
  './js/services/taper.js',
  './js/components/breather.js',
  './js/components/emberGame.js',
  './js/components/icons.js',
  './js/components/logSheet.js',
  './js/components/lungTree.js',
  './js/components/missionCard.js',
  './js/components/remindersCard.js',
  './js/components/nav.js',
  './js/components/ring.js',
  './js/components/sheet.js',
  './js/components/toast.js',
  './js/components/triggerPicker.js',
  './js/views/onboarding.js',
  './js/views/plan.js',
  './js/views/progress.js',
  './js/views/settings.js',
  './js/views/sos.js',
  './js/views/today.js',
  './js/views/toolkit.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) return;

  // Network first: you always get the latest deploy when online; the cache is the offline fallback.
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request, { ignoreSearch: true });
        return cached || (request.mode === 'navigate' ? caches.match('./index.html') : Response.error());
      }),
  );
});

// ---- Daily reminders (Web Push) ----

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = { body: event.data?.text() };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Exhale', {
      body: data.body || '',
      icon: './assets/icons/icon-192.png',
      badge: './assets/icons/icon-192.png',
      tag: data.tag || 'exhale-reminder',
      data: { url: data.url || '#/today' },
    }),
  );
});

// Tapping a notification opens Exhale (or focuses it) on the right screen.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = new URL(`./${event.notification.data?.url || ''}`, self.registration.scope).href;
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const open = windows.find((w) => w.url.startsWith(self.registration.scope));
      if (open) return open.focus().then((w) => w?.navigate?.(target)).catch(() => {});
      return self.clients.openWindow(target);
    }),
  );
});

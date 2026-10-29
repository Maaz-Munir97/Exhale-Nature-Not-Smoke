// Service worker registration for offline use and "Add to Home Screen".

export function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('Exhale: service worker registration failed', err);
    });
  });
}

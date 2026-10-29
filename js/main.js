// App entry point.
import { initRouter } from './core/router.js';
import { registerServiceWorker } from './core/pwa.js';
import { syncReminders } from './services/notifications.js';

initRouter(document.getElementById('app'), document.getElementById('nav'));
registerServiceWorker();

// Ask the browser to keep our saved data even when the phone is low on space.
navigator.storage?.persist?.().catch(() => {});

// Keep reminder times / time zone up to date on the server (silently ignored offline).
syncReminders().catch(() => {});

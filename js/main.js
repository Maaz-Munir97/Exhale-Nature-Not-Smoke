// App entry point.
import { initRouter } from './core/router.js';
import { registerServiceWorker } from './core/pwa.js';

initRouter(document.getElementById('app'), document.getElementById('nav'));
registerServiceWorker();

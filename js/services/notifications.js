// Daily reminders via Web Push. The phone shows them even when Exhale is closed.
// Flow: ask permission → subscribe with the server's public VAPID key → save the subscription on the server.
import { getState, update } from '../core/store.js';

export const isStandalone = () =>
  window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

export const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

/** 'ok' | 'needs-install' | 'denied' | 'unsupported' */
export function pushSupport() {
  const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  if (!supported) return isIOS() && !isStandalone() ? 'needs-install' : 'unsupported';
  if (Notification.permission === 'denied') return 'denied';
  return 'ok';
}

function urlBase64ToUint8Array(base64) {
  const padded = (base64 + '='.repeat((4 - (base64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

async function api(path, body, method = 'POST') {
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Server error (${res.status})`);
  return data;
}

function payload(subscription) {
  const { profile, reminders } = getState();
  return {
    subscription: subscription.toJSON(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    morningHour: reminders.morning,
    eveningHour: reminders.evening,
    profile: { name: profile.name, mode: profile.mode, startDate: profile.startDate },
  };
}

async function currentSubscription() {
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

/** Must be called straight from a tap (iOS only shows the permission prompt after a user gesture). */
export async function enableReminders() {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Notifications were not allowed.');

  const config = await fetch('/api/config').then((r) => r.json()).catch(() => ({}));
  if (!config.ready) throw new Error('Reminders are not set up on the server yet. See NOTIFICATIONS.md.');

  const registration = await navigator.serviceWorker.ready;
  const subscription =
    (await registration.pushManager.getSubscription()) ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(config.publicKey),
    }));

  update((s) => {
    s.reminders.enabled = true;
  });
  await api('/api/subscribe', payload(subscription));
}

export async function disableReminders() {
  const subscription = await currentSubscription();
  if (subscription) {
    await api('/api/subscribe', { endpoint: subscription.endpoint }, 'DELETE').catch(() => {});
    await subscription.unsubscribe();
  }
  update((s) => {
    s.reminders.enabled = false;
  });
}

export async function setReminderTimes({ morning, evening }) {
  update((s) => {
    if (morning !== undefined) s.reminders.morning = morning;
    if (evening !== undefined) s.reminders.evening = evening;
  });
  await syncReminders();
}

/** Keep the server's copy (times, time zone, plan dates) in step with the app. Safe to call any time. */
export async function syncReminders() {
  if (!getState().reminders.enabled || pushSupport() !== 'ok') return;
  const subscription = await currentSubscription();
  if (!subscription) {
    update((s) => {
      s.reminders.enabled = false;
    });
    return;
  }
  await api('/api/subscribe', payload(subscription));
}

export async function sendTestReminder() {
  const subscription = await currentSubscription();
  if (!subscription) throw new Error('Reminders are not turned on.');
  await api('/api/test-push', { subscription: subscription.toJSON() });
}

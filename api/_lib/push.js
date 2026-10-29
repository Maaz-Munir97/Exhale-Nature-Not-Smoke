// Sends Web Push messages signed with your VAPID keys.
import webpush from 'web-push';

let configured = false;

export function sendPush(subscription, message) {
  if (!configured) {
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT || 'mailto:exhale@example.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );
    configured = true;
  }
  return webpush.sendNotification(subscription, JSON.stringify(message), { TTL: 3 * 60 * 60 });
}

/** The phone unsubscribed or the app was removed: delete the stored subscription. */
export const isGone = (err) => err?.statusCode === 404 || err?.statusCode === 410;

// POST   /api/subscribe  { subscription, timezone, morningHour, eveningHour, profile }  → save / update a device
// DELETE /api/subscribe  { endpoint }                                                 → stop reminders for a device
import { deleteSubscription, upsertSubscription } from './_lib/supabase.js';

const hourOr = (value, fallback) => {
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 23 ? n : fallback;
};

const dateOrNull = (value) => (/^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? value : null);

export default async function handler(req, res) {
  try {
    const body = req.body || {};

    if (req.method === 'POST') {
      const { subscription, timezone, morningHour, eveningHour, profile = {} } = body;
      if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
        return res.status(400).json({ error: 'Invalid push subscription' });
      }
      await upsertSubscription({
        endpoint: subscription.endpoint,
        subscription,
        timezone: String(timezone || 'UTC').slice(0, 64),
        morning_hour: hourOr(morningHour, 9),
        evening_hour: hourOr(eveningHour, 21),
        name: String(profile.name || '').slice(0, 30),
        mode: profile.mode === 'step' ? 'step' : 'quick',
        start_date: dateOrNull(profile.startDate),
        updated_at: new Date().toISOString(),
      });
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      if (!body.endpoint) return res.status(400).json({ error: 'Missing endpoint' });
      await deleteSubscription(body.endpoint);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('subscribe failed', err);
    return res.status(500).json({ error: 'Could not save reminder settings' });
  }
}

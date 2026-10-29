// GET /api/send-reminders: called every hour by GitHub Actions (see .github/workflows/reminders.yml).
// Sends each device its morning or evening reminder once it is due in that device's own time zone.
import { isGone, sendPush } from './_lib/push.js';
import { buildMessage, dueSlot } from './_lib/reminders.js';
import { deleteSubscription, listSubscriptions, updateSubscription } from './_lib/supabase.js';

export default async function handler(req, res) {
  if (!process.env.CRON_SECRET || req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const now = new Date();
  const result = { checked: 0, sent: 0, removed: 0, failed: 0 };

  try {
    const rows = await listSubscriptions();
    result.checked = rows.length;

    for (const row of rows) {
      const due = dueSlot(row, now);
      if (!due) continue;
      try {
        await sendPush(row.subscription, { ...buildMessage(row, due.slot, due.dateKey), tag: `exhale-${due.slot}` });
        await updateSubscription(row.endpoint, { [`last_${due.slot}`]: due.dateKey });
        result.sent += 1;
      } catch (err) {
        if (isGone(err)) {
          await deleteSubscription(row.endpoint);
          result.removed += 1;
        } else {
          console.error('push failed', row.endpoint.slice(0, 60), err.statusCode, err.body);
          result.failed += 1;
        }
      }
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error('send-reminders failed', err);
    return res.status(500).json({ ...result, error: err.message });
  }
}

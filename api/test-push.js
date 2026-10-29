// POST /api/test-push { subscription }: sends one notification right away so you can check it works.
import { sendPush } from './_lib/push.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { subscription } = req.body || {};
  if (!subscription?.endpoint) return res.status(400).json({ error: 'Missing subscription' });
  try {
    await sendPush(subscription, {
      title: 'Reminders are on 💙',
      body: "You'll get today's mission each morning and a check-in each evening.",
      url: '#/today',
      tag: 'exhale-test',
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('test push failed', err);
    return res.status(502).json({ error: `Push service refused the message (${err.statusCode || 'error'})` });
  }
}

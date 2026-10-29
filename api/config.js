// GET /api/config: tells the app whether reminders are set up, and gives it the public VAPID key.

export default function handler(req, res) {
  const ready = Boolean(
    process.env.VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ready, publicKey: ready ? process.env.VAPID_PUBLIC_KEY : null });
}

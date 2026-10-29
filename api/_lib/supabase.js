// Minimal Supabase REST client for the push_subscriptions table (server-side only).

const TABLE = 'push_subscriptions';

async function request(path, { method = 'GET', body, prefer } = {}) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const headers = { apikey: key, 'Content-Type': 'application/json' };
  // Legacy service_role keys are JWTs and also go in Authorization; new sb_secret_ keys do not.
  if (key?.startsWith('eyJ')) headers.Authorization = `Bearer ${key}`;
  if (prefer) headers.Prefer = prefer;

  const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const byEndpoint = (endpoint) => `${TABLE}?endpoint=eq.${encodeURIComponent(endpoint)}`;

export const listSubscriptions = () => request(`${TABLE}?select=*`);

export const upsertSubscription = (row) =>
  request(`${TABLE}?on_conflict=endpoint`, {
    method: 'POST',
    body: row,
    prefer: 'resolution=merge-duplicates,return=minimal',
  });

export const updateSubscription = (endpoint, patch) =>
  request(byEndpoint(endpoint), { method: 'PATCH', body: patch, prefer: 'return=minimal' });

export const deleteSubscription = (endpoint) => request(byEndpoint(endpoint), { method: 'DELETE' });

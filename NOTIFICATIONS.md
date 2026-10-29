# Daily reminders: how they work and how to set them up

## How it works

```
GitHub Actions (every hour) ──► /api/send-reminders on Vercel
                                   │  reads devices from Supabase
                                   │  "is it 9 AM or 9 PM for this phone yet?"
                                   ▼
                          Apple / Google push service ──► your phone shows the notification
```

- **Morning** (default 9:00): today's mission, e.g. *"Day 5: Move it out"*. On quit day: *"Not one puff today."*
- **Evening** (default 21:00): a check-in, e.g. log cigarettes or mood. The night before quit day it says *"Quit day is tomorrow."*
- Times are chosen in **Settings → Daily reminders** and follow your phone's time zone.
- Tapping a notification opens Exhale on the Today screen.

**Why these pieces?** A phone only shows a notification for a closed web app if a server sends a push message. So:
- **Vercel functions** (`/api`) send the messages.
- **Supabase** (free) stores each phone's push subscription. It holds no smoking data: only the subscription, time zone, reminder times, first name, path and start date (needed to word the message).
- **GitHub Actions** triggers sending every hour. Vercel's free plan only allows a cron job once a day, with loose timing.

Your quit data (logs, missions, reasons, and so on) still lives only on your phone.

## One-time setup (about 10 minutes)

### 1. Supabase
1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor → New query**, paste the contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**.
3. Go to **Project Settings → API** (or **API Keys**) and copy:
   - the **Project URL** → `SUPABASE_URL`
   - the **secret** key (`sb_secret_…`) or legacy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

   Never put this key in the app's code. It only goes into Vercel.

### 2. Vercel environment variables
Open your local `.env.local` file. It's already generated with your push keys and a cron secret, and it's git-ignored. Fill in the two Supabase values and set `VAPID_SUBJECT` to your app URL.

In Vercel, go to **Project → Settings → Environment Variables** and add all six:

| Name | Value |
|---|---|
| `VAPID_PUBLIC_KEY` | from `.env.local` |
| `VAPID_PRIVATE_KEY` | from `.env.local` |
| `VAPID_SUBJECT` | your app URL, e.g. `https://exhale-nature-not-smoke.vercel.app` |
| `CRON_SECRET` | from `.env.local` |
| `SUPABASE_URL` | from step 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | from step 1 |

Then **Deployments → ⋯ → Redeploy** so the new variables take effect.

Check it: open `https://YOUR-APP.vercel.app/api/config`. It should say `"ready": true`.

### 3. GitHub secrets (the hourly trigger)
In your repo, go to **Settings → Secrets and variables → Actions → New repository secret** and add:
- `APP_URL`: your app URL (no trailing slash)
- `CRON_SECRET`: the same value as in Vercel

Test it: go to **Actions → Daily reminders → Run workflow**. The log should show something like `{"checked":1,"sent":0,...}`.

### 4. On your phone
1. Open Exhale **from the Home Screen icon**. On iPhone, notifications only work there (iOS 16.4 or later), not in a Safari tab.
2. Go to **Settings → Daily reminders**, pick your times, then tap **Turn on reminders** → **Allow**.
3. A test notification arrives within seconds.

## Troubleshooting
- **"Reminders are not set up on the server yet"**: the Vercel variables are missing, or you haven't redeployed since adding them.
- **Button is greyed out on iPhone**: you're in Safari. Open the Home Screen app instead.
- **"Notifications were not allowed"**: on iPhone go to Settings → Notifications → Exhale. On Android, open Chrome site settings.
- **Test works but daily ones don't arrive**: check the GitHub secrets, and look at **Actions → Daily reminders** logs.
- **Reminders stopped after a long break**: GitHub pauses scheduled workflows after 60 days with no repo activity. Re-enable it on the Actions tab.
- **Supabase project paused**: free projects pause after about a week of no use. The hourly job normally keeps it awake; if it's paused, click **Restore** in Supabase.

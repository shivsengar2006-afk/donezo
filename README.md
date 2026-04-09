# Donezo

A Gen-Z styled gamified productivity app built with Next.js, Clerk, Prisma, Postgres, and Resend.

## Features
- Auth with Clerk
- Task CRUD (create, edit, complete, delete)
- Subtasks with progress bar
- Due dates + multi-reminder ladder
- Reminder modes: Chill / Focus / Beast
- XP and level system
- Daily streak tracking
- Focus timer
- Analytics page
- Email reminders via cron

## Setup
1. Copy `.env.example` to `.env`
2. Install packages
3. Run Prisma migration
4. Start the app

```bash
npm install
npx prisma migrate dev --name init
npm run dev
```

## Cron reminder route
Call this route from a cron service every minute:

```bash
POST /api/reminders/send
```

Send a header `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret: <CRON_SECRET>`.

On Vercel, use a cron job or external scheduler.

## Vercel cron
Create `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/reminders/send",
      "schedule": "* * * * *"
    }
  ]
}
```

## Next upgrades you can add
- browser notifications
- voice task capture
- AI task breakdown route
- “graveyard” overdue page
- public shareable streak card
- premium unlockable themes

## Notes
- Streaks increment once per day on first completion.
- Reminder ladder supports multiple scheduled sends per task.
- The reminders endpoint is protected by `CRON_SECRET`.

<!-- redeploy ping -->

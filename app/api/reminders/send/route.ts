import { NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "@/lib/db";
import { getReminderMessage } from "@/lib/reminder-copy";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function assertCronAuth(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true;

  const header = req.headers.get("authorization") || "";
  const bearer = header.startsWith("Bearer ") ? header.replace("Bearer ", "") : null;
  const token = bearer || req.headers.get("x-cron-secret");

  return token === secret;
}

export async function POST(req: Request) {
  if (!assertCronAuth(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const dueReminders = await db.reminder.findMany({
    where: {
      sent: false,
      remindAt: { lte: new Date() },
    },
    include: {
      task: {
        include: {
          user: true,
        },
      },
    },
    take: 100,
  });

  for (const reminder of dueReminders) {
    const subject = `Donezo reminder: ${reminder.task.title}`;
    const body = getReminderMessage(reminder.task.reminderMode, reminder.task.title);

    if (resend) {
      try {
        await resend.emails.send({
          from: "Donezo <onboarding@resend.dev>",
          to: reminder.task.user.email,
          subject,
          html: `<div style=\"font-family:Manrope,system-ui\"><h2>${subject}</h2><p>${body}</p></div>`,
        });
      } catch (e) {
        console.error("Reminder email failed", e);
      }
    }

    await db.reminder.update({
      where: { id: reminder.id },
      data: { sent: true },
    });
  }

  return NextResponse.json({ sent: dueReminders.length });
}

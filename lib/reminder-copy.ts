import { ReminderMode } from "@prisma/client";

export function getReminderMessage(mode: ReminderMode, title: string) {
  switch (mode) {
    case "CHILL":
      return `hey, just a soft nudge for: ${title} ✨`;
    case "FOCUS":
      return `locked in yet? this task is waiting: ${title} ⚡`;
    case "BEAST":
      return `bro you said this matters 💀 go finish: ${title}`;
    default:
      return `Reminder: ${title}`;
  }
}

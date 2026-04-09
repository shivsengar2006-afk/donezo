import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentProfile } from "@/lib/auth";
import { getXpForPriority } from "@/lib/utils";

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  energyLevel: z.enum(["LOW", "MEDIUM", "DEEP"]).default("MEDIUM"),
  reminderMode: z.enum(["CHILL", "FOCUS", "BEAST"]).default("CHILL"),
  dueDate: z.string().optional().nullable(),
  tags: z.array(z.string()).optional().default([]),
  reminderOffsets: z.array(z.number().int()).optional().default([]),
});

export async function POST(req: Request) {
  try {
    const profile = await getCurrentProfile();
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const data = createTaskSchema.parse(body);

    const task = await db.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        energyLevel: data.energyLevel,
        reminderMode: data.reminderMode,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        tags: data.tags,
        points: getXpForPriority(data.priority),
        userId: profile.id,
      },
    });

    if (task.dueDate && data.reminderOffsets.length) {
      const uniqueOffsets = Array.from(new Set(data.reminderOffsets));
      const reminders = uniqueOffsets
        .map((offset, index) => ({
          remindAt: new Date(task.dueDate!.getTime() - offset * 60 * 1000),
          taskId: task.id,
          offsetMinutes: offset,
          sequence: index,
        }))
        .filter((reminder) => reminder.remindAt.getTime() > Date.now())
        .sort((a, b) => a.remindAt.getTime() - b.remindAt.getTime());

      if (reminders.length) {
        await db.reminder.createMany({ data: reminders });
      }
    }

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create task" }, { status: 400 });
  }
}

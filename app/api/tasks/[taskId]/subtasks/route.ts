import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentProfile } from "@/lib/auth";

const createSubtaskSchema = z.object({
  title: z.string().min(1),
});

export async function POST(req: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = createSubtaskSchema.parse(body);

  const task = await db.task.findFirst({ where: { id: taskId, userId: profile.id } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const subtask = await db.subtask.create({
    data: {
      title: data.title,
      taskId: task.id,
    },
  });

  return NextResponse.json(subtask, { status: 201 });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getCurrentProfile } from "@/lib/auth";

const createSubtaskSchema = z.object({
  title: z.string().min(1),
});

export async function POST(req: Request, { params }: { params: { taskId: string } }) {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data = createSubtaskSchema.parse(body);

  const task = await db.task.findFirst({ where: { id: params.taskId, userId: profile.id } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const subtask = await db.subtask.create({
    data: {
      title: data.title,
      taskId: task.id,
    },
  });

  return NextResponse.json(subtask, { status: 201 });
}

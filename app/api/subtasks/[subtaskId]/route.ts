import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentProfile } from "@/lib/auth";

export async function PATCH(_: Request, { params }: { params: Promise<{ subtaskId: string }> }) {
  const { subtaskId } = await params;
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subtask = await db.subtask.findFirst({
    where: { id: subtaskId, task: { userId: profile.id } },
  });

  if (!subtask) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.subtask.update({
    where: { id: subtask.id },
    data: { completed: !subtask.completed },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ subtaskId: string }> }) {
  const { subtaskId } = await params;
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subtask = await db.subtask.findFirst({
    where: { id: subtaskId, task: { userId: profile.id } },
  });

  if (!subtask) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await db.subtask.delete({ where: { id: subtask.id } });

  return NextResponse.json({ ok: true });
}

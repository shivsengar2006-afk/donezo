import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentProfile } from "@/lib/auth";
import { getLevelFromXp } from "@/lib/utils";
import { computeNextStreak } from "@/lib/streaks";

export async function PATCH(_: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const task = await db.task.findFirst({ where: { id: taskId, userId: profile.id } });
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const nextCompleted = !task.completed;

  await db.task.update({
    where: { id: task.id },
    data: {
      completed: nextCompleted,
      completedAt: nextCompleted ? new Date() : null,
    },
  });

  const xpChange = nextCompleted ? task.points : -task.points;
  const nextXp = Math.max(0, profile.xp + xpChange);
  const nextLevel = getLevelFromXp(nextXp);

  if (nextCompleted) {
    const { nextStreak, nextBestStreak, nextLastStreakDate } = computeNextStreak({
      currentStreak: profile.streak,
      bestStreak: profile.bestStreak,
      lastStreakDate: profile.lastStreakDate,
    });

    await db.userProfile.update({
      where: { id: profile.id },
      data: {
        xp: nextXp,
        level: nextLevel,
        streak: nextStreak,
        bestStreak: nextBestStreak,
        lastStreakDate: nextLastStreakDate,
      },
    });

    return NextResponse.json({ ok: true });
  }

  await db.userProfile.update({
    where: { id: profile.id },
    data: {
      xp: nextXp,
      level: nextLevel,
    },
  });

  return NextResponse.json({ ok: true });
}

import { startOfDay, endOfDay } from "date-fns";
import { DashboardShell } from "@/components/dashboard-shell";
import { TaskCard } from "@/components/task-card";
import { db } from "@/lib/db";
import { getCurrentProfile } from "@/lib/auth";

export default async function TodayPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const start = startOfDay(new Date());
  const end = endOfDay(new Date());

  const tasks = await db.task.findMany({
    where: {
      userId: profile.id,
      completed: false,
      OR: [
        { dueDate: { gte: start, lte: end } },
        { dueDate: { lt: start } },
      ],
    },
    include: { subtasks: true, reminders: true },
    orderBy: [{ dueDate: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
  });

  return (
    <DashboardShell>
      <div className="glass rounded-[28px] p-6">
        <h1 className="text-3xl font-black">Today’s grind ⚡</h1>
        <p className="mt-2 text-white/65">Knock out your top tasks before the day owns you.</p>
      </div>
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="glass rounded-[28px] p-8 text-center text-white/60">You are clear for today. Add something or just breathe.</div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        )}
      </div>
    </DashboardShell>
  );
}

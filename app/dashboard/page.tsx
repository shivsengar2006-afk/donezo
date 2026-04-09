import { db } from "@/lib/db";
import { getCurrentProfile } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard-shell";
import { TaskForm } from "@/components/task-form";
import { TaskCard } from "@/components/task-card";
import { StatsCards } from "@/components/stats-cards";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const tasks = await db.task.findMany({
    where: { userId: profile.id },
    include: { subtasks: true, reminders: true },
    orderBy: [{ completed: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
  });

  return (
    <DashboardShell>
      <StatsCards xp={profile.xp} level={profile.level} streak={profile.streak} total={tasks.filter((t) => !t.completed).length} />
      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <TaskForm />
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <div className="glass rounded-[28px] p-8 text-center text-white/60">No tasks yet. Create one and start the streak.</div>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

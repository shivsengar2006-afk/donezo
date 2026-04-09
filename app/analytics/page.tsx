import { DashboardShell } from "@/components/dashboard-shell";
import { db } from "@/lib/db";
import { getCurrentProfile } from "@/lib/auth";

export default async function AnalyticsPage() {
  const profile = await getCurrentProfile();
  if (!profile) return null;

  const tasks = await db.task.findMany({ where: { userId: profile.id } });
  const completed = tasks.filter((t) => t.completed).length;
  const pending = tasks.filter((t) => !t.completed).length;
  const overdue = tasks.filter((t) => !t.completed && t.dueDate && new Date(t.dueDate).getTime() < Date.now()).length;

  return (
    <DashboardShell>
      <div className="glass rounded-[28px] p-6">
        <h1 className="text-3xl font-black">Analytics</h1>
        <p className="mt-2 text-white/65">Your momentum, visualized.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Completed", completed],
          ["Pending", pending],
          ["Overdue", overdue],
        ].map(([label, value]) => (
          <div key={label as string} className="glass rounded-[28px] p-6">
            <p className="text-white/55">{label as string}</p>
            <p className="mt-2 text-4xl font-black">{value as number}</p>
          </div>
        ))}
      </div>
      <div className="glass rounded-[28px] p-6">
        <p className="text-white/55">Streak</p>
        <p className="mt-2 text-4xl font-black">{profile.streak} days</p>
        <p className="mt-1 text-white/40">Best streak: {profile.bestStreak} days</p>
      </div>
    </DashboardShell>
  );
}

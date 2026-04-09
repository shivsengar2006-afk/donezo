import { BellRing } from "lucide-react";

export function NotificationCenter({ overdue }: { overdue: number }) {
  return (
    <div className="glass rounded-[28px] p-5">
      <div className="mb-3 inline-flex rounded-2xl bg-white/10 p-3">
        <BellRing className="h-5 w-5" />
      </div>
      <p className="text-white/55">Pulse alerts</p>
      <p className="mt-1 text-lg font-semibold">
        {overdue === 0 ? "No overdue tasks" : `${overdue} overdue tasks`}
      </p>
      <p className="mt-2 text-sm text-white/45">Keep your streak alive with a quick win.</p>
    </div>
  );
}

import { Flame } from "lucide-react";

export function StreakCard({ streak, best }: { streak: number; best: number }) {
  return (
    <div className="glass rounded-[28px] p-5">
      <div className="mb-3 inline-flex rounded-2xl bg-rose-500/15 p-3 text-rose-200">
        <Flame className="h-5 w-5" />
      </div>
      <p className="text-white/55">Streak</p>
      <p className="mt-1 text-3xl font-black">{streak} days</p>
      <p className="mt-2 text-sm text-white/45">Best: {best} days</p>
    </div>
  );
}

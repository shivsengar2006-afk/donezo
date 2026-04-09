import { Flame, Trophy, Zap, Clock3 } from "lucide-react";

export function StatsCards({
  xp,
  level,
  streak,
  total,
}: {
  xp: number;
  level: number;
  streak: number;
  total: number;
}) {
  const cards = [
    { label: "XP", value: xp, icon: Zap },
    { label: "Level", value: level, icon: Trophy },
    { label: "Streak", value: streak, icon: Flame },
    { label: "Open tasks", value: total, icon: Clock3 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="glass rounded-[28px] p-5">
            <div className="mb-3 inline-flex rounded-2xl bg-white/10 p-3"><Icon className="h-5 w-5" /></div>
            <p className="text-white/55">{card.label}</p>
            <p className="mt-1 text-3xl font-black">{card.value}</p>
          </div>
        );
      })}
    </div>
  );
}

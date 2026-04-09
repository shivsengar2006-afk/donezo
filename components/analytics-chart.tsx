import { Priority } from "@prisma/client";

export function AnalyticsChart({
  totals,
}: {
  totals: Record<Priority, number>;
}) {
  const max = Math.max(1, ...Object.values(totals));
  const bars: { label: string; value: number; color: string }[] = [
    { label: "Low", value: totals.LOW, color: "from-emerald-400 to-emerald-200" },
    { label: "Medium", value: totals.MEDIUM, color: "from-cyan-400 to-cyan-200" },
    { label: "High", value: totals.HIGH, color: "from-fuchsia-400 to-fuchsia-200" },
    { label: "Critical", value: totals.CRITICAL, color: "from-rose-500 to-rose-300" },
  ];

  return (
    <div className="glass rounded-[28px] p-6">
      <h3 className="text-lg font-semibold">Priority mix</h3>
      <div className="mt-4 space-y-3">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex items-center justify-between text-xs text-white/55">
              <span>{bar.label}</span>
              <span>{bar.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${bar.color}`}
                style={{ width: `${Math.round((bar.value / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Link from "next/link";
import { Timer } from "lucide-react";

export function FocusCard() {
  return (
    <div className="glass rounded-[28px] p-5">
      <div className="mb-3 inline-flex rounded-2xl bg-white/10 p-3">
        <Timer className="h-5 w-5" />
      </div>
      <p className="text-white/55">Focus boost</p>
      <p className="mt-1 text-lg font-semibold">Start a 25‑min sprint</p>
      <Link href="/focus" className="mt-3 inline-flex rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black">
        Start Focus
      </Link>
    </div>
  );
}

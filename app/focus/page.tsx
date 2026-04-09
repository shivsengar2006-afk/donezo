"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard-shell";
import { toast } from "sonner";

export default function FocusPage() {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setSecondsLeft(minutes * 60);
  }, [minutes]);

  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setRunning(false);
          toast.success("Focus session completed. You cooked 🔥");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [running]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <DashboardShell>
      <div className="glass rounded-[32px] p-8 text-center">
        <p className="text-white/60">Focus mode</p>
        <h1 className="mt-2 text-6xl font-black tracking-tight">{mm}:{ss}</h1>
        <div className="mt-6 flex justify-center gap-3">
          {[15, 25, 45, 60].map((m) => (
            <button key={m} onClick={() => setMinutes(m)} className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/80">
              {m}m
            </button>
          ))}
        </div>
        <div className="mt-8 flex justify-center gap-3">
          <button onClick={() => setRunning((v) => !v)} className="rounded-full bg-white px-6 py-3 font-semibold text-black">
            {running ? "Pause" : "Start Focus"}
          </button>
          <button onClick={() => { setRunning(false); setSecondsLeft(minutes * 60); }} className="rounded-full border border-white/10 px-6 py-3">
            Reset
          </button>
        </div>
      </div>
    </DashboardShell>
  );
}

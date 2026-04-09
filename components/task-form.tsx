"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const reminderOptions = [
  { label: "On time", minutes: 0 },
  { label: "1 hour before", minutes: 60 },
  { label: "1 day before", minutes: 1440 },
];

export function TaskForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [energyLevel, setEnergyLevel] = useState("MEDIUM");
  const [reminderMode, setReminderMode] = useState("CHILL");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState("");
  const [reminderOffsets, setReminderOffsets] = useState<number[]>([0]);

  function toggleOffset(minutes: number) {
    setReminderOffsets((prev) =>
      prev.includes(minutes) ? prev.filter((m) => m !== minutes) : [...prev, minutes]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    setLoading(true);

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        priority,
        energyLevel,
        reminderMode,
        dueDate: dueDate || null,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        reminderOffsets: dueDate ? reminderOffsets : [],
      }),
    });

    setLoading(false);
    if (!res.ok) return toast.error("Could not create task");
    setTitle("");
    setDescription("");
    setDueDate("");
    setTags("");
    setReminderOffsets([0]);
    toast.success("Task created. Let’s move 😈");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass rounded-[28px] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Create task</h2>
        <p className="text-sm text-white/55">Build momentum, not clutter.</p>
      </div>
      <div className="grid gap-3">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Finish UI polish" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional details..." className="min-h-28 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" />
        <div className="grid gap-3 md:grid-cols-3">
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="rounded-2xl border border-white/10 bg-[#12121a] px-4 py-3">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          <select value={energyLevel} onChange={(e) => setEnergyLevel(e.target.value)} className="rounded-2xl border border-white/10 bg-[#12121a] px-4 py-3">
            <option value="LOW">Low Energy</option>
            <option value="MEDIUM">Medium Energy</option>
            <option value="DEEP">Deep Work</option>
          </select>
          <select value={reminderMode} onChange={(e) => setReminderMode(e.target.value)} className="rounded-2xl border border-white/10 bg-[#12121a] px-4 py-3">
            <option value="CHILL">Chill</option>
            <option value="FOCUS">Focus</option>
            <option value="BEAST">Beast</option>
          </select>
        </div>
        <input type="datetime-local" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" />
        <div className="grid gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Multi-reminders</p>
          <div className="flex flex-wrap gap-2">
            {reminderOptions.map((option) => (
              <button
                key={option.minutes}
                type="button"
                onClick={() => toggleOffset(option.minutes)}
                disabled={!dueDate}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  reminderOffsets.includes(option.minutes)
                    ? "border-fuchsia-400/50 bg-fuchsia-500/15 text-fuchsia-100"
                    : "border-white/10 text-white/60"
                } ${!dueDate ? "cursor-not-allowed opacity-40" : "hover:border-white/40"}`}
              >
                {option.label}
              </button>
            ))}
          </div>
          {!dueDate ? <p className="text-xs text-white/40">Set a due date to enable reminders.</p> : null}
        </div>
        <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="study, launch, urgent" className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" />
        <button disabled={loading} className="rounded-2xl bg-white px-4 py-3 font-semibold text-black disabled:opacity-60">
          {loading ? "Creating..." : "Create task"}
        </button>
      </div>
    </form>
  );
}

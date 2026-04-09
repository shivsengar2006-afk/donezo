"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";

const reminderOptions = [
  { label: "On time", minutes: 0 },
  { label: "1 hour before", minutes: 60 },
  { label: "1 day before", minutes: 1440 },
];

type TaskData = {
  id: string;
  title: string;
  description: string | null;
  priority: string;
  energyLevel: string;
  reminderMode: string;
  dueDate: string | Date | null;
  tags: string[];
  reminders: { remindAt: string | Date }[];
};

export function TaskEditModal({
  open,
  onOpenChange,
  task,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: TaskData;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [energyLevel, setEnergyLevel] = useState(task.energyLevel);
  const [reminderMode, setReminderMode] = useState(task.reminderMode);
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "");
  const [tags, setTags] = useState(task.tags.join(", "));

  const initialOffsets = useMemo(() => {
    if (!task.dueDate) return [0];
    const base = new Date(task.dueDate).getTime();
    const offsets = task.reminders
      .map((r) => Math.round((base - new Date(r.remindAt).getTime()) / 60000))
      .filter((minutes) => reminderOptions.some((o) => o.minutes === minutes));
    return offsets.length ? Array.from(new Set(offsets)) : [0];
  }, [task.dueDate, task.reminders]);

  const [reminderOffsets, setReminderOffsets] = useState<number[]>(initialOffsets);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority);
    setEnergyLevel(task.energyLevel);
    setReminderMode(task.reminderMode);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "");
    setTags(task.tags.join(", "));
    setReminderOffsets(initialOffsets);
  }, [task, initialOffsets]);

  function toggleOffset(minutes: number) {
    setReminderOffsets((prev) =>
      prev.includes(minutes) ? prev.filter((m) => m !== minutes) : [...prev, minutes]
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    setLoading(true);

    const res = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
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
    if (!res.ok) return toast.error("Could not update task");
    toast.success("Task updated");
    onOpenChange(false);
    router.refresh();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="glass glow w-full max-w-2xl rounded-[32px] p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-black">Edit task</h2>
          <button onClick={() => onOpenChange(false)} className="rounded-full border border-white/10 p-2 text-white/70 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSave} className="grid gap-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-28 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" />
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
          <input value={tags} onChange={(e) => setTags(e.target.value)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 outline-none" />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => onOpenChange(false)} className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/80">Cancel</button>
            <button disabled={loading} className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60">
              {loading ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

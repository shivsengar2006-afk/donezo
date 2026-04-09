"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Trash2 } from "lucide-react";
import { toast } from "sonner";

type Subtask = {
  id: string;
  title: string;
  completed: boolean;
};

export function SubtaskList({
  taskId,
  subtasks,
  onRefresh,
}: {
  taskId: string;
  subtasks: Subtask[];
  onRefresh?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  async function addSubtask(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/tasks/${taskId}/subtasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    setLoading(false);
    if (!res.ok) return toast.error("Could not add subtask");
    setTitle("");
    onRefresh?.();
  }

  async function toggleSubtask(id: string) {
    const res = await fetch(`/api/subtasks/${id}`, { method: "PATCH" });
    if (!res.ok) return toast.error("Could not update subtask");
    onRefresh?.();
  }

  async function deleteSubtask(id: string) {
    const res = await fetch(`/api/subtasks/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Could not delete subtask");
    onRefresh?.();
  }

  return (
    <div className="mt-4 space-y-3">
      <div className="text-xs uppercase tracking-[0.2em] text-white/40">Subtasks</div>
      <div className="space-y-2">
        {subtasks.length === 0 ? (
          <p className="text-sm text-white/50">No subtasks yet.</p>
        ) : (
          subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <button onClick={() => toggleSubtask(subtask.id)} className="flex items-center gap-2 text-sm text-white/80">
                {subtask.completed ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Circle className="h-4 w-4 text-white/40" />}
                <span className={subtask.completed ? "line-through text-white/40" : ""}>{subtask.title}</span>
              </button>
              <button onClick={() => deleteSubtask(subtask.id)} className="rounded-full p-1 text-white/50 transition hover:text-white">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
      <form onSubmit={addSubtask} className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a tiny step"
          className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none"
        />
        <button disabled={loading} className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-60">
          {loading ? "Adding" : "Add"}
        </button>
      </form>
    </div>
  );
}

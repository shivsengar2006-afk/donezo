"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { CheckCircle2, Clock3, Trash2, Zap, Pencil, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { isTaskOverdue } from "@/lib/utils";
import { SubtaskList } from "@/components/subtask-list";
import { TaskEditModal } from "@/components/task-modal";

type TaskCardProps = {
  task: {
    id: string;
    title: string;
    description: string | null;
    completed: boolean;
    priority: string;
    dueDate: string | Date | null;
    reminderMode: string;
    points: number;
    energyLevel: string;
    tags: string[];
    reminders: { remindAt: string | Date }[];
    subtasks: { id: string; title: string; completed: boolean }[];
  };
};

export function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const progress = task.subtasks.length
    ? Math.round((completedSubtasks / task.subtasks.length) * 100)
    : task.completed
      ? 100
      : 0;

  const overdue = isTaskOverdue(task.dueDate, task.completed);

  async function completeTask() {
    const res = await fetch(`/api/tasks/${task.id}/complete`, { method: "PATCH" });
    if (!res.ok) return toast.error("Could not update task");
    toast.success(task.completed ? "Task reopened" : `Task done. +${task.points} XP`);
    router.refresh();
  }

  async function deleteTask() {
    const res = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Could not delete task");
    toast.success("Task deleted");
    router.refresh();
  }

  return (
    <>
      <motion.div layout className="glass rounded-[28px] p-5 transition hover:bg-white/[0.07]">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-fuchsia-500/15 px-3 py-1 text-xs font-semibold text-fuchsia-200">{task.priority}</span>
              <span className="rounded-full bg-slate-500/20 px-3 py-1 text-xs font-semibold text-slate-200">{task.energyLevel}</span>
              <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-semibold text-cyan-200">{task.reminderMode}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                <Zap className="h-3.5 w-3.5" /> +{task.points} XP
              </span>
              {overdue ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold text-rose-200">
                  <AlertTriangle className="h-3.5 w-3.5" /> Overdue
                </span>
              ) : null}
            </div>
            <h3 className="text-xl font-bold">{task.title}</h3>
            {task.description ? <p className="max-w-xl text-white/65">{task.description}</p> : null}
            {task.tags.length ? (
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-white/10 px-2 py-1 text-xs text-white/60">
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}
            {task.dueDate ? (
              <p className="inline-flex items-center gap-2 text-sm text-white/60">
                <Clock3 className="h-4 w-4" /> Due {format(new Date(task.dueDate), "PPP p")}
              </p>
            ) : null}
            <div className="mt-2">
              <div className="mb-1 flex items-center justify-between text-xs text-white/55">
                <span>Subtask progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-400" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <SubtaskList taskId={task.id} subtasks={task.subtasks} onRefresh={() => router.refresh()} />
          </div>
          <div className="flex gap-2">
            <button onClick={completeTask} className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> {task.completed ? "Undo" : "Complete"}
              </span>
            </button>
            <button onClick={() => setEditing(true)} className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/85">
              <span className="inline-flex items-center gap-2">
                <Pencil className="h-4 w-4" /> Edit
              </span>
            </button>
            <button onClick={deleteTask} className="rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/85">
              <span className="inline-flex items-center gap-2">
                <Trash2 className="h-4 w-4" /> Delete
              </span>
            </button>
          </div>
        </div>
      </motion.div>
      <TaskEditModal open={editing} onOpenChange={setEditing} task={task} />
    </>
  );
}

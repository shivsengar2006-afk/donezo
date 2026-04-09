import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLevelFromXp(xp: number) {
  return Math.floor(xp / 100) + 1;
}

export function getXpForPriority(priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL") {
  switch (priority) {
    case "LOW":
      return 10;
    case "MEDIUM":
      return 20;
    case "HIGH":
      return 35;
    case "CRITICAL":
      return 50;
    default:
      return 10;
  }
}

export function isTaskOverdue(dueDate?: string | Date | null, completed?: boolean) {
  if (!dueDate || completed) return false;
  return new Date(dueDate).getTime() < Date.now();
}

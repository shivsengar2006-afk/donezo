import { differenceInCalendarDays, startOfDay } from "date-fns";

export function computeNextStreak({
  currentStreak,
  bestStreak,
  lastStreakDate,
  now = new Date(),
}: {
  currentStreak: number;
  bestStreak: number;
  lastStreakDate: Date | null;
  now?: Date;
}) {
  const today = startOfDay(now);
  const last = lastStreakDate ? startOfDay(lastStreakDate) : null;

  let nextStreak = currentStreak;
  if (!last) {
    nextStreak = 1;
  } else {
    const diff = differenceInCalendarDays(today, last);
    if (diff >= 2) nextStreak = 1;
    if (diff === 1) nextStreak = currentStreak + 1;
  }

  return {
    nextStreak,
    nextBestStreak: Math.max(bestStreak, nextStreak),
    nextLastStreakDate: today,
  };
}

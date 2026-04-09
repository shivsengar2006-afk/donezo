"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Sparkles, Flame, TimerReset, BellRing, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <div className="text-2xl font-black tracking-tight">Donezo</div>
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/90 transition hover:border-white/30 hover:text-white">Sign in</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black">Open app</Link>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      <section className="mx-auto mt-20 max-w-6xl">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass glow rounded-[32px] p-8 md:p-14"
        >
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-4 py-1 text-sm text-fuchsia-200">
            <Sparkles className="h-4 w-4" /> Gamified productivity for real people
          </p>
          <h1 className="max-w-3xl font-display text-5xl font-black leading-tight md:text-7xl">
            Your todo app should feel like <span className="text-gradient">momentum</span>, not homework.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            Tasks, streaks, focus sessions, reminder modes, and a vibe people actually want to open every day.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:translate-y-[-1px]">
                  Start free
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="rounded-full bg-white px-6 py-3 font-semibold text-black">Go to dashboard</Link>
            </SignedIn>
            <Link href="#vibe" className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-white/80 transition hover:border-white/40 hover:text-white">
              See the vibe <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
          id="vibe"
          className="mt-8 grid gap-4 md:grid-cols-3"
        >
          {[
            [Flame, "Streak energy", "Build momentum with daily wins and best streak tracking."],
            [TimerReset, "Focus mode", "One tap to start a clean session and lock into deep work."],
            [BellRing, "Reminder ladder", "Chill, Focus, or Beast reminder styles for every task."],
          ].map(([Icon, title, desc]) => (
            <div key={title as string} className="glass rounded-3xl p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]">
              <div className="mb-4 inline-flex rounded-2xl bg-white/10 p-3">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold">{title as string}</h3>
              <p className="mt-2 text-white/65">{desc as string}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}

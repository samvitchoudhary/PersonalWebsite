"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { KitchenBridgeRevealOverlay } from "@/components/kitchen/KitchenBridgeRevealOverlay";

const BG = "#0A0806";
const CREAM = "#F5E6C8";
const GOLD = "#D4A03C";
const MUTED = "#B8A888";

const SECTION_COUNT = 12;

const easeOut = { duration: 0.8, ease: "easeOut" as const };
const easeSnap = { duration: 0.75, ease: [0.42, 0, 0.58, 1] as const };

const fadeXLeft = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: easeOut },
};
const fadeXRight = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: { ...easeOut, delay: 0.12 } },
};
const fadeYUp = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: easeOut },
};
const fadeYUpDelay = {
  hidden: { opacity: 0, y: 48 },
  show: { opacity: 1, y: 0, transition: { ...easeOut, delay: 0.15 } },
};
const fadeTextBlock = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { ...easeOut, delay: 0.2 } },
};
const scalePhoto = {
  hidden: { scale: 1.05 },
  show: {
    scale: 1,
    transition: { duration: 0.9, ease: "easeOut" as const },
  },
};

function BackButton() {
  return (
    <motion.div
      className="fixed left-4 top-4 z-50 md:left-6 md:top-6"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.5, ease: "easeOut" }}
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm backdrop-blur-md transition-opacity hover:opacity-90"
        style={{
          backgroundColor: "rgba(26, 21, 16, 0.85)",
          borderColor: "rgba(212, 160, 60, 0.25)",
          color: CREAM,
        }}
      >
        <span aria-hidden className="text-lg leading-none">
          ←
        </span>
        Back to Kitchen
      </Link>
    </motion.div>
  );
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke={CREAM}
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronUp({ className }: { className?: string }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke={CREAM}
      strokeWidth="1.5"
      className={className}
      aria-hidden
    >
      <path d="M18 15l-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AboutScrollPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((targetIndex: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const h = el.clientHeight;
    if (h === 0) return;
    const clamped = Math.max(0, Math.min(SECTION_COUNT - 1, targetIndex));
    el.scrollTo({ top: clamped * h, behavior: "smooth" });
  }, []);

  const syncIndexFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const h = el.clientHeight;
    if (h === 0) return;
    const idx = Math.round(el.scrollTop / h);
    setActiveIndex(Math.min(SECTION_COUNT - 1, Math.max(0, idx)));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => syncIndexFromScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    syncIndexFromScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [syncIndexFromScroll]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const prevent = (e: WheelEvent) => e.preventDefault();
    el.addEventListener("wheel", prevent, { passive: false });
    return () => el.removeEventListener("wheel", prevent);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (
        t instanceof HTMLInputElement ||
        t instanceof HTMLTextAreaElement ||
        (t instanceof HTMLElement && t.isContentEditable)
      ) {
        return;
      }
      const el = scrollRef.current;
      if (!el) return;
      const h = el.clientHeight;
      if (h === 0) return;
      const current = Math.round(el.scrollTop / h);
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        scrollToIndex(current + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollToIndex(current - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollToIndex]);

  const isLast = activeIndex === SECTION_COUNT - 1;
  const isFirst = activeIndex === 0;

  return (
    <>
      <KitchenBridgeRevealOverlay />
      <main
        className="fixed inset-0 flex flex-col overflow-hidden"
        style={{ backgroundColor: BG, color: CREAM }}
      >
        <BackButton />

        {!isFirst && (
          <div className="pointer-events-none fixed inset-x-0 top-6 z-40 flex justify-center md:top-7">
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex - 1)}
              className="pointer-events-auto flex items-center justify-center rounded-full p-2 opacity-90 transition-opacity hover:opacity-100"
              style={{ color: CREAM }}
              aria-label="Previous section"
            >
              <motion.span
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronUp />
              </motion.span>
            </button>
          </div>
        )}

        <div
          ref={scrollRef}
          className="about-snap-container min-h-0 flex-1 overflow-y-auto overscroll-none"
          style={{
            scrollSnapType: "y mandatory",
            scrollBehavior: "smooth",
          }}
        >
          {/* 0 — Hero */}
          <section className="flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 pt-16">
            <motion.div
              className="flex max-w-3xl flex-col items-center text-center"
              initial={false}
              animate={activeIndex === 0 ? "show" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut" as const },
                },
              }}
            >
              <motion.h1
                className="font-light tracking-tight"
                style={{
                  fontFamily: "var(--font-crimson-pro), serif",
                  fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
                  color: CREAM,
                }}
                initial={false}
                animate={activeIndex === 0 ? "show" : "hidden"}
                variants={{
                  hidden: { opacity: 0, y: 28 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 1, ease: "easeOut" },
                  },
                }}
              >
                Hey, I&apos;m Samvit
              </motion.h1>
              <motion.p
                className="mt-6 max-w-[600px] text-lg leading-relaxed"
                style={{ color: MUTED }}
                initial={false}
                animate={activeIndex === 0 ? "show" : "hidden"}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, delay: 0.15, ease: "easeOut" },
                  },
                }}
              >
                A quick intro about who I am, what drives me, and what you&apos;ll
                find here.
              </motion.p>
            </motion.div>
          </section>

          {/* 1 — Cooking */}
          <section className="flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always items-center overflow-hidden px-6 py-8 md:py-12">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-center md:gap-16">
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === 1 ? "show" : "hidden"}
                variants={fadeXLeft}
              >
                <motion.div
                  initial={false}
                  animate={activeIndex === 1 ? "show" : "hidden"}
                  variants={scalePhoto}
                >
                  <PhotoPlaceholder
                    tone="#2C1810"
                    className="aspect-[4/5] w-full md:min-h-[320px]"
                  />
                </motion.div>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === 1 ? "show" : "hidden"}
                variants={fadeXRight}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: GOLD }}
                >
                  From Mom&apos;s Kitchen
                </p>
                <h2
                  className="mt-3 font-semibold"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontSize: "36px",
                    color: CREAM,
                  }}
                >
                  Cooking
                </h2>
                <p className="mt-5 leading-relaxed" style={{ color: MUTED }}>
                  I learned to cook from my mom—and I try to make at least one meal
                  every day. It&apos;s part discipline, part comfort, and part
                  creative practice: a way to slow down and take care of myself and
                  the people around me.
                </p>
              </motion.div>
            </div>
          </section>

          {/* 2 — Tennis */}
          <TennisSection activeIndex={activeIndex} />

          {/* 3 — Eagle Scout */}
          <section className="flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always items-center overflow-hidden px-6 py-8 md:py-12">
            <div className="mx-auto flex w-full max-w-6xl flex-col-reverse gap-8 md:flex-row md:items-center md:gap-16">
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === 3 ? "show" : "hidden"}
                variants={fadeXLeft}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: GOLD }}
                >
                  Trail to Eagle
                </p>
                <h2
                  className="mt-3 font-semibold"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontSize: "40px",
                    color: CREAM,
                  }}
                >
                  Eagle Scout
                </h2>
                <p className="mt-5 leading-relaxed" style={{ color: MUTED }}>
                  I served as Senior Patrol Leader and completed an Eagle project
                  building community garden plots. Scouting taught me how to lead
                  with patience, plan real projects, and show up for my community.
                </p>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === 3 ? "show" : "hidden"}
                variants={fadeXRight}
              >
                <motion.div
                  initial={false}
                  animate={activeIndex === 3 ? "show" : "hidden"}
                  variants={scalePhoto}
                >
                  <PhotoPlaceholder
                    tone="#1A2A1A"
                    className="aspect-[4/5] w-full md:min-h-[320px]"
                  />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* 4 — India */}
          <section className="flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always flex-col justify-center overflow-hidden px-6 py-8 md:py-12">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-5 md:gap-8">
                <motion.div
                  className="md:col-span-3"
                  initial={false}
                  animate={activeIndex === 4 ? "show" : "hidden"}
                  variants={fadeYUp}
                >
                  <motion.div
                    initial={false}
                    animate={activeIndex === 4 ? "show" : "hidden"}
                    variants={scalePhoto}
                  >
                    <PhotoPlaceholder tone="#1A2030" className="aspect-[4/3] w-full" />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="md:col-span-2"
                  initial={false}
                  animate={activeIndex === 4 ? "show" : "hidden"}
                  variants={fadeYUpDelay}
                >
                  <motion.div
                    initial={false}
                    animate={activeIndex === 4 ? "show" : "hidden"}
                    variants={scalePhoto}
                  >
                    <PhotoPlaceholder tone="#2A1A10" className="aspect-[4/3] w-full" />
                  </motion.div>
                </motion.div>
              </div>
              <motion.div
                className="mx-auto mt-8 max-w-2xl text-center md:mt-10"
                initial={false}
                animate={activeIndex === 4 ? "show" : "hidden"}
                variants={fadeTextBlock}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: GOLD }}
                >
                  Every August
                </p>
                <h2
                  className="mt-3 font-semibold"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontSize: "40px",
                    color: CREAM,
                  }}
                >
                  India
                </h2>
                <p className="mt-5 leading-relaxed" style={{ color: MUTED }}>
                  Every summer I spend about a month in India with family. It
                  keeps me connected to where my parents came from—language, food,
                  and cousins who feel like home even across an ocean.
                </p>
              </motion.div>
            </div>
          </section>

          {/* 5 — Tottenham */}
          <section className="flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always items-center overflow-hidden px-6 py-8 md:py-12">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-center md:gap-16">
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === 5 ? "show" : "hidden"}
                variants={fadeXLeft}
              >
                <motion.div
                  initial={false}
                  animate={activeIndex === 5 ? "show" : "hidden"}
                  variants={scalePhoto}
                >
                  <PhotoPlaceholder tone="#2C1810" className="aspect-video w-full" />
                </motion.div>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === 5 ? "show" : "hidden"}
                variants={fadeXRight}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: GOLD }}
                >
                  COYS
                </p>
                <h2
                  className="mt-3 font-semibold"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontSize: "36px",
                    color: CREAM,
                  }}
                >
                  Tottenham Hotspur
                </h2>
                <p className="mt-5 leading-relaxed" style={{ color: MUTED }}>
                  I watch Spurs every weekend I can. Someday I want to travel to
                  London and hear the crowd at the stadium in person—until then,
                  it&apos;s early mornings and a lot of coffee.
                </p>
              </motion.div>
            </div>
          </section>

          {/* 6 — Movies */}
          <section className="flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always flex-col justify-center overflow-hidden px-6 py-8 md:py-12">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <motion.div
                  initial={false}
                  animate={activeIndex === 6 ? "show" : "hidden"}
                  variants={fadeYUp}
                >
                  <motion.div
                    initial={false}
                    animate={activeIndex === 6 ? "show" : "hidden"}
                    variants={scalePhoto}
                  >
                    <PhotoPlaceholder tone="#252018" className="aspect-[4/3] w-full" />
                  </motion.div>
                </motion.div>
                <motion.div
                  initial={false}
                  animate={activeIndex === 6 ? "show" : "hidden"}
                  variants={fadeYUpDelay}
                >
                  <motion.div
                    initial={false}
                    animate={activeIndex === 6 ? "show" : "hidden"}
                    variants={scalePhoto}
                  >
                    <PhotoPlaceholder tone="#1E2430" className="aspect-[4/3] w-full" />
                  </motion.div>
                </motion.div>
              </div>
              <motion.div
                className="mx-auto mt-8 max-w-2xl text-center md:mt-10"
                initial={false}
                animate={activeIndex === 6 ? "show" : "hidden"}
                variants={fadeTextBlock}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: GOLD }}
                >
                  Lights, Camera, Action
                </p>
                <h2
                  className="mt-3 font-semibold"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontSize: "40px",
                    color: CREAM,
                  }}
                >
                  Movies
                </h2>
                <p className="mt-5 leading-relaxed" style={{ color: MUTED }}>
                  I love going to the theater—the big screen, the sound, the
                  shared silence when the lights go down. I gravitate toward
                  thoughtful dramas and sharp comedies, and I&apos;m always chasing
                  stories that surprise me. Film reminds me how much creativity
                  lives in pacing, image, and a single line delivered at the right
                  moment.
                </p>
              </motion.div>
            </div>
          </section>

          {/* 7 — UMD */}
          <UmdSection activeIndex={activeIndex} />

          {/* 8 — Journaling */}
          <section className="flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always items-center overflow-hidden px-6 py-8 md:py-12">
            <div className="mx-auto flex w-full max-w-6xl flex-col-reverse gap-8 md:flex-row md:items-center md:gap-16">
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === 8 ? "show" : "hidden"}
                variants={fadeXLeft}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: GOLD }}
                >
                  Daily Practice
                </p>
                <h2
                  className="mt-3 font-semibold"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontSize: "36px",
                    color: CREAM,
                  }}
                >
                  Journaling
                </h2>
                <p className="mt-5 leading-relaxed" style={{ color: MUTED }}>
                  Journaling is one of the most meaningful habits I keep—a place to
                  think clearly, remember small moments, and check in with myself.
                </p>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === 8 ? "show" : "hidden"}
                variants={fadeXRight}
              >
                <motion.div
                  initial={false}
                  animate={activeIndex === 8 ? "show" : "hidden"}
                  variants={scalePhoto}
                >
                  <PhotoPlaceholder tone="#1A2030" className="aspect-[4/5] w-full" />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* 9 — Foodie */}
          <section className="flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always flex-col justify-center overflow-hidden px-6 py-8 md:py-12">
            <div className="mx-auto max-w-6xl">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    initial={false}
                    animate={activeIndex === 9 ? "show" : "hidden"}
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { ...easeOut, delay: i * 0.12 },
                      },
                    }}
                  >
                    <motion.div
                      initial={false}
                      animate={activeIndex === 9 ? "show" : "hidden"}
                      variants={scalePhoto}
                    >
                      <PhotoPlaceholder
                        tone={
                          i === 0 ? "#2A1A10" : i === 1 ? "#1A2A1A" : "#2C1810"
                        }
                        className="aspect-square w-full"
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="mx-auto mt-8 max-w-2xl text-center md:mt-10"
                initial={false}
                animate={activeIndex === 9 ? "show" : "hidden"}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { ...easeOut, delay: 0.35 },
                  },
                }}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: GOLD }}
                >
                  Beyond the Kitchen
                </p>
                <h2
                  className="mt-3 font-semibold"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontSize: "36px",
                    color: CREAM,
                  }}
                >
                  Foodie
                </h2>
                <p className="mt-5 leading-relaxed" style={{ color: MUTED }}>
                  I love exploring new restaurants, cuisines, and the stories
                  behind food—travel on a plate, shared with friends whenever I can.
                </p>
              </motion.div>
            </div>
          </section>

          {/* 10 — Friends */}
          <section className="flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always items-center overflow-hidden px-6 py-8 md:py-12">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-center md:gap-16">
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === 10 ? "show" : "hidden"}
                variants={fadeXLeft}
              >
                <motion.div
                  initial={false}
                  animate={activeIndex === 10 ? "show" : "hidden"}
                  variants={scalePhoto}
                >
                  <PhotoPlaceholder
                    tone="#1A1510"
                    className="min-h-[280px] w-full md:min-h-[380px]"
                  />
                </motion.div>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === 10 ? "show" : "hidden"}
                variants={fadeXRight}
              >
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em]"
                  style={{ color: GOLD }}
                >
                  My People
                </p>
                <h2
                  className="mt-3 font-semibold"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontSize: "36px",
                    color: CREAM,
                  }}
                >
                  Hanging Out
                </h2>
                <p className="mt-5 leading-relaxed" style={{ color: MUTED }}>
                  Friends are the through-line of college for me—late nights,
                  shared meals, and the kind of laughter that makes everything feel
                  lighter.
                </p>
              </motion.div>
            </div>
          </section>

          {/* 11 — Footer */}
          <motion.section
            className="flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 pb-12 pt-16 text-center"
            initial={false}
            animate={activeIndex === 11 ? "show" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 32 },
              show: { opacity: 1, y: 0, transition: easeOut },
            }}
          >
            <h2
              className="font-light"
              style={{
                fontFamily: "var(--font-crimson-pro), serif",
                fontSize: "28px",
                color: CREAM,
              }}
            >
              Thanks for getting to know me.
            </h2>
            <Link
              href="/"
              className="mt-8 text-lg transition-opacity hover:opacity-85"
              style={{ color: GOLD }}
            >
              Back to the Kitchen →
            </Link>
          </motion.section>
        </div>

        {/* Dot navigation */}
        <nav
          className="pointer-events-none fixed right-3 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2 sm:right-4"
          aria-label="About sections"
        >
          {Array.from({ length: SECTION_COUNT }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToIndex(i)}
              className="pointer-events-auto h-2.5 w-2.5 rounded-full border transition-colors"
              style={{
                borderColor:
                  activeIndex === i ? GOLD : "rgba(212, 160, 60, 0.35)",
                backgroundColor: activeIndex === i ? GOLD : "transparent",
              }}
              aria-label={`Go to section ${i + 1}`}
              aria-current={activeIndex === i ? "true" : undefined}
            />
          ))}
        </nav>

        {/* Bottom chevron */}
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-40 -translate-x-1/2 md:bottom-8">
          {!isLast ? (
            <button
              type="button"
              onClick={() => scrollToIndex(activeIndex + 1)}
              className="pointer-events-auto flex flex-col items-center gap-1 opacity-95 transition-opacity hover:opacity-100"
              style={{ color: CREAM }}
              aria-label="Next section"
            >
              <motion.span
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronDown />
              </motion.span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => scrollToIndex(0)}
              className="pointer-events-auto flex flex-col items-center gap-1 text-sm opacity-95 transition-opacity hover:opacity-100"
              style={{ color: CREAM, fontFamily: "var(--font-crimson-pro), serif" }}
              aria-label="Back to top"
            >
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <ChevronUp />
              </motion.span>
              <span className="mt-1 text-xs tracking-wide opacity-90">
                Back to top
              </span>
            </button>
          )}
        </div>
      </main>
    </>
  );
}

function TennisSection({ activeIndex }: { activeIndex: number }) {
  const isActive = activeIndex === 2;
  return (
    <section className="relative flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always items-end overflow-hidden">
      <motion.div
        className="absolute inset-0 scale-[1.06]"
        initial={false}
        animate={isActive ? { y: "0%" } : { y: "4%" }}
        transition={easeSnap}
      >
        <PhotoPlaceholder
          tone="#1A2A1A"
          noRound
          className="h-[120%] min-h-full w-full"
        />
      </motion.div>
      <div className="relative z-10 w-full bg-gradient-to-t from-[#0A0806] via-[#0A0806]/85 to-transparent px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <motion.div
          className="mx-auto max-w-2xl"
          initial={false}
          animate={isActive ? "show" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 40 },
            show: { opacity: 1, y: 0, transition: easeOut },
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: GOLD }}
          >
            On the Court
          </p>
          <h2
            className="mt-3 font-semibold"
            style={{
              fontFamily: "var(--font-crimson-pro), serif",
              fontSize: "40px",
              color: CREAM,
            }}
          >
            Tennis Captain
          </h2>
          <p className="mt-5 leading-relaxed" style={{ color: MUTED }}>
            I captained my high school tennis team to two sectional titles. The
            court taught me how to stay calm under pressure and lift teammates when
            matches get tight.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function UmdSection({ activeIndex }: { activeIndex: number }) {
  const isActive = activeIndex === 7;
  return (
    <section className="relative flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always items-end overflow-hidden">
      <motion.div
        className="absolute inset-0 scale-[1.06]"
        initial={false}
        animate={isActive ? { y: "0%" } : { y: "4%" }}
        transition={easeSnap}
      >
        <PhotoPlaceholder
          tone="#1A2030"
          noRound
          className="h-[120%] min-h-full w-full"
        />
      </motion.div>
      <div className="relative z-10 w-full bg-gradient-to-t from-[#0A0806] via-[#0A0806]/85 to-transparent px-6 pb-16 pt-32 md:pb-24 md:pt-40">
        <motion.div
          className="mx-auto max-w-2xl"
          initial={false}
          animate={isActive ? "show" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 40 },
            show: { opacity: 1, y: 0, transition: easeOut },
          }}
        >
          <p
            className="text-xs font-semibold uppercase tracking-[0.25em]"
            style={{ color: GOLD }}
          >
            Go Terps
          </p>
          <h2
            className="mt-3 font-semibold"
            style={{
              fontFamily: "var(--font-crimson-pro), serif",
              fontSize: "40px",
              color: CREAM,
            }}
          >
            University of Maryland
          </h2>
          <p className="mt-5 leading-relaxed" style={{ color: MUTED }}>
            I&apos;m studying Computer Science at UMD, class of 2028—building
            projects, grinding problem sets, and finding my people along the way.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

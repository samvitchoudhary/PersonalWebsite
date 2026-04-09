"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { PhotoPlaceholder } from "./PhotoPlaceholder";
import { KitchenBridgeRevealOverlay } from "@/components/kitchen/KitchenBridgeRevealOverlay";

const BG = "#0A0806";
const CREAM = "#F5E6C8";
const GOLD = "#D4A03C";
const MUTED = "#B8A888";
const viewportOnce = { once: true as const, amount: 0.3 };
const easeOut = { duration: 0.8, ease: "easeOut" as const };

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

function ScrollChevron() {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2"
      animate={{ y: [0, 8, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke={GOLD}
        strokeWidth="1.5"
        className="opacity-70"
      >
        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </motion.div>
  );
}

export function AboutScrollPage() {
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 700], [0, 140]);
  const heroTextYSmooth = useSpring(heroTextY, { stiffness: 100, damping: 30 });

  return (
    <>
      <KitchenBridgeRevealOverlay />
      <main
        className="min-h-screen overflow-x-hidden"
        style={{ backgroundColor: BG, color: CREAM }}
      >
        <BackButton />

      {/* Section 1 — Hero */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24">
        <motion.div
          className="flex max-w-3xl flex-col items-center text-center"
          style={{ y: heroTextYSmooth }}
        >
          <motion.h1
            className="font-light tracking-tight"
            style={{
              fontFamily: "var(--font-crimson-pro), serif",
              fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
              color: CREAM,
            }}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            Hey, I&apos;m Samvit
          </motion.h1>
          <motion.p
            className="mt-6 max-w-[600px] text-lg leading-relaxed"
            style={{ color: MUTED }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          >
            A quick intro about who I am, what drives me, and what you&apos;ll
            find here.
          </motion.p>
        </motion.div>
        <ScrollChevron />
      </section>

      {/* Section 2 — Cooking */}
      <section className="flex min-h-screen items-center px-6 py-24 md:py-32">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 md:flex-row md:items-center md:gap-16">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ ...easeOut, delay: 0 }}
          >
            <motion.div
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <PhotoPlaceholder
                tone="#2C1810"
                className="aspect-[4/5] w-full md:min-h-[420px]"
              />
            </motion.div>
          </motion.div>
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ ...easeOut, delay: 0.15 }}
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

      {/* Section 3 — Tennis (parallax bg) */}
      <TennisParallaxSection />

      {/* Section 4 — Eagle Scout */}
      <section className="flex min-h-screen items-center px-6 py-24 md:py-32">
        <div className="mx-auto flex w-full max-w-6xl flex-col-reverse gap-12 md:flex-row md:items-center md:gap-16">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ ...easeOut, delay: 0 }}
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
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ ...easeOut, delay: 0.15 }}
          >
            <motion.div
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={viewportOnce}
              transition={{ duration: 0.9, ease: "easeOut" }}
            >
              <PhotoPlaceholder
                tone="#1A2A1A"
                className="aspect-[4/5] w-full md:min-h-[420px]"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 5 — India */}
      <section className="min-h-screen px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-5 md:gap-8">
            <motion.div
              className="md:col-span-3"
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ ...easeOut }}
            >
              <motion.div
                initial={{ scale: 1.05 }}
                whileInView={{ scale: 1 }}
                viewport={viewportOnce}
              >
                <PhotoPlaceholder tone="#1A2030" className="aspect-[4/3] w-full" />
              </motion.div>
            </motion.div>
            <motion.div
              className="md:col-span-2"
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ ...easeOut, delay: 0.15 }}
            >
              <motion.div
                initial={{ scale: 1.05 }}
                whileInView={{ scale: 1 }}
                viewport={viewportOnce}
              >
                <PhotoPlaceholder tone="#2A1A10" className="aspect-[4/3] w-full" />
              </motion.div>
            </motion.div>
          </div>
          <motion.div
            className="mx-auto mt-14 max-w-2xl text-center"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ ...easeOut, delay: 0.2 }}
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

      {/* Section 6 — Tottenham */}
      <section className="flex min-h-screen items-center px-6 py-24 md:py-32">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 md:flex-row md:items-center md:gap-16">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={easeOut}
          >
            <motion.div
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={viewportOnce}
            >
              <PhotoPlaceholder tone="#2C1810" className="aspect-video w-full" />
            </motion.div>
          </motion.div>
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ ...easeOut, delay: 0.12 }}
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

      {/* Section 7 — UMD */}
      <UmdParallaxSection />

      {/* Section 8 — Journaling */}
      <section className="flex min-h-screen items-center px-6 py-24 md:py-32">
        <div className="mx-auto flex w-full max-w-6xl flex-col-reverse gap-12 md:flex-row md:items-center md:gap-16">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={easeOut}
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
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ ...easeOut, delay: 0.12 }}
          >
            <motion.div
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={viewportOnce}
            >
              <PhotoPlaceholder tone="#1A2030" className="aspect-[4/5] w-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 9 — Foodie */}
      <section className="min-h-screen px-6 py-24 md:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ ...easeOut, delay: i * 0.12 }}
              >
                <motion.div
                  initial={{ scale: 1.05 }}
                  whileInView={{ scale: 1 }}
                  viewport={viewportOnce}
                >
                  <PhotoPlaceholder
                    tone={i === 0 ? "#2A1A10" : i === 1 ? "#1A2A1A" : "#2C1810"}
                    className="aspect-square w-full"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="mx-auto mt-14 max-w-2xl text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ ...easeOut, delay: 0.35 }}
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

      {/* Section 10 — Friends */}
      <section className="flex min-h-screen items-center px-6 py-24 md:py-32">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 md:flex-row md:items-center md:gap-16">
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={easeOut}
          >
            <motion.div
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={viewportOnce}
            >
              <PhotoPlaceholder tone="#1A1510" className="min-h-[360px] w-full md:min-h-[480px]" />
            </motion.div>
          </motion.div>
          <motion.div
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ ...easeOut, delay: 0.12 }}
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

      {/* Section 11 — Footer */}
      <motion.section
        className="flex min-h-[50vh] flex-col items-center justify-center px-6 pb-32 pt-16 text-center"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={easeOut}
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
    </main>
    </>
  );
}

function TennisParallaxSection() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-end overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 scale-[1.06]"
        style={{ y }}
      >
        <PhotoPlaceholder
          tone="#1A2A1A"
          noRound
          className="h-[120%] min-h-screen w-full"
        />
      </motion.div>
      <div className="relative z-10 w-full bg-gradient-to-t from-[#0A0806] via-[#0A0806]/85 to-transparent px-6 pb-24 pt-40 md:pb-32 md:pt-48">
        <motion.div
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={easeOut}
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
            I captained my high school tennis team to two sectional titles.
            The court taught me how to stay calm under pressure and lift
            teammates when matches get tight.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function UmdParallaxSection() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-7%", "7%"]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen items-end overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 scale-[1.06]"
        style={{ y }}
      >
        <PhotoPlaceholder
          tone="#1A2030"
          noRound
          className="h-[120%] min-h-screen w-full"
        />
      </motion.div>
      <div className="relative z-10 w-full bg-gradient-to-t from-[#0A0806] via-[#0A0806]/85 to-transparent px-6 pb-24 pt-40 md:pb-32 md:pt-48">
        <motion.div
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={easeOut}
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
            projects, grinding problem sets, and finding my people along the
            way.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

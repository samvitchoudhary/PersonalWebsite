"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  cookbookProjects,
  INGREDIENT_BULLETS,
  type CookbookProject,
} from "@/data/cookbookProjects";

const CREAM = "#F5E6C8";
const PARCHMENT = "#F0E6D2";
const GOLD = "#D4A03C";
const INK = "#3D2817";
const MUTED_INK = "#6B5344";
const BG = "#0A0806";

function BackButton() {
  return (
    <div className="fixed left-4 top-4 z-50 md:left-6 md:top-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm backdrop-blur-md transition-opacity hover:opacity-90"
        style={{
          fontFamily: "var(--font-crimson-pro), serif",
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
    </div>
  );
}

function BookShell({ children }: { children: ReactNode }) {
  return (
    <div className="cookbook-book relative mx-auto w-full max-w-5xl">
      <div className="cookbook-book-shadow absolute inset-x-4 -bottom-3 top-6 rounded-md bg-black/50 blur-xl md:inset-x-8" />
      <div className="relative grid grid-cols-1 overflow-hidden rounded-sm md:grid-cols-2 md:rounded-md">
        {children}
      </div>
    </div>
  );
}

function BookPage({
  side,
  children,
  className = "",
}: {
  side: "left" | "right";
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`cookbook-page relative px-6 py-8 sm:px-8 sm:py-10 md:min-h-[min(78vh,640px)] md:px-10 md:py-12 ${
        side === "left" ? "cookbook-page-left" : "cookbook-page-right"
      } ${className}`}
      style={{ backgroundColor: PARCHMENT, color: INK }}
    >
      <div className="cookbook-page-texture pointer-events-none absolute inset-0" aria-hidden />
      {children}
    </div>
  );
}

function Flourish() {
  return (
    <svg
      width="120"
      height="12"
      viewBox="0 0 120 12"
      fill="none"
      className="mx-auto mt-3"
      aria-hidden
    >
      <path
        d="M2 6c18-8 38-8 58 0s40 8 58 0"
        stroke={GOLD}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="60" cy="6" r="2" fill={GOLD} />
    </svg>
  );
}

function ContentsView({
  onSelect,
}: {
  onSelect: (id: string) => void;
}) {
  const featured = cookbookProjects.filter((p) => p.featured);
  const rest = cookbookProjects.filter((p) => !p.featured);

  return (
    <BookShell>
      <BookPage side="left">
        <div className="relative z-[1] flex h-full flex-col">
          <p
            className="text-center text-xs font-semibold uppercase tracking-[0.28em]"
            style={{ color: GOLD }}
          >
            Open Cookbook
          </p>
          <h1
            className="mt-3 text-center text-[clamp(1.85rem,4vw,2.6rem)] font-semibold leading-tight"
            style={{
              fontFamily: "var(--font-crimson-pro), serif",
              color: INK,
            }}
          >
            Samvit&apos;s Recipes
          </h1>
          <Flourish />
          <h2
            className="mt-8 text-center text-lg italic md:text-xl"
            style={{
              fontFamily: "var(--font-crimson-pro), serif",
              color: MUTED_INK,
            }}
          >
            Table of Contents
          </h2>
          <p
            className="mt-3 text-center text-sm leading-relaxed"
            style={{ color: MUTED_INK }}
          >
            A collection of projects, plated like recipes — turn the page to taste
            each one.
          </p>

          <div className="mt-8 flex flex-1 flex-col justify-center gap-5">
            <p
              className="text-xs font-semibold uppercase tracking-[0.22em]"
              style={{ color: GOLD }}
            >
              Chef&apos;s Specials
            </p>
            {featured.map((p, i) => (
              <FeaturedTocItem
                key={p.id}
                project={p}
                pageNum={String(i + 1).padStart(2, "0")}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>
      </BookPage>

      <BookPage side="right">
        <div className="relative z-[1] flex h-full flex-col justify-center">
          <p
            className="mb-4 text-xs font-semibold uppercase tracking-[0.22em]"
            style={{ color: GOLD }}
          >
            Also on the Menu
          </p>
          <div className="flex flex-col gap-1">
            {rest.map((p, i) => (
              <TocItem
                key={p.id}
                project={p}
                pageNum={String(i + 3).padStart(2, "0")}
                onSelect={onSelect}
              />
            ))}
          </div>
          <div className="mt-10 border-t border-[#3D2817]/15 pt-6">
            <p className="text-center text-sm italic" style={{ color: MUTED_INK }}>
              Click any dish to open its recipe spread.
            </p>
          </div>
        </div>
      </BookPage>
    </BookShell>
  );
}

function FeaturedTocItem({
  project,
  pageNum,
  onSelect,
}: {
  project: CookbookProject;
  pageNum: string;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(project.id)}
      className="group w-full rounded-md border px-3.5 py-3 text-left transition-colors hover:border-[#D4A03C]/55"
      style={{
        borderColor: "rgba(212, 160, 60, 0.35)",
        background:
          "linear-gradient(135deg, rgba(212,160,60,0.14), rgba(240,230,210,0.4))",
      }}
    >
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
        style={{
          backgroundColor: "rgba(212, 160, 60, 0.2)",
          color: "#8A6418",
        }}
      >
        ⭐ Chef&apos;s Special
      </span>
      <span className="mt-2 flex w-full items-baseline gap-2">
        <span
          className="shrink-0 text-xl font-semibold leading-snug transition-colors group-hover:text-[#8A6418] md:text-2xl"
          style={{
            fontFamily: "var(--font-crimson-pro), serif",
            color: INK,
          }}
        >
          {project.name}
        </span>
        <span
          className="min-w-0 flex-1 border-b border-dotted border-[#3D2817]/35"
          aria-hidden
        />
        <span className="shrink-0 text-sm tabular-nums" style={{ color: MUTED_INK }}>
          {pageNum}
        </span>
      </span>
      <span className="mt-1 block text-sm italic" style={{ color: MUTED_INK }}>
        {project.tagline}
      </span>
    </button>
  );
}

function TocItem({
  project,
  pageNum,
  onSelect,
}: {
  project: CookbookProject;
  pageNum: string;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(project.id)}
      className="group w-full py-2.5 text-left transition-opacity hover:opacity-80"
    >
      <span className="flex w-full items-baseline gap-2">
        <span
          className="shrink-0 text-base font-medium md:text-lg"
          style={{
            fontFamily: "var(--font-crimson-pro), serif",
            color: INK,
          }}
        >
          {project.name}
        </span>
        <span
          className="min-w-0 flex-1 border-b border-dotted border-[#3D2817]/35"
          aria-hidden
        />
        <span className="shrink-0 text-sm tabular-nums" style={{ color: MUTED_INK }}>
          {pageNum}
        </span>
      </span>
      <span className="mt-0.5 block text-sm italic" style={{ color: MUTED_INK }}>
        {project.tagline}
      </span>
    </button>
  );
}

function RecipeSpread({
  project,
  onBack,
}: {
  project: CookbookProject;
  onBack: () => void;
}) {
  return (
    <div className="w-full">
      <div className="mb-4 flex justify-center md:mb-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-80"
          style={{
            fontFamily: "var(--font-crimson-pro), serif",
            color: GOLD,
          }}
        >
          ← Back to Contents
        </button>
      </div>

      <BookShell>
        <BookPage side="left">
          <div className="relative z-[1]">
            {project.featured && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
                style={{
                  backgroundColor: "rgba(212, 160, 60, 0.2)",
                  color: "#8A6418",
                }}
              >
                ⭐ Chef&apos;s Special
              </span>
            )}
            <h1
              className="mt-3 text-[clamp(1.6rem,3.5vw,2.35rem)] font-semibold leading-tight"
              style={{
                fontFamily: "var(--font-crimson-pro), serif",
                color: INK,
              }}
            >
              {project.name}
            </h1>
            <p
              className="mt-2 text-base italic leading-snug"
              style={{ color: MUTED_INK }}
            >
              {project.tagline}
            </p>
            <div
              className="my-4 h-px w-16"
              style={{ backgroundColor: "rgba(212, 160, 60, 0.45)" }}
              aria-hidden
            />
            <p className="text-[15px] leading-relaxed" style={{ color: INK }}>
              {project.description}
            </p>

            <h2
              className="mt-7 text-lg font-semibold"
              style={{
                fontFamily: "var(--font-crimson-pro), serif",
                color: INK,
              }}
            >
              Ingredients
            </h2>
            <ul className="mt-3 space-y-2">
              {project.ingredients.map((ing, i) => (
                <li
                  key={ing}
                  className="flex items-center gap-2.5 text-[15px]"
                  style={{ color: INK }}
                >
                  <span aria-hidden className="text-base leading-none">
                    {INGREDIENT_BULLETS[i % INGREDIENT_BULLETS.length]}
                  </span>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>
        </BookPage>

        <BookPage side="right">
          <div className="relative z-[1] flex h-full flex-col">
            <h2
              className="text-lg font-semibold"
              style={{
                fontFamily: "var(--font-crimson-pro), serif",
                color: INK,
              }}
            >
              Where to Taste
            </h2>
            <p className="mt-1 text-sm italic" style={{ color: MUTED_INK }}>
              Links &amp; serving notes
            </p>

            <div className="mt-5 flex flex-col gap-3">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cookbook-link-card rounded-md border px-4 py-3 transition-transform hover:-translate-y-0.5"
                  style={{
                    borderColor: "rgba(61, 40, 23, 0.2)",
                    backgroundColor: "rgba(255, 252, 245, 0.65)",
                    color: INK,
                    fontFamily: "var(--font-crimson-pro), serif",
                  }}
                >
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
                    GitHub
                  </span>
                  <span className="mt-1 block text-base">Open the repository →</span>
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cookbook-link-card rounded-md border px-4 py-3 transition-transform hover:-translate-y-0.5"
                  style={{
                    borderColor: "rgba(212, 160, 60, 0.4)",
                    backgroundColor: "rgba(212, 160, 60, 0.12)",
                    color: INK,
                    fontFamily: "var(--font-crimson-pro), serif",
                  }}
                >
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
                    Live Site
                  </span>
                  <span className="mt-1 block text-base">Taste it live →</span>
                </a>
              )}
              {project.liveNote && !project.live && (
                <div
                  className="rounded-md border px-4 py-3"
                  style={{
                    borderColor: "rgba(61, 40, 23, 0.18)",
                    backgroundColor: "rgba(255, 252, 245, 0.55)",
                    color: INK,
                    fontFamily: "var(--font-crimson-pro), serif",
                  }}
                >
                  <span className="block text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: GOLD }}>
                    Beta
                  </span>
                  <span className="mt-1 block text-base">{project.liveNote}</span>
                </div>
              )}
              {!project.github && !project.live && !project.liveNote && (
                <p className="text-sm italic" style={{ color: MUTED_INK }}>
                  This recipe is still plating — no public links yet.
                </p>
              )}
            </div>

            <div
              className="mt-6 flex flex-1 items-center justify-center rounded-md border-2 border-dashed p-6"
              style={{
                borderColor: "rgba(61, 40, 23, 0.22)",
                backgroundColor: "rgba(255, 252, 245, 0.4)",
                minHeight: 180,
              }}
            >
              <div className="text-center">
                <p className="text-3xl" aria-hidden>
                  📷
                </p>
                <p
                  className="mt-2 text-sm italic"
                  style={{
                    color: MUTED_INK,
                    fontFamily: "var(--font-crimson-pro), serif",
                  }}
                >
                  screenshot coming soon
                </p>
              </div>
            </div>
          </div>
        </BookPage>
      </BookShell>
    </div>
  );
}

export function CookbookPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = cookbookProjects.find((p) => p.id === selectedId) ?? null;

  return (
    <div
      className="cookbook-stage relative min-h-[100dvh] w-screen overflow-x-hidden"
      style={{ backgroundColor: BG, color: CREAM }}
    >
      <div className="cookbook-vignette pointer-events-none absolute inset-0" aria-hidden />
      <BackButton />

      <div className="relative z-10 flex min-h-[100dvh] items-center justify-center px-4 py-20 md:px-8 md:py-16">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <RecipeSpread
                project={selected}
                onBack={() => setSelectedId(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="contents"
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <ContentsView onSelect={setSelectedId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

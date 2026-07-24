"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { AboutPhoto, PhotoPlaceholder } from "./PhotoPlaceholder";
import { KitchenBridgeRevealOverlay } from "@/components/kitchen/KitchenBridgeRevealOverlay";

const CREAM = "#F5E6C8";
const GOLD = "#D4A03C";
const MUTED = "#B8A888";

const SECTION_COUNT = 11;

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

/** Section indices — 11 snap sections total */
const S = {
  hero: 0,
  cooking: 1,
  foodie: 2,
  umd: 3,
  tennis: 4,
  movies: 5,
  spurs: 6,
  eagle: 7,
  india: 8,
  friends: 9,
  footer: 10,
} as const;

function SectionLabel({
  label,
  align = "left",
}: {
  label: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : ""}>
      <p
        className="text-xs font-semibold uppercase tracking-[0.25em]"
        style={{ color: GOLD }}
      >
        {label}
      </p>
      <div
        className={`mt-2 h-px w-[60px] bg-[#D4A03C]/30 ${align === "center" ? "mx-auto" : ""}`}
        aria-hidden
      />
    </div>
  );
}

function FloatingLogoLink({
  href,
  src,
  alt,
  isActive,
  width = 64,
  height = 64,
}: {
  href: string;
  src: string;
  alt: string;
  isActive: boolean;
  width?: number;
  height?: number;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="about-section-footer-link pointer-events-auto inline-block"
      style={{ width, height }}
      initial={false}
      animate={isActive ? { y: [0, -8, 0] } : { y: 0 }}
      whileHover={{ scale: 1.08 }}
      transition={{
        y: {
          duration: 3,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        },
        scale: { duration: 0.2 },
      }}
      aria-label={alt}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]"
      />
    </motion.a>
  );
}

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

function FullBackgroundSection({
  activeIndex,
  sectionIndex,
  imageSrc,
  imageAlt,
  label,
  title,
  body,
}: {
  activeIndex: number;
  sectionIndex: number;
  imageSrc: string;
  imageAlt: string;
  label: string;
  title: string;
  body: string;
}) {
  const isActive = activeIndex === sectionIndex;
  return (
    <section className="about-slide relative h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always overflow-hidden">
      {/* Single wrapper so .about-slide > * position:relative doesn't break absolute fill */}
      <div className="relative h-full w-full">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1]"
          aria-hidden
          style={{
            background:
              "linear-gradient(to right, rgba(10,8,6,0.9) 0%, rgba(10,8,6,0.75) 35%, rgba(10,8,6,0.4) 100%)",
          }}
        />
        <div className="relative z-[2] flex h-full w-full items-center px-6 py-16 md:px-12 md:py-20 lg:px-16">
          <motion.div
            className="max-w-xl"
            initial={false}
            animate={isActive ? "show" : "hidden"}
            variants={{
              hidden: { opacity: 0, y: 40 },
              show: { opacity: 1, y: 0, transition: easeOut },
            }}
          >
            <SectionLabel label={label} />
            <h2
              className="mt-3 font-semibold"
              style={{
                fontFamily: "var(--font-crimson-pro), serif",
                fontSize: "40px",
                color: CREAM,
              }}
            >
              {title}
            </h2>
            <p className="mt-5 leading-relaxed" style={{ color: CREAM }}>
              {body}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function ParallaxBleedSection({
  activeIndex,
  sectionIndex,
  tone,
  imageSrc,
  imageAlt,
  label,
  title,
  body,
}: {
  activeIndex: number;
  sectionIndex: number;
  tone?: string;
  imageSrc?: string;
  imageAlt?: string;
  label: string;
  title: string;
  body: string;
}) {
  const isActive = activeIndex === sectionIndex;
  return (
    <section className="about-slide relative flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always items-end overflow-hidden">
      <motion.div
        className="absolute inset-0 scale-[1.06]"
        initial={false}
        animate={isActive ? { y: "0%" } : { y: "4%" }}
        transition={easeSnap}
      >
        {imageSrc ? (
          <AboutPhoto
            src={imageSrc}
            alt={imageAlt ?? title}
            noRound
            className="h-[120%] min-h-full w-full"
          />
        ) : (
          <PhotoPlaceholder
            tone={tone ?? "#1A2030"}
            noRound
            className="h-[120%] min-h-full w-full"
          />
        )}
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
          <SectionLabel label={label} />
          <h2
            className="mt-3 font-semibold"
            style={{
              fontFamily: "var(--font-crimson-pro), serif",
              fontSize: "40px",
              color: CREAM,
            }}
          >
            {title}
          </h2>
          <p className="mt-5 leading-relaxed" style={{ color: MUTED }}>
            {body}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

const FOODIE_PILE = [
  {
    src: "/aboutMeImages/Food.jpg",
    alt: "Food",
    rot: -10,
    mdStyle: { left: "4%", top: "8%", width: 280 },
    aspect: "aspect-[4/3]",
  },
  {
    src: "/aboutMeImages/Food1.jpg",
    alt: "Food",
    rot: 8,
    mdStyle: { left: "36%", top: "2%", width: 240 },
    aspect: "aspect-[3/4]",
  },
  {
    src: "/aboutMeImages/Food2.jpg",
    alt: "Food",
    rot: -5,
    mdStyle: { right: "3%", top: "10%", width: 300 },
    aspect: "aspect-[16/10]",
  },
  {
    src: "/aboutMeImages/Food3.jpg",
    alt: "Food",
    rot: 12,
    mdStyle: { left: "10%", bottom: "4%", width: 250 },
    aspect: "aspect-[3/4]",
  },
  {
    src: "/aboutMeImages/Food4.jpg",
    alt: "Food",
    rot: -7,
    mdStyle: { right: "10%", bottom: "6%", width: 290 },
    aspect: "aspect-[4/3]",
  },
] as const;

function FoodieSection({ activeIndex }: { activeIndex: number }) {
  const isActive = activeIndex === S.foodie;
  return (
    <section className="about-slide relative flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always flex-col overflow-hidden px-4 pb-24 pt-12 md:px-6 md:pb-28 md:pt-14">
      <motion.div
        className="relative z-[1] mx-auto w-full max-w-3xl shrink-0 text-center"
        initial={false}
        animate={isActive ? "show" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 20 },
          show: { opacity: 1, y: 0, transition: easeOut },
        }}
      >
        <SectionLabel label="Beyond the Kitchen" align="center" />
        <h2
          className="mt-3 font-semibold"
          style={{
            fontFamily: "var(--font-crimson-pro), serif",
            fontSize: "clamp(28px, 5vw, 36px)",
            color: CREAM,
          }}
        >
          Foodie
        </h2>
        <p className="mx-auto mt-3 max-w-xl leading-relaxed" style={{ color: MUTED }}>
          I love exploring new restaurants, cuisines, and the stories behind food
        </p>
      </motion.div>

      <div className="relative z-[1] mx-auto mt-2 w-full max-w-5xl flex-1 md:min-h-0">
        {/* Mobile: stacked, still large */}
        <div className="flex flex-col gap-3 py-2 md:hidden">
          {FOODIE_PILE.map((p, i) => (
            <motion.div
              key={i}
              initial={false}
              animate={isActive ? "show" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 36, rotate: p.rot + 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  rotate: p.rot * 0.35,
                  transition: {
                    ...easeOut,
                    delay: 0.08 + i * 0.1,
                  },
                },
              }}
              className="mx-auto w-full max-w-[300px]"
            >
              <div
                className="overflow-hidden rounded-xl shadow-[0_4px_20px_rgba(20,12,5,0.4)] ring-1 ring-[rgba(212,160,60,0.15)]"
                style={{ transform: `rotate(${p.rot * 0.35}deg)` }}
              >
                <AboutPhoto
                  src={p.src}
                  alt={p.alt}
                  className={`${p.aspect} w-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop: generous scattered cluster in center */}
        <div className="relative mx-auto hidden h-full min-h-[380px] w-full max-w-5xl md:block">
          {FOODIE_PILE.map((p, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={p.mdStyle}
              initial={false}
              animate={isActive ? "show" : "hidden"}
              variants={{
                hidden: {
                  opacity: 0,
                  y: -56,
                  rotate: p.rot + 18,
                  scale: 0.92,
                },
                show: {
                  opacity: 1,
                  y: 0,
                  rotate: p.rot,
                  scale: 1,
                  transition: {
                    type: "spring",
                    stiffness: 260,
                    damping: 22,
                    delay: 0.05 + i * 0.12,
                  },
                },
              }}
            >
              <div className="overflow-hidden rounded-xl shadow-[0_6px_24px_rgba(20,12,5,0.5)] ring-1 ring-[rgba(212,160,60,0.18)]">
                <AboutPhoto
                  src={p.src}
                  alt={p.alt}
                  className={`${p.aspect} w-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="about-section-footer-link absolute bottom-6 left-0 right-0 z-[2] flex justify-center md:bottom-8">
        <FloatingLogoLink
          href="https://beliapp.co/app/samvit"
          src="/aboutMeImages/BeliLogo.webp"
          alt="Follow me on Beli"
          isActive={isActive}
          width={64}
          height={64}
        />
      </div>
    </section>
  );
}

const FRIENDS_PORTRAITS = [
  {
    src: "/aboutMeImages/Friends.jpg",
    alt: "Friends",
    radius: "rounded-xl",
  },
  {
    src: "/aboutMeImages/Friends1.jpg",
    alt: "Friends",
    radius: "rounded-lg",
  },
  {
    src: "/aboutMeImages/Friends3.jpg",
    alt: "Friends",
    radius: "rounded-xl",
  },
] as const;

const FRIENDS_LANDSCAPES = [
  {
    src: "/aboutMeImages/Friends2.jpg",
    alt: "Friends",
    radius: "rounded-lg",
  },
  {
    src: "/aboutMeImages/Friends4.jpg",
    alt: "Friends",
    radius: "rounded-xl",
  },
] as const;

function HangingCollageSection({ activeIndex }: { activeIndex: number }) {
  const isActive = activeIndex === S.friends;

  const frame =
    "overflow-hidden shadow-[0_4px_18px_rgba(20,12,5,0.38)] ring-1 ring-[rgba(212,160,60,0.14)]";

  return (
    <section className="about-slide flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always flex-col overflow-hidden px-4 py-8 md:px-6 md:py-10">
      <motion.div
        className="mx-auto w-full max-w-5xl shrink-0 text-center md:text-left"
        initial={false}
        animate={isActive ? "show" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 24 },
          show: { opacity: 1, y: 0, transition: easeOut },
        }}
      >
        <SectionLabel label="My People" align="center" />
        <h2
          className="mt-3 font-semibold"
          style={{
            fontFamily: "var(--font-crimson-pro), serif",
            fontSize: "clamp(28px, 5vw, 36px)",
            color: CREAM,
          }}
        >
          I love spending time with my friends
        </h2>
      </motion.div>

      <div className="mx-auto mt-4 flex w-full max-w-5xl flex-1 flex-col justify-center gap-2 min-h-0 md:mt-5">
        {/* Top row: three portrait photos */}
        <div className="grid grid-cols-3 gap-2">
          {FRIENDS_PORTRAITS.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={false}
              animate={isActive ? "show" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 32 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { ...easeOut, delay: 0.05 + i * 0.08 },
                },
              }}
            >
              <motion.div
                className={`${frame} ${photo.radius}`}
                initial={false}
                animate={isActive ? "show" : "hidden"}
                variants={scalePhoto}
              >
                <AboutPhoto
                  src={photo.src}
                  alt={photo.alt}
                  className="aspect-[3/4] w-full"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom row: two landscape photos */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {FRIENDS_LANDSCAPES.map((photo, i) => (
            <motion.div
              key={photo.src}
              initial={false}
              animate={isActive ? "show" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 32 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { ...easeOut, delay: 0.2 + i * 0.08 },
                },
              }}
            >
              <motion.div
                className={`${frame} ${photo.radius}`}
                initial={false}
                animate={isActive ? "show" : "hidden"}
                variants={scalePhoto}
              >
                <AboutPhoto
                  src={photo.src}
                  alt={photo.alt}
                  className="aspect-[4/3] w-full"
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
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
        className="about-parchment-bg fixed inset-0 flex flex-col overflow-hidden"
        style={{ color: CREAM }}
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
          <section className="about-slide flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 pt-16">
            <motion.div
              className="flex max-w-3xl flex-col items-center text-center"
              initial={false}
              animate={activeIndex === S.hero ? "show" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: "easeOut" as const },
                },
              }}
            >
              <motion.div
                className="mb-8"
                initial={false}
                animate={activeIndex === S.hero ? "show" : "hidden"}
                variants={{
                  hidden: { opacity: 0, scale: 0.92 },
                  show: {
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.8, ease: "easeOut" },
                  },
                }}
              >
                <div
                  className="mx-auto h-56 w-56 overflow-hidden rounded-full border-2 sm:h-64 sm:w-64 md:h-80 md:w-80"
                  style={{
                    borderColor: "rgba(212, 160, 60, 0.35)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.45)",
                  }}
                >
                  <img
                    src="/aboutMeImages/Samvit.png"
                    alt="Samvit Choudhary"
                    className="h-full w-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.h1
                className="font-light tracking-tight"
                style={{
                  fontFamily: "var(--font-crimson-pro), serif",
                  fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
                  color: CREAM,
                }}
                initial={false}
                animate={activeIndex === S.hero ? "show" : "hidden"}
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
                animate={activeIndex === S.hero ? "show" : "hidden"}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.9, delay: 0.15, ease: "easeOut" },
                  },
                }}
              >
                Keep scrolling to find out more about me
              </motion.p>
            </motion.div>
          </section>

          {/* 1 — Cooking */}
          <section className="about-slide flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always items-center overflow-hidden px-6 py-8 md:py-12">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:flex-row md:items-center md:gap-16">
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === S.cooking ? "show" : "hidden"}
                variants={fadeXLeft}
              >
                <motion.div
                  initial={false}
                  animate={activeIndex === S.cooking ? "show" : "hidden"}
                  variants={scalePhoto}
                >
                  <AboutPhoto
                    src="/aboutMeImages/Cooking.png"
                    alt="Cooking"
                    className="aspect-[4/5] w-full md:min-h-[320px]"
                  />
                </motion.div>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === S.cooking ? "show" : "hidden"}
                variants={fadeXRight}
              >
                <SectionLabel label="From Mom's Kitchen" />
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
                  I learned my love of cooking from my mom, and it&apos;s become a
                  hobby for me, and a way to destress. I love to learn new
                  techniques and challenge myself to be patient and go the extra
                  mile to get some more flavor into my dishes
                </p>
              </motion.div>
            </div>
          </section>

          {/* 2 — Foodie */}
          <FoodieSection activeIndex={activeIndex} />

          {/* 3 — UMD */}
          <FullBackgroundSection
            activeIndex={activeIndex}
            sectionIndex={S.umd}
            imageSrc="/aboutMeImages/UofM.png"
            imageAlt="University of Maryland campus"
            label="Go Terps"
            title="University of Maryland"
            body={
              "I'm studying Computer Science at UMD with a minor in mathematics. On campus I am a part of Project LIFT, a club that helps small business grow through free tech solutions. I also love to play intramural sports like tennis and soccer"
            }
          />

          {/* 4 — Tennis */}
          <ParallaxBleedSection
            activeIndex={activeIndex}
            sectionIndex={S.tennis}
            imageSrc="/aboutMeImages/Tennis.png"
            imageAlt="Tennis"
            label="On the Court"
            title="Tennis Captain"
            body="I played for varsity all 4 years of highschool and captained the team to three sectional titles in my sophomore, junior, and senior years. The most rewarding part of the experience was the bonds I formed with my teammates, and the love I continue to have for the game."
          />

          {/* 5 — Movies */}
          <section className="about-slide relative flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always flex-col overflow-hidden px-4 pb-24 pt-10 md:px-6 md:pb-28 md:pt-12">
            <div className="mx-auto flex h-full w-full max-w-5xl flex-col items-center justify-between gap-4 py-2 md:gap-5">
              <motion.div
                className="shrink-0 text-center"
                initial={false}
                animate={activeIndex === S.movies ? "show" : "hidden"}
                variants={fadeYUp}
              >
                <SectionLabel label="Lights, Camera, Action" align="center" />
                <h2
                  className="mt-2 font-semibold md:mt-3"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontSize: "clamp(28px, 5vw, 40px)",
                    color: CREAM,
                  }}
                >
                  Movies
                </h2>
              </motion.div>

              <div className="flex w-full max-w-3xl flex-1 items-center justify-center gap-4 sm:gap-6 md:gap-8">
                {/* About Time — portrait */}
                <motion.div
                  className="shrink-0"
                  initial={false}
                  animate={activeIndex === S.movies ? "show" : "hidden"}
                  variants={fadeYUp}
                >
                  <motion.div
                    initial={false}
                    animate={activeIndex === S.movies ? "show" : "hidden"}
                    variants={scalePhoto}
                  >
                    <div className="h-[min(42vh,320px)] w-[min(28vw,215px)] overflow-hidden rounded-xl shadow-[0_6px_24px_rgba(20,12,5,0.45)] ring-1 ring-[rgba(212,160,60,0.15)]">
                      <img
                        src="/aboutMeImages/AboutTime.jpg"
                        alt="About Time movie poster"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Studio Ghibli — landscape */}
                <motion.div
                  className="min-w-0 flex-1 max-w-md"
                  initial={false}
                  animate={activeIndex === S.movies ? "show" : "hidden"}
                  variants={fadeYUpDelay}
                >
                  <motion.div
                    initial={false}
                    animate={activeIndex === S.movies ? "show" : "hidden"}
                    variants={scalePhoto}
                  >
                    <div className="aspect-video w-full overflow-hidden rounded-xl shadow-[0_6px_24px_rgba(20,12,5,0.45)] ring-1 ring-[rgba(212,160,60,0.15)]">
                      <img
                        src="/aboutMeImages/StudioGhibli.webp"
                        alt="Studio Ghibli"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                className="max-w-2xl shrink-0 px-2 text-center"
                initial={false}
                animate={activeIndex === S.movies ? "show" : "hidden"}
                variants={fadeTextBlock}
              >
                <p
                  className="text-[14px] leading-relaxed md:text-[15px]"
                  style={{ color: MUTED }}
                >
                  I became a big movie guy my senior year of highschool. My
                  favorite genre is rom coms, and my favorite movie is About Time.
                  Throughout highschool, I took Japanese as my world language
                  class, and during that time I fell in love with Studi Ghibli
                  movies. If you&apos;re not familiar it&apos;s a Japanese animation
                  company, and the animation style is the basis for this entire
                  website.
                </p>
              </motion.div>
            </div>

            <div className="about-section-footer-link absolute bottom-6 left-0 right-0 z-[2] flex justify-center md:bottom-8">
              <FloatingLogoLink
                href="https://boxd.it/f7wlb"
                src="/aboutMeImages/LetterBoxdLogo.png"
                alt="Follow me on Letterboxd"
                isActive={activeIndex === S.movies}
                width={80}
                height={52}
              />
            </div>
          </section>

          {/* 6 — Tottenham */}
          <section className="about-slide flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always items-center overflow-hidden px-6 py-6 md:py-12">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 md:flex-row md:items-center md:gap-16">
              <motion.div
                className="w-full shrink-0 md:w-1/2"
                initial={false}
                animate={activeIndex === S.spurs ? "show" : "hidden"}
                variants={fadeXLeft}
              >
                <SectionLabel label="COYS" />
                <h2
                  className="mt-2 font-semibold md:mt-3"
                  style={{
                    fontFamily: "var(--font-crimson-pro), serif",
                    fontSize: "clamp(1.75rem, 5vw, 2.25rem)",
                    color: CREAM,
                  }}
                >
                  Tottenham Hotspur
                </h2>
                <p
                  className="mt-4 text-[14px] leading-relaxed md:text-[15px] lg:text-base"
                  style={{ color: MUTED }}
                >
                  I became a Spurs fan around 3rd grade when I started watching
                  soccer because Harry Kane was (and still is) my favorite player.
                  Even though he left, I&apos;ve unfortunately been stuck supporting
                  this team, but I wouldn&apos;t change it for anything. This past
                  summer I had the privilege of going to watch the last game of the
                  season against Everton where we barely survived relegation. It was
                  one of the best experiences of my life. Beyond Tottenham, soccer is
                  my favorite sport, and something I can talk about for hours.
                </p>
              </motion.div>
              <motion.div
                className="w-full shrink-0 md:w-1/2"
                initial={false}
                animate={activeIndex === S.spurs ? "show" : "hidden"}
                variants={fadeXRight}
              >
                <motion.div
                  initial={false}
                  animate={activeIndex === S.spurs ? "show" : "hidden"}
                  variants={scalePhoto}
                >
                  <AboutPhoto
                    src="/aboutMeImages/COYS.jpg"
                    alt="Tottenham Hotspur"
                    className="aspect-[4/3] w-full md:aspect-[3/4] md:min-h-[320px]"
                  />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* 7 — Eagle Scout */}
          <section className="about-slide flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always items-center overflow-hidden px-6 py-8 md:py-12">
            <div className="mx-auto flex w-full max-w-6xl flex-col-reverse gap-8 md:flex-row md:items-center md:gap-16">
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === S.eagle ? "show" : "hidden"}
                variants={fadeXLeft}
              >
                <SectionLabel label="Trail to Eagle" />
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
                  I served as Senior Patrol Leader of my Boy Scout Troop and
                  completed an Eagle project restoring the community garden, and
                  building new plots. On the right is a photo of the team
                  alongside one of the new garden plots we built.
                </p>
              </motion.div>
              <motion.div
                className="w-full md:w-1/2"
                initial={false}
                animate={activeIndex === S.eagle ? "show" : "hidden"}
                variants={fadeXRight}
              >
                <motion.div
                  initial={false}
                  animate={activeIndex === S.eagle ? "show" : "hidden"}
                  variants={scalePhoto}
                >
                  <AboutPhoto
                    src="/aboutMeImages/EagleScout.jpg"
                    alt="Eagle Scout garden project team"
                    className="aspect-[4/5] w-full md:min-h-[320px]"
                  />
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* 8 — India */}
          <section className="about-slide flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always flex-col justify-center overflow-hidden px-6 py-8 md:py-12">
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 md:gap-6">
                {[
                  {
                    src: "/aboutMeImages/Family.png",
                    alt: "Family in India",
                  },
                  {
                    src: "/aboutMeImages/Family1.png",
                    alt: "Family in India",
                  },
                ].map((photo, i) => (
                  <motion.div
                    key={photo.src}
                    initial={false}
                    animate={activeIndex === S.india ? "show" : "hidden"}
                    variants={i === 0 ? fadeYUp : fadeYUpDelay}
                  >
                    <motion.div
                      className="overflow-hidden rounded-2xl shadow-[0_4px_20px_rgba(20,12,5,0.4)] ring-1 ring-[rgba(212,160,60,0.15)]"
                      initial={false}
                      animate={activeIndex === S.india ? "show" : "hidden"}
                      variants={scalePhoto}
                    >
                      <AboutPhoto
                        src={photo.src}
                        alt={photo.alt}
                        className="aspect-[4/5] w-full"
                      />
                    </motion.div>
                  </motion.div>
                ))}
              </div>
              <motion.div
                className="mx-auto mt-8 max-w-2xl text-center md:mt-10"
                initial={false}
                animate={activeIndex === S.india ? "show" : "hidden"}
                variants={fadeTextBlock}
              >
                <SectionLabel label="Every August" align="center" />
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
                  Every summer I spend about a month in India with family. It keeps
                  me connected to where my parents came from and has kept me
                  connected to my hundreds of first and second cousins.
                </p>
              </motion.div>
            </div>
          </section>

          {/* 9 — Friends */}
          <HangingCollageSection activeIndex={activeIndex} />

          {/* 10 — Footer */}
          <motion.section
            className="about-slide flex h-[100dvh] max-h-[100dvh] min-h-[100dvh] shrink-0 snap-start snap-always flex-col items-center justify-center overflow-hidden px-6 pb-12 pt-16 text-center"
            initial={false}
            animate={activeIndex === S.footer ? "show" : "hidden"}
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
                  activeIndex === i ? GOLD : "rgba(212, 160, 60, 0.2)",
                backgroundColor: activeIndex === i ? GOLD : "transparent",
              }}
              aria-label={`Go to section ${i + 1}`}
              aria-current={activeIndex === i ? "true" : undefined}
            />
          ))}
        </nav>

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

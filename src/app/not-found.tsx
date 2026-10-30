import Link from "next/link";

const CREAM = "#F5E6C8";
const GOLD = "#D4A03C";
const BG = "#0A0806";

export default function NotFound() {
  return (
    <div
      className="relative flex min-h-[100dvh] w-screen flex-col items-center justify-center px-4"
      style={{ backgroundColor: BG }}
    >
      <div className="text-center">
        <h1
          className="text-[clamp(3rem,8vw,5rem)] font-bold leading-none"
          style={{
            fontFamily: "var(--font-crimson-pro), serif",
            color: GOLD,
          }}
        >
          404
        </h1>
        <p
          className="mt-4 text-xl"
          style={{
            fontFamily: "var(--font-crimson-pro), serif",
            color: CREAM,
          }}
        >
          This page wandered off from the kitchen.
        </p>
        <p
          className="mt-2 text-base italic"
          style={{
            fontFamily: "var(--font-crimson-pro), serif",
            color: CREAM,
            opacity: 0.7,
          }}
        >
          Perhaps it&apos;s hiding in the fridge?
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full border px-6 py-3 text-base transition-opacity hover:opacity-90"
          style={{
            fontFamily: "var(--font-crimson-pro), serif",
            backgroundColor: "rgba(26, 21, 16, 0.85)",
            borderColor: "rgba(212, 160, 60, 0.25)",
            color: CREAM,
          }}
        >
          <span aria-hidden className="text-xl leading-none">
            ←
          </span>
          Back to Kitchen
        </Link>
      </div>
    </div>
  );
}

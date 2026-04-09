"use client";

import Link from "next/link";
import { KitchenBridgeRevealOverlay } from "@/components/kitchen/KitchenBridgeRevealOverlay";

const CREAM = "#F5E6C8";

export default function SkillsClient() {
  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-[#0A0806]">
      <KitchenBridgeRevealOverlay />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Skills.png"
        alt=""
        className="absolute left-0 top-0 z-0 block h-full w-full object-cover"
      />

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
    </div>
  );
}

"use client";

import Link from "next/link";
import { KitchenBridgeRevealOverlay } from "@/components/kitchen/KitchenBridgeRevealOverlay";

const CREAM = "#F5E6C8";

const HOTSPOTS = [
  {
    id: "email",
    label: "Email",
    href: "mailto:samvitchoudhary@gmail.com",
    points: "1079,532 1411,570 1407,605 1072,563",
    external: false as const,
  },
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/samvitchoudhary",
    points: "1071,585 1204,598 1198,637 1062,625",
    external: true as const,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/samvit-choudhary-6b3504291/",
    points: "1067,648 1218,666 1214,704 1061,689",
    external: true as const,
  },
] as const;

export default function ContactClient() {
  return (
    <div className="relative h-[100dvh] w-screen overflow-hidden bg-[#0A0806]">
      <KitchenBridgeRevealOverlay />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Contact.png"
        alt=""
        className="absolute left-0 top-0 z-0 block h-full w-full object-cover"
      />

      <svg
        className="contact-hotspot-svg absolute left-0 top-0 z-[25] h-full w-full"
        viewBox="0 0 1536 1024"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        style={{ pointerEvents: "none" }}
        aria-label="Contact links on post-it"
      >
        {HOTSPOTS.map((h) => (
          <a
            key={h.id}
            href={h.href}
            aria-label={h.label}
            style={{ pointerEvents: "all" }}
            {...(h.external
              ? { target: "_blank" as const, rel: "noopener noreferrer" }
              : {})}
          >
            <polygon
              className="contact-hotspot-shape"
              points={h.points}
              fill="transparent"
              stroke="none"
              strokeWidth={0}
              style={{ pointerEvents: "all", cursor: "pointer" }}
            />
          </a>
        ))}
      </svg>

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

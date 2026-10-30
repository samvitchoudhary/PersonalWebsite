"use client";

import { BackToKitchenButton } from "@/components/kitchen/BackToKitchenButton";
import { KitchenBridgeRevealOverlay } from "@/components/kitchen/KitchenBridgeRevealOverlay";

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
      <picture>
        <source
          srcSet="/Contact.avif"
          type="image/avif"
        />
        <source
          srcSet="/Contact.webp"
          type="image/webp"
        />
        <img
          src="/Contact.png"
          alt=""
          className="absolute left-0 top-0 z-0 block h-full w-full object-cover"
          loading="lazy"
        />
      </picture>

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
            style={{ pointerEvents: "all", touchAction: "manipulation" }}
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

      <BackToKitchenButton />
    </div>
  );
}

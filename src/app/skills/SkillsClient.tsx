"use client";

import { BackToKitchenButton } from "@/components/kitchen/BackToKitchenButton";
import { KitchenBridgeRevealOverlay } from "@/components/kitchen/KitchenBridgeRevealOverlay";

/** Warm parchment sampled from Skills.png edge tones */
const PARCHMENT = "#C4A46A";

export default function SkillsClient() {
  return (
    <div
      className="relative flex h-[100dvh] max-h-[100dvh] w-screen items-center justify-center overflow-hidden"
      style={{ backgroundColor: PARCHMENT }}
    >
      <KitchenBridgeRevealOverlay />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/Skills.png"
        alt="Spice rack of skills — Languages, Frameworks, and Tools"
        className="relative z-0 h-full w-full object-contain object-center"
      />

      <BackToKitchenButton />
    </div>
  );
}

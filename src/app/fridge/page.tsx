"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { BackToKitchenButton } from "@/components/kitchen/BackToKitchenButton";
import { FridgePlaceholder } from "@/components/fridge/FridgePlaceholder";

const FridgeGameArena = dynamic(
  () => import("@/components/fridge/FridgeGameArena").then((mod) => ({ default: mod.FridgeGameArena })),
  { ssr: false }
);

const GOLD = "#D4A03C";
const BG = "#0A0806";
const showGame = process.env.NODE_ENV === "development";

export default function FridgePage() {
  return (
    <div
      className="relative flex min-h-[100dvh] w-screen flex-col items-center justify-center overflow-hidden px-4 py-6"
      style={{ backgroundColor: BG }}
    >
      <BackToKitchenButton />

      <motion.h1
        className="mb-4 text-center text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight"
        style={{
          fontFamily: "var(--font-crimson-pro), serif",
          color: GOLD,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        The Fridge
      </motion.h1>

      <motion.div
        className="flex w-full justify-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.12, ease: "easeOut" }}
      >
        {showGame ? <FridgeGameArena /> : <FridgePlaceholder />}
      </motion.div>
    </div>
  );
}

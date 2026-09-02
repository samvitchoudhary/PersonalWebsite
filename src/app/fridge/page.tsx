"use client";

import { motion } from "framer-motion";
import { BackToKitchenButton } from "@/components/kitchen/BackToKitchenButton";
import { FridgeGameArena } from "@/components/fridge/FridgeGameArena";

const GOLD = "#D4A03C";
const BG = "#0A0806";

export default function FridgePage() {
  return (
    <div
      className="relative flex min-h-[100dvh] w-screen flex-col items-center justify-center overflow-hidden px-6 py-20"
      style={{ backgroundColor: BG }}
    >
      <BackToKitchenButton />

      <motion.h1
        className="mb-8 text-center text-[clamp(1.75rem,4vw,2.5rem)] font-semibold tracking-tight"
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
        className="w-full max-w-[800px]"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.12, ease: "easeOut" }}
      >
        <FridgeGameArena />
      </motion.div>
    </div>
  );
}

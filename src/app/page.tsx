"use client";

import { motion } from "framer-motion";
import { KitchenScene } from "@/components/KitchenScene";

export default function Home() {
  return (
    <div className="flex min-h-screen cursor-default flex-col items-center justify-center bg-[#0A0806] px-4 py-10">
      <header className="mb-8 flex flex-col items-center text-center">
        <motion.h1
          className="mb-2 font-serif font-light tracking-[4px] text-[#F5E6C8]"
          style={{
            fontFamily: "var(--font-crimson-pro), serif",
            fontSize: "clamp(28px, 5vw, 44px)",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Samvit&apos;s Kitchen
        </motion.h1>
        <motion.p
          className="text-sm italic text-[#B8A888]"
          style={{ fontFamily: "var(--font-crimson-pro), serif" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          explore the kitchen to learn more
        </motion.p>
      </header>
      <KitchenScene />
    </div>
  );
}

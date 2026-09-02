"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const CREAM = "#F5E6C8";

export function BackToKitchenButton() {
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
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { consumeKitchenBridgeReveal } from "@/lib/kitchenBridgeReveal";

const CREAM = "#F5E6C8";

/**
 * Full-screen cream overlay that fades out. Only mount under a client-only parent
 * (e.g. `dynamic(..., { ssr: false })`) so `consumeKitchenBridgeReveal` runs on first paint.
 */
export function KitchenBridgeRevealOverlay() {
  const [visible, setVisible] = useState(() => consumeKitchenBridgeReveal());
  if (!visible) return null;
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[300]"
      style={{ backgroundColor: CREAM }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onAnimationComplete={() => setVisible(false)}
      aria-hidden
    />
  );
}

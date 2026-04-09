"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/** ease-in-out for zoom + cream (matches user spec) */
const EASE: [number, number, number, number] = [0.42, 0, 0.58, 1];

interface KitchenExitZoomLayerProps {
  /** When true, scales the kitchen viewport and fades cream overlay */
  isExiting: boolean;
  /** e.g. "15% 22%" from hotspot bbox center */
  transformOrigin: string;
  durationSec: number;
  children: ReactNode;
}

/**
 * Wraps the kitchen image + SVG overlay so they zoom together.
 * Cream overlay sits above hotspots/hint during exit.
 */
export function KitchenExitZoomLayer({
  isExiting,
  transformOrigin,
  durationSec,
  children,
}: KitchenExitZoomLayerProps) {
  return (
    <>
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={isExiting ? { scale: 3 } : { scale: 1 }}
        transition={{ duration: durationSec, ease: EASE }}
        style={{
          transformOrigin,
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0 z-[100] bg-[#F5E6C8]"
        initial={false}
        animate={isExiting ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: durationSec, ease: EASE }}
        aria-hidden
      />
    </>
  );
}

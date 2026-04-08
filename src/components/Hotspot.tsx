"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HotspotConfig } from "@/types";

interface HotspotProps extends HotspotConfig {
  onActivate: () => void;
}

export function Hotspot({
  id,
  label,
  description,
  x,
  y,
  w,
  h,
  glowColor,
  onActivate,
}: HotspotProps) {
  const [hovered, setHovered] = useState(false);
  const ariaLabel = `${description}: ${label}`;

  const showTip = useCallback(() => setHovered(true), []);
  const hideTip = useCallback(() => setHovered(false), []);

  return (
    <div
      className="pointer-events-auto absolute z-10"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${w}%`,
        height: `${h}%`,
      }}
    >
      <button
        type="button"
        aria-label={ariaLabel}
        aria-describedby={hovered ? `tip-${id}` : undefined}
        onClick={onActivate}
        onMouseEnter={showTip}
        onMouseLeave={hideTip}
        onFocus={showTip}
        onBlur={hideTip}
        className="kitchen-hotspot relative h-full w-full cursor-pointer rounded-[12px] border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(212,160,60,0.6)]"
        style={
          {
            "--hotspot-glow": glowColor,
          } as React.CSSProperties
        }
      />
      <div
        className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-max max-w-[min(280px,85vw)] -translate-x-1/2"
        aria-hidden
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              id={`tip-${id}`}
              role="tooltip"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{
                duration: 0.25,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="rounded-full border border-[rgba(212,160,60,0.3)] bg-[rgba(20,15,10,0.85)] px-3 py-1.5 text-center text-[13px] italic leading-snug text-[#F5E6C8] backdrop-blur-md"
              style={{ fontFamily: "var(--font-crimson-pro), serif" }}
            >
              {description} — {label}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

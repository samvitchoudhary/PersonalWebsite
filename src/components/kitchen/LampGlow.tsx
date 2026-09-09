"use client";

import { SCENE_H, SCENE_W } from "./atmosphereDebug";

/** Hanging lamp bulb in illustration space (matches SVG hotspot overlay). */
const LAMP_X = SCENE_W * 0.38;
const LAMP_Y = SCENE_H * 0.08;
const GLOW_R = 170;

export function LampGlow() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      aria-hidden
    >
      <defs>
        <radialGradient id="kitchen-lamp-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD98C" stopOpacity="0.55" />
          <stop offset="35%" stopColor="#FFD98C" stopOpacity="0.22" />
          <stop offset="68%" stopColor="#E8B86A" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#FFD98C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle
        className="kitchen-lamp-glow"
        cx={LAMP_X}
        cy={LAMP_Y}
        r={GLOW_R}
        fill="url(#kitchen-lamp-glow)"
      />
    </svg>
  );
}

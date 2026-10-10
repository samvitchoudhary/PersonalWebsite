"use client";

import { LAMP_CONFIG, SCENE_H, SCENE_W } from "./atmosphereConfig";

/** Hanging lamp bulb in illustration space (matches SVG hotspot overlay). */
const LAMP_X = SCENE_W * 0.38;
const LAMP_Y = SCENE_H * 0.08;

export function LampGlow() {
  const peak = LAMP_CONFIG.peakOpacity;

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
          <stop offset="0%" stopColor="#FFD98C" stopOpacity={peak} />
          <stop offset="35%" stopColor="#FFD98C" stopOpacity={peak * 0.42} />
          <stop offset="68%" stopColor="#E8B86A" stopOpacity={peak * 0.16} />
          <stop offset="100%" stopColor="#FFD98C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle
        className="kitchen-lamp-glow"
        cx={LAMP_X}
        cy={LAMP_Y}
        r={LAMP_CONFIG.glowRadius}
        fill="url(#kitchen-lamp-glow)"
        style={
          {
            "--kitchen-lamp-peak": String(peak),
            "--kitchen-lamp-trough": String(peak * 0.64),
            "--kitchen-lamp-scale": String(LAMP_CONFIG.pulseScale),
            animationDuration: `${LAMP_CONFIG.pulseSpeed}s`,
          } as React.CSSProperties
        }
      />
    </svg>
  );
}

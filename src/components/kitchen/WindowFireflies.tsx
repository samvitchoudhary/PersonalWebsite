"use client";

import { FIREFLY_CONFIG, SCENE_H, SCENE_W } from "./atmosphereConfig";

/** Window bounds in illustration space — lower third holds the dusk hills. */
const WINDOW = {
  x: SCENE_W * 0.29,
  y: SCENE_H * 0.1,
  w: SCENE_W * 0.22,
  h: SCENE_H * 0.32,
};

type Firefly = {
  id: string;
  x: number;
  y: number;
  r: number;
  className: string;
  duration: number;
};

const FIREFLIES: Firefly[] = [
  { id: "a", x: 0.18, y: 0.72, r: 3.2, className: "kitchen-firefly kitchen-firefly-a", duration: 3.2 },
  { id: "b", x: 0.32, y: 0.78, r: 2.4, className: "kitchen-firefly kitchen-firefly-b", duration: 4.6 },
  { id: "c", x: 0.48, y: 0.68, r: 3.6, className: "kitchen-firefly kitchen-firefly-c", duration: 2.4 },
  { id: "d", x: 0.61, y: 0.82, r: 2.6, className: "kitchen-firefly kitchen-firefly-d", duration: 5 },
  { id: "e", x: 0.74, y: 0.7, r: 2.8, className: "kitchen-firefly kitchen-firefly-e", duration: 3.8 },
  { id: "f", x: 0.28, y: 0.88, r: 2.2, className: "kitchen-firefly kitchen-firefly-f", duration: 2.8 },
  { id: "g", x: 0.55, y: 0.9, r: 3, className: "kitchen-firefly kitchen-firefly-g", duration: 4.2 },
];

export function WindowFireflies() {
  const speedScale = FIREFLY_CONFIG.twinkleSpeed / 3.5;
  const flies = FIREFLIES.slice(0, FIREFLY_CONFIG.count);

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      aria-hidden
    >
      {flies.map((fly) => (
        <circle
          key={fly.id}
          className={fly.className}
          cx={WINDOW.x + WINDOW.w * fly.x}
          cy={WINDOW.y + WINDOW.h * fly.y}
          r={fly.r * FIREFLY_CONFIG.size}
          fill="#FFD98C"
          style={
            {
              "--kitchen-firefly-peak": String(FIREFLY_CONFIG.peakOpacity),
              "--kitchen-firefly-min": String(FIREFLY_CONFIG.peakOpacity * 0.2),
              animationDuration: `${fly.duration * speedScale}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  );
}

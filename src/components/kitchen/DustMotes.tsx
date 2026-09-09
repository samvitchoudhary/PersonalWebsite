"use client";

import { SCENE_H, SCENE_W } from "./atmosphereDebug";

/** Central lamp/window-lit air in illustration space. */
const DUST_REGION = {
  x: SCENE_W * 0.28,
  y: SCENE_H * 0.12,
  w: SCENE_W * 0.42,
  h: SCENE_H * 0.42,
};

type Mote = {
  id: string;
  x: number;
  y: number;
  size: number;
  className: string;
};

const MOTES: Mote[] = [
  { id: "a", x: 0.12, y: 0.22, size: 3.2, className: "kitchen-dust-mote kitchen-dust-mote-a" },
  { id: "b", x: 0.28, y: 0.4, size: 2.4, className: "kitchen-dust-mote kitchen-dust-mote-b" },
  { id: "c", x: 0.46, y: 0.18, size: 3.6, className: "kitchen-dust-mote kitchen-dust-mote-c" },
  { id: "d", x: 0.62, y: 0.34, size: 2.6, className: "kitchen-dust-mote kitchen-dust-mote-d" },
  { id: "e", x: 0.78, y: 0.26, size: 2.8, className: "kitchen-dust-mote kitchen-dust-mote-e" },
  { id: "f", x: 0.2, y: 0.62, size: 2.2, className: "kitchen-dust-mote kitchen-dust-mote-f" },
  { id: "g", x: 0.38, y: 0.7, size: 3, className: "kitchen-dust-mote kitchen-dust-mote-g" },
  { id: "h", x: 0.55, y: 0.54, size: 2.5, className: "kitchen-dust-mote kitchen-dust-mote-h" },
  { id: "i", x: 0.7, y: 0.66, size: 3.4, className: "kitchen-dust-mote kitchen-dust-mote-i" },
  { id: "j", x: 0.86, y: 0.48, size: 2.3, className: "kitchen-dust-mote kitchen-dust-mote-j" },
];

export function DustMotes() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] h-full w-full"
      viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
      preserveAspectRatio="xMidYMid slice"
      width="100%"
      height="100%"
      aria-hidden
    >
      {MOTES.map((mote) => (
        <circle
          key={mote.id}
          className={mote.className}
          cx={DUST_REGION.x + DUST_REGION.w * mote.x}
          cy={DUST_REGION.y + DUST_REGION.h * mote.y}
          r={mote.size}
          fill="#F5E6C8"
        />
      ))}
    </svg>
  );
}

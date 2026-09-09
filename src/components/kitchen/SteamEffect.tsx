"use client";

import { SCENE_H, SCENE_W } from "./atmosphereDebug";

/** Pot mouth in illustration space (matches SVG hotspot overlay). */
const POT_X = SCENE_W * 0.57;
const POT_Y = SCENE_H * 0.62;

type Wisp = {
  id: string;
  dx: number;
  rx: number;
  ry: number;
  className: string;
};

const WISPS: Wisp[] = [
  { id: "a", dx: -34, rx: 34, ry: 68, className: "kitchen-steam-wisp kitchen-steam-wisp-a" },
  { id: "b", dx: 4, rx: 28, ry: 58, className: "kitchen-steam-wisp kitchen-steam-wisp-b" },
  { id: "c", dx: 32, rx: 36, ry: 74, className: "kitchen-steam-wisp kitchen-steam-wisp-c" },
  { id: "d", dx: -14, rx: 24, ry: 52, className: "kitchen-steam-wisp kitchen-steam-wisp-d" },
  { id: "e", dx: 18, rx: 30, ry: 64, className: "kitchen-steam-wisp kitchen-steam-wisp-e" },
  { id: "f", dx: -44, rx: 26, ry: 60, className: "kitchen-steam-wisp kitchen-steam-wisp-f" },
  { id: "g", dx: 42, rx: 30, ry: 66, className: "kitchen-steam-wisp kitchen-steam-wisp-g" },
];

export function SteamEffect() {
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
        <filter
          id="kitchen-steam-blur"
          x="-120%"
          y="-120%"
          width="340%"
          height="340%"
        >
          <feGaussianBlur stdDeviation="26" />
        </filter>
      </defs>
      <g filter="url(#kitchen-steam-blur)">
        {WISPS.map((wisp) => (
          <ellipse
            key={wisp.id}
            className={wisp.className}
            cx={POT_X + wisp.dx}
            cy={POT_Y}
            rx={wisp.rx}
            ry={wisp.ry}
            fill="#F5F0E6"
            fillOpacity={0.45}
          />
        ))}
      </g>
    </svg>
  );
}

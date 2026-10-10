"use client";

import { STEAM_CONFIG, SCENE_H, SCENE_W } from "./atmosphereConfig";

/** Pot mouth in illustration space (matches SVG hotspot overlay). */
const POT_X = SCENE_W * 0.57;
const POT_Y = SCENE_H * 0.62;

type Wisp = {
  id: string;
  dx: number;
  rx: number;
  ry: number;
  className: string;
  /** Base duration in seconds at riseSpeed = 5. */
  duration: number;
};

const WISPS: Wisp[] = [
  { id: "a", dx: -34, rx: 38, ry: 76, className: "kitchen-steam-wisp kitchen-steam-wisp-a", duration: 5.4 },
  { id: "b", dx: 4, rx: 32, ry: 66, className: "kitchen-steam-wisp kitchen-steam-wisp-b", duration: 4.6 },
  { id: "c", dx: 32, rx: 40, ry: 82, className: "kitchen-steam-wisp kitchen-steam-wisp-c", duration: 6 },
  { id: "d", dx: -14, rx: 28, ry: 60, className: "kitchen-steam-wisp kitchen-steam-wisp-d", duration: 4.2 },
  { id: "e", dx: 18, rx: 34, ry: 72, className: "kitchen-steam-wisp kitchen-steam-wisp-e", duration: 5.1 },
  { id: "f", dx: -44, rx: 30, ry: 68, className: "kitchen-steam-wisp kitchen-steam-wisp-f", duration: 5.7 },
  { id: "g", dx: 42, rx: 34, ry: 74, className: "kitchen-steam-wisp kitchen-steam-wisp-g", duration: 4.8 },
];

export function SteamEffect() {
  const speedScale = STEAM_CONFIG.riseSpeed / 5;
  const wisps = WISPS.slice(0, STEAM_CONFIG.wispCount);

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
          <feGaussianBlur stdDeviation={STEAM_CONFIG.blur} />
        </filter>
      </defs>
      <g filter="url(#kitchen-steam-blur)">
        {wisps.map((wisp) => (
          <ellipse
            key={wisp.id}
            className={wisp.className}
            cx={POT_X + wisp.dx}
            cy={POT_Y}
            rx={wisp.rx * STEAM_CONFIG.size}
            ry={wisp.ry * STEAM_CONFIG.size}
            fill="#F5F0E6"
            style={
              {
                "--kitchen-steam-peak": String(STEAM_CONFIG.peakOpacity),
                animationDuration: `${wisp.duration * speedScale}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </g>
    </svg>
  );
}

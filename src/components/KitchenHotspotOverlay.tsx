"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { HotspotConfig, HotspotId } from "@/types";
import { shapeCenter } from "@/lib/hotspotGeometry";

function svgPointToScreen(
  svg: SVGSVGElement,
  x: number,
  y: number,
): { x: number; y: number } {
  const pt = svg.createSVGPoint();
  pt.x = x;
  pt.y = y;
  const ctm = svg.getScreenCTM();
  if (!ctm) return { x, y };
  const out = pt.matrixTransform(ctm);
  return { x: out.x, y: out.y };
}

function clampTooltipLeft(screenX: number) {
  if (typeof window === "undefined") return screenX;
  const half = 140;
  return Math.max(half, Math.min(screenX, window.innerWidth - half));
}

interface KitchenHotspotOverlayProps {
  hotspots: HotspotConfig[];
  debug: boolean;
  onOpen: (id: HotspotId) => void;
}

export function KitchenHotspotOverlay({
  hotspots,
  debug,
  onOpen,
}: KitchenHotspotOverlayProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    screenX: number;
    screenY: number;
    text: string;
  } | null>(null);

  const showTooltip = useCallback((h: HotspotConfig) => {
    const svg = svgRef.current;
    if (!svg) return;
    const c = shapeCenter(h.shape);
    const { x, y } = svgPointToScreen(svg, c.x, c.y);
    setTooltip({ screenX: x, screenY: y, text: h.tooltip });
  }, []);

  const hideTooltip = useCallback(() => {
    setTooltip(null);
  }, []);

  const handleActivate = useCallback(
    (h: HotspotConfig) => {
      if (debug) {
        console.log("[kitchen-hotspot]", h.id, h.shape);
        return;
      }
      onOpen(h.id);
    },
    [debug, onOpen],
  );

  return (
    <>
      <svg
        ref={svgRef}
        className={`kitchen-hotspot-svg absolute left-0 top-0 z-[1] h-full w-full ${debug ? "kitchen-debug" : ""}`}
        viewBox="0 0 1536 1024"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        aria-label="Interactive kitchen hotspots"
      >
        {hotspots.map((h) => {
          const handlers = {
            "aria-label": h.tooltip,
            tabIndex: 0 as const,
            onMouseEnter: () => showTooltip(h),
            onMouseLeave: hideTooltip,
            onClick: (e: React.MouseEvent) => {
              e.stopPropagation();
              handleActivate(h);
            },
            onKeyDown: (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleActivate(h);
              }
            },
          };

          if (h.shape.kind === "polygon") {
            return (
              <polygon
                key={h.id}
                className="kitchen-hotspot-shape"
                fill="transparent"
                stroke="none"
                strokeWidth={0}
                points={h.shape.points}
                {...handlers}
              />
            );
          }
          const r = h.shape;
          return (
            <rect
              key={h.id}
              className="kitchen-hotspot-shape"
              fill="transparent"
              stroke="none"
              strokeWidth={0}
              x={r.x}
              y={r.y}
              width={r.width}
              height={r.height}
              {...handlers}
            />
          );
        })}

        {debug &&
          hotspots.map((h) => {
            const c = shapeCenter(h.shape);
            return (
              <text
                key={`${h.id}-debug-label`}
                className="kitchen-hotspot-debug-label"
                x={c.x}
                y={c.y}
                fill="#ff2222"
                fontSize={11}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {h.id}
              </text>
            );
          })}
      </svg>

      <AnimatePresence>
        {tooltip && !debug && (
          <motion.div
            key="hotspot-tip"
            role="tooltip"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 2 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-none fixed z-[60] max-w-[min(280px,85vw)] rounded-full border border-[rgba(212,160,60,0.3)] bg-[rgba(20,15,10,0.85)] px-3 py-1.5 text-center text-[13px] italic leading-snug text-[#F5E6C8] backdrop-blur-md"
            style={{
              fontFamily: "var(--font-crimson-pro), serif",
              left: clampTooltipLeft(tooltip.screenX),
              top: tooltip.screenY,
              transform: "translate(-50%, calc(-100% - 12px))",
            }}
          >
            {tooltip.text}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

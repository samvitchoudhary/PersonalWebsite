import type { HotspotShape } from "@/types";

const VIEWBOX_W = 1536;
const VIEWBOX_H = 1024;

/** Center of bounding box in image pixel space (matches viewBox 0 0 1536 1024). */
export function shapeCenter(shape: HotspotShape): { x: number; y: number } {
  if (shape.kind === "rect") {
    return {
      x: shape.x + shape.width / 2,
      y: shape.y + shape.height / 2,
    };
  }
  const pairs = shape.points.trim().split(/\s+/).filter(Boolean);
  const xs: number[] = [];
  const ys: number[] = [];
  for (const p of pairs) {
    const parts = p.split(",").map(Number);
    if (parts.length >= 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
      xs.push(parts[0]);
      ys.push(parts[1]);
    }
  }
  if (xs.length === 0) return { x: VIEWBOX_W / 2, y: VIEWBOX_H / 2 };
  return {
    x: (Math.min(...xs) + Math.max(...xs)) / 2,
    y: (Math.min(...ys) + Math.max(...ys)) / 2,
  };
}

/** CSS transform-origin for zoom-from-hotspot (percent of kitchen layer). */
export function transformOriginPercentFromShape(shape: HotspotShape): string {
  const c = shapeCenter(shape);
  return `${(c.x / VIEWBOX_W) * 100}% ${(c.y / VIEWBOX_H) * 100}%`;
}

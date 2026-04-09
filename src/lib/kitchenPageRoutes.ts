import type { HotspotId } from "@/types";

/** Hotspots that navigate to full pages (zoom transition + router). */
export const KITCHEN_PAGE_ROUTES: Partial<Record<HotspotId, string>> = {
  about: "/about",
  skills: "/skills",
  contact: "/contact",
};

export type HotspotId =
  | "projects"
  | "skills"
  | "fridge"
  | "about"
  | "cooking"
  | "resume"
  | "contact";

export type HotspotShape =
  | { kind: "polygon"; points: string }
  | {
      kind: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    };

export interface HotspotConfig {
  id: HotspotId;
  /** Full tooltip line (dark pill). */
  tooltip: string;
  shape: HotspotShape;
  /** Optional CSS transform-origin for kitchen exit zoom (overrides bbox center). */
  transformOrigin?: string;
}

export interface Project {
  name: string;
  prep: string;
  difficulty: string;
  ingredients: string[];
  description: string;
}

export interface SkillCategory {
  name: string;
  items: string[];
}

export interface AboutFact {
  emoji: string;
  text: string;
}

export interface CookingItem {
  title: string;
  status: "Active" | "Studying";
  description: string;
}

export interface Experience {
  role: string;
  org: string;
  period: string;
  description: string;
}

export interface ContactLink {
  emoji: string;
  label: string;
  value: string;
  href: string;
}

export interface ModalTheme {
  bg: string;
  accent: string;
  text: string;
  card: string;
}

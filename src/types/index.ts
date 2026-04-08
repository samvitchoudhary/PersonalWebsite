export type HotspotId =
  | "projects"
  | "skills"
  | "about"
  | "cooking"
  | "resume"
  | "interests"
  | "contact"
  | "easter";

export interface HotspotConfig {
  id: HotspotId;
  label: string;
  description: string;
  x: number;
  y: number;
  w: number;
  h: number;
  glowColor: string;
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

export interface InterestStation {
  frequency: string;
  title: string;
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

import type { Metadata } from "next";
import { CookbookPage } from "@/components/projects/CookbookPage";

export const metadata: Metadata = {
  title: "Projects — Samvit's Recipes",
  description:
    "An open cookbook of Samvit's projects — ThinkEx, SR 11-7, HeatMap, and more.",
};

export default function ProjectsPage() {
  return <CookbookPage />;
}

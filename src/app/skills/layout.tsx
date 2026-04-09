import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Skills — Samvit",
  description: "Spice rack — skills and tools.",
};

export default function SkillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

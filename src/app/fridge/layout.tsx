import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Fridge — Samvit",
  description: "Catch the Falling Ingredients — a kitchen mini-game.",
};

export default function FridgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

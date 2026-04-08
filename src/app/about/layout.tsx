import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Samvit",
  description:
    "Get to know Samvit — cooking, tennis, scouting, UMD, and more.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

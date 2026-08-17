"use client";

import dynamic from "next/dynamic";

const SkillsClient = dynamic(() => import("./SkillsClient"), {
  ssr: false,
  loading: () => (
    <div
      className="h-[100dvh] w-screen"
      style={{ backgroundColor: "#C4A46A" }}
      aria-hidden
    />
  ),
});

export default function SkillsPage() {
  return <SkillsClient />;
}

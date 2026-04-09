"use client";

import dynamic from "next/dynamic";

const SkillsClient = dynamic(() => import("./SkillsClient"), {
  ssr: false,
  loading: () => (
    <div
      className="h-[100dvh] w-screen bg-[#F5E6C8]"
      aria-hidden
    />
  ),
});

export default function SkillsPage() {
  return <SkillsClient />;
}
